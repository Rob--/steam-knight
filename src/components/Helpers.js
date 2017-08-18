import cheerio from 'cheerio';

function markdownToHtml(markdown) {
  let text = markdown.replace(/\n/g, '<br>');

  function replace(tag) {
    const opening = tag === 'url' ? `[${tag}=` : `[${tag}]`;
    const closing = `[/${tag}]`;
    if (text.includes(opening) && text.includes(closing)) {
      const innerText =
        text.substring(text.indexOf(opening) + opening.length, text.indexOf(closing));
      const outerText =
        text.substring(text.indexOf(opening), text.indexOf(closing) + closing.length);

      let html = innerText;

      if (tag === 'h1') {
        html = `<div class="bb_h1">${innerText}</div>`;
      }

      if (['b', 'u', 'i'].includes(tag)) {
        html = `<${tag}>${innerText}</${tag}>`;
      }

      if (tag === 'strike') {
        html = `<span class="bb_strike">${innerText}</span>`;
      }

      if (tag === 'spoiler') {
        html = `<span class="bb_spoiler"><span>${innerText}</span></span>`;
      }

      if (tag === 'url') {
        html = outerText;

        // let url = outerText.split('url=');
        // if (url.length > 1) url = url[1].split(']');
        // if (url.length > 1) url = url.slice(0, -2).join('');
        //
        // let linkText = outerText.split('url=');
        // if (linkText.length > 1) linkText = linkText[1].split(']').slice(-2);
        // if (linkText.length > 0) linkText = linkText[0].split('[').slice(0, -1).join('');

        // const url = outerText.split('url=')[1].split(']').slice(0, -2).join('');
        // const linkText =
        // outerText.split('url=')[1]
        // .split(']').slice(-2)[0].split('[').slice(0, -1).join('');
        // console.log(url, linkText);
        // if (!url.includes('url=') && !linkText.includes('url=')) {
        //   html =
        // `<a class="bb_link" href="${url}" target="_blank" rel="noreferrer">${linkText}</a>`;
        // }

        const textMatches = outerText.match(/\](.*?)\[/g);
        let linkText = 'Link';
        if (textMatches && textMatches.length === 1 && textMatches[0].slice(0, 1) === ']'
        && textMatches[0].slice(-1) === '[') {
          linkText = textMatches[0].slice(1, -1);
        }

        const urlMatches = outerText.match(/\[([^\]]+)]/g);
        if (urlMatches && urlMatches.length === 2 && urlMatches[0].includes('url=')
        && urlMatches[0].includes(']')) {
          const url = urlMatches[0].split('url=')[1].slice(0, -1);
          html =
        `<a class="bb_link" href="${url}" target="_blank" rel="noreferrer">${linkText}</a>`;
        }
      }

      text = text.replace(outerText, html);

      // recursive, keep replacing instances of this tag
      // until no more are found
      replace(tag);
    }
  }

  ['h1', 'b', 'u', 'i', 'strike', 'spoiler', 'url'].forEach(replace);

  return text;
}

function htmlToMarkdown(html) {
  console.log('hey');
  const $ = cheerio.load(html);

  $('a').each((index, element) => {
    let url = $(element).attr('href');
    if (url.includes('//steamcommunity.com/linkfilter/?url=')) {
      url = url.split('//steamcommunity.com/linkfilter/?url=')[1];
    }

    $(element).replaceWith(`[url=${url}]${$(element).text()}[/url]`);
  });

  $('.bb_h1').each((index, element) => {
    $(element).replaceWith(`[h1]${$(element).text()}[/h1]`);
  });

  $('span.bb_link_host').remove();

  $('br').each((index, element) => {
    $(element).replaceWith('\n');
  });

  $('b').each((index, element) => {
    $(element).replaceWith(`[b]${$(element).text()}[/b]`);
  });

  $('u').each((index, element) => {
    $(element).replaceWith(`[u]${$(element).text()}[/u]`);
  });

  $('i').each((index, element) => {
    $(element).replaceWith(`[i]${$(element).text()}[/i]`);
  });

  $('.bb_strike').each((index, element) => {
    $(element).replaceWith(`[strike]${$(element).text()}[/strike]`);
  });

  $('.bb_spoiler').each((index, element) => {
    $(element).replaceWith(`[spoiler]${$(element).text()}[/spoiler]`);
  });

  return $.text();
}

function itemFilter(steamID, item) {
  /* If this function is called for offer history, then the `steamID` parameter
     is not passed because every item has a property called `owner` (which is a Steam ID) */
  let inspect = false;
  if (item.actions && item.actions.length !== 0) {
    inspect = item.actions[0].link
      .replace('%owner_steamid%', steamID || item.owner)
      .replace('%assetid%', item.assetid || item.id);
  }

  let border = '';
  let style = {
    'border-bottom': '5px solid #b0c3d9',
  };

  if (Object.hasOwnProperty.call(item, 'tags')) {
    item.tags.forEach((tag) => {
      if (tag.category === 'Rarity') {
        style['border-bottom'] = `5px solid #${tag.color}`;
      }

      if (tag.category === 'Type' && tag.internal_name.includes('Knife')) {
        border = '1px solid #8650ac';
      }
    });
  }

  if (item.market_hash_name.includes('StatTrak')) {
    border = '1px solid #cf6a32';
  }

  if (item.market_hash_name.includes('Souvenir')) {
    border = '1px solid #ffd700';
  }

  style = {
    ...style,
    'border-left': border,
    'border-top': border,
    'border-right': border,
  };

  return {
    appid: item.appid,
    assetid: item.assetid || item.id,
    icon_url: item.icon_url_large || item.icon_url,
    name: item.market_hash_name,
    color: item.name_color,
    inspect,
    style,
  };
}

function getUserDetails(offer) {
  return new Promise((resolve, reject) => {
    offer.getUserDetails((err, me, them) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        them: {
          name: them.personaName,
          avatar: them.avatarMedium,
          probation: them.probation,
        },
      });
    });
  });
}

function filterHistory(offer) {
  const date = new Date(offer.date);

  return {
    date: `${date.toDateString()}, ${date.toLocaleTimeString()}`,
    name: offer.partnerName,
    url: offer.partnerSteamID ? `profiles/${offer.partnerSteamID}` : `id/${offer.partnerVanityURL}`,
    // we need to bind `null` as a first parameter is expected for the function,
    // but the first parameter is already provided by the offers we are passing in
    itemsGiven: offer.itemsGiven.map(itemFilter.bind(null, null)),
    itemsReceived: offer.itemsReceived.map(itemFilter.bind(null, null)),
  };
}

function filterOffer(offer, steamID) {
  const created = new Date(offer.created);
  const expires = new Date(offer.expires);

  return {
    created: `${created.toDateString()}, ${created.toLocaleTimeString()}`,
    expires: `${expires.toDateString()}, ${expires.toLocaleTimeString()}`,
    id: offer.id,
    ourOffer: offer.isOurOffer,
    partner: offer.partner.getSteamID64(),
    state: offer.state,
    itemsGive: offer.itemsToGive.map(itemFilter.bind(null, steamID)),
    itemsReceive: offer.itemsToReceive.map(itemFilter.bind(null, offer.partner.getSteamID64())),
  };
}

const currencies = {
  0: 'Invalid',
  1: '$',
  2: '£',
  3: '€',
  4: 'Fr.',
  5: '₽',
  6: 'zł',
  7: 'R$',
  8: '¥',
  9: 'kr',
  10: 'Rp',
  11: 'RM',
  12: '₱',
  13: '$',
  14: '฿',
  15: '₫',
  16: '₩',
  17: '₺',
  18: '₴',
  19: '$',
  20: '$',
  21: '$',
  22: '$',
  23: '¥',
  24: '₹',
  25: '$',
  26: 'S/.',
  27: '$',
  28: 'R',
  29: '$',
  30: 'NT$',
  31: '﷼',
  32: 'د.إ',
  33: 'kr',
  34: 'Max',
};

export default {
  currencies,
  markdownToHtml,
  htmlToMarkdown,
  itemFilter,
  filterOffer,
  filterHistory,
  getUserDetails,
};

/* global Glue */

function getPortfolioValue(portfolio) {
  let portfolioValue = portfolio.reduce((sum, ticker) => {
    sum += ticker.price * ticker.shares;
    return sum;
  }, 0);

  return portfolioValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function getRestId(contact) {
  let ids;
  let id;
  if (contact.ids) {
    ids = contact.ids;
  } else if(Array.isArray(contact)) {
    ids = contact;
  }

  ids.forEach(currentId => {
    if (currentId.systemName === 'rest.id') {
      id = currentId.nativeId;
    }
  });

  return id;
}

async function fetchAllContactInfo(contact) {
  let restId = false;
  if (contact && Array.isArray(contact.ids) && contact.ids.length > 0) {
    restId = contact.ids.find((id) => id.systemName === 'rest.id');
  }

  if (restId) {
    let response = await fetch(`http://localhost:22060/clients/${restId.nativeId}`);
    return await response.json();
  } else {
    return contact;
  }
}

function cloneObject(object) {
  return JSON.parse(JSON.stringify(object));
}

function getIntialClientId() {
  let queryParmsClientId = getQueryParams()['clientId'];
  let contextClientId = window.glue42gd && glue42gd.context.clientId;

  return queryParmsClientId || contextClientId;
}

function getQueryParams() {
  return location.search
    .slice(1)
    .split('&')
    .filter(v => v)
    .reduce((acc, cur) => {
    let [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {})
}

function setButtonAvailability(button, status) {
  if (status) {
    button.removeAttribute('disabled');
    button.classList.remove('disabled');
  } else {
    button.setAttribute('disabled', true);
    button.classList.add('disabled');
  }
}

export {
  getPortfolioValue,
  getRestId,
  cloneObject,
  getQueryParams,
  getIntialClientId,
  setButtonAvailability,
  fetchAllContactInfo
}
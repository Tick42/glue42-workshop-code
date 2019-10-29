window.applicationName = 'Vanilla Client Portfolio'
import {getIntialClientId} from '../shared/utils.js';

let displayedContact = undefined;
let acceptSync = false;

(async function init() {
  addClickListener();

  if (getIntialClientId()) {
    loadContact(getIntialClientId());
  } else {
    changeSync(true)
  }
}())

function addClickListener() {
  document.addEventListener('click', (event) => {
    if (event.target.matches('[action], [action] *')) {
      let button = event.path.reduce((acc, cur) => {
        return cur.matches && cur.matches('[action]') ? cur : acc;
      });

      if (button.hasAttribute('disabled')) {
        return;
      }

      let action = button.getAttribute('action');
      switch(action) {
        case 'send-email': emailContact(); break;
        case 'open-sheet': openSheetForContact(); break;
        case 'sync-on': changeSync(true); break;
        case 'sync-off': changeSync(false); break;
      }
    }
  })
}

async function loadContact(contactId) {
  let contact = await (await fetch(`http://localhost:22060/clients/${contactId}`)).json();
  console.log(contact);
  if (!contact) {
    return;
  }

  displayContact(contact);
  displayedContact = contact;
}

function displayContact(contact) {
  clearTable();
  if (!contact) {
    return;
  }

  document.querySelector('#title-name').innerHTML = contact.displayName;

  let emptyRow = document.querySelector('.empty-row').cloneNode(true);
  emptyRow.style.display = '';
  emptyRow.classList.remove('empty-row')

  contact.context.portfolio.forEach(instrument => {
    let newRow = emptyRow.cloneNode(true);
    newRow.querySelector('.instrument-ric').innerText = instrument.ric;
    newRow.querySelector('.instrument-name').innerText = instrument.description;
    newRow.querySelector('.instrument-price').innerText = instrument.price;
    newRow.querySelector('.instrument-number').innerText = instrument.shares;

    document.querySelector('table tbody').appendChild(newRow);
  });
}

function emailContact() {
  console.log('TODO: Send an email');
}

async function openSheetForContact() {
  console.log(`TODO: Open Excel Worksheet with portfolio of ${displayedContact}`);
}

function changeSync(newValue) {
  acceptSync = newValue;

  document.querySelector(`[action="sync-${newValue ? 'on' : 'off'}"]`).classList.add('hidden');
  document.querySelector(`[action="sync-${newValue ? 'off' : 'on'}"]`).classList.remove('hidden');
}

function clearTable() {
  document.querySelectorAll('tbody tr:not(.empty-row)').forEach(row => {
    row.remove();
  })
}
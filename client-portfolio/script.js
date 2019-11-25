window.applicationName = 'Vanilla Client Portfolio'
import {getInitialClientId, setButtonAvailability} from '../shared/utils.js';
import { initializeInterop, updateContext } from './glue-related.js';
import { openSheet } from './excel-related.js';
import { sendEmail } from './outlook-related.js';

let displayedContact = undefined;
let acceptSync = false;

function addClickListener() {
  // Only add a single handler for the click event to the entire document
  //   to reduce the load to the DOM
  document.addEventListener('click', (event) => {
    // Detect if the element has the attribute of "action"
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
        case 'sync-to-excel': syncPortfolioToExcel(); break;
        case 'sync-on': toggleSync(true); break;
        case 'sync-off': toggleSync(false); break;
        case 'select-ticker-row': selectTickerRow(event.target.parentNode); break;
      }
    }
  })
}

function updatePortfolioHandler(data) {
  if (data.clientId) {
    loadContact(data.clientId);
  }
}

async function loadContact(contactId) {
  let contact = await (await fetch(`http://localhost:22060/clients/${contactId}`)).json();
  console.log(contact);
  if (!contact) {
    return;
  }

  displayContactPortfolio(contact);
  displayedContact = contact;
}

function displayContactPortfolio(contact) {
  clearTable();
  if (!contact) {
    return;
  }

  document.querySelector('#title-name').innerHTML = contact.displayName;

  // Use the empty row as a template:
  let templateRow = document.querySelector('.empty-row').cloneNode(true);
  templateRow.style.display = '';
  templateRow.classList.remove('empty-row');

  const tbodyElement = document.querySelector('table tbody'); 

  contact.context.portfolio.forEach(instrument => {
    let newRow = templateRow.cloneNode(true);
    newRow.querySelector('.instrument-ric').innerText = instrument.ric;
    newRow.querySelector('.instrument-name').innerText = instrument.description;
    newRow.querySelector('.instrument-price').innerText = instrument.price;
    newRow.querySelector('.instrument-number').innerText = instrument.shares;
    newRow.setAttribute('ticker', instrument.ric);
    newRow.setAttribute('action', 'select-ticker-row');

    tbodyElement.appendChild(newRow);
  });
}

async function emailContact() {
  await sendEmail(displayedContact);
}

async function syncPortfolioToExcel() {
  const onExcelUpdate = (data) => {
    displayedContact.context.portfolio = data;
    displayContactPortfolio(displayedContact);
  }

  await openSheet(displayedContact, onExcelUpdate);
}

function toggleSync(newValue) {
  acceptSync = newValue;

  document.querySelector(`[action="sync-${newValue ? 'on' : 'off'}"]`).classList.add('hidden');
  document.querySelector(`[action="sync-${newValue ? 'off' : 'on'}"]`).classList.remove('hidden');
}

function clearTable() {
  document.querySelectorAll('tbody tr:not(.empty-row)').forEach(row => {
    row.remove();
  })
}

function clearSelection() {
  document.querySelectorAll(`.contacts-table tbody tr.bg-primary`).forEach(el => el.classList.remove('bg-primary'))
}

function selectTickerRow(row) {
  clearSelection();
  row.classList.add("bg-primary");
  const ticker = row.getAttribute('ticker');
  if (ticker) {
    updateContext(ticker);
  }
}

function setButtonState(buttons, status) {
  buttons.forEach(button => {
    setButtonAvailability(button, status);
  })
}

function excelStatusChangeHandler(newStatus) {
  setButtonState(document.querySelectorAll('[action="sync-to-excel"]'), newStatus);
}

function outlookStatusChangeHandler({connected} ) {
  console.log(`newStatus: ${connected}`);
  setButtonState(document.querySelectorAll('[action="send-email"]'), connected);
};

(async function init() {
  // Initialize the interop capabilities:
  await initializeInterop(updatePortfolioHandler, excelStatusChangeHandler, outlookStatusChangeHandler);

  addClickListener();

  if (getInitialClientId()) {
    // Loaded with a ClientId in the QueryString. Show this contact.
    loadContact(getInitialClientId());
  } else {
    // No client set by QueryString, enable the "Sync button" to show
    // we are in interop mode
    acceptSync = true;
    toggleSync(acceptSync)
  }
}())

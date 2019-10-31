import { getPortfolioValue, getRestId } from '../shared/utils.js';

(async function init() {
  // Do form initialization:
  document.addEventListener('DOMContentLoaded', async () => {
    displayContacts();
    addSearchFilter();
    addClickListener();
  });
})()

window.dc = displayContacts;

async function displayContacts() {
  let contacts = (window.contacts || await getContacts());
  window.contacts = contacts;

  // Use the hidden empty row as a template:
  let templateRow = document.querySelector('.empty-row').cloneNode(true);
  templateRow.style.display = '';
  templateRow.classList.remove('empty-row');

  // Clear rows
  document.querySelectorAll('.contacts-table tbody tr:not(.empty-row)').forEach(n => n.remove());

  contacts.forEach(contact => {
    // clone the empty "template" row, fill current contact details and add it to the table
    const {displayName, emails, context:{portfolio}, _id} = contact;
    const newRow = templateRow.cloneNode(true);
    let portfolioValue = getPortfolioValue(portfolio);

    newRow.querySelector('.client-name').innerText = displayName;
    newRow.querySelector('.client-email').innerText = emails[0];
    newRow.querySelector('.client-portfolio').innerText = portfolioValue;
    newRow.setAttribute('client-id', _id)


    document.querySelector('.contacts-table tbody').appendChild(newRow);
  });
}

async function getContacts() {
  console.log('fetching contacts');
  const restURL = 'http://localhost:22060/clients';
  return (await fetch(restURL)).json();
}

function addSearchFilter() {
  const filterInput = document.querySelector('input.contacts-filter');
  filterInput.addEventListener('keyup', () => {
    const filterValue = filterInput.value.toLowerCase();

    document.querySelectorAll('.contacts-table tbody tr:not(.empty-row)').forEach(row => {
      const currentContactName = row.querySelector('.client-name').innerText.toLowerCase();
      const currentContactEmail = row.querySelector('.client-email').innerText.toLowerCase();
      const matches = (currentContactName.indexOf(filterValue) >= 0) || (currentContactEmail.indexOf(filterValue) >= 0);
      // hide or show the current row depending if the search value matches the name or the email
      row.style.display = matches ? '' : 'none';
    })
  })
}

function selectRow(restId) {
  clearRowSelection();

  let selectedContactRow = document.querySelector(`.contacts-table tbody tr[client-id="${restId}"]`);
  if (selectedContactRow) {
    selectedContactRow.classList.add('bg-primary');
  }
}

function clearRowSelection() {
  document.querySelectorAll('.contacts-table tbody tr.bg-primary').forEach(node => {
    node.classList.remove('bg-primary');
  });
}

function getContactById(restId) {
  return contacts.reduce((acc, currentContact) => {
    if (getRestId(currentContact) === restId) {
      return currentContact
    } else {
      return acc;
    }
  }, null);
}

function addClickListener() {
  document.addEventListener('click', (event) => {
    handleMenuClick(event);

    if (event.target.matches('.dropdown-item[action]')) {
      handleActionClick(event);
    }

    if (event.target.matches('.contacts-table tr, .contacts-table tr *') && !event.target.matches('.contacts-table tr td:first-child, .contacts-table tr td:first-child *')) {
      handleRowClick(event);
    }
  })
}

function handleMenuClick(event) {
  if (event.target.matches('.contacts-table tbody tr td.action-button .dropdown, .contacts-table tbody tr td.action-button .dropdown *')) {
    event.path.forEach(element => {
      if (element.matches && element.matches('tr')) {
        let menu = element.querySelector('.dropdown-menu');
        let menuIsVisible = menu.classList.contains('show');
        closeAllMenus();
        if (!menuIsVisible) {
          menu.classList.add('show');
        }
      }
    })
  } else {
    closeAllMenus();
  }
}

function handleActionClick(event) {
  event.path.forEach(element => {
    if (element.matches && element.matches('tr')) {
      let restId = element.getAttribute('client-id');
      let contact = getContactById(restId);
      let action  = event.target.getAttribute('action');

      switch(action) {
        case 'openPortfolio': {
          console.log(`TODO: OpenPortfolio ${contact}`);
          break;
        }
        case 'openPortfolioInExcel': {
          console.log(`TODO: OpenPortfolioInExce ${contact}`);
          break;
        }
        case 'openContact': {
          console.log(`TODO: OpenContact ${contact}`);
          break;
        }
        case 'emailContact': {
          console.log(`TODO: EmailContact ${contact}`);
          break;
        }
        case 'updateContact': {
          console.log(`TODO: UpdateContact ${contact}`);
          break;
        }
      }
    }
  });
}

function handleRowClick(event) {
  event.path.forEach(element => {
    if (element.matches && element.matches('tr')) {
      let clientId = element.getAttribute('client-id');
      console.log(`TODO: Sync Contact By ID ${clientId}`)
      selectRow(clientId);
    }
  });
}

function closeAllMenus() {
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  })
}

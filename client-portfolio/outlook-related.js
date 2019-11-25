import {emailTemplate} from './email-template.js';

async function sendEmail(contact) {
  if (!window.glue) {
    return;
  }
  let emailBody = replaceContentInTemplate(contact);
  const sendEmailResponse = await glue.outlook
    .newEmail({
      to: contact.emails,
      subject: `Your portfolio as of ${new Date().toDateString()}`,
      bodyHtml: emailBody
    });
  console.log(sendEmailResponse);
}

function replaceContentInTemplate(contact) {
  let emailBody = emailTemplate.cloneNode(true);

  emailBody.querySelector('#displayName').innerText = contact.displayName;

  let emptyRow = emailBody.querySelector('.empty-row');
  console.log(contact, emailBody, emptyRow);
  contact.context.portfolio.forEach(instrument => {
    let newRow = emptyRow.cloneNode(true);
    newRow.style.display = '';
    Object.keys(instrument).forEach(instrumentDetail => {
      newRow.querySelector(`#${instrumentDetail}`).innerText = instrument[instrumentDetail];
    });

    emailBody.querySelector(`#portfolio-table tbody`).appendChild(newRow);
  });

  return emailBody.innerHTML;
}


export {sendEmail};
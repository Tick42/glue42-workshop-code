import { cloneObject } from "../shared/utils.js";

const excelOptions = {
  clearGrid: true,
  worksheet: 'Data',
  inhibitLocalSave: false,
  workbook: 'Portfolio Info',
  disableErrorViewer: false,
  window: 'top',
  updateTrigger: ['row']
}

const columnConfig = [
  {fieldName: 'ric', header: 'Instrument', width: 10},
  {fieldName: 'description', header: 'Description', width: 20},
  {fieldName: 'price', header: 'Price'},
  {fieldName: 'shares', header: 'Number of shares', width: 16}
]

async function openSheet(contact, callback) {
  if (!window.glue) {
    return;
  }
  if (!contact) {
    return;
  }

  let sheetConfig = {
    options: excelOptions,
    columnConfig,
    data: cloneObject(contact.context.portfolio)
  }

  sheetConfig.options.workbook = `${contact.displayName} Portfolio`

  const sheetRef = await glue.excel.openSheet(sheetConfig);
  return sheetRef.onChanged((data, errorCb, successCb) => {
    let errors = checkSheetChangeForErrors(data);
    if (errors.length === 0) {
      successCb();
      callback(data);
    } else {
      errorCb(errors);
    }
  })
}

function checkSheetChangeForErrors(data) {
  let errors = [];

  data.forEach((row, index) => {
    if (typeof row.price !== 'number' || row.price < 1) {
      errors.push({row: index + 1, column: 3, foregroundColor: 'white', backgroundColor: 'red', description: `"${row.price}" is not a valid positive number`})
    }

    if (typeof row.shares !== 'number' || row.shares < 1) {
      errors.push({row: index + 1, column: 4, foregroundColor: 'white', backgroundColor: 'red', description: `"${row.shares}" is not a valid positive number`})
    }
  })

  return errors;
}


export { openSheet }
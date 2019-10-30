async function initializeInterop() {
  await Glue().then(glue => {
    // From a debugging perspective, it is a good practice to add a reference
    //   to the Glue42 object globally
    window.glue = glue;
  });
}

async function callShowPortfolio(clientId) {
  // Call the BigBank.ShowPortfolio method, registered in the Glue42
  //   environment
  glue.interop.invoke("BigBank.ShowPortfolio", {clientId});
}

export {
  initializeInterop,
  callShowPortfolio
};
async function initializeInterop(onUpdatePortfolioHandler) {
  const glue = await Glue();
    // From a debugging perspective, it is a good practice to add a reference
    //   to the Glue42 object globally
  window.glue = glue;

    //Once the Glue42 API object is initialized, declare the capability of
    // displaying a client portfolio
  glue.interop.register("BigBank.ShowPortfolio", (data, server) => {
    onUpdatePortfolioHandler(data);
  });
}

async function updateContext(ticker) {
  // Check if Glue42 was initialized
  if (window.glue) {
    window.glue.contexts.update('instrumentDetails', {ticker: ticker});
  }
}

export {
  initializeInterop,
  updateContext,
};
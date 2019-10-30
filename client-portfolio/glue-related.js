async function initializeInterop(onUpdatePortfolioHandler) {
  await Glue().then(glue => {
    // From a debugging perspective, it is a good practice to add a reference
    //   to the Glue42 object globally
    window.glue = glue;

    //Once the Glue42 API object is initialized, declare the capability of
    // displaying a client portfolio
    glue.interop.register("BigBank.ShowPortfolio", (data, server) => {
      onUpdatePortfolioHandler(data);
    });
  });
}

export {
  initializeInterop
};
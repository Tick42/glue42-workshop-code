const sharedContextName = "instrumentDetails";

async function initializeInterop(contextUpdateAction) {
  const glue = await Glue();
  // From a debugging perspective, it is a good practice to add a reference
  //   to the Glue42 object globally
  window.glue = glue;
  glue.contexts.subscribe(sharedContextName, context => {
    if (context && context.ticker) {
      contextUpdateAction(context.ticker);
    }
  });
}

export {
  initializeInterop
};
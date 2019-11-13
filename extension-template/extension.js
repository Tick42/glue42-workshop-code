const exchangesMap = {
  XLON: "LN",
  XNAS: "US",
  XNYS: "US",
  XETR: "GR"
};

history.pushState = ((f) => function pushState() {
  const ret = f.apply(this, arguments);
  window.dispatchEvent(new Event('pushState'));
  window.dispatchEvent(new Event('locationchange'));
  return ret;
})(history.pushState);

history.replaceState = ((f) => function replaceState() {
  const ret = f.apply(this, arguments);
  window.dispatchEvent(new Event('replaceState'));
  window.dispatchEvent(new Event('locationchange'));
  return ret;
})(history.replaceState);

window.addEventListener('popstate', () => {
  window.dispatchEvent(new Event('locationchange'));
});

window.addEventListener("locationchange", () => {
  myCustomFunctionality();
});

let interval;

window.dispatchEvent(new Event("locationchange"));

function myCustomFunctionality() {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    let button = document.querySelector("div.mdc-security-header a");
    let myCustomButton = document.querySelector('[myCustomButton]')
    if (button && !myCustomButton) {
      drawButton(button);
      clearInterval(interval);
    }
  }, 200);
}

function drawButton(button) {
  let glueButton = button.cloneNode(true);
  glueButton.setAttribute("myCustomButton", "true");
  glueButton.innerText = `Show in Glue`;

  let icon = button.querySelector("svg").cloneNode(true);
  glueButton.prepend(icon);

  glueButton.addEventListener("click", onGlueButtonClicked);
  button.parentNode.insertBefore(glueButton, button.nextSibling);
}

function onGlueButtonClicked(e) {
  e.preventDefault();

  loadApp();
  updateContext();
}

function updateContext() {
  const [exchangeMS, instrument] = window.location.href
    .replace("https://www.morningstar.com/stocks/", "")
    .replace("/quote", "")
    .toLocaleUpperCase()
    .split("/");

  const exchange = exchangesMap[exchangeMS];

  return injectedGlue.contexts.update("instrumentDetails", {
    ticker: `${instrument}:${exchange}`
  });
}

function loadApp() {
  const app = injectedGlue.appManager.application("instrument-chart-no-channels");
  if (app && app.instances.length === 0) {
    app.start();
  }
}
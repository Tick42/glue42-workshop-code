let header = document.querySelector('header');
let title = document.createElement('h1');
header.parentNode.insertBefore(title, header.nextSibling);
title.innerText = `I made this! ${(new Date(Date.now())).toLocaleString()}`;

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

window.addEventListener('locationchange', () => {
  title.innerText = `I made this! ${(new Date(Date.now())).toLocaleString()}`;
});
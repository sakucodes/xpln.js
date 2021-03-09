import xpln from './src/xpln.min.js';

document.addEventListener('DOMContentLoaded', () => {
  const options = { delay: 200, disableActiveElem: false };
  xpln.init(options);
  xpln.show();

  document.querySelector('.show-help').addEventListener('click', () => {
    xpln.show();
  });
});

import xpln from './src/xpln.js';
import xpnl from './src/xpln.js';

document.addEventListener('DOMContentLoaded', () => {
    xpnl._init();
    xpnl.show();

    document.querySelector('[data-xpln-show]').addEventListener('click', () => {
        // xpln.hide();
        xpln.show();
    });
});

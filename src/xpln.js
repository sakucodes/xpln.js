export const prefix = 'xpln';
const cardSelector = `[data-${prefix}-tooltip]`;
const textSelector = `[data-${prefix}-text]`;
const closeSelector = `[data-${prefix}-close]`;
const prevBtnSelector = `[data-${prefix}-prev]`;
const nextBtnSelector = `[data-${prefix}-next]`;

const padding = 10;

class xpln {
  bodyElem = null;
  highlightElem = null;
  tooltipElem = null;
  activeTooltipElem = null;
  xplnList = [];
  activeIndex = 0;
  popperInstance = null;

  initialized = false;

  constructor() {
}

_init() {
    if (this.initialized) return;
    
    this.body = document.getElementsByTagName('body')[0];
    this.xplnList = document.querySelectorAll('[data-xpln]');

    this._init_highlight();
    this._init_tooltip();

    this.popperInstance = Popper.createPopper(this.highlightElem, this.tooltipElem, {
      placement: 'auto',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    });

    this.initialized = true;
  }

  show() {
    if (!this.xplnList) return;

    const elem = this.xplnList[this.activeIndex];
    if (!elem) return;

    if (this.activeTooltipElem) {
      this.activeTooltipElem.removeAttribute(`data-${prefix}-elem`);
    }

    const clientRect = elem.getClientRects()[0];

    this.highlightElem.style.left = clientRect.left - padding + 'px';
    this.highlightElem.style.top = clientRect.top - padding + 'px';
    this.highlightElem.style.height = clientRect.height + 2 * padding + 'px';
    this.highlightElem.style.width = clientRect.width + 2 * padding + 'px';
    this.highlightElem.setAttribute(`data-${prefix}-show`, '');

    this.activeTooltipElem = elem;

    this._update_tooltip();
    this._update_buttons();

    setTimeout(() => {
      this.popperInstance.update();
      this.tooltipElem.setAttribute(`data-${prefix}-show`, '');
      this.activeTooltipElem.setAttribute(`data-${prefix}-elem`, '');
    }, 320);
  }

  hide() {
    this.tooltipElem.removeAttribute(`data-${prefix}-show`);
    this.highlightElem.removeAttribute(`data-${prefix}-show`);

    if (this.activeTooltipElem) {
      this.activeTooltipElem.removeAttribute(`data-${prefix}-elem`);
      this.activeTooltipElem = null;
    }

    // this.body.removeChild(this.highlightElem);
    // this.body.removeChild(this.tooltipElem);

    this.activeIndex = 0;
  }

  _init_highlight() {
    this.highlightElem = document.createElement('div');
    this.highlightElem.setAttribute('id', `${prefix}-highlight`);
    this.body.appendChild(this.highlightElem);
  }

  _init_tooltip() {
    this.tooltipElem = document.querySelector(cardSelector);

    // if (!this.tooltipElem) {
    //     let tooltip = document.createElement('div');
    //     tooltip.innerHTML = `<div class="card text-dark bg-light mb-3" style="max-width: 18rem;">
    //     <div class="card-header">Tipp <a href="#" class="btn xpln-close">X</a></div>
    //     <div class="card-body">
    //         <h5 class="card-title xpln-title"></h5>
    //         <p class="card-text ${prefix}-text"></p>
    //     </div>
    //     <div class="card-footer bg-transparent border-success">
    //         <a href="#" class="btn btn-primary xpln-prev">Prev</a>
    //         <a href="#" class="btn btn-primary xpln-next">Next</a>
    //     </div>
    //     </div>`;

    //     tooltip = tooltip.firstChild;
    //     tooltip.classList.add(`${prefix}-tooltip`);

    //     this.body.appendChild(tooltip);
    //     this.tooltipElem = tooltip;
    // }

    this._init_buttons();
  }

  _init_buttons() {
    const closeBtn = this.tooltipElem.querySelector(closeSelector);
    closeBtn.addEventListener('click', () => {
      this.hide();
    });

    const prevBtn = this.tooltipElem.querySelector(prevBtnSelector);
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.tooltipElem.removeAttribute(`data-${prefix}-show`);
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this.show();
      });
    }

    const nextBtn = this.tooltipElem.querySelector(nextBtnSelector);
    if (nextBtn) {
      nextBtn.setAttribute('disabled', this.activeIndex + 1 >= this.xplnList.length);
      nextBtn.addEventListener('click', () => {
        this.tooltipElem.removeAttribute(`data-${prefix}-show`);
        this.activeIndex = Math.min(this.activeIndex + 1, this.xplnList.length);
        this.show();
      });
    }

    this._update_buttons();
  }

  _update_tooltip() {
    const text = this.activeTooltipElem.getAttribute(`data-${prefix}-text`);
    const tooltipTextElem = this.tooltipElem.querySelector(textSelector);
    tooltipTextElem.innerHTML = text;
  }

  _update_buttons() {
    const prevBtn = this.tooltipElem.querySelector(prevBtnSelector);
    const nextBtn = this.tooltipElem.querySelector(nextBtnSelector);

    if (this.activeIndex <= 0) {
      prevBtn.setAttribute('disabled', '');
    } else {
      prevBtn.removeAttribute('disabled');
    }

    if (this.activeIndex + 1 >= this.xplnList.length) {
      nextBtn.setAttribute('disabled', '');
    } else {
      nextBtn.removeAttribute('disabled');
    }
  }
}

export default new xpln();

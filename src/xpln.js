export const prefix = 'xpln';
const xplnSelector = `[data-${prefix}]`;
const xplnStepAttr = `data-${prefix}-step`;

const xplnBoxSelector = `[data-${prefix}-box]`;
const xplnBoxContentSelector = `[data-${prefix}-content]`;
const xplnBoxCloseBtnSelector = `[data-${prefix}-close]`;
const prevBtnSelector = `[data-${prefix}-prev]`;
const nextBtnSelector = `[data-${prefix}-next]`;

const minDelay = 120;
const padding = 10;

const defaultBoxHtml = `<div class="card text-dark bg-light mb-3" data-xpln-box>
<div class="card-header">Tipp <a href="#" class="btn" data-xpln-close>x</a></div>
<div class="card-body">
    <p class="card-text" data-xpln-content></p>
</div>
<div class="card-footer bg-transparent border-success">
    <button class="btn btn-primary" data-xpln-prev>Prev</button>
    <button class="btn btn-primary" data-xpln-next>Next</button>
</div>
</div>`;

class xpln {
  bodyElem = null;
  highlightElem = null;
  xplnBoxElem = null;
  activeXplnElem = null;
  xplnList = [];
  activeIndex = 0;
  xplnBoxDelay = 0;
  popperInstance = null;

  initialized = false;
  options = {
    delay: 0,
    disableActiveElem: false,
  };

  constructor() {}

  init(options) {
    if (this.initialized) return;

    if (options) {
      this.options = {
        ...this.options,
        ...options,
      };
    }

    if (this.options.delay) {
      this.xplnBoxDelay = Math.max(minDelay, options.delay);
    }

    this.body = document.getElementsByTagName('body')[0];
    this.xplnList = [...document.querySelectorAll(xplnSelector)].sort(
      (a, b) => a.getAttribute(xplnStepAttr) - b.getAttribute(xplnStepAttr)
    );

    this._init_highlight();
    this._init_box();

    this.popperInstance = Popper.createPopper(this.highlightElem, this.xplnBoxElem, {
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
    if (!this.initialized || !this.xplnList) return;

    if (this.activeXplnElem) {
      this.activeXplnElem.removeAttribute(`data-${prefix}-elem`);
    }

    const elem = this.xplnList[this.activeIndex];
    if (!elem) return;

    const clientRect = elem.getClientRects()[0];

    this.highlightElem.style.left = clientRect.left - padding + 'px';
    this.highlightElem.style.top = clientRect.top - padding + 'px';
    this.highlightElem.style.height = clientRect.height + 2 * padding + 'px';
    this.highlightElem.style.width = clientRect.width + 2 * padding + 'px';
    this.highlightElem.setAttribute(`data-${prefix}-show`, '');

    this.activeXplnElem = elem;

    this._update_tooltip();
    this._update_buttons();

    setTimeout(() => {
      this.popperInstance.update();
      this.xplnBoxElem.setAttribute(`data-${prefix}-show`, '');
      if (!this.options.disableActiveElem) {
        this.activeXplnElem.setAttribute(`data-${prefix}-elem`, '');
      }
    }, this.xplnBoxDelay);
  }

  hide() {
    this.xplnBoxElem.removeAttribute(`data-${prefix}-show`);
    this.highlightElem.removeAttribute(`data-${prefix}-show`);

    if (this.activeXplnElem) {
      this.activeXplnElem.removeAttribute(`data-${prefix}-elem`);
      this.activeXplnElem = null;
    }

    this.activeIndex = 0;
  }

  clean() {
    this.hide();

    this.body.removeChild(this.highlightElem);
    this.body.removeChild(this.tooltipElem);

    this.initialized = false;
  }

  _init_highlight() {
    this.highlightElem = document.createElement('div');
    this.highlightElem.setAttribute('id', `${prefix}-highlight`);
    this.highlightElem.style.setProperty('--delay', this.xplnBoxDelay + 'ms');
    this.body.appendChild(this.highlightElem);
  }

  _init_box() {
    this.xplnBoxElem = document.querySelector(xplnBoxSelector);

    if (!this.xplnBoxElem) {
      let box = document.createElement('div');
      box.innerHTML = defaultBoxHtml;

      box = box.firstChild;
      box.classList.add(`${prefix}-tooltip`);

      this.xplnBoxElem = box;
      this.body.appendChild(box);
    }

    this._init_buttons();
  }

  _init_buttons() {
    const closeBtns = this.xplnBoxElem.querySelectorAll(xplnBoxCloseBtnSelector);
    if (closeBtns && closeBtns.length > 0) {
      for (const btn of closeBtns) {
        btn.addEventListener('click', () => {
          this.hide();
        });
      }
    }

    const prevBtn = this.xplnBoxElem.querySelector(prevBtnSelector);
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.xplnBoxElem.removeAttribute(`data-${prefix}-show`);
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this.show();
      });
    }

    const nextBtn = this.xplnBoxElem.querySelector(nextBtnSelector);
    if (nextBtn) {
      nextBtn.setAttribute('disabled', this.activeIndex + 1 >= this.xplnList.length);
      nextBtn.addEventListener('click', () => {
        this.xplnBoxElem.removeAttribute(`data-${prefix}-show`);
        this.activeIndex = Math.min(this.activeIndex + 1, this.xplnList.length);
        this.show();
      });
    }

    this._update_buttons();
  }

  _update_tooltip() {
    const text = this.activeXplnElem.getAttribute(`data-${prefix}`);
    const tooltipTextElem = this.xplnBoxElem.querySelector(xplnBoxContentSelector);
    tooltipTextElem.innerHTML = text;
  }

  _update_buttons() {
    const prevBtn = this.xplnBoxElem.querySelector(prevBtnSelector);
    const nextBtn = this.xplnBoxElem.querySelector(nextBtnSelector);

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

import selectAll from './select-all';

export default class LazyLoad {
  constructor() {
    this.threshold = 150;
    this.onScroll = this.onScroll.bind(this);
  }

  init() {
    this.elements = selectAll('img.lazyload');
    this.checkElements();
    this.createScrollListener();
  }

  checkElements() {
    const elements = this.elements;
    const threshold = this.threshold;
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const processedElements = [];

    elements.forEach((element, idx) => {
      // the element is not visible at all, no need
      if (!elementIsVisible(element)) return;

      const rect = element.getBoundingClientRect();

      const visible =
        rect.top <= clientHeight + threshold &&
        rect.right >= -threshold &&
        rect.bottom >= -threshold &&
        rect.left <= clientWidth + threshold;

      if (visible) {
        processedElements.push(idx);
        element.classList.add('lazyload--loaded');
        const src = element.getAttribute('data-src');
        const srcset = element.getAttribute('data-srcset');

        if (src) element.setAttribute('src', src);
        if (srcset) element.setAttribute('srcset', srcset);
      }

      while (processedElements.length > 0) {
        elements.splice(processedElements.pop(), 1);
      }

      if (elements.length === 0) {
        this.removeScrollListener();
      }
    }, this);
  }

  createScrollListener() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  removeScrollListener() {
    window.removeEventListener('scroll', this.onScroll, { passive: true });
  }

  destroy() {
    this.elements = null;
    this.removeScrollListener();
  }

  onScroll() {
    this.checkElements();
  }
}

function elementIsVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight);
}

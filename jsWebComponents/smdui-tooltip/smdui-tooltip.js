/* global customElements */

class Tooltip extends HTMLElement {
    constructor() {
        super();
        this._tooltipVisible = false;
        this.init();
    }

    init() {
        this.tooltipContainer = document.createElement('div');
    }

    set text(text) {
        if (text) {
            this.setAttribute('text', text);
        } else if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text') || '';
        } else {
            this._tooltipText = '';
        }
    }

    get text() {
        return this.getAttribute('text');
    }
    
    get target() {
        return this._tooltipTarget;
    }

    set element(element) {
        this._tooltipTarget = element;
        if (element.parentElement && element.parentElement !== this) {
            element.parentElement.appendChild(this);
        }
        this.appendChild(element);
    }

    connectedCallback() {
        this.appendChild(this._tooltipTarget);
        this._tooltipTarget.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipTarget.addEventListener('mouseleave', this._hideTooltip.bind(this));
        this._tooltipTarget.addEventListener('touchstart', this._showTooltipTouch.bind(this));
        this._tooltipTarget.addEventListener('touchend', this._hideTooltip.bind(this));
        this.tooltipContainer.classList.add('sui-tt');
        this.appendChild(this.tooltipContainer);
        this._render();
    }
    ;
            attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === 'text') {
            this._tooltipText = newValue;
        }
    }

    static get observedAttributes() {
        return ['text'];
    }

    disconnectedCallback() {
        this._tooltipTarget.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipTarget.removeEventListener('mouseleave', this._hideTooltip);
    }

    _render() {
        this.tooltipContainer.textContent = this._tooltipText || "";
        if (this._tooltipVisible) {
            this.tooltipContainer.classList.add('sui-tt-open');

        } else {
            if (this.tooltipContainer)
                this.tooltipContainer.classList.remove('sui-tt-open');
        }
    }

    _showTooltip() {
            this._tooltipVisible = true;
            this._render();
    }
    _showTooltipTouch(ev) {
            this._tooltipVisible = true;
            this._render();
    }
    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
    }
}
customElements.define('smdui-tooltip', Tooltip);
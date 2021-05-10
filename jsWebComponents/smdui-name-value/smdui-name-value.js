/* global customElements */

class NameValue extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.init();
        this.stylesheetPath = '../../../../resources/platar86/jsWebComponents';
        this.tooltipJsPath = '../smdui-tooltip/smdui-tooltip.js';
        this.tootipAvailable = false; //Flag to indicate whether the script is available
    }

    init() {
        this.contentDiv = document.createElement('div');
        this.nameSpan = document.createElement('span');
        this.valueSpan = document.createElement('span');
        this.unitSpan = document.createElement('span');

        this.contentDiv.classList.add('content-div');
        this.shadowRoot.appendChild(this.contentDiv);

        const nameSpanContainer = document.createElement('div');
        nameSpanContainer.classList.add('left-container');

        const valueSpanContainer = document.createElement('div');
        valueSpanContainer.classList.add('right-container');

        this.contentDiv.appendChild(nameSpanContainer);
        this.contentDiv.appendChild(valueSpanContainer);

        this.nameSpan.classList.add('name-span');
        nameSpanContainer.appendChild(this.nameSpan);
        this.nameSpan.innerHTML = this.name;


        this.valueSpan.classList.add('value-span');
        valueSpanContainer.appendChild(this.valueSpan);
        this.valueSpan.innerHTML = this.value;


        this.unitSpan.classList.add('unit-span');
        this.contentDiv.appendChild(this.unitSpan);
        this.unitSpan.innerHTML = this.unit;
    }

    set name(name) {
        this.setAttribute('item-name', name);
    }

    get name() {
        return this.getAttribute('item-name');
    }

    set value(value) {
        this.setAttribute('item-value', value);
    }

    get value() {
        return this.getAttribute('item-value');
    }

    set unit(unit) {
        this.setAttribute('item-unit', unit);
    }

    get unit() {
        return this.getAttribute('item-unit');
    }

    set nameTooltip(text) {
        this.setNameTooltip(text);
    }

    set valueTooltip(text) {
        this.setValueTooltip(text);
    }



    connectedCallback() {
        const linkElem = document.createElement('link'); //link for external stylesheet
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', this.stylesheetPath + '/smdui-name-value/smdui-name-value.css');
        this.shadowRoot.appendChild(linkElem);

        //tooltip try add script
//        import (this.tooltipJsPath).catch(e => { return; });

        try {
            this.nameTooltipEl = document.createElement('smdui-tooltip');
            this.valueTooltipEl = document.createElement('smdui-tooltip');
        } catch (error) {
            return;
        }
    }

    static get observedAttributes() {
        return ['item-name', 'item-value', 'item-unit'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'item-name' && this.nameSpan) {
            this.nameSpan.innerHTML = newVal;
        }
        if (name === 'item-value' && this.valueSpan) {
            this.valueSpan.innerHTML = newVal;
        }
        if (name === 'item-unit' && this.unitSpan) {
            this.unitSpan.innerHTML = newVal;
        }
    }

    setNameTooltip(text) {
        if (text === (null || undefined)) {
            this.nameTooltipEl.setAttribute('text', '');
        }
        this.nameTooltipEl.setAttribute('text', text);
        if (this.nameSpan.parentNode !== this.nameTooltipEl) {
            this.nameSpan.parentNode.replaceChild(this.nameTooltipEl, this.nameSpan);
            this.nameTooltipEl.appendChild(this.nameSpan);
        }
        return this;
    }

    setValueTooltip(text) {
        if (text === null || undefined) {
            this.valueTooltipEl.setAttribute('text', '');
        }
        this.valueTooltipEl.setAttribute('text', text);
        if (this.valueSpan.parentNode !== this.valueTooltipEl) {
            this.valueSpan.parentNode.replaceChild(this.valueTooltipEl, this.valueSpan);
            this.valueTooltipEl.appendChild(this.valueSpan);
        }
        return this;
    }
}

customElements.define('smdui-name-value', NameValue);
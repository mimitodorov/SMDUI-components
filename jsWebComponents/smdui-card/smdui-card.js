/* global customElements */

class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.contentItems = [];
        this.init();
        this.stylesheetPath = '../../../../resources/platar86/jsWebComponents';
    }

    init() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrapper');
        this.shadowRoot.appendChild(this.wrapper);

        this.headingSpan = document.createElement('span');
        this.headingSpan.classList.add('heading');
        this.wrapper.appendChild(this.headingSpan);

        this.contentDiv = document.createElement('div');
        this.contentDiv.classList.add('content-div');
        this.wrapper.appendChild(this.contentDiv);

        const contentSlot = document.createElement('slot'); //To insert content from DOM, add separately, style before inserting
        contentSlot.classList.add('content-slot');
        contentSlot.setAttribute('name', 'content-slot');
        this.contentDiv.appendChild(contentSlot);
    }

    set heading(heading) {
        this.setAttribute('heading', heading);
    }

    get heading() {
        return this.getAttribute('heading');
    }

    connectedCallback() {
        const linkElem = document.createElement('link'); //link for external stylesheet
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', this.stylesheetPath + '/smdui-card/smdui-card.css');
        this.shadowRoot.appendChild(linkElem);
    }

    addContent(content) { //Allows to insert content rather than using slot. Should be styled before.
        try {
            this.contentDiv.appendChild(content);
            this.contentItems.push(content);
        } catch(e) {
            let message = content + " Should be an html element. May have nested elements, but only one parent.";
            console.warn(e + message);
        }
        return this;
    }

    removeContent(index, removeAll) {
        try {
            if (removeAll === true) {
                for (let i = index; i < this.contentItems.length; i++) {
                    this.contentDiv.removeChild(this.contentItems[i]);
                }
                this.contentItems.splice(0, this.contentItems.length);
            } else {
                this.contentDiv.removeChild(this.contentItems[index]);
                this.contentItems.splice(index, 1);
            }
        } catch (e) {
            console.warn(e);
        }
        return this;
    }

    static get observedAttributes() {
        return ['heading'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'heading') {
            this.headingSpan.innerHTML = this.heading;
        }
    }
}
customElements.define('smdui-card', Card);
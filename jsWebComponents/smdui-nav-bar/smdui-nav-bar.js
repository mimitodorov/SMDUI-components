/* global customElements */

class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tabsArr = [];
        this.selectedTab;
        this.mainSection = document.createElement('div');
        this.tabsSection = document.createElement('div');
        this.init();
        this.stylesheetPath = '../../../../resources/platar86/jsWebComponents';
    }

    connectedCallback() {
        const linkElem = document.createElement('link'); //link for external stylesheet
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', this.stylesheetPath + '/smdui-nav-bar/smdui-nav-bar.css');
        this.shadowRoot.appendChild(linkElem);
    }

    init() {
        this.shadowRoot.appendChild(this.mainSection);

        this.mainSection.classList.add('main-section');

        this.tabsSection.classList.add('tabs-section');
        this.mainSection.appendChild(this.tabsSection);
    }

    addTab(name, cb) {
        const newTab = document.createElement('span');
        newTab.classList.add('nav-tab');
        newTab.innerHTML = name;
        newTab.addEventListener('click', () => {
            cb();
            this.setSelected(newTab);
        });
        this.tabsSection.appendChild(newTab);
        this.tabsArr.push(newTab);

        if (this.selectedTab === undefined) {
            this.selectedTab = this.tabsArr[0];
            this.setSelected(this.selectedTab);
        }
    }

    setSelected(tab) {
        let selectedTab = tab;
        for (let i = 0; i < this.tabsSection.children.length; i++) {
            this.tabsArr[i].classList.remove('selected');
        }
        selectedTab.classList.add('selected');
    }

    addLink(name, cb) {
        if (!document.querySelector('.link-section')) {
            const linkSection = document.createElement('div');
            linkSection.classList.add('link-section');
            this.mainSection.appendChild(linkSection);
            const link = document.createElement('a');
            link.innerHTML = name;
            link.addEventListener('click', cb);
            link.classList.add('anchor-tag');
            linkSection.appendChild(link);
        }
    }

    setLinkInfo(text) {
        const linkInfo = document.createElement('span');
        linkInfo.classList.add('link-info');
        linkInfo.innerHTML = text;
        if (this.shadowRoot.querySelector('.link-section')) {
            this.shadowRoot.querySelector('.link-section').appendChild(linkInfo);
        } else {
            const linkSection = document.createElement('div');
            linkSection.classList.add('link-section');
            this.mainSection.appendChild(linkSection);
            linkSection.appendChild(linkInfo);
        }
    };
}

customElements.define('smdui-nav-bar', NavBar);
/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global customElements */

class TabPanel extends HTMLElement {
    constructor(el, conf) {
        super();
        this.el = el;
        this.conf = conf || {};
        this.menuContent = {};
        this.contentElArr = {};
        this.contentTabArr = {};
        this.init();
    }

    init() {
        this.classList.add('smdui-tabPanel-container');
    }

    connectedCallback() {
        this.appendChild(this._wrapper);
    }

    addTab() {


    }

    removeTab() {

    }

}

customElements.define('sui-tab-panel', TabPanel);
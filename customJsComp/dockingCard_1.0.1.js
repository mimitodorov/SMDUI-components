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
/* global Element, hh */

(function (root) {
    let SMDUIDockingCard = function (el) {
        this.conf = {};
        this.conf.card = hh.validateDomEl(el);
        if (!this.conf.card) {
            console.warn('Invalid element');
            return;
        }

        init.call(this);
    };

    let prot = SMDUIDockingCard.prototype;

    prot.detach = function () {
        this.dialogContent.appendChild(this.card);
        this.dialog.open();
        this.wrapper.style.display = 'none';
    };

    prot.dock = function () {
        this.wrapper.appendChild(this.card);
        this.wrapper.style.display = 'block';
    };

    function init() {
        this.container = this.conf.card.parentElement;

        if (this.conf.card) {
            this.card = this.conf.card;
        } else {
            this.card = document.createElement('div');
        }

        this.wrapper = document.createElement('div');
        this.wrapper.style.position = 'relative';

        this.container.insertBefore(this.wrapper, this.card);
        this.wrapper.appendChild(this.card);

        this.headerDiv = document.createElement('div');
        this.headerDiv.style.position = 'absolute';
        this.headerDiv.style.right = '10px';
        this.headerDiv.style.top = '1px';
        this.wrapper.appendChild(this.headerDiv);

        this.expButton = document.createElement('i');
        hh.addClass(this.expButton, ['fa-window-minimize', 'fa']);
        this.expButton.style.cursor = 'pointer';
        this.expButton.onclick = this.detach.bind(this);
        this.headerDiv.appendChild(this.expButton);


        if (!(this.parentEl instanceof Element)) {
            this.parentEl = document.querySelector('#' + this.parentEl);
            if (!this.parentEl) {
                this.parentEl = document.querySelector('.' + this.parentEl);
            }
        }

        if (this.parentEl) {
            this.parentEl.appendChild(this.container);
        }

        this.dialog = new SMDUIDialog({
            onClose: this.dock.bind(this),
            modal: false,
            open: true,
            draggable: true
        });

        this.dialogContent = this.dialog.contentDiv;

    }

    root.SMDUIDockingCard = SMDUIDockingCard;
}(window));


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
/* global hh, init */

(function (root) {
    let SMDUIDialog = function (conf) {
        this.parentEl = document.querySelector('body');
        this.conf = conf;

        init.call(this);
        

    };



    let prot = SMDUIDialog.prototype;

    prot.open = function () {
        this.container.style.display = 'block';
        this.backdrop.style.display = 'block';         //modal: true but if false then default
        this.container.style.transform = "";

        if (!this.isFullscreen) {
            this.container.style.left = (innerWidth - (this.container.clientWidth + innerWidth) / 2).toString() + "px";
            this.container.style.top = (innerHeight - (this.container.clientHeight + innerHeight) / 2).toString() + "px";
        }


        this.resizeObserver.observe(this.container);
        dragElement.call(this, this.container);

    };

    prot.close = function () {
        this.container.style.display = 'none';
        this.backdrop.style.display = 'none';
    };

    root.SMDUIDialog = SMDUIDialog;

    //////////////Internal functionality////////////////////

    function init() {
// this.conf.modal = this.conf.modal || false;
        this.container = document.createElement('div');
            //    this.container.style.minWidth = '300px';
            //    this.container.style.minHeight = '100px';
        this.container.style.zIndex = '501';
        hh.addClass(this.container, ['ui-dialog', 'ui-widget', 'ui-widget-content', 'ui-corner-all', 'ui-shadow', 'ui-hidden-container', 'ui-draggable', 'ui-resizable']);

        this.headerDiv = document.createElement('div');
        hh.addClass(this.headerDiv, ['ui-widget-header', 'ui-helper-clearfix', 'ui-draggable-handle']);
        this.container.appendChild(this.headerDiv);
        ////////////////////////////////////////////////////////////////////
        this.headerDiv.addEventListener('dblclick', onFullscreenClick.bind(this));  //MARIA: added double click to headerDiv to act as fullscreen button
        ////////////////////////////////////////////////////////////////////

        this.headerDiv.headingpan = document.createElement('span');
        hh.addClass(this.headerDiv.headingpan, 'ui-dialog-title');
        this.headerDiv.appendChild(this.headerDiv.headingpan);
        this.headerDiv.headingpan.style.paddingLeft = '5px';
        this.headerDiv.headingpan.style.pointerEvents = 'none';
        if (this.conf.heading) {
            this.headerDiv.headingpan.innerHTML = this.conf.heading;
        }
        this.headerDiv.controlsDiv = document.createElement('div');
        this.headerDiv.controlsDiv.style.display = 'flex';
        this.headerDiv.controlsDiv.style.float = 'right';
        this.headerDiv.controlsDiv.style.float = 'right';
        hh.addClass(this.headerDiv.controlsDiv, ['ui-dialog-titlebar-icon', 'ui-corner-all']);

        this.headerDiv.controlsDiv.fullscreenButton = document.createElement('span');
        hh.addClass(this.headerDiv.controlsDiv.fullscreenButton, ['ui-icon', 'ui-icon-fullscreen', 'ui-dialog-titlebar-close']);
        this.headerDiv.controlsDiv.appendChild(this.headerDiv.controlsDiv.fullscreenButton);
        this.headerDiv.appendChild(this.headerDiv.controlsDiv);

        this.headerDiv.controlsDiv.closeButton = document.createElement('span');
        hh.addClass(this.headerDiv.controlsDiv.closeButton, ['ui-icon', 'ui-icon-closethick', 'ui-dialog-titlebar-close']);

        this.headerDiv.controlsDiv.appendChild(this.headerDiv.controlsDiv.closeButton);
        this.headerDiv.controlsDiv.closeButton.onclick = this.close.bind(this);
        this.contentDiv = document.createElement('div');
        hh.addClass(this.contentDiv, ['ui-dialog-content', 'ui-widget-content']);
        this.container.appendChild(this.contentDiv);
        this.headerDiv.controlsDiv.fullscreenButton.onclick = onFullscreenClick.bind(this);


        this.footerDiv = document.createElement('div');
        this.footerDiv.style.display = 'flex';
        this.footerDiv.style.justifyContent = 'space-evenly';
        hh.addClass(this.footerDiv, ['ui-dialog-footer', 'ui-widget-footer']);

        this.container.appendChild(this.footerDiv);

        if (typeof (this.parentEl) === 'string') {
            let pe = document.getElementById(this.parentEl);
            if (pe) {
                pe.appendChild(this.container);
            }
        } else if (typeof (this.parentEl) === 'object') {
            try {
                this.parentEl.appendChild(this.container);
            } catch (e) {
                console.warn(e);
            }
        }


        if (this.conf.modal) {
            //modal functionality
            this.backdrop = document.createElement('div');
            this.backdrop.classList.add('ui-widget-overlay');
            this.backdrop.style.zIndex = 500;
            this.parentEl.appendChild(this.backdrop);
        }

        if (this.conf.draggable) {

        }

        if (this.conf.onInitComplete) {
            this.conf.onInitComplete(this.contentDiv, this.footerDiv, this);
        }

        this.resizeObserver = new ResizeObserver((entries) => {
            console.log(entries);
            this.container.style.transform = "";

            if (!this.isFullscreen) {
                this.container.style.left = (innerWidth - (this.container.clientWidth + innerWidth) / 2).toString() + "px";
                this.container.style.top = (innerHeight - (this.container.clientHeight + innerHeight) / 2).toString() + "px";
            }
            dragElement.call(this, this.container);

        });

        window.onresize = function () {
        };

    }

    function onFullscreenClick() {
        if (!this.isFullscreen) {
            this.isFullscreen = true;
            this.container.style.width = '100vw';
            this.container.style.height = '100vh';
            this.contentDiv.style.height = '90%';
            //            this.contentDiv.style.display = 'grid';
            this.contentDiv.style.alignItems = 'center';
            this.contentDiv.style.justifyContent = 'center';
            this.container.style.maxHeight = '100%';
            this.container.style.left = "0px";
            this.container.style.top = "0px";
            this.container.style.transform = "";

        } else {
            this.contentDiv.style = '';
            this.isFullscreen = false;
            this.container.style.width = '';
            this.container.style.height = '';
            this.contentDiv.style.display = 'block';
            if (this.container.lastTransform) {
                this.container.style.transform = this.container.lastTransform;
            }
            console.log(this.container.lastTransform);
        }
        this.open();
    }

    function dragElement(el) {
        //        let draggable = !this.isFullscreen;
        let draggable = true;
        let dragItem = this.headerDiv;
        let wrapper = this.container;

        if (draggable) {
            dragItem.onmousedown = dragStart;
            dragItem.addEventListener('touchstart', dragStart, false);
            dragItem.addEventListener('touchend', dragEnd, false);
            dragItem.addEventListener('touchmove', drag, false);
        } else {
            dragItem.onmousedown = null;
            dragItem.addEventListener('touchstart', null);
            dragItem.addEventListener('touchend', null);
            dragItem.addEventListener('touchmove', null);
            el.style.transform = '';
        }

        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let active = false;

        function dragStart(e) {
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === dragItem) {
                active = true;
            }
            document.onmouseup = dragEnd;
            document.onmousemove = drag;
        }

        function drag(e) {
            if (active) {

                e.preventDefault();
                if (e.type === 'touchmove') {

                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }
                xOffset = currentX;
                yOffset = currentY;

                let topOffsetHeight;
                if (window.matchMedia("(max-width: 1000px)").matches) {
                    // topOffsetHeight = 65;
                    topOffsetHeight = 0;                                    //MARIA: changed value from 65 to 0
                } else {
                    topOffsetHeight = 0;
                }
                ;
                let leftLimitBool = (innerWidth / 2 - wrapper.clientWidth / 2 > -currentX);
                let topLimitBool = (innerHeight / 2 - wrapper.clientHeight / 2 - topOffsetHeight > -currentY);
                let rightLimitBool = (-(wrapper.clientWidth / 2 - innerWidth / 2) > currentX);
                let bottomLimitBool = (-(wrapper.clientHeight / 2 - (innerHeight) / 2) + topOffsetHeight > currentY);

                if (!topLimitBool || !bottomLimitBool) {
                    if (!topLimitBool) {
                        currentY = -(innerHeight / 2 - wrapper.clientHeight / 2) + topOffsetHeight;
                    }
                    if (!bottomLimitBool) {
                        currentY = (innerHeight / 2 - wrapper.clientHeight / 2) + topOffsetHeight;
                    }
                    yOffset = currentY;
                }

                if (!leftLimitBool || !rightLimitBool) {
                    if (!leftLimitBool) {
                        currentX = -(innerWidth / 2 - wrapper.clientWidth / 2);
                    }

                    if (!rightLimitBool) {
                        currentX = (innerWidth / 2 - wrapper.clientWidth / 2);
                    }
                    xOffset = currentX;
                }
                setTranslate((currentX), (currentY));

            }

            function setTranslate(xPos, yPos) {
                el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
                el.lastTransform = el.style.transform;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            active = false;
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    /////////////////////////////////////////////////////

}(window));
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

        if (this.conf.modal) {
            this.backdrop.style.display = 'block';
        }

        if (!this.conf.isFullscreen && !this.conf.position && !this.inited) {
            this.container.style.left = "0px";
            this.container.style.top = "0px";
            let xPos;
            let yPos;

            if (this.conf.position) {
                if (this.conf.position.x) {
                    xPos = this.conf.position.x;
                }
                if (this.conf.position.y) {
                    yPos = this.conf.position.y;
                }
            } else {
                xPos = (innerWidth - (this.container.clientWidth + innerWidth) / 2);
                yPos = (innerHeight - (this.container.clientHeight + innerHeight) / 2);
            }
            if (this.conf.draggable) {
                this.inited = true;
                dragElement.call(this, this.container, xPos, yPos);
            } else {
            }
            this.container.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
            this.container.lastTransform = this.container.style.transform;
        }
    };

    prot.setBarTitle = function (title) {
        this.headerDiv.headingpan.innerHTML = title;
    };

    prot.close = function () {
        this.container.style.display = 'none';
        if (this.conf.modal) {
            this.backdrop.style.display = 'none';
        }
    };

    root.SMDUIDialog = SMDUIDialog;

    //////////////Internal functionality////////////////////

    function init() {

        this.container = document.createElement('div');
        this.container.style.zIndex = '501';
        hh.addClass(this.container, ['ui-dialog', 'ui-widget', 'ui-widget-content', 'ui-corner-all', 'ui-shadow', 'ui-hidden-container', 'ui-draggable', 'ui-resizable']);

        this.headerDiv = document.createElement('div');
        hh.addClass(this.headerDiv, ['ui-widget-header', 'ui-helper-clearfix', 'ui-draggable-handle']);
        this.container.appendChild(this.headerDiv);

        this.headerDiv.headingpan = document.createElement('span');
        hh.addClass(this.headerDiv.headingpan, 'ui-dialog-title');
        this.headerDiv.appendChild(this.headerDiv.headingpan);
        this.headerDiv.headingpan.style.paddingLeft = '5px';
        this.headerDiv.headingpan.style.pointerEvents = 'none';

        if (this.conf.heading) {
            this.headerDiv.headingpan.innerHTML = this.conf.heading;
        }

        if (this.conf.doubleClickFS) {
            this.headerDiv.addEventListener('dblclick', onFullscreenClick.bind(this));
        }

        this.headerDiv.controlsDiv = document.createElement('div');
        this.headerDiv.controlsDiv.style.display = 'flex';
        this.headerDiv.controlsDiv.style.float = 'right';
        this.headerDiv.controlsDiv.style.float = 'right';
        this.headerDiv.controlsDiv.style.position = 'relative'; //KP added to fix resize on window
        this.headerDiv.controlsDiv.style.width = '50px'; //KP added to fix resize on window
        hh.addClass(this.headerDiv.controlsDiv, ['ui-dialog-titlebar-icon', 'ui-corner-all']);

        this.headerDiv.controlsDiv.fullscreenButton = document.createElement('span');
        this.headerDiv.controlsDiv.fullscreenButton.style.position = 'absolute'; //KP added to fix resize on window
        this.headerDiv.controlsDiv.fullscreenButton.style.right = '25px'; //KP added to fix resize on window
        hh.addClass(this.headerDiv.controlsDiv.fullscreenButton, ['ui-icon', 'ui-icon-fullscreen', 'ui-dialog-titlebar-close']);
        this.headerDiv.controlsDiv.appendChild(this.headerDiv.controlsDiv.fullscreenButton);
        this.headerDiv.appendChild(this.headerDiv.controlsDiv);

        this.headerDiv.controlsDiv.closeButton = document.createElement('span');
        this.headerDiv.controlsDiv.closeButton.style.position = 'absolute'; //KP added to fix resize on window
        this.headerDiv.controlsDiv.closeButton.style.right = '5px'; //KP added to fix resize on window
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

        if (this.conf.onInitComplete) {
            this.conf.onInitComplete(this.contentDiv, this.footerDiv, this);
        }

        this.resizeObserver = new ResizeObserver((entries) => {
            console.log(entries);
        });

        this.resizeObserver.observe(this.container);


        let intersectionOptions = {
            rootMargin: '0px',
            threshold: 1.0
        };

        this.intersectionObserver = new IntersectionObserver(entries => {
            this.container.intersectionRatio = entries[0].intersectionRatio;

        }, intersectionOptions);

        this.intersectionObserver.observe(this.container);

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
                console.log(this.container.lastTransform);
            }
        }
        this.open();

        //        if (!this.isFullscreen) {
        //            this.isFullscreen = true;
        //            this.container.style.width = '100vw';
        //            this.container.style.height = '100vh';
        //            this.contentDiv.style.height = '100%';
        //            this.contentDiv.style.display = 'grid';
        //            this.contentDiv.style.alignItems = 'center';
        //            this.container.style.maxHeight = '100%';
        //            this.container.style.left = "0px";
        //            this.container.style.top = "0px";
        //            this.container.style.transform = "";
        //
        //        } else {
        //            this.contentDiv.style = '';
        //            this.isFullscreen = false;
        //            this.container.style.width = '';
        //            this.container.style.height = '';
        //            this.contentDiv.style.display = 'block';
        //            if (this.container.lastTransform) {
        //                this.container.style.transform = this.container.lastTransform;
        //            }
        //        }
        //        this.open();
    }

    function dragElement(el, xpos, ypos) {
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

        let dragBeginX;
        let dragBeginY;

        let active = false;

        let x = xpos || 0; //passed when calling dragElement. 
        let y = ypos || 0;

        function dragStart(e) {

            if (e.type === 'touchstart') {
                dragBeginX = e.touches[0].clientX - x;
                dragBeginY = e.touches[0].clientY - y;
            } else {
                dragBeginX = e.clientX - x;
                dragBeginY = e.clientY - y;
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
                let dx = 0;
                let dy = 0;

                if (e.type === 'touchmove') {
                    dx = e.touches[0].clientX - dragBeginX - x;
                    dy = e.touches[0].clientY - dragBeginY - y;
                } else {
                    dx = e.clientX - dragBeginX - x;
                    dy = e.clientY - dragBeginY - y;
                }

                if (x + dx < 0) {//check if out of boundry  left
                    x = 0;
                } else if (x + dx > (innerWidth - wrapper.clientWidth)) {//check if out of boundry right
                    x = innerWidth - wrapper.clientWidth;
                } else {
                    x += dx;
                }

                if (y + dy < 0) {//check if out of boundry  top
                    y = 0;
                } else if (y + dy > (innerHeight - wrapper.clientHeight)) {//check if out of boundry bottom
                    y = innerHeight - wrapper.clientHeight;
                } else {
                    y += dy;
                }

                //                console.log('xy[%d %d]    dxy[%d %d]  e.client[x:%d y:%d]   dragBegin[x:%d y:%d]   clientWidth[%f]  innerWidth[%f]',
                //                        x, y, dx, dy, e.clientX, e.clientY, dragBeginX, dragBeginY, wrapper.clientWidth, innerWidth);

                setTranslate((x), (y));

            }

        }
        function setTranslate(xPos, yPos) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
            el.lastTransform = el.style.transform;
        }

        function dragEnd() {
            active = false;
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    /////////////////////////////////////////////////////

}(window));
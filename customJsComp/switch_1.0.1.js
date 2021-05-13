/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by maria, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
/* global hh, init */

(function(root) {
    let SMDUISwitch = function(el, conf) {
        if (!hh.isElement(el)) {
            console.warn("Not valid HTML Element", el);
        }
        this.el = el;
    
        this.conf = conf || {};

        init.call(this);
    };

    let prot = SMDUISwitch.prototype;


    prot.hide = function() {
        document.querySelector(this.container).hide();
    };
    
    prot.show = function() {
        document.querySelector(this.container).show();
    };

    // prot.onChange = function(callback) {
    //     if (isFunction(callback)) {
    //         this.onChangeCbArr.push(callback);
    //     }
    // };


    prot.onChangeCb = function(val, comp) {
        
        //this.conf.onChange must not be called internally, used to push functions into array for callback
        //    if (typeof (this.conf.onChange) === 'function') {
        //            if (this.getValue !== undefined && this.getValue() !== null) {
        //                    this.conf.onChange(this.getValue(), this.conf.args || null, this);
        //                }
        //            }

        if (this.inputEl) {
            this.container.hidden = false;
        } else {
            this.container.hidden = true;
        }
                
                // if (this.prevValue !== val && !this.conf.disableControl) {
                //     this.ctrlExecBtn.hidden = false;
                // } else {
                //     this.ctrlExecBtn.hidden = true;
                // }
                // mu.execCallback(this.onChangeCbArr, this, val);
                //    console.log(val);
                
            };

    function init() {

        if (!this.label) {
            this.container = document.createElement('div');
            hh.addClass(this.container, 'smdui-switch-wraper');
            hh.addClass(this.container, this.conf.containerClass);
            
            this.el.appendChild(this.container);
            
            this.label = document.createElement('span');
            hh.addClass(this.label, this.conf.labelClass);
            hh.addClass(this.label, "smdui-switchLabel");
        }
        
        let swLabel = document.createElement('label');
        swLabel.classList.add('smdui-switchLabel');

        let swInput = document.createElement('input');
        swInput.type = 'checkbox';
        this.inputEl = swInput;
        
        let swSpan = document.createElement('span');
        swSpan.classList.add('smdui-switchSlider');

        if (this.conf.typeStyle === 'sliderRound') {
            swSpan.classList.add('smdui-switchSliderRound');
        }
        
        swLabel.appendChild(swInput);
        swLabel.appendChild(swSpan);
        this.container.appendChild(swLabel);
        
        this.inputEl.onchange = this.onChangeCb.bind(this); 

    }
    
    root.SMDUISwitch = SMDUISwitch;

}(window));





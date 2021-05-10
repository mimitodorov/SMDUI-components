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


/* global pm, mu */

(function (root) {
    let ParamManager = function () {
        this.elements = {};
        this.changedParams = [];
        this.flags = {
            warningMisingParamCompDisplayedArr: []
        };
    };

    //called from DeviceManager=>SubDevice when param message received
    ParamManager.prototype.onParamReceived = function (dev) {
//        console.log('PM on ParamReceived');
        if (dev.param) {
            let param = dev.param;
            for (var pName in param) {
                let pValue = param[pName];
                if (this.elements[pName]) {
                    this.elements[pName].setValue(pValue);
                } else {
                    if (!this.flags.warningMisingParamCompDisplayedComplete) {
                        if (pName !== 'sniu' || pName !== 'deviceID' || pName !== 'serialNumber') {
                            //show warning with arr ones only
                            if (!this.flags.warningMisingParamCompDisplayed) {
                                this.flags.warningMisingParamCompDisplayed = window.setTimeout(function () {
                                    console.log("%c Param Manager: Param Control Missing %d for: %O", 'background: yellow', this.flags.warningMisingParamCompDisplayedArr.length, this.flags.warningMisingParamCompDisplayedArr);
                                    this.flags.warningMisingParamCompDisplayedComplete = true;

                                }.bind(this), 500);
                            }
                            this.flags.warningMisingParamCompDisplayedArr.push(pName);
                        }
                    }
                }
            }
        }
    };

    ParamManager.prototype.logParamChange = function (element, newVal, oldVal, ser) {
        this.changedParams.push({
            elName: element.paramName,
            el: element,
            newValue: newVal,
            oldValue: oldVal,
            serial: ser
        });
    };

    ParamManager.prototype.addElement = function (name, element) {
        if (!this.elements[name]) {
            this.elements[name] = element;
        } else {
            console.error("Duplicate Parameter found! ", name, element);
        }
    };

    ParamManager.prototype.getParamValue = function (paramName) {
        if (paramName) {
            return this.elements[paramName].getValue();
        }
    };


    root.pm = new ParamManager();
//    console.log('smdui-components init');

}(window));
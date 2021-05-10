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

/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 *  ==================EXAMPLE=======================
 *  
 *    new ParamSetting('bmu-paramTest', 'recordingValues', {
 type: 'dropDown',
 title: 'Recording Values:',
 ctrlInfo: 'Choose which field to be Recorded by the logger.',
 onSaveSuccess: function (comp, val) {
 console.log('Success', comp, val);
 },
 onSaveFail: function (comp, val) {
 console.log('Fail', comp, val);
 },
 onChange: function (comp, val) {
 //Here we van call functions that for example hide other
 //settings depending on the value of the changed component.
 onPowerSettingChange(comp, val);
 },
 extraData: {
 time: function () {
 return new Date().getTime();
 },
 data: 'nwadsf'
 },
 dropDownConf: {
 val: 0,
 options: [
 {label: 'SUM Values only', value: '1'},
 {label: 'Independant Phases only', value: '2'},
 {label: 'Phases and SUM', value: '3'}
 ]
 }
 });
 */



/* global HTMLElement, hh, this, sui, dm, pm, wsm, mu */

function ParamSetting(el, paramName, conf) {

    if (!hh.isElement(el)) {
        if (typeof(el) === 'string') {
            let idEl = document.getElementById(el);
            if (idEl) {
                el = idEl;
            } else {
                console.warn("Not valid HTML Element", el);
            }
        }
    }

    if (typeof(paramName) === 'object' && conf === undefined) {
        conf = paramName;
        paramName = null;
    }


    this.el = el;

    this.conf = conf || {};

    this.onChangeCbArr = [];
    this.onSaveSuccessCbArr = [];
    this.onSaveFailCbArr = [];
    this.prevValue = null;


    if (paramName === undefined || paramName === null) {
        this.conf.detached = true;
    } else {
        this.paramName = paramName;
    }

    this.conf.instrExt = this.conf.instrExt || paramName || "undefined";


    this.init();
    if (typeof(this.conf.onInitComplete) === 'function') {
        this.conf.onInitComplete(this);
    }
    if (!this.conf.detached) {
        pm.addElement(paramName, this);
    }

    this.priv = {};

    this.priv._onParamSave = function(message, val) {
        console.log('this.priv._onParamSave', val);

        let messageInfo = 'Setting: ' +
            this.conf.title +
            ' changed from ' +
            this.getDisplayValueFromValue(this.prevValue) +
            ' to ' +
            this.getDisplayValueFromValue(val);

        if (this.conf.type === 'command') {
            this.conf.title = this.conf.title || '';
            messageInfo = 'Instruction ' + this.conf.title.replaceAll(';', '') + ' triggered!';
        }

        mu.showInfoMessage(messageInfo);

        pm.logParamChange(this, val.toString(), this.prevValue, dm.getSelected().serialNumber);
        this.prevValue = val.toString();
        //to revalidate input and hide icon
        this.setValue(this.prevValue);
        mu.execCallback(this.onSaveSuccessCbArr, this, val);
    };

    this.priv._onParamSaveErr = function(message, err) {
        if (this.onSaveFailCbArr.length === 0) {
            console.log('ParamSettingComp Error: ', err);
        }
        if (!this.conf.hideErrMsg) {
            mu.showErrorMessage(err, 'Error Param: ' + this.conf.title);
        }

        mu.execCallback(this.onSaveFailCbArr, message, err);
    };

}

ParamSetting.prototype.getDisplayValueFromValue = function(val) {
    switch (this.conf.type) {
        case 'switch': //   return this.inputEl.checked;
        case 'sliderHidden': //    return this.sliderHidden.val;
        case 'inputText': //   return  this.textHidden.getValue();
        case 'inputNumber': //   return  this.textHidden.getValue();
        case 'button': //   return    true;
        case 'command': //   return   1;
            return val;
        case 'inputColor':
            if (this.coloPicker.valueSet === false) {
                return null;
            }
            return val; //   return  '#' + this.coloPicker.toString();
        case 'dropDown':
            return this.dropDown.getLabelFromItemValue(val);
        default:
            console.warn('Unknow Setting Panel type' + this.conf.type);
            return null;
    }
};

ParamSetting.prototype.setLabelText = function(text) {
    this.label.innerText = text;
};

ParamSetting.prototype.setInfoTopText = function(text) {
    this.topInfo.innerText = text;
};

ParamSetting.prototype.setInfoText = function(text) {
    this.bottomInfo.innerText = text;
};

ParamSetting.prototype.setUnitText = function(text) {
    this.unitLabel.innerText = text;
};

ParamSetting.prototype.hide = function() {
    $(this.container).hide();
};

ParamSetting.prototype.show = function() {
    $(this.container).show();
};


ParamSetting.prototype.init = function() {
    if (!this.isInitComplete) { //to avoid reinit

        this.isInitComplete = true;
        let conf = this.conf;

        if (conf.val !== undefined) {
            this.prevValue = conf.val;
        }

        let container = document.createElement('div');
        //        container.classList.add('smdui-setPanel-container');
        container.classList.add('devParamPanel');

        if (this.el) {
            this.el.appendChild(container);
            this.el.classList.add('devParamPanelWrapper');
            this.el.appendChild(container);
        }

        this.container = container;

        if (this.conf.hidden) {
            this.hide();
        }

        if (isFunction(conf.onChange)) {
            this.onChangeCbArr.push(conf.onChange);
            //            this.onChange(conf.onChange);
        }
        if (isFunction(conf.onSaveSuccess)) {
            this.onSaveSuccessCbArr.push(conf.onSaveSuccess);
            //            this.onSaveSuccess(conf.onSaveSuccess);
        }
        if (isFunction(conf.onSaveFail)) {
            this.onSaveFailCbArr.push(conf.onSaveFail);
            //            this.onSaveFail(conf.onSaveFail);
        }

        let topInfo = document.createElement('span');
        topInfo.style.gridArea = 'topInfo';
        container.appendChild(topInfo);
        this.topInfo = topInfo;

        let label = document.createElement('span');
        label.textContent = conf.title || "";
        label.classList.add('ctrlLabel');
        container.appendChild(label);
        //        label.style.justifySelf = 'left';
        label.style.alignSelf = 'center';
        this.label = label;

        let bottomInfo = document.createElement('span');
        bottomInfo.classList.add("ctrlInfo");
        if (this.conf.ctrlInfo) {
            bottomInfo.innerHTML = this.conf.ctrlInfo;
        }
        container.appendChild(bottomInfo);
        this.bottomInfo = bottomInfo;

        let unit = document.createElement('span');
        this.unitLabel = unit;
        unit.classList.add("ctrlUnit");
        unit.style.justifySelf = 'left';
        unit.style.alignSelf = 'center';
        if (this.conf.unit) {
            unit.innerHTML = this.conf.unit;
        }
        container.appendChild(unit);

        //        let btnDiv = document.createElement('div');

        this.ctrlExecBtn = sui.dropdown({
            text: '...',
            content: [{
                    name: 'Set',
                    cb: () => {
                        let instruction = {
                            instrExt: this.conf.instrExt,
                            instrData: this.getValue().toString()
                        };

                        //This is to support the new way
                        instruction[this.conf.instrExt] = this.getValue().toString();
                        if (this.conf.extraData) {
                            for (var fieldName in this.conf.extraData) {
                                let exData = this.conf.extraData[fieldName];
                                try {
                                    if (typeof(exData) === 'function') {
                                        instruction[fieldName] = exData();
                                    } else {
                                        instruction[fieldName] = exData;
                                    }
                                } catch (e) {}
                            }
                        }
                        if (typeof(this.conf.validator) === 'function') {
                            try {
                                this.conf.validator(this, instruction);
                            } catch (e) {
                                //                                console.warn(e);
                                mu.showErrorMessage(e);
                                return;
                            }
                        }

                        wsm.sendDevMsgExecWithJsonInst(
                            instruction,
                            this.priv._onParamSave.bind(this),
                            this.priv._onParamSaveErr.bind(this),
                            3000);
                    }
                },
                {
                    name: 'Discard',
                    cb: () => {
                        // console.log('discard');
                        if (this.prevValue !== null) {
                            this.setValue(this.prevValue);
                        }
                    }
                }
            ],
            type: 'small'
        });

        this.ctrlExecBtn.classList.add('ctrlExec');
        if (conf.type !== 'dropDownButton') {
            container.appendChild(this.ctrlExecBtn);
        }
        //        hh.addClass(button, ['ui-button', 'ui-widget', 'ui-state-default', 'ui-corner-all', 'ui-button-icon-only']);
        //        this.button.textContent = '...';
        //        button.onclick = console.log();

        switch (conf.type) {
            case 'dropDownButton':
                this.createDropDownButton();
                break;
            case 'switch':
                this.createSwitch();
                break;
            case 'command':
                this.createCommand();
                break;
            case 'sliderHidden':
                this.createSliderHidden();
                break;
            case 'inputText':
                this.createInputText('text');
                break;
            case 'inputNumber':
                this.createInputText('number');
                break;
            case 'inputColor':
                this.createInputColor();
                break;
            case 'dropDown':
                this.createDropDown();
                break;
            case 'button':
                this.createButton();
                break;
            default:
                console.warn('Unknow Setting Panel type' + conf.type);
                break;
        }

        if (conf.toolTip) {
            let tooltip = sui.addTooltip(container, conf.toolTip);
            tooltip.tooltipContainer.style.justifyContent = 'flex-end';
            tooltip.target.style.width = '100%';
        }
        if (conf.type !== 'command') {
            this.ctrlExecBtn.hidden = true;
        }

        this.setValue(this.prevValue);

    }
};

ParamSetting.prototype.createDropDownButton = function() {
    this.dropDownButton = sui.dropdown({
        text: this.conf.menuText || '...',
        content: this.conf.content,
        type: this.conf.menuType || 'small'
    });
    this.dropDownButton.classList.add('ctrlExec');
    this.container.appendChild(this.dropDownButton);
};

ParamSetting.prototype.getArgs = function() {
    return this.conf.args;
};

ParamSetting.prototype.getValue = function() {
    switch (this.conf.type) {
        case 'switch':
            return this.inputEl.checked;
            break;
        case 'command':
            return 'command';
            break;
        case 'sliderHidden':
            return this.sliderHidden.val;
            break;
        case 'inputText':
        case 'inputNumber':
            return this.inputText.getValue();
            break;
        case 'inputColor':
            if (this.coloPicker.valueSet === false) {
                return null;
            }
            return '#' + this.coloPicker.toString();
            break;
        case 'dropDown':
            return this.dropDown.getValue();
            break;
        case 'button':
            return true;
            break;
        default:
            console.warn('Unknow Setting Panel type' + this.conf.type);
            break;
    }
};

//internally used only to fire any component change by user intput
ParamSetting.prototype.onChangeCb = function(val, comp) {

    //this.conf.onChange must not be called internally, used to push functions into array for callback
    //    if (typeof (this.conf.onChange) === 'function') {
    //        if (this.getValue !== undefined && this.getValue() !== null) {
    //            this.conf.onChange(this.getValue(), this.conf.args || null, this);
    //        }
    //    }

    if (this.prevValue !== val && !this.conf.disableControl) {
        this.ctrlExecBtn.hidden = false;
    } else {
        this.ctrlExecBtn.hidden = true;
    }
    mu.execCallback(this.onChangeCbArr, this, val);
    //    console.log(val);

};

//add on change support to outside scripts, this can be convert to setter
ParamSetting.prototype.onChange = function(callback) {
    if (isFunction(callback)) {
        this.onChangeCbArr.push(callback);
    }
};

ParamSetting.prototype.onSaveSuccess = function(callback) {
    if (isFunction(callback)) {
        this.onSaveSuccessCbArr.push(callback);
    }
};

ParamSetting.prototype.onSaveFail = function(callback) {
    if (isFunction(callback)) {
        this.onSaveFailCbArr.push(callback);
    }
};

ParamSetting.prototype.setValue = function(value) {

    let success = true;
    if (value === undefined || value === null) {

        if (this.conf.disableControl) {
            this.ctrlExecBtn.hidden = true;
        } else {
            this.ctrlExecBtn.hidden = false;
        }
        return;
    }

    switch (this.conf.type) {
        case 'dropDownButton':
            this.ctrlExecBtn.hidden = true;
            return;
        case 'switch':
            this.inputEl.checked = value ? true : false;
            break;
        case 'command':
            success = false;
            break;
        case 'command':
            success = false;
            break;
        case 'sliderHidden':
            this.sliderHidden.setValue(value);
            break;
        case 'inputText':
        case 'inputNumber':
            this.inputText.setValue(value);
            break;
        case 'inputColor':
            if (value && value.toString().charAt(0) === '#') {
                this.coloPicker.valueSet = true;
                value = value.substr(1, value.length);
                this.coloPicker.fromString(value);
            }
            break;
        case 'dropDown':
            this.dropDown.setValue(value.toString());

            break;
        case 'button':

            break;
        default:
            success = false;
            console.warn('Unknow Setting Panel type' + this.conf.type);
            break;
    }

    if (success) {
        mu.execCallback(this.onChangeCbArr, this, value);

        if (this.prevValue === null) {
            this.prevValue = value.toString();
            this.ctrlExecBtn.hidden = true;
        } else {
            if (this.prevValue.toString() !== value.toString() && !this.conf.disableControl) {
                this.ctrlExecBtn.hidden = false;
            } else {
                this.ctrlExecBtn.hidden = true;
            }
        }
    }
    //    console.log(this.conf.type);
    if (this.conf.type === 'command' && !this.conf.disableControl) {
        this.ctrlExecBtn.hidden = false;
    }


};

ParamSetting.prototype.createButton = function() {
    this.button = document.createElement('span');
    this.container.appendChild(this.button);
    this.button.classList.add('smdui-button');
    this.button.textContent = this.conf.label || '';
    this.button.onclick = this.onChangeCb.bind(this);
};

ParamSetting.prototype.createCommand = function() {
    //    this.button = document.createElement('span');
    //    this.container.appendChild(this.button);
    //    this.button.classList.add('smdui-button');
    //    this.button.textContent = this.conf.label || '';
    //    this.button.onclick = this.onChangeCb.bind(this);
    //    this.ctrlExecBtn.hidden = false;
    this.setValue();

};

ParamSetting.prototype.createDropDown = function() {
    let div = document.createElement('div');
    this.container.appendChild(div);
    if (!this.conf.dropDownConf) {
        this.conf.dropDownConf = {};
    }
    this.conf.dropDownConf.onValueChange = this.onChangeCb.bind(this);
    this.conf.dropDownConf.containerClass = "ctrlValue";

    this.conf.dropDownConf.val = this.prevValue;
    this.dropDown = new SMDUIDropDown(div, this.conf.dropDownConf, this.paramName);

};

ParamSetting.prototype.createInputText = function(type) {
    let div = document.createElement('div');
    this.container.appendChild(div);
    if (!this.conf.inputTextConf) {
        this.conf.inputTextConf = {};
    }
    if (this.conf.inputTextConf.type === undefined) {
        this.conf.inputTextConf.type = type;
    }
    let textProp = ['min', 'max', 'decimals', 'length', 'val'];
    for (var i = 0; i < textProp.length; i++) {
        if (this.conf[textProp[i]] !== null) {
            this.conf.inputTextConf[textProp[i]] = this.conf[textProp[i]];
        }
    }

    this.conf.inputTextConf.onValueChange = this.onChangeCb.bind(this);
    this.conf.inputTextConf.containerClass = "ctrlValue";
    this.conf.inputTextConf.val = this.prevValue;
    this.inputText = new InputText(div, this.conf.inputTextConf);
};

ParamSetting.prototype.createInputColor = function() {
    let div = document.createElement('div');
    this.container.appendChild(div);
    this.container.classList.add('smdui-colorPicker-container');

    if (!this.conf.inputColorConf) {
        this.conf.inputColorConf = {};
    }

    var input = document.createElement('INPUT');
    input.classList.add('smdui-colorPicker-input');

    var picker = new jscolor(input);
    //    picker.fromHSV(360 / 100 * 2, 100, 100);
    picker.valueSet = false;
    this.coloPicker = picker;
    document.cp = picker;
    picker.onFineChange = function() {
        //        console.log('asdfs');
        picker.valueSet = true;
        if (this.coloPicker.targetElement.select) {
            this.coloPicker.targetElement.select();
        } else if (this.coloPicker.targetElement.setSelectionRange) {
            this.coloPicker.targetElement.setSelectionRange(0, this.input.value.length);
        }

        this.onChangeCb.bind(this)();
    }.bind(this);
    //    picker.onFineChange = this.onChangeCb.bind(this);
    if (this.conf.inputColorConf.val) {
        picker.fromString(this.conf.inputColorConf.val);
    }
    div.appendChild(input);
};

ParamSetting.prototype.createSliderHidden = function() {
    let div = document.createElement('div');
    this.container.appendChild(div);
    if (!this.conf.sliderHiddenConf) {
        this.conf.sliderHiddenConf = {};
    }
    this.conf.sliderHiddenConf.containerClass = "ctrlValue";
    this.conf.sliderHiddenConf.onValueChange = this.onChangeCb.bind(this);
    this.conf.sliderHiddenConf.val = this.prevValue;
    this.sliderHidden = new HidSlider(div, this.conf.sliderHiddenConf, this.paramName);
};

ParamSetting.prototype.createSwitch = function() {
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
};
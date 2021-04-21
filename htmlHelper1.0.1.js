/* 
 * Copyright (C) 2019 platar86
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/* global HTMLElement */

hh = {};

hh.removeAllChilds = function (className) {
    if (typeof (className) === 'string') {

        let arr = document.querySelectorAll();
        for (var i = 0; i < arr.length; i++) {
            let container = arr[i];
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    } else {
        try {
            while (className.firstChild) {
                className.removeChild(className.firstChild);
            }

        } catch (e) {

        }
    }
};

hh.createActDataPanelHeaderElement = function (headerTitle, image) {
    let div = document.createElement('div');
    div.classList.add('header-block');

    let title = document.createElement('span');
    title.textContent = headerTitle || " ";
    div.appendChild(title);

    if (image) {
        let img = document.createElement('img');
        img.src = image;
        div.appendChild(img);
    }
    return div;
};

hh.createItemTableToActDataPanelCard = function (actPanelTableObj, tableClass) { //{ header:[], item:[]}
    //    { header:[], item:[
    //      ['asdf', 'asdf' , {title: }],[]
    //    ]}
    if (!Array.isArray(actPanelTableObj.item)) {
        return;
    }
    let table = document.createElement('table');
    table.style.setProperty('width', '100%');
    table.classList.add('actDataTableContent');
    if (typeof (tableClass) === 'string') {
        table.classList.add(tableClass);
    }
    if (Array.isArray(actPanelTableObj.header)) {

        let headerRow = document.createElement('tr');
        table.appendChild(headerRow);

        for (var i = 0; i < actPanelTableObj.header.length; i++) {
            let th = document.createElement('th');

            if (typeof (actPanelTableObj.header[i]) === "string") {
                th.textContent = actPanelTableObj.header[i];
                if (tableClass) {
                    th.classList.add(tableClass + "-th-" + i);
                }
            } else if (typeof (actPanelTableObj.header[i]) === "object") {
                th.innerHTML = actPanelTableObj.header[i].label;
                if (tableClass) {
                    th.classList.add(tableClass + "-" + actPanelTableObj.header[i].columClass + "-th-" + i);
                }
            }
            headerRow.appendChild(th);
        }
    }

    for (var i = 0; i < actPanelTableObj.item.length; i++) {

        let row = document.createElement('tr');
        table.appendChild(row);
        let rowItemsArr = actPanelTableObj.item[i];

        if (Array.isArray(rowItemsArr)) {
            for (var j = 0; j < rowItemsArr.length; j++) {
                let item = rowItemsArr[j];
                let td = document.createElement('td');

                td.classList.add("actDataTableContent-item");
                if (tableClass) {
                    td.classList.add(tableClass + "-tbItem");
                }
                if (actPanelTableObj.header[j] && typeof (actPanelTableObj.header[j]) === "object") {
                    if (tableClass) {
                        td.classList.add(tableClass + "-" + actPanelTableObj.header[j].columClass + "-" + i);
                    }
                }

                if (typeof (item) === 'string' || typeof (item) === 'number') {
                    td.textContent = item;
                } else if (typeof (item) === 'object') {
                    td.textContent = item.title || " ";
                    if (item.onclick) {
                        row.classList.add('linkItem');
                        row.onclick = item.onclick;
                    }
                }
                row.appendChild(td);
            }
            table.appendChild(row);
        }
    }
    return table;
};

hh.addItemToActDataPanelCard = function (labelObject) {
    if (typeof (labelObject) === 'object') {
        let div = document.createElement('div');
        div.classList.add('actDataPanel');
        let title = document.createElement('span');
        title.classList.add('tooltip');
        title.textContent = labelObject.title || " ";
        div.appendChild(title);

        let value = document.createElement('span');


        if (typeof (labelObject.link) === 'string') {
                    //    value.onclick = window.open(labelObject.link, labelObject.link);
                    //    value.style.cursor = 'pointer';
                    //    value.classList.add('linkItem');
                    //    value.target = "_blank";

            value.innerHTML = (labelObject.value || " ").link(labelObject.link);
        } else {
            value.textContent = labelObject.value || " ";

        }

        if (labelObject.type && labelObject.type === 'static') {
            value.classList.add('staticValues');
        } else {
            value.classList.add('dataValues');
        }



        div.appendChild(value);
        if (labelObject.valueOnClick) {
            value.classList.add('linkItem');
            value.onclick = labelObject.valueOnClick;
        }

        if (typeof (labelObject.valueClass) === 'object') {
            for (var item in labelObject.valueClass) {
                if (typeof (labelObject.valueClass[item] === 'string')) {
                    value.classList.add(labelObject.valueClass[item]);
                }
            }
        } else if (typeof (labelObject.valueClass) === 'string') {
            value.classList.add(labelObject.valueClass);

        }
        if (typeof (labelObject.valueId) === 'string') {
            value.id = labelObject.valueId;
        }

        let unit = document.createElement('span');
        unit.textContent = labelObject.unit || " ";
        if (labelObject.unitClass) {
            unit.classList.add(labelObject.unitClass);
        }
        div.appendChild(unit);

        if (typeof (labelObject.tooltip) === 'string') {
            let tooltip = document.createElement('span');
            tooltip.textContent = labelObject.tooltip || " ";
            tooltip.classList.add('tooltiptext');
            title.appendChild(tooltip);
        }

        return div;
    }
};

hh.createActDataPanelCard = function (label, classList) {
    let panel = document.createElement('div');
    panel.classList.add('actDataPanelCard');
    if (typeof (classList) === 'object') {
        for (var item in classList) {
            if (typeof (classList[item] === 'string')) {
                panel.classList.add(classList[item]);
            }
        }
    } else if (typeof (classList) === 'string') {
        panel.classList.add(classList);
    }
    //    container.appendChild(panel);

    if (typeof (label) === 'string') {
        let headerBlock = document.createElement('div');
        headerBlock.classList.add('header-block');
        let headerBlockContent = document.createElement('span');
        headerBlockContent.textContent = label;
        headerBlock.appendChild(headerBlockContent);
        panel.appendChild(headerBlock);
    }

    return panel;
};

hh.openFullscreen = function (elem) {

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
};

hh.closeFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }


};

hh.toggleFullscreen = function (elem) {
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
};

// hh.createDropDownList = function (element, obj) {
//    if (typeof (element) === 'object' && element.parentElement !== undefined && typeof (obj) === 'object') {
//        hh.removeAllChilds(element);
//        let option = document.createElement('select');
//        element.appendChild(option);
//        if (typeof (obj.containerClass) === 'string') {
//            element.classList.add(obj.containerClass);
//        } else if (Array.isArray(obj.containerClass)) {
//            for (var item in obj.containerClass) {
//                element.classList.add(obj.containerClass[item]);
//            }
//        }

//        if (Array.isArray(obj.options)) {
//            for (var i in obj.options) {
//                let opt = obj.options[i];
//                let item = document.createElement('option');

//            }
//        }
//        //create the options



//    } else {
//        console.log('Illigal parameter: ', element);
//    }
// };

hh.isElement = function (obj) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return obj instanceof HTMLElement;
    } catch (e) {
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have (works on IE7)
        return (typeof obj === "object") &&
            (obj.nodeType === 1) && (typeof obj.style === "object") &&
            (typeof obj.ownerDocument === "object");
    }
};


hh.addClass = function (el, classObj) {
    if (hh.isElement(el)) {
        if (typeof (classObj) === 'string') {
            el.classList.add(classObj);
        } else if (Array.isArray(classObj)) {
            for (var i = 0; i < classObj.length; i++) {
                el.classList.add(classObj[i]);
            }
        }
    }
};

hh.getCoords = function (elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
};

//Tries to use attributeStyleMap, which is not supported on some browsers (iphone);
hh.setStyle = function (target, cssProp, cssValue) {
    if (hh.isElement(target)) {
        try {
            target.attributeStyleMap.set(cssProp, cssValue);
        } catch (e) {
            try {
                cssProp = mu.camelize(cssProp);
                target.style[cssProp] = cssValue;
            } catch (e) {
                console.warn('Failed to apply style: ' + e);
            }
        }
    } else {
        console.warn('Failed to set style, target is not an HTML element');
    }
};
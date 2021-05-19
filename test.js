let test = {

    init: function () {
        let container = document.getElementById('contentDiv');
        // let dialog = new SMDUIDialog({
        //     modal: true,
        //     heading: 'Dialog Test',
        //    open: false,
        //     draggable: true,
        //     onInitComplete: function (contentDiv, footerDiv, comp) {
        //         // onInitComplete is a callback to attach content to the dialog
        //         let content = document.createElement('div');
        //         content.style.display = 'flex';
        //         content.style.flexDirection = 'column';
        //         container.appendChild(content);
        //         contentDiv.appendChild(container);
        //         //can add a button to the footer or something etc
        //     },
        // });
        // dialog.open();
        // window.dialog = dialog;

        let tabPanel = new TabPanel(container, {
            // sortable: true,
            menuItem: [
                {
                    contentId: "tab1",
                    contentClass: "smdui-tabPanel-contentFlexRow"
                },
                {
                    contentId: "tab2",
                    contentClass: "smdui-tabPanel-contentFlexRow"
                },
                {
                    contentId: "tab3",
                    contentClass: "smdui-tabPanel-contentFlexRow"
                },
            ]
        });

        window.tabPanel = tabPanel;

        let tab1Content = tabPanel.getItemContent('tab1');
        tab1Content.style.flexDirection = "column";

        let tab2Content = tabPanel.getItemContent('tab2');
        tab2Content.style.flexDirection = "column";

        let tab3Content = tabPanel.getItemContent('tab3');
        tab3Content.style.flexDirection = "column";

        new ParamSetting(tab1Content, "recordingValues", {
            type: "switch",
            title: "Recording Values",
            ctrlInfo: "Choose which field to be Recorded by the logger"
        });

        new ParamSetting(tab1Content, "testParameter", {
            type: "dropDown",
            title: "Example",
            ctrlInfo: "This text is used to explain what this setting does.",
            dropDownConf: {
                val: 0,
                options: [
                    { label: 'SUM Values only', value: '1' },
                    { label: 'Independant Phases only', value: '2' },
                    { label: 'Phases and SUM', value: '3' }
                ]
            }
        });


        new ParamSetting(tab3Content, "calcValue", {
            type: "switch",
            title: "Recording Values",
            ctrlInfo: "Choose which field to be Recorded by the logger"
        });

        new ParamSetting(tab3Content, "testParam", {
            type: "dropDown",
            title: "Example (Dropdown)",
            ctrlInfo: "This text is used to explain what this setting does.",
            dropDownConf: {
                val: 0,
                options: [
                    { label: 'SUM Values only', value: '1' },
                    { label: 'Independant Phases only', value: '2' },
                    { label: 'Phases and SUM', value: '3' }
                ]
            }
        });

        new ParamSetting(tab3Content, "testCommand", {
            type: "button",
            title: "Example (Button)",
            ctrlInfo: "Click the button.",
            label: "Click Me!"
        });

        new ParamSetting(tab3Content, "testSlider", {
            type: "sliderHidden",
            title: "Example (Slider Hidden)",
            ctrlInfo: "Slide the slider across to increase the value.",
            sliderHiddenConf: {
                val: 100
            }
        });

        let accPanel = new SMDUIAccordianPanel(tab2Content, {
            tabs: ["tab1", "tab2"],
            "tab1": tab1Content,
            "tab2": tab2Content
        });

        let txt = document.createElement('span');
        txt.innerHTML = "Value?"
        tab1Content.appendChild(txt);

        this.val = 9;

        let self = this;

        window.swtch = new SMDUISwitch(tab1Content, {
            onChange: function(comp, val) {
                console.log("Changed to " + val);
                txt.innerHTML = "Changed to " + val;
            }.bind(this),
            val: true
            

        });


    }
};






window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    test.init();

});
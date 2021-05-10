let test = {

    init: function() {
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

        });

        window.tabPanel = tabPanel;

        tabPanel.addItem({
            contentId: "tab1",
            contentClass: "smdui-tabPanel-contentFlexRow"
        });
        tabPanel.addItem({
            contentId: "tab2",
            contentClass: "smdui-tabPanel-contentFlexRow"
        });

        let tab1Content = tabPanel.getItemContent('tab1');
        tab1Content.style.display = "flex";
        tab1Content.style.flexDirection = "column";

        let tab2Content = tabPanel.getItemContent('tab2');
        tab2Content.style.display = "flex";
        tab2Content.style.flexDirection = "column";

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

    }
};

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    test.init();
});
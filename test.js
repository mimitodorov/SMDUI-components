let test = {

    init: function () {
        let container = document.getElementById('contentDiv');
        let dialog = new SMDUIDialog({
            modal: true,
            heading: 'Dialog Test',
           open: false,
            draggable: true,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                // onInitComplete is a callback to attach content to the dialog
                let content = document.createElement('div');
                content.style.display = 'flex';
                content.style.flexDirection = 'column';
                container.appendChild(content);
                contentDiv.appendChild(container);
                //can add a button to the footer or something etc
            },
        });
        dialog.open();
        window.dialog = dialog;
    }
};

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    test.init();
});
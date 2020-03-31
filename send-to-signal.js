const forceKeyboard = require('./forced-input/forced-keyboard');
const forceMouse = require('./forced-input/forced-mouse');

module.exports = {
    sendToDialRotate : [
        forceMouse.scrollY,
        function (value) {
            forceMouse.combineMouse(value, forceMouse.scrollY, 'control', ['control']);
        },
        forceKeyboard.arrowX,
        forceKeyboard.arrowY
    ],
    sendToDialPush : [
        function () {
            console.log('d1');

        },
        function () {
            console.log('d2');

        },
        function () {
            console.log('d3');

        },
        function () {

            console.log('d4');
        }
    ],
    sendToButtonPush : [
        forceMouse.doubleLeftClick,
        forceMouse.oneRightClick,
        function () {
            forceKeyboard.combineKey('s', 'control');
        },
        function () {
            forceKeyboard.combineKeys(['a', 'k', 'c'], 'control');
        },
        function () {
            console.log('group change');
        }
    ],
}
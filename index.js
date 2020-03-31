var usbDetect = require('usb-detection');
var SerialPort = require("serialport");
let STSObject = require('./send-to-signal');

const Readline = require('@serialport/parser-readline')
// const port = new SerialPort('COM3', { baudRate: 256000 })
const port = new SerialPort('COM4', { baudRate: 256000 })
const parser = new Readline()
port.pipe(parser)

function getRotateVectorFromBuffer(r, v) { return v ? r : -r; } // 방향을 지정하기 위해 음수 혹은 양수로 변환.
function getSignalFromBuffer(buffer) {
    // 입력 받은 다이얼 키보드 데이터를 OS 입력 신호로 전환
    let bfSplit = buffer.split(',');
    if (bfSplit[0] == '$0') {
        // 다이얼 입력됨
        for (let dNum = 0; dNum < 4; dNum++) {
            let checkNum = dNum * 4;
            // bfSplit[checkNum + 1] ~ bfSplit[checkNum + 4] = dNum번 엔코더 위치, 가속도, 방향, 버튼
            if (parseInt(bfSplit[checkNum + 2])) {
                isInfinity = false;
                value = getRotateVectorFromBuffer(
                            parseInt(bfSplit[checkNum + 2]), // 가속도
                            parseInt(bfSplit[checkNum + 3])  // 방향
                        );
                STSObject.sendToDialRotate[dNum](value);
                if (parseInt(bfSplit[checkNum + 2]) >= 5) {
                    console.log('On')
                    infinity = STSObject.sendToDialRotate[dNum].bind(this, value);
                    isInfinity = true;
                }
            }
            if (parseInt(bfSplit[checkNum + 4])) {
                STSObject.sendToDialPush[dNum]();
            }
        }
    } else {
        // 키 버튼 입력됨
        // bfSplit[1] = 입력된 키 버튼 인덱스
        STSObject.sendToButtonPush[parseInt(bfSplit[1])]();
    }
}
let infinity = test;
let isInfinity = false;
function test() { console.log('unset infinity'); }
parser.on('data', line => { 
    getSignalFromBuffer(line.toString())
    if (isInfinity) // 무한 반복
        infinity();
})

usbDetect.startMonitoring();
async function findDevice() {
    if (process.argv[2]) {
        return process.argv[2]
    }
    const ports = await SerialPort.list()
    for (const port of ports) {
        console.log(port);
        // return port.path
    }
    throw new Error('No arduinos found')
}
  
findDevice().then(
    portName => {
        const port = new SerialPort(portName)
        port.on('open', () => {
            console.log('opened', portName)
            // port.write(Buffer.alloc(1024 * 20, 0));
            port.on('data', data => console.log('data', data.toString())) // put the port into flowing mode
            // setTimeout(() => {
            //   console.log('closing');
            //   port.close((err) => {
            //     console.log('closed?', err);
            //   });
            // }, 5000);
        })
    },
    () => {
        console.log('no arduino')
    }
)
process.on('unhandledRejection', r => console.log(r, r.stack))
 
// Detect add/insert
usbDetect.on('add', function(device) {
    console.log('add', device);
});
usbDetect.on('add:vid', function(device) { console.log('add', device); });
usbDetect.on('add:vid:pid', function(device) { console.log('add', device); });
 
// Detect remove
usbDetect.on('remove', function(device) {
    console.log('remove', device);
});
usbDetect.on('remove:vid', function(device) { console.log('remove', device); });
usbDetect.on('remove:vid:pid', function(device) { console.log('remove', device); });
 
// Detect add or remove (change)
usbDetect.on('change', function(device) {
    console.log('change', device);
});
usbDetect.on('change:vid', function(device) { console.log('change', device); });
usbDetect.on('change:vid:pid', function(device) { console.log('change', device); });
 
// Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
// usbDetect.find(function(err, devices) { console.log('find', devices, err); });
usbDetect.find(1155, function(err, devices) { console.log('find', devices, err); });
// usbDetect.find(vid, pid, function(err, devices) { console.log('find', devices, err); });
// Promise version of `find`:
// usbDetect.find().then(function(devices) { console.log(devices); }).catch(function(err) { console.log(err); });

// Allow the process to exit
//usbDetect.stopMonitoring()
const { DaasIoT } = require("daas-sdk");

const hver = "nodeJS-server";
const daasNode = new DaasIoT(hver)


const SID = 100;
const DIN = 102;
const URL = "0.0.0.0:8612"
const INET4 = 2;
daasNode.doInit(SID, DIN)


// Remote nodes
const REMOTE_DIN_Esp32 = 110;


if (daasNode.enableDriver(INET4, URL)) {
	console.log("Driver enabled!, listening on: " + URL)
}

// mappiamo il REMOTE_DIN_Esp32 a un indirizzo fittizio e.g. localhost
daasNode.map(REMOTE_DIN_Esp32, INET4, "127.0.0.1:2020");

daasNode.onDinConnected((din) => { console.log(getTime(), "📌 DIN Accepted:", din); });

daasNode.onDDOReceived((din) => {

	console.log("DDO Received from", din);
	daasNode.locate(din);
	daasNode.pull(din, esp32MessageCallback);

	//daasNode.push(din, 12, "Invio risposta...");
	//daasNode.push(din, 12, "Invio risposta...");
});

if (daasNode.doPerform()) {
	console.log("Node performed!");
}


messageCounter = 0;

setInterval(() => {
	console.log(getTime(), "Invio risposta a", REMOTE_DIN_Esp32, ' ('+messageCounter+')')

	const payload = JSON.stringify({
		'message': `(${messageCounter}) Ciao, sono un server su AWS :)`
	})

	const timestampSeconds = Math.floor(new Date().getTime() / 1000);
	daasNode.push(REMOTE_DIN_Esp32, 12, timestampSeconds, payload);
	messageCounter++;
}, 1_000);


/**
 * parses the Json object coming in into a Javascript object
 * @param {object} data
 * @returns {object}
 */
function decode (data) {
    const utf8decoder = new TextDecoder();
    const decodedData = utf8decoder.decode(data);
    return JSON.parse(decodedData);
}

/**
 * @param {number} origin 
 * @param {number} timestamp Unix Epoch time in seconds
 * @param {number} typeset 
 * @param {object} rawData
 */
function esp32MessageCallback(origin, timestamp, typeset, rawData) {
	if (origin != REMOTE_DIN_Esp32) {
		console.error('using esp32MessageCallback for wrong DIN! din: ', origin, ', expected: ', REMOTE_DIN_Esp32)
		return;
	}
	if(typeset != 12) {
		console.error('unexpected typeset! typeset: ', typeset, ', expected: 12');
		return;
	}

	const currTimestampSeconds = Math.floor(new Date().getTime() / 1000);
	const secondsSinceMessageWasSent = currTimestampSeconds - timestamp;

	// console.log("raw data", rawData)

	const data = decode(rawData);
	console.log(getTime(), `New message from Esp32 [${origin}]`);
	console.log(data)
	console.log(secondsSinceMessageWasSent,'s ago\n')
}


function getTime() {
	return new Date().toTimeString().split(' ')[0]
}

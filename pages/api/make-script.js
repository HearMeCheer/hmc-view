import { getEvent } from '../../app/HmcApi';

const template = `
(function App() {
    var hmc = {
        iframe: null,
        iframeReady: false,
        // before iframe is loaded, store messages
        _messageList: [{ type: 'parentHref', payload: window.location.href }],

        _sendMessageToApp(message) {
            hmc.iframe.contentWindow.postMessage(
                message,
                'process.env.APP_URL',
            );
        },

        sendMessageToApp(message) {
            if (hmc.iframeReady) {
                hmc._sendMessageToApp(message);
            } else {
                hmc._messageList.push(message);
            }
        },

        sendUpdatesToApp() {
            hmc._messageList.forEach(function (message) {
                hmc._sendMessageToApp(message);
            });
            hmc._messageList = [];
            hmc.iframeReady = true;
        },
    };

    window.hmc__app = hmc;

    window.hmc__setParticipantName = function (name) {
        hmc.sendMessageToApp({ type: 'participantName', payload: name });
    };

    window.hmc__setParticipantInfo = function (info) {
        hmc.sendMessageToApp({ type: 'participantInfo', payload: info });
    };

    window.hmc__joinParty = function (partyId) {
        hmc.sendMessageToApp({ type: 'participantParty', payload: partyId });
    };

    window.hmc__leaveParty = function () {
        hmc.sendMessageToApp({ type: 'participantParty', payload: null });
    };

    function handleIframe(iframe) {
        hmc.iframe = iframe;
        iframe.addEventListener('load', function () {
            hmc.sendUpdatesToApp();
        });
    }

    function findIframe(attempt) {
        var el = document.getElementById('hmc-app');
        if (el && el.src && el.src.indexOf('process.env.APP_URL') === 0) {
            handleIframe(el);
            return;
        }

        if (attempt > 5) {
            console.warn(
                '[HMC] iframe for view was unable to be located. External Controls disabled',
            );
            return;
        }

        // exponential backoff: [ 200, 400, 800, 1600, 3200 ]
        var timeout = Math.pow(2, attempt) * 100;
        setTimeout(function () {
            findIframe(attempt + 1);
        }, timeout);
    }

    findIframe(1);

    process.env.CUSTOM_SCRIPT;
})();
`;

const replaceEnvironmentVariables = (str, context) => {
    let output = str;
    for (const key of Object.keys(context)) {
        const regex = new RegExp(`process.env.${key}`, 'g');
        output = output.replace(regex, context[key]);
        // output = output.replace(regex, `'${context[key]}'`);
    }
    return output;
};

const handler = async (req, res) => {
    const {
        body: { propertyId, eventId },
    } = req;
    console.log('headers', req.headers);
    console.log('body', req.body);
    console.log('makeScript', { propertyId, eventId });
    const [err, event] = await getEvent({ propertyId, eventId });
    if (err) throw err;
    res.status(200).send(
        replaceEnvironmentVariables(template, {
            APP_URL: process.env.APP_URL,
            CUSTOM_SCRIPT: event.customScripts,
        }),
    );
};

export default handler;

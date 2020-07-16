
let mqtt = require('mqtt')
require('dotenv/config');

let mqttClient= function () {
    let options = {
        port: 1885,
        clientId:"scanner/"+process.env.FLOOR+"/"+process.env.ROOM
    }

    console.log('mqttClient');
    let client = mqtt.connect('mqtt://127.0.0.1', options);
    client.on('connect', function () {
        console.log('mqttClient connect');
    })

    function publishMessage(topic,message) {
        client.publish(topic,message)
    }

    function subscribe(topic) {
        client.subscribe(topic)
    }

    function unsubscribe(topic) {
        client.unsubscribe(topic)
    }

    return{
        publishMessage,
        subscribe,
        unsubscribe
    }
}

module.exports = mqttClient();
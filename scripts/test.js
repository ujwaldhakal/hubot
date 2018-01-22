module.exports = (robot) => {
    robot.hear (/badger/i, (res) => {
       console.log('asd');
        res.send('ass hole');
    });

    robot.respond (/open the pod bay doors/i, (res) => {
        console.log('need to respond');
        res.send('ass hole');
    });

    robot.respond (/I like pie/i, (res) => {
        console.log('need to respond');
    res.emote("makes a freshly baked pie");
    });
};

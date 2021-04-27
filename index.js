const { app } = require('./core');
const { db, update } = require('./db'); 

app.listen(3000, () => {
    console.log('API for smart home 1.1 up n running.')
})

/* CODE YOUR API HERE */

/*
   How to use API:

   Example for lights: 
   To switch on/off lights simply use localhost:3000/light?on=true
   To change color add color code without #: localhost:3000/light?on=true&color=ffffff
   To change brightness from default set value 1: localhost:3000/light?on=true&brightness=0.3
   To select which light to turn on: localhost:3000/light?room=bedroom&on=true

   Example in using all selections for testing purpose:

   localhost:3000/light?room=garden&on=true&brightness=0.7&color=e53307

*/

app.get('/light', (req, res) => {

    let state = (req.query.on === 'true' ? true : false);
    let brightness = setBrightness(req.query.brightness);
    let color = setColor(req.query.color);
    let room = getRoom(req.query.room.toLowerCase().replace(/\s+/g,''));

    
    db
        .get('devices')
        .find({id: room})
        .assign({on: state, brightness: brightness, color: color})
        .value();

    update();


    res.send(JSON.stringify({Light : (state === true ? 'On' : 'Off')}))
});

/*
    Example: localhost:3000/ac?on=true&temp=20
*/

app.get('/ac', (req, res) => {
    let temperature = setTemperature(parseInt(req.query.temp));
    let state = (req.query.on === 'true' ? true : false);

    db
        .get('devices')
        .find({id: 'AC1'})
        .assign({on: state, temperature: temperature})
        .value();

    update();

        res.send(JSON.stringify({AC : (state === true ? 'On' : 'Off'), Temperature: temperature}))
});

/*
    Example: localhost:3000/blind?on=true
*/

app.get('/blind', (req, res) => {
    let state = (req.query.on === 'true' ? true : false);

    db
        .get('devices')
        .find({id: 'BLI1'})
        .assign({on: state})
        .value();

    update();

        res.send(JSON.stringify({Blind : (state === true ? 'On' : 'Off')}))
});

/*
    Example: localhost:3000/camera?on=true
*/

app.get('/camera', (req, res) => {
    let state = (req.query.on === 'true' ? true : false);

    db
        .get('devices')
        .find({id: 'CAM1'})
        .assign({on: state})
        .value();

    update();

        res.send(JSON.stringify({Camera : (state === true ? 'On' : 'Off')}))
});

/*
    Example: localhost:3000/door?locked=1234
*/

app.get('/door', (req, res) => {
    let locked = (req.query.keycode === '1234' ? true : false);

    db
        .get('devices')
        .find({id: 'LOC1'})
        .assign({locked: locked})
        .value();

    update();

        res.send(JSON.stringify({Lock : (locked === true ? 'Door is unlocked' : 'Door is locked')}))
});

/*
    Example: localhost:3000/vacuum?on=true
*/

app.get('/vacuum', (req, res) => {
    let state = (req.query.on === 'true' ? true : false);

    db
        .get('devices')
        .find({id: 'VAC1'})
        .assign({on: state})
        .value();

    update();

        res.send(JSON.stringify({Vacuum : (state === true ? 'On/Cleaning' : 'Off')}))
});

// Enables speaker

app.get('/speaker', (req, res) => {
    let state = (req.query.on === 'true' ? true : false);
    
    db
        .get('devices')
        .find({id: 'SPE1'})
        .assign({on: state})
        .value();

    update();
    res.send(JSON.stringify({Speaker: (state === true ? 'On' : 'Off')}))
});


// If temperature is not set, return a default value of 17.

const setTemperature = (temp) => {
    return (temp === undefined ? 17 : temp)
}

// If brightness is not a number or is undefined, return 1. 

const setBrightness = (bright) => {
    if (bright === NaN) {
        console.log('Parameter is not a number, returns default value')
        return 1;
    }
    return (bright === undefined ? 1 : bright)
}

// Return default color if color is undefined.

const setColor = (color) => {
    const pound = '#';
    return (color === undefined ? '#FFDE67' : pound.concat(color))
}

// Return which room the light should turn on in.

const getRoom = (room) => {

    switch(room){
        case 'bedroom':
           return room = 'LIG1';
        case 'livingroom':
           return room = 'LIG2';
        case 'garden':
           return room = 'LIG3';
        default:
            // do nothing;
    }
}
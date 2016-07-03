module.exports = dump;

var Daycycle = require('../daycycle/daycycleSchema');

var User = require('../user/userSchema');

var randomString = require('randomstring');
function dump() {

}

dump.create = function() {
    
    var daycycle1 = new Daycycle({
        title: 'BlueOcean',
        configuration: 'Json datei 1',
        description: 'Beschreibung 1',
        maxmoonlight: '60',
        uniqueID: randomString.generate(6)
    });

    var daycycle2 = new Daycycle({
        title: 'GreenAqua',
        configuration: 'Json datei 2',
        description: 'Beschreibung 2',
        maxmoonlight: '80',
        uniqueID: randomString.generate(6)

    });

    var daycycle3 = new Daycycle({
        title: 'WhiteHeaven',
        configuration: 'Json datei 3',
        description: 'Beschreibung 3',
        maxmoonlight: '30',
        uniqueID: randomString.generate(6)
        
    });

    var user1 = new User({
        username: 'ahmetk_53@hotmail.de',
        password: '123'
    })

    user1.save();
    daycycle1.save();
    daycycle2.save();
    daycycle3.save();
    
};


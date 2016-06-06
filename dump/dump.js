module.exports = dump;

var Daycycle = require('../daycycle/daycycleSchema');

function dump() {

}

dump.create = function() {
    
    var daycycle1 = new Daycycle({
        title: 'BlueOcean',
        configuration: 'Json datei 1',
        description: 'Beschreibung 1',
        maxmoonlight: '60'
        
    });

    var daycycle2 = new Daycycle({
        title: 'GreenAqua',
        configuration: 'Json datei 2',
        description: 'Beschreibung 2',
        maxmoonlight: '80'

    });

    var daycycle3 = new Daycycle({
        title: 'WhiteHeaven',
        configuration: 'Json datei 3',
        description: 'Beschreibung 3',
        maxmoonlight: '30'

    });


    daycycle1.save();
    daycycle2.save();
    daycycle3.save();
    
};


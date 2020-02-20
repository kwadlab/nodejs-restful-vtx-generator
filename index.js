//[./SZ]
var data;
var modetype; 
var vtx_protocol; 
var vtx_channel; 
var vtx_power;
var filename = 'vtx_table.json';
var mimetype = 'application/json';

const express = require('express');
const api = express();

api.listen(3000, () => {
    console.log('API up and running!');
  });
api.get('/', (req, res) => {
    parseSearch(req.url);
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( data );
});

function parseSearch(val) {
        var temp1 = val.split("?");
        var temp2 = temp1[1].split("&");
    
        var temp3 = temp2[0].split("=");
        switch(temp3[1]) {
            case "vtx":
                modetype = "vtx";
                temp3 = temp2[1].split("=");
                vtx_protocol = temp3[1];
                temp3 = temp2[2].split("=");
                vtx_channel = temp3[1];
                temp3 = temp2[3].split("=");
                vtx_power = temp3[1];
                generateVTXTable();
                break;
        }
}

function generateVTXTable() {
     //Generate File 
     var desc = {"description": "Auto-generated VTX Table from KwadLab.com"};
     var ver = {"version": "0.1"};

     var bl = [];
     var pl = [];

     var boscama = { "name": "BOSCAM_A", "letter": "A", "is_factory_band": false, "frequencies": [5865, 5845, 5825, 5805, 5785, 5765, 5745, 5725 ] };
     var boscamb = { "name": "BOSCAM_B", "letter": "B", "is_factory_band": false, "frequencies": [5733, 5752, 5771, 5790, 5809, 5828, 5847, 5866 ] };
     var boscame = { "name": "BOSCAM_E", "letter": "E", "is_factory_band": false, "frequencies": [5705, 5685, 5665, 0, 5885, 5905, 0, 0 ] };
     var fatshark = { "name": "FATSHARK", "letter": "F", "is_factory_band": false, "frequencies": [5740, 5760, 5780, 5800, 5820, 5840, 5860, 5880 ] };
     var raceband = { "name": "RACEBAND", "letter": "R", "is_factory_band": false, "frequencies": [5658, 5695, 5732, 5769, 5806, 5843, 5880, 5917 ] };
     var imd6 = { "name": "IMD6", "letter": "I", "is_factory_band": false, "frequencies": [5732, 5765, 5828, 5840, 5866, 5740, 0, 0 ] };

     var tempChannel = vtx_channel.split(",");

     var i;
     for(i = 0; i < tempChannel.length; i++) {
        if(tempChannel[i] == "a") {
            bl = bl.concat(boscama);
        }
        if(tempChannel[i] == "b") {
            bl = bl.concat(boscamb);
        }
        if(tempChannel[i] == "e") {
            bl = bl.concat(boscame);
        }
        if(tempChannel[i] == "f") {
            bl = bl.concat(fatshark);
        }
        if(tempChannel[i] == "r") {
            bl = bl.concat(raceband);
        }
        if(tempChannel[i] == "i") {
            bl = bl.concat(imd6);
        }
     }

     var tempPower = vtx_power.split(",");

     for(i = 0; i < tempPower.length; i++) {
        switch(vtx_protocol) {
            case "irc":
                pl = pl.concat({ "value": parseInt(tempPower[i]), "label": tempPower[i] });
                break;
            case "sa2":
                pl = pl.concat({ "value": i, "label": tempPower[i] });
                break;
        }
     }

     var vtxtable = { "vtx_table": { "bands_list": bl, "powerlevels_list": pl } };
     
     data = Object.assign( desc, ver, vtxtable);

     //Download File

     if(!data) {
       console.error('No data')
       return;
     }

     if(typeof data === "object"){
         data = JSON.stringify(data, undefined, 4)
     }
}
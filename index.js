var firebase = require("firebase");
var wol = require("wol");

// PC MAC address
var pc_mac = "94:de:80:c5:53:09";

// firebase config
var config = {
    apikey: "AIzaSyDGovAymoeXQfdIAnNFw8fnDXp2MTb7OHk",
    authDomain: "home-project-931c1.firebaseapp.com",
    databaseURL: "https://home-project-931c1.firebaseio.com",
    projectId: "home-project-931c1",
    storageBucket: "home-project-931c1.appspot.com",
    messagingSenderId: "517706936392"
};
firebase.initializeApp(config);

//get value from json
const getJsonData = (value, json) => {
    for (var word in json)
	if(value == word) return json[word]
    return json["default"]
}

//path for python_broadlink/cli
const rm3_home = "/home/kanekiyo/python-broadlink/";
const rm3_command = rm3_home + "cli/broadlink_cli";
//path for IR data
const data_path = rm3_home + "cmd/";

//database updated
const db_path = "/googlehome";
const key = "word";
const db = firebase.database();
db.ref(db_path).on("value", function(changedSnapshot) {
    //get value
    const value = changedSnapshot.child(key).val();
    if(value) {
	console.log(value);
	const location = value.split(" ")[0];
	const equipment = value.split(" ")[1];
	const action = value.split(" ")[2];
	//generate command
	const command = getJsonData(value.split(" ")[1], {
	    //light
	    "light": () => {
		const command = rm3_command + " ";
		const option = getJsonData(value.split(" ")[2], {
		    "on": "on",
		    "small": "small",
		    "off": "off",
		    "default": false
		});
		const ir_data = data_path + location + "_" + equipment + "_" + action + ".txt";
		return rm3_command + " --device @" + rm3_home + location + ".device " + " --send @" + ir_data;
	    },
	    //heater
	    "heat": () => {
		const command = rm3_command + " ";
		const option = getJsonData(value.split(" ")[2], {
		    "on": "on",
		    "off": "off",
		    "default": false
		});
		const ir_data = data_path + location + "_" + equipment + "_" + action + ".txt";
		return rm3_command + " --device @" + rm3_home + location + ".device " + " --send @" + ir_data;
	    },
	    //cooler
	    "cool": () => {
		const command = rm3_command + " ";
		const option = getJsonData(value.split(" ")[2], {
		    "on": "on",
		    "off": "off",
		    "default": false
		});
		const ir_data = data_path + location + "_" + equipment + "_" + action + ".txt";
		return rm3_command + " --device @" + rm3_home + location + ".device " + " --send @" + ir_data;
	    },
	    //air conditioner
	    "aircon": () => {
		const command = rm3_command + " ";
		const option = getJsonData(value.split(" ")[2], {
		    "on": "on",
		    "off": "off",
		    "default": false
		});
		const ir_data = data_path + location + "_" + equipment + "_" + action + ".txt";
		return rm3_command + " --device @" + rm3_home + location + ".device " + " --send @" + ir_data;
	    },
	    //PC
	    "pc": () => {
		const wake = () => wol.wake(pc_mac);
		return getJsonData(value.split(" ")[2], {
		    "on": wake,
		    "default": false
		});
	    },
	    //template
	    "xxx": () => {
		return getJsonData(value.split(" ")[1], {
		    "xxx": "xxx",
		    "default": false
		});
	    },

	    //default
	    "default": ()=> false,
	})();
	console.log(command);

	//run command
	if(command) {
	    if(typeof command == "string") {
		const exec = require('child_process').exec;
		exec(command);
	    }
	    else if (typeof command == "function") {
		command();
	    }
	    //clear firebase database
	    db.ref(db_path).set({[key]: ""});
	}
    }
});


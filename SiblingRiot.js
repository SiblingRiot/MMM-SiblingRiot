/* global Module */

/* Magic Mirror
 * Module: SiblingRIOT
 *
 * By {{SiblingR.I.O.T. Capstone Team (James Madison University)}}
 * MIT Licensed.
 */

Module.register("SiblingRIOT", {
	defaults: {
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;

		var urlApi = "https://jsonplaceholder.typicode.com/posts/1";
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {
			var wrapperDataRequest = document.createElement("div");
			// check format https://jsonplaceholder.typicode.com/posts/1
			wrapperDataRequest.innerHTML = this.dataRequest.title;

			var labelDataRequest = document.createElement("label");
			// Use translate function
			//             this id defined in translations files
			labelDataRequest.innerHTML = this.translate("TITLE");


			wrapper.appendChild(labelDataRequest);
			wrapper.appendChild(wrapperDataRequest);
		}

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"SiblingRIOT.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("SiblingRIOT-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "SiblingRIOT-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
		this.config.useKeyboard
	    openKeyboard: function () {
        console.log("SiblingRIOT opening keyboard");
        this.sendNotification("KEYBOARD", {key: "SiblingRIOT", style: "default"});
    },
	notificationReceived: function (noti, payload) {
		if (noti == ("DOM_OBJECTS_CREATED") {
			this.log ("MMM-Keyboard: Initializing keyboard");
			//Add event listener on first implementation of keyboard
		} else if (noti == "KEYBOARD") {
			console.log ("MMM-Keyboard recognized a notification: " + noti + JSON.stringify(payload));
			this.log ("Activating Keyboard!");
			this.currentKey = payload.key;
			this.currentData = payload.data;
			var layout = (payload.style == "default") ? ((this.config.startUppercase) ? "shift": "default"): "numbers";
			this.keyboard.setOptions({
				layoutName: layout
			});
			this.showKeyboard();
		}
	},

	sendInput: function () {
		var message = document.getElementById("kbInput").value;
		this.log ("MMM-Keyboard sent input: " + message);
		this.sendNotification("KEYBOARD_INPUT" ,{key: this.curentKey, message: message, data: this.currentData});
		const fs = require("fs");
		var data = fs.readFileSync("complimentsA.json");
		var theObject = JSON.parse(data);
		let noti = {
			"anytime": message
		};
		theObject.push(noti);
		var newData2 = JSON.stringify(theObject);
		fs.writeFile("complimentsA.json", newData2);
		console.log(message);
		this.keyboard.clearInput();
		document.getElementById("knInput").value="";
		if (this.config.startUppercase) {this.shiftState = 1;}
		this.hideKeyboard();
		
    /*socketNotificationReceived: function (notification, payload) {
        if (notification === "LIST_DATA") {
            this.currentList = payload.currentList;
            this.lists = payload.lists;
            if (!this.config.listName) {
                this.config.listName = this.currentList.name;
            }
            this.updateDom(1000);
        } else if (notification === "RELOAD_LIST") {
            this.sendSocketNotification("GET_LIST", this.config);
        }
    },
    notificationReceived: function (notification, payload) {
        if (notification === "KEYBOARD_INPUT" && payload.key === "SiblingRIOT" && payload.message != '') {
            var item = {
                name: payload.message[0].toUpperCase() + payload.message.substring(1),
                purchase: false,
                listId: this.currentList.uuid
            };
            console.log("SiblingRIOT received Keyboard input: " + item.name);
            this.sendSocketNotification("PURCHASED_ITEM", item);
        } else if (notification === "HIDE_SHIPPING") {
            this.hide(1000, {lockString: "LOCKEDBYMODULE"});
        } else if (notification === "SHOW_SHIPPING") {
            this.show(1000, {lockString: "LOCKEDBYMODULE"});
        }
    },
	*/
});

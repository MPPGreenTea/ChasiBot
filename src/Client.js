/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This is the part of ChasiBot that deals with the Websocket connection to
 * Multiplayer Piano. Different sections of ChasiBot uses data received by the
 * client to perform tasks.
 */

(function (exports, WebSocket, EventEmitter) {

	function extend(a, b) {
		for (var i in b) {
			if (b.hasOwnProperty(i)) {
				a[i] = b[i];
			}
		}
	}


	function Client(URI) {
		EventEmitter.call(this);

		this.URI = URI;
		this.WS = null;

		this.user = {};
		this.participantId = {};
		this.channel = {};
		this.players = {};

		this.channelID = "lobby";
		this.ping_interval = 0;

		this.channels = {};
		this.network = {
			bytes_received: 0,
			bytes_sent: 0,
			packets_received: 0,
			packets_sent: 0,
			ping: 0
		};

		this.last_ping = 0;

		this.bindEvents();
	};

	extend(Client.prototype, EventEmitter.prototype);

	Client.prototype.constructor = Client;

	Client.prototype.start = function() {
		this.WS = new WebSocket(this.URI, {
			origin: "http://www.multiplayerpiano.com"
		});

		var self = this;
		this.WS.addEventListener("close", function () {
			self.user = {};
			self.participantId = {};
			self.channel = {};
			self.players = {};

			clearInterval(self.ping_interval);
		});

		this.WS.addEventListener("open", function () {
			self.send({ m: "hi" });

			self.ping_interval = setInterval(function () {
				self.send({ m: "t", e: Date.now() });
				self.send({ m: "+ls" });

				self.last_ping = Date.now();
			}, 2000);
		});

		this.WS.addEventListener("message", function (event) {
			for (var i = 0; i < JSON.parse(event.data).length; i++) {
				self.emit(JSON.parse(event.data)[i].m, JSON.parse(event.data)[i]);
				self.emit("Packet Receive", JSON.parse(event.data)[i]);
			}

			self.emit("Byte", event.data.length);
		});
	};

	Client.prototype.bindEvents = function () {
		var self = this;
		this.on("hi", function (message) {
			self.user = message.u;
			if (self.channelID)
				self.setChannel(self.channelID);
		});

		this.on("t", function (message) {
			self.network.ping = Date.now() - self.last_ping;
		});

		this.on("ch", function (message) {
			self.channel = message.ch;
			self.setParticipants(message.ppl);
		});

		this.on("p", function (message) {
			if (typeof self.players[message._id] == "undefined")
				self.emit("player added", message);
			self.players[message._id] = message;
			self.emit("player update", message);
		});

		this.on("bye", function (message) {
			for (var id in self.players) {
				if (self.players[id].id == message.p) {
					this.emit("player removed", self.players[id]);
					delete self.players[id];
				}
			}
		});

		this.on("ls", function (message) {
			if (message.c) self.channels = message.u;
		});

		this.on("Byte", function (bytes) {
			self.network.bytes_received += bytes;
		});

		this.on("Bytes Send", function (bytes) {
			self.network.bytes_sent += bytes;
		});

		this.on("Packet Receive", function (packet) {
			self.network.packets_received ++;
		});

		this.on("Packet Send", function (packet) {
			self.network.packets_sent ++;
		});
	};

	Client.prototype.send = function (obj) {
		if (this.WS && this.WS.readyState == 1) {
			this.WS.send(JSON.stringify([obj]));
			this.emit("Packet Send", obj);
			this.emit("Bytes Send", JSON.stringify([obj]).length);
		}
	};

	Client.prototype.setChannel = function (id) {
		this.channelID = id;
		this.send({ m: "ch", _id: id || this.channelID, set: {} });
	};

	Client.prototype.setParticipants = function (players) {
		for (var i = 0; i < players.length; i++) {
			if (typeof this.players[players[i]._id] == "undefined") {
				this.emit("player added", players[i]);
				this.players[players[i]._id] = players[i];
			}
		}

		for (var id in this.players) {
			var found = false;
			for (var i = 0; i < players.length; i++) {
				if (players[i]._id == id) {
					found = true;
					break;
				}
			}

			if (!found) {
				this.emit("player removed", this.players[id]);
				delete this.players[id];
			}
		}
	};

	exports = Client;

})(module.exports, require("ws"), require("events").EventEmitter);

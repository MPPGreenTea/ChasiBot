/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This is the central interface of ChasiBot where the bot receives data from
 * the server, processes them, and sends them to the different systems that
 * helps the bot be able to perform tasks.
 */

(function (Filesystem, Permissions, CommandManager, ChatIO, Events) {

  function Chasi() {
    this.command_manager = null;
    this.permissions = null;
    this.spam_detector = null;
    this.settings = null;
    this.client = null;
    this.logger = null;
    this.variables = null;
    this.events = null;
    this.chat = null;
  }

  /**
   * Sets the client for ChasiBot
   *
   * @param {Client} client - The client that the bot will use
   */
  Chasi.prototype.set_client = function (client) {
    if (typeof client != "undefined") this.client = client;
  };

  /**
   * Sets the logger for ChasiBot
   *
   * @param {function} logger - The function that will log messages
   */
  Chasi.prototype.set_logger = function (logger) {
    if (typeof logger == "function") this.logger = logger;
  };

  /**
   * Logs an exception
   *
   * @param {Error} e - The error that will be logged in the terminal
   */
  Chasi.prototype.log_exception = function (e) {
    console.log(e);
  };

  /**
   * Starts the initialization process of ChasiBot.
   *
   * @param {object} settings - The settings that the bot will be using
   * @throws {Error}
   */
  Chasi.prototype.init = function (settings) {
    if (typeof this.client == "undefined" || typeof this.logger != "function")
      throw new Error("Client or logger has not been set");

    const self = this;
    this.logger("INFO", "Initializing Chasi Bot...");

    this.settings = {};
    this.settings.data = settings;

    this.settings.get_setting = function (name) {
      return self.settings.data[name];
    };

    this.settings.set_setting = function (name, value) {
      self.settings.data[name] = value;
    };

    this.settings.save = function () {
      Filesystem.writeFileSync(JSON.stringify(self.settings.data), "utf8");
      self.logger("INFO", "Settings have been saved");
    };

    this.permissions = new Permissions(this);
    this.command_manager = new CommandManager(this);
    this.chat = new ChatIO(this);
    this.events = new Events(this);

    var connection_time = Date.now();

    this.client.setChannel(this.settings.get_setting("initialization_channel"));
    this.client.start();

    this.client.last_channel = "";

    this.register_bot_events();
    this.register_socket_events(connection_time);
  }

  /**
   * Registers the websocket events
   *
   * @param {number} connection_time - The time the bot started to connect to Multiplayer Piano
   */
  Chasi.prototype.register_socket_events = function (connection_time) {
    const self = this;
    this.client.WS.addEventListener("open", function () {
      self.logger("INFO", "Connected to the server in " + (Date.now() - connection_time) + "ms");
    });

    this.client.WS.addEventListener("close", function () {
      self.logger("INFO", "Disconnected from the server");
    });
  }

  /**
   * Registers the bot's main events
   */
  Chasi.prototype.register_bot_events = function () {
    const self = this;
    this.client.on("user", function (user) {
      if (self.settings.data.permissions_owners.indexOf(user._id) < 0) {
        self.logger("INFO", "Added #" + user._id + " to the owner list");
        self.settings.data.permissions_owners.push(user._id);
      }
    });

    this.client.on("channel", function (channel) {
      self.logger("INFO", "Connected to the room " + channel._id + " [" + channel.count + " users]");
    });

    this.chat.register_bot_events();
    this.command_manager.register_bot_events();
  };


  module.exports = Chasi;

})(require("fs"), require(__dirname + "/Permissions.js"), require(__dirname + "/CommandManager.js"), require(__dirname + "/Chat.js"), require(__dirname + "/Events.js"));

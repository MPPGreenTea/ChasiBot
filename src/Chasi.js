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

(function (Filesystem, Permissions, CommandManager, SpamDetector, ChatIO, Events) {

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

  Chasi.prototype.set_client = function (client) {
    if (typeof client != "undefined") this.client = client;
  };

  Chasi.prototype.set_logger = function (logger) {
    if (typeof logger == "function") this.logger = logger;
  };

  Chasi.prototype.log_exception = function (e) {
    console.log(e);
  };

  Chasi.prototype.init = function (settings) {
    if (typeof this.client == "undefined" || typeof this.logger != "function")
      throw new Error("Client or logger has not been set");

    const self = this;
    this.logger("INFO", "Initializing Chasi Bot...");

    this.settings = {};
    this.settings.data = settings || {
      terminal_save_logs: false,
      terminal_commands: true,
      terminal_time: true,

      mute_strikes: 3,
      mute_duration: 3E5,
      mute_threshold: 1E3,

      permissions_bans: [],
      permissions_owners: [],
      permissions_moderators: [],

      initalization_channel: "lobby",

      command_prefix: "#",

      buffer_interval: 1500,
      buffer_max_messages: 7
    };

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

    this.logger("INFO", "Connecting to Multiplayer Piano...");
    var connection_time = Date.now();

    this.client.setChannel(this.settings.get_setting("initialization_channel"));
    this.client.start();

    this.register_socket_events(connection_time);
  }

  Chasi.prototype.register_socket_events = function (connection_time) {
    const self = this;
    this.client.WS.addEventListener("open", function () {
      self.logger("INFO", "Connected to the server in " + (Date.now() - connection_time) + "ms");

      self.register_bot_events();
    });

    this.client.WS.addEventListener("close", function () {
      self.logger("INFO", "Disconnected from the server");
    });
  }

  Chasi.prototype.register_bot_events = function () {

  };


  module.exports = Chasi;

})(require("fs"), require(__dirname + "/Permissions.js"), require(__dirname + "/CommandManager.js"), null, require(__dirname + "/Chat.js"), require(__dirname + "/Events.js"));

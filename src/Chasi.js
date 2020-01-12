/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 */

(function (exports, Filesystem, Permissions, CommandManager, SpamDetector) {

  function Chasi() {
    this.command_manager = null;
    this.permissions = null;
    this.spam_detector = null;
    this.settings = null;
    this.client = null;
    this.logger = null;
    this.variables = null;
  }

  Chasi.prototype.set_client = function (client) {
    if (typeof client != "undefined") this.client = client;
  };

  Chasi.prototype.set_logger = function (logger) {
    if (typeof logger == "function") this.logger = logger;
  }

  Chasi.prototype.init = function (settings) {
    if (typeof this.client != "undefined" || typeof this.logger != "function")
      throw new Error("Client has not been set");

    const self = this;
    this.logger("Initializing Chasi Bot...");

    this.command_manager = new CommandManager();
    this.permissions = new Permissions();
    this.spam_detector = new SpamDetector();

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

      initalization_channel: "lobby"
    };

    this.settings.get_setting = function (name) {
      return self.settings.data[name];
    };

    this.settings.set_setting = function (name, value) {
      self.settings.data[name] = value;
    };

    this.settings.save = function () {
      Filesystem.writeFileSync(JSON.stringify(self.settings.data), "utf8");
      self.logger("Settings have been saved");
    };

    this.logger("Connecting to Multiplayer Piano...");
    var connection_time = Date.now();

    this.client.setChannel(this.settings.get_setting("initialization_channel"));
    this.client.start();

    this.register_socket_events(connection_time);
  }

  Chasi.prototype.register_socket_events = function (connection_time) {
    const self = this;
    this.client.WS.addEventListener("open", function () {
      self.logger("Connected to the server in " + (Date.now() - connection_time) + "ms");

      self.register_bot_events();
    });

    this.client.WS.addEventListener("close", function () {
      self.logger("Disconnected from the server");
    });
  }

  Chasi.prototype.register_bot_events = function () {

  };


  exports = Chasi;

})(module.exports, require("fs"));
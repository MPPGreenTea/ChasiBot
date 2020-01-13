/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This file contains code that is required for the code in Chasi.js to
 * be able to function properly. The settings are loaded in this file and the
 * modules the bot requires are also loaded here.
 */

(function (Test, Chasi, Client, Filesystem, Readline) {

  var chat_log = "";
  var settings, chasi;

  /**
   * Logs messages to the console and stores the messages in a log that will be
   * saved when the bot is exited.
   *
   * @param {string} type - Category the message is included in like INFO, WARN.
   * @param {string} input - The message that will be logged
   */
  function log(type, input) {
    var output = ((settings ? settings.terminal_time : true) ? "[" + new Date().toString().split(" ")[4] + "] " : "") + "[" + type + "] " + input;

    chat_log += output + "\n";
    console.log(output);
  }

  if (!Filesystem.existsSync(__dirname + "/settings.txt")) {
    log("INFO", "Settings file will be created");

    if (!Test) {
      Filesystem.writeFileSync(__dirname + "/settings.txt", JSON.stringify({
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
      }), "utf8");
    }
  }

  if (!Test) settings = JSON.parse(Filesystem.readFileSync(__dirname + "/settings.txt", "utf8"));
  else {
    settings = {
      terminal_save_logs: false,
      terminal_commands: true,
      terminal_time: true,

      permissions_bans: [],
      permissions_owners: [],
      permissions_moderators: [],

      initialization_channel: "lobby",

      command_prefix: "#",

      buffer_interval: 1500,
      buffer_max_messages: 7
    };
  }

  log("INFO", "Settings have been loaded");

  chasi = new Chasi();
  chasi.set_logger(log);
  chasi.set_client(new Client("ws://www.multiplayerpiano.com:8080"));

  chasi.init(settings);

})(true, require(__dirname + "/src/Chasi.js"), require(__dirname + "/src/Client.js"), require("fs"), require("readline"));

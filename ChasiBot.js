/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 */

(function (Chasi, Client, Filesystem, Readline) {

  var chat_log = "";
  var settings, chasi;

  function log(type, input) {
    var output = ((settings ? settings.terminal_time : true) ? "[" + new Date().toString().split(" ")[4] + "] " : "") + "[" + type + "]: " + input;

    chat_log += output + "\n";
    console.log(output);
  }

  if (!Filesystem.existsSync(__dirname + "/settings.txt")) {
    log("INFO", "Settings file will be created");

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

      initalization_channel: "lobby"
    }), "utf8");
  }

  settings = JSON.parse(Filesystem.readFileSync(__dirname + "/settings.txt", "utf8"));
  log("INFO", "Settings have been loaded");

  chasi = new Chasi();
  chasi.set_logger(log);
  chasi.set_client(new Client);

  chasi.init();

})(require(__dirname + "/src/Chasi.js"), require(__dirname + "/src/Client.js"), require("fs"), require("readline"));

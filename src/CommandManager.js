/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This is where the commands are added and removed. This file also processes
 * chat messages received from the server and outputs messages to the bot.
 */

(function (exports) {

  function CommandManager(Chasi) {
    this.commands = {};
    this.chasi = Chasi;
  }

  CommandManager.prototype.register_command = function (callback, name, description, level, min_args, max_args, exact_args) {
    if (typeof callback != "function") return;

    this.commands[name] = {
      callback: callback,
      description: description || "",
      level: level || 0,
      min: min_args || null,
      max: max_args || null,
      exact: exact_args || null
    };
  };

  CommandManager.prototype.command_exists = function (command_name) {
    return Object.keys(this.commands).indexOf(command_name) >= 0;
  };

  CommandManager.prototype.process_chat = function (input, user) {
    if (input.slice(0, this.chasi.settings.get_setting("command_prefix").length) != this.chasi.settings.get_setting("command_prefix"))
      return false;

    var command = input.slice(this.chasi.settings.get_setting("command_prefix").length).split(" ")[0];
    var parameters = input.split(" ").slice(1);

    if (!this.command_exists)
      return "Unknown command. Type " + this.chasi.settings.get_setting("command_prefix") + "help for a list of commands";

    var cmd = this.commands[command];

    if (cmd.min && parameters.length < cmd.min)
      return "This command requires a minimum of " + cmd.min + " parameters";
    if (cmd.max && parameters.length > cmd.max)
      return "This command requires a maximum of " + cmd.min + " parameters";
    if (cmd.exact && parameters.length != cmd.exact)
      return "This command requires " + cmd.exact + " parameters";

    try {
      cmd.callback(parameters, user);
    } catch (e) {
      this.chasi.log_exception(e);
      return "An exception has occured while performing the command";
    } finally {
      return true;
    }
  };

  module.exports = CommandManager;

})(module.exports);

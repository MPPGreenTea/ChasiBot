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

(function () {

  /**
   * Handles the registration of commands and when players call the commands.
   *
   * @param {Chasi} Chasi - The Chasi instance the class will use
   */
  function CommandManager(Chasi) {
    this.commands = {};
    this.chasi = Chasi;
  }

  /**
   * Registers a command to the command manager
   *
   * @param {function} callback - The callback of the command when it is called
   * @param {string} name - The name of the command that will be registered
   * @param {string} description - The name of the command that will be registered
   * @param {number} level - The level of the command that will be registered
   * @param {number} min_args - The minimum amount of args
   * @param {number} max_args - The maximum amount of args
   * @param {number} exact_args - The exact amount of args
   */
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

  /**
   * Checks if a command exists in the list of registered commands
   *
   * @param {string} command_name - Name of the command that will be checked
   * @return {boolean} Whether or not the command exists
   */
  CommandManager.prototype.command_exists = function (command_name) {
    return Object.keys(this.commands).indexOf(command_name) >= 0;
  };

  /**
   * Processes the chat message received from the server and runs a command
   *
   * @param {string} input - The chat message received by the server
   * @param {object} user - The user that sent the chat message
   * @return {string} The result of calling the command
   */
  CommandManager.prototype.process_chat = function (input, user) {
    if (input.slice(0, this.chasi.settings.get_setting("command_prefix").length) != this.chasi.settings.get_setting("command_prefix"))
      return "N";

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
      return "N";
    }
  };

  /**
   * Registers the events that makes the manager function properly
   */
  CommandManager.prototype.register_bot_events = function () {
    const self = this;
    this.chasi.events.registerListener("chat", function (data) {
      self.process_chat(data.message, data.user);
    });

    this.register_command(function (parameters, user) {
      var level = self.chasi.permissions.get_level(user._id);

      var commands = Object.keys(self.commands).filter(function (command) {
        return self.commands[command].level == level;
      }).sort(function (a, b) {
        return self.commands[b] - self.commands[a];
      }).sort(function (a, b) {
        return b.length - a.length;
      }).map(function (command) {
        return command + " [" + self.commands[command].level + "]";
      });
      self.chasi.chat.send("List of commands you can access [L=" + level + "]: " + commands.join(", "));
    }, "help", "Shows a list of commands", 0, null, 1, null);
  };

  module.exports = CommandManager;

})();

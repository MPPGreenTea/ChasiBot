/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This is where the default bot commands are registered.
 */

(function () {
  module.exports = function (commandmanager) {
    const self = commandmanager;
    self.register_command(function (parameters, user) {
      var level = self.chasi.permissions.get_level(user._id);

      var commands = Object.keys(self.commands).filter(function (command) {
        return self.commands[command].level <= level;
      }).sort(function (a, b) {
        return self.commands[b] - self.commands[a];
      }).map(function (command) {
        return command + " [" + self.commands[command].level + "]";
      });
      self.chasi.chat.send("List of commands you can access [L=" + level + "]: " + commands.join(", "));
    }, "help", "Shows a list of commands", 0, null, 1, null);

    self.register_command(function (parameters, user) {
      var run_time = Date.now();
      var output = "";
      try {
        output = eval(parameters.join(" "));
      } catch (e) {
        commandmanager.chasi.chat.send(e.toString());
      } finally {
        commandmanager.chasi.chat.send("> " + output + " < " + (Date.now() - run_time) + "ms >");
      }
    }, "node", "Runs a nodejs script", 2, 1, null, null);

    self.register_command(function (parameters, user) {
      if (parameters[0].toLowerCase() == "list" || parameters[0].toLowerCase() == "save") {
        if (parameters[0].toLowerCase() == "save") {

          return;
        }
        commandmanager.chasi.chat.send("List of settings: " +
          Object.keys(commandmanager.chasi.settings.data).map(function (setting) {
            return setting + "=" + self.chasi.settings.data[setting];
          }).join(", ")
        );
      } else if (parameters.length < 2) {
        commandmanager.chasi.chat.send("This command requires 2 args");
        return;
      }

      if (parameters[0].toLowerCase == "get") {
        if (typeof commandmanager.chasi.settings.get_setting(parameters[1]) == "undefined") {
          commandmanager.chasi.chat.send("The key " + parameters[1] + " doesn't exist in the settings");
          return;
        }

        commandmanager.chasi.chat.send(parameters[1] + "=" + commandmanager.chasi.settings.get_setting(parameters[1]));
      }

      if (parameters[0].toLowerCase == "set") {
        var value = parameters[2];
        if (parameters[2] == "true" || parameters[2] == "false")
          value = parameters[2] == "true" ? true : false;
        if (!isNaN(parameters[2]))
          value = parseInt(parameters[2], 10);
        if (parameters[2].match(/['"`]/))
          value = parameters[2].slice(1).slice(-1);

        commandmanager.chasi.settings.set_setting(parameters[1], value);
        commandmanager.chasi.chat.send("Setting " + parameters[1] + "set to " + value);
      }
    }, "setting", "Manages settings", 2, 1, null, null);

    self.register_command(function (parameters, user) {

    }, "file", "Managesfiles", 2, 2, null, null);

    self.register_command(function (parameters, user) {

    }, "variable", "Manages variables", 2, 2, null, null);

  };
})();

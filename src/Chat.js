/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This is where the chat messages are processed in the bot. This file also
 * houses the chat buffer that sends chat messages to the client.
 */

(function () {

  /**
   * ChatIO is a class that handles chat input and output messages.
   *
   * @param {Chasi} Chasi - The Chasi instance that will be used by the class
   */
  function ChatIO(Chasi) {
    this.chasi = Chasi;
    this.buffer = [];

    this.initialize_buffer();
  }

  /**
   * Adds a chat message to the chat buffer to be sent.
   *
   * @param {string} message - The message that will be added to the buffer
   */
  ChatIO.prototype.send = function (message) {
    this.buffer.push(message);
  };

  /**
   * Handles the chat messages received by the client.
   *
   * @param {string} message - Message that was received from the server
   * @param {object} user - User that sent the chat message
   */
  ChatIO.prototype.input = function (message, user) {
    this.chasi.logger("CHAT", user.name + " #" + user._id + ": " + message);
    this.chasi.events.callEvent(this.chasi.events.create_event("chat", {
      message: message,
      user: user
    }));
  };

  /**
   * Initializes the chat buffer
   */
  ChatIO.prototype.initialize_buffer = function () {
    const self = this;

    setInterval(function () {
      if (self.buffer.length >= parseInt(self.chasi.settings.get_setting("buffer_max_messages"), 10)) {
        self.buffer.splice(0, parseInt(self.chasi.settings.get_setting("buffer_max_messages"), 10));
        return;
      }

      var message = self.buffer.pop();

      if (typeof message != "string") return;

      if (message.length > 511) {
        self.buffer.push("" + message.slice(511));

        message = message.slice(0, 511) + "";
      }

      self.chasi.client.send({ m: "a", message: message });
    }, parseInt(this.chasi.settings.get_setting("buffer_interval"), 10));
  };

  /**
   * Registers the events for the bot
   */
  ChatIO.prototype.register_bot_events = function () {
    const self = this;
    this.chasi.client.on("a", function (message) {
      self.input(message.a, message.p);
    });
  };

  module.exports = ChatIO;

})();

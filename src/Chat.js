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

(function (exports) {

  function ChatIO(Chasi) {
    this.chasi = Chasi;
    this.buffer = [];

    this.initialize_buffer();
  }

  ChatIO.prototype.output = function (message) {
    this.buffer.push(message);
  };

  ChatIO.prototype.input = function (message, user) {
    
  };

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

})(module.exports);

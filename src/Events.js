/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This is where events are handled in ChasiBot. Sections of ChasiBot can
 * access this class and register events and emit events.
 */

(function () {

  function Events(Chasi) {
    this.chasi = Chasi;
    this.events = {};
  }

  Events.prototype.callEvent = function (event) {
    event.name = event.name.toLowerCase();
    if (!Array.isArray(this.events[event.name])) return;

    console.log("EVENTS: " + this.events[event.name]);

    for (var i = 0; i < this.events[event.name].length; i++)
      this.events[event.name][i](event.data);
  };

  Events.prototype.registerListener = function (event, listener) {
    event = event.toLowerCase();

    if (!Array.isArray(this.events[event]))
      this.events[event] = [];

    this.events[event].push(listener);
  };

  Events.prototype.create_event = function (name, data) {
    return {
      name: name.toLowerCase(),
      data: data,
      timestamp: Date.now()
    };
  };

  module.exports = Events;

})();

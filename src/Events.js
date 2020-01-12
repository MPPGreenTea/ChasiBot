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

(function (exports) {

  function Events(Chasi) {
    this.chasi = Chasi;
    this.events = {};
  }

  Events.prototype.callEvent = function (event) {
    if (!Array.isArray(this.events[event.name])) returnl

    for (var i = 0; i < this.events[event.name].length; i++)
      this.events[event.name][i](event);
  };

  Events.prototype.registerListener = function (event, listener) {
    if (!Array.isArray(this.events[event]))
      this.events[event] = [];

    this.events[event].push(listener);
  };

  Events.prototype.create_event = function (name, data) {
    return {
      name: name,
      data: data,
      timestamp: Date.now()
    };
  };

  module.eports = Events;

})(module.exports);

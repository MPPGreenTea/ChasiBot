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

  /**
   * Handles all registration and calls of events
   *
   * @param {Chasi} Chasi - The Chasi instance that the Events class will use
   */
  function Events(Chasi) {
    this.chasi = Chasi;
    this.events = {};
  }

  /**
   * Triggers all the callbacks that are attached to a certain event
   *
   * @param {object} event -  The event data that was emitted
   */
  Events.prototype.callEvent = function (event) {
    event.name = event.name.toLowerCase();
    if (!Array.isArray(this.events[event.name])) return;

    for (var i = 0; i < this.events[event.name].length; i++)
      this.events[event.name][i](event.data);
  };

  /**
   * Registers an event listener for the events
   *
   * @param {string} event - The name of the event the listener will be attached to
   * @param {function} listener - The callback function for when the event is triggered
   */
  Events.prototype.registerListener = function (event, listener) {
    event = event.toLowerCase();

    if (!Array.isArray(this.events[event]))
      this.events[event] = [];

    this.events[event].push(listener);
  };

  /**
   * Creates an event from the specified parameters
   *
   * @param {string} name - The name of the event that will be created
   * @param {object} data - The data that will be sent with the event
   * @return {object} The event object that could be sent using the callEvent function
   */
  Events.prototype.create_event = function (name, data) {
    return {
      name: name.toLowerCase(),
      data: data,
      timestamp: Date.now()
    };
  };

  module.exports = Events;

})();

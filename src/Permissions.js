/**
 * Chasi Bot v1.2.0
 * By ChaCha Si on 1/11/20
 *
 * Chasi Bot is a Multiplayer Piano Bot written for NodeJS. This
 * bot provides commands not frequently seen in MPP bots created from
 * 2012-2016. These commands include variables, permissions, and files.
 *
 * This is where the user permissions are set. This file works with the file
 * CommandManager.js so that users could access commands that are at their
 * access levels. This prevents regular users from accessing the owner commands
 * without permission.
 */

(function () {

  /**
   * This class handles all permissions of users, like setting levels and
   * getting levels of users.
   *
   * @param {Chasi} Chasi - The Chasi instance that the class will use
   */
  function Permissions(Chasi) {
    this.chasi = Chasi;

    this.data = {};
    this.data.owners = [];
    this.data.moderators = [];
    this.data.bans = [];

    this.load_data();
  }

  /**
   * Sets the level of a user
   *
   * @param {string} id - The id of the target user
   * @param {number} level - The level that the user will be set to
   * @throws {Error}
   */
  Permissions.prototype.set_level = function (id, level) {
    switch (level) {
      case -1:
        this.data.bans.push(id);
        this.data.owners.splice(this.data.owners.indexOf(id), 1);
        this.data.moderators.splice(this.data.moderators.indexOf(id), 1);
        break;
      case 0:
        this.data.owners.splice(this.data.owners.indexOf(id), 1);
        this.data.moderators.splice(this.data.moderators.indexOf(id), 1);
        this.data.bans.splice(this.data.bans.indexOf(id), 1);
        break;
      case 1:
        this.data.moderators.push(id);
        this.data.owners.splice(this.data.owners.indexOf(id), 1);
        this.data.bans.splice(this.data.bans.indexOf(id), 1);
        break;
      case 2:
        this.data.owners.push(id);
        this.data.moderators.splice(this.data.moderators.indexOf(id), 1);
        this.data.bans.splice(this.data.bans.indexOf(id), 1);
        break;
      default:
        throw new Error("Invalid level");
    };
  };

  /**
   * Gets the level of the target user
   *
   * @param {string} id - The target id that will be checked
   * @return {number} The level of the target id
   */
  Permissions.prototype.get_level = function (id) {
    if (this.data.owners.indexOf(id) >= 0)
      return 2;

    if (this.data.moderators.indexOf(id) >= 0)
      return 1;

    if (this.data.bans.indexOf(id) >= 0)
      return -1;

    return 0;
  };

  /**
   * Loads the user levels from the settings
   */
  Permissions.prototype.load_data = function () {
    this.data.bans = this.chasi.settings.data.permissions_bans;
    this.data.moderators = this.chasi.settings.data.permissions_moderators;
    this.data.owners = this.chasi.settings.data.permissions_owners;
  };

  /**
   * Saves the user levels into the settings
   */
  Permissions.prototype.save_data = function () {
    this.chasi.settings.data.permissions_bans = this.data.bans;
    this.chasi.settings.data.permissions_moderators = this.data.moderators;
    this.chasi.settings.data.permission_owners = this.data.owners;
  };

  module.exports = Permissions;

})();

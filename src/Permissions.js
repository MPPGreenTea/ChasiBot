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

(function (exports) {

  function Permissions() {
    this.data = {};
    this.data.owners = [];
    this.data.moderators = [];
    this.data.bans = [];
  }

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
        return false;
    };

    return true;
  };

  Permissions.prototype.get_level = function (id) {
    if (this.data.owners.indexOf(id) >= 0)
      return 2;

    if (this.data.moderators.indexOf(id) >= 0)
      return 1;

    if (this.data.bans.indexOf(id) >= 0)
      return -1;

    return 0;
  };

  Permissions.prototype.load_data = function (settings) {
    this.data.bans = settings.permissions_bans;
    this.data.moderators = settings.permissions_moderators;
    this.data.owners = settings.permissions_owners;
  };

  Permissions.prototype.save_data = function (settings) {
    settings.permissions_bans = this.data.bans;
    settings.permissions_moderators = this.data.moderators;
    settings.permission_owners = this.data.owners;
  };

  exports = Permissions;

})(module.exports);

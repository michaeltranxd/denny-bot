const { adminroleid } = require("../config.json");

class Permissions {
  constructor() {}

  isAdmin(message) {
    let isAdmin = false;

    // If insufficient permissions then just say we don't recognize that command
    if (message.member.roles.cache.get(adminroleid)) {
      isAdmin = true;
    }

    // // If the user is owner of guild then automatic admin
    // if (message.author.id === message.guild.ownerID) isAdmin = true;

    return isAdmin;
  }
}

module.exports = new Permissions();

const { channelid } = require("../config.json");

module.exports = {
  name: "answer",
  description: "simple helper :)",
  args: true, // Include if command requires args
  usage: "talk to tr. denny if you want to know how to use", // Include if args is true
  guildOnly: true, // Include if exclusive to server
  cooldown: 0.1,
  execute(message, args) {
    // Get channel to purge
    let channel = message.guild.channels.cache.get(channelid);

    if (!channel) {
      console.log("Issue with getting channel");
    }

    channel.send(message);
  },
};

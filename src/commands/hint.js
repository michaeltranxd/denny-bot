const { channelid } = require("../config.json");
const permissions = require("../util/permissions");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "hint",
  description: "Requests hint",
  args: true, // Include if command requires args
  usage: "<pageNeedHelpOn>", // Include if args is true
  guildOnly: true, // Include if exclusive to server
  cooldown: 2,

  execute(message, args) {
    const guildId = message.guild.id;
    const textChannelId = message.channel.id;
    const messageId = message.id;

    const discordMessageLink = `https://discord.com/channels/${guildId}/${textChannelId}/${messageId}`;

    const channelName = message.channel.name;

    let replyMessageContent = `Help is on the way. Please wait.`;
    let leaderMessageContent = `They input \`${args}\` and post can be found [here](${discordMessageLink} 'redirect to post')`;

    if (leaderMessageContent.length > 1024) {
      leaderMessageContent = `They input a long message so please look at the post [here](${discordMessageLink} 'redirect to post')`;
    }

    let leaderEmbedMessage = new MessageEmbed().setColor("#0099ff").addFields({
      name: `Users from channel \`${channelName}\` are requesting a hint \`${textChannelId}\``,
      value: leaderMessageContent,
    });

    message.guild.channels.cache
      .get(channelid)
      .send(leaderEmbedMessage)
      .then((msg) => {
        message.reply(replyMessageContent);
      });
  },
};

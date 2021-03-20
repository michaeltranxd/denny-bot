const { channelid } = require("../config.json");
const permissions = require("../util/permissions");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "answer",
  description: "Submit answer",
  args: true, // Include if command requires args
  usage: "<answer>", // Include if args is true
  guildOnly: true, // Include if exclusive to server
  cooldown: 2,

  execute(message, args) {
    const guildId = message.guild.id;
    const textChannelId = message.channel.id;
    const messageId = message.id;

    const discordMessageLink = `https://discord.com/channels/${guildId}/${textChannelId}/${messageId}`;

    const channelName = message.channel.name;

    let replyMessageContent = `Help is on the way. Please wait.`;
    let leaderMessageContent = `Their answer: \`${args.join(
      " "
    )}\` | post can be found [here](${discordMessageLink} 'redirect to post')`;

    if (leaderMessageContent.length > 1024) {
      leaderMessageContent = `They input a long message so please look at the post [here](${discordMessageLink} 'redirect to post')`;
    }

    let leaderEmbedMessage = new MessageEmbed().setColor("#0099ff").addFields({
      name: `Team channel \`${channelName}\` are submitting answer \`${textChannelId}\``,
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

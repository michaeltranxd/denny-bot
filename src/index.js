const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const permissions = require("./util/permissions");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  // Ignore the message if it was sent by the bot or if it doesn't have our prefix
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  // command is not valid (we dont recognize this command)
  if (!command) {
    const helpCommand = client.commands.get("help");
    return message.reply(
      `I don't recognize that command, look at my available commands:\nrun \`${prefix}${helpCommand.name}\` to examine commands`
    );
  }

  // Check for permissions
  let isAdmin = permissions.isAdmin(message);
  if (!isAdmin && command.admin_permissions) {
    // Don't have admin permissions and command requires it
    const helpCommand = client.commands.get("help");
    return message.reply(
      `I don't recognize that command, look at my available commands:\nrun \`${prefix}${helpCommand.name}\` to examine commands`
    );
  }

  // Checks for args if required
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}}\``;
    }

    return message.channel.send(reply);
  }

  // Check for guilds only
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  // Check for cooldowns
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message
        .reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        )
        .then((msg) => {
          msg.delete({ timeout: 5 * 1000 });
        })
        .catch((error) => {
          console.log("Couldn't delete for some reason...", error);
        });
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    if (error && error.type == `CommandException`) {
      console.error(message, error.name, error.errorLog);
      message.reply(error.replyContent);
    } else {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  }
});

client.login(token);

client.on("error", (error) => {
  console.log(error);
  console.log("invalid");
});

/* Exit Handling */

function exitHandler() {
  client.destroy();
}

process.on("SIGINT", () => {
  console.log("Process interrupted");
  exitHandler();
  process.exit();
});

process.on("SIGTERM", () => {
  console.log("Process terminated");
  exitHandler();
  //process.exit();
});

process.on("uncaughtException", (error) => {
  console.log(error);
  exitHandler();
});

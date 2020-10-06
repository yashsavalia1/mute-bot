const Discord = require('discord.js');
const bot = new Discord.Client();
//const config = require('./config.json');

const prefix = '-';

const fs = require('fs');
bot.commands = new Discord.Collection();

//reads commands folder
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

//starts the bot
bot.once('ready', () => {
  console.log('Mute Bot Online!');
});

//waits for message
bot.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  let adminRole;

  if (message.guild.roles.cache.find(role => role.name === "botUser"/*name of role that can use bot*/) != null) {
    adminRole = message.guild.roles.cache.find(role => role.name === "botUser");

    if (message.member.roles.cache.has(adminRole.id)) {
      switch (command) {
        case 'mute':
          bot.commands.get('mute').execute(message, true);
          break;
        case 'm':
          bot.commands.get('mute').execute(message, true);
          break;
        case 'um':
          bot.commands.get('mute').execute(message, false);
          break;
        case 'unmute':
          bot.commands.get('mute').execute(message, false);
          break;
        case 'umute':
          bot.commands.get('mute').execute(message, false);
          break;

      }
    } else {
      //commands for non-admins to use
    }
  } else {
    // Create a new role with data
    message.guild.roles.create({
      data: {
        name: "botUser"
      }
    })
      .then(console.log("Role Created."))
      .catch(console.error);
    try {
      //adds the member to the id of the the role found called 'botuser'
      const tempRole = message.guild.roles.cache.find(role => role.name === 'botUser');
      console.log("created temp role: " + tempRole);
      const member = message.mentions.members.first();
      member.roles.add(tempRole);
      console.log("gave member");
    } catch (err) {
      console.log(err)
    }

  }
});

bot.login(process.env.MUTE_BOT_TOKEN);
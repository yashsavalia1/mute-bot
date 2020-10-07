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

      .then(role/*Returned from create and using Promise, role can be accesed in .then */ => {
        message.member.roles.add(role);
        console.log("Created botUser and added them to role");
        message.reply('Because there was no "botUser" role, a role was created and given to you.' +
                '\bFrom now on only those with the "botUser" role can use the bot.' + 
                '\b Ensure that the role can only edited by those you desire to otherwise users may get access when they should not.' +
                '\b If you are not the administrator or are otherwise not supposed to have access to this bot, ensure they know about it.');
      })
      .catch(console.error);
  }
});

bot.login(process.env.MUTE_BOT_TOKEN);
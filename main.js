const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const prefix = '-';

client.once('ready', () => {
  console.log('your bot name is online!');
});

client.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  let adminRole = message.guild.roles.cache.find(role => role.name === "Admin");

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (message.member.roles.cache.has(adminRole.id)) {
    switch (command) {
      case 'mute':
          mute(message, true);
        break;
      case 'unmute':
          mute(message, false);
        break;
      case 'umute':
          mute(message, false);
        break;
    }
  } else {
  }
});

function mute(message, setMute) {
  if (message.member.voice.channel) {
    let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
    for (const [memberID, member] of channel.members) {
      // I added the following if statement to mute everyone but the invoker:
      // if (member != message.member)

      // This single line however, nested inside the for loop, should mute everyone in the channel:
      member.voice.setMute(setMute);
    }
  } else {
    message.reply('You need to join a voice channel first!');
  }
}


client.login(config.token);
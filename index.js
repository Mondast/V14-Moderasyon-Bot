const { Client, Collection, Events, GatewayIntentBits, PermissionFlagsBits, Partials, EmbedBuilder} = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const db = require("croxydb")

let token = config.token

client.commands = new Collection()
client.slashcommands = new Collection()
client.commandaliases = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };


//slash-command-handler
const slashcommands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = await require(`./src/commands/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
})

client.on(Events.ClientReady, async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: slashcommands },
            );
        } catch (error) {
            console.error(error);
        }
    log(`${client.user.username} Aktif Edildi!`);
})

//event-handler
readdirSync('./src/events').forEach(async file => {
	const event = await require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})

//nodejs-listeners
process.on("unhandledRejection", e => { 
   console.log(e)
 }) 
process.on("uncaughtException", e => { 
   console.log(e)
 })  
process.on("uncaughtExceptionMonitor", e => { 
   console.log(e)
 })
//



client.login(token)


//---------- Otorol ----------//
client.on("guildMemberAdd", member => {
  const rol = db.get(`otorol_${member.guild.id}`)
  if (!rol) return;
  member.roles.add(rol).catch(() => { })
})

//---------- Reklam engel ----------//
client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let reklamlar = db.fetch(`reklamengel_${message.guild.id}`)
  if (!reklamlar) return;

  if (reklamlar) {

    const linkler = [

      ".com.tr",
      ".net",
      ".org",
      ".tk",
      ".cf",
      ".gf",
      "https://",
      ".gq",
      "http://",
      ".com",
      ".gg",
      ".porn",
      ".edu"

    ]

    if (linkler.some(alo => message.content.toLowerCase().includes(alo))) {
      if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;
      message.delete()
      const embed = new EmbedBuilder()
        .setDescription(`<@${message.author.id}>, dostum. Bu sunucuda reklam engelleme sistemi aktif!`);
      message.channel.send({ embeds: [embed] })
    }
  }
})
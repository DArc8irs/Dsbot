const { token , clientId , guildId , ChannelId} = require('./config.json')
const { Client , MessageEmbed , Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS , 
        Intents.FLAGS.GUILD_MEMBERS , 
        Intents.FLAGS.GUILD_MESSAGES
]});
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
    new SlashCommandBuilder().setName('verify').setDescription('Verify the user.')
    .addSubcommand(subcommand => 
        subcommand
        .setName('user')
        .setDescription('mention the user')
        .addUserOption(option => 
            option
            .setName('target')
            .setDescription('The user')))
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

client.on('ready' , () => {
    console.log(`[${client.user.tag}] : online`)
}); 

client.on('interactionCreate' , async (interaction)=> {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'verify') {
        const targetID = interaction.options.getUser('target').id;
        const targetMember = await interaction.guild.members.fetch(targetID);
        var role = interaction.guild.roles.cache.find(role => role.name === "node");
        if (targetMember.roles.cache.some(role => role.name === 'node')) {
            interaction.reply('member already has the role')
        } else {
            targetMember.roles.add(role);
            interaction.reply(`added role to ${targetMember.user.tag}`);
        } 
    }
});

client.on('guildMemberAdd' , (member) => {
    const Joinmsg = new MessageEmbed()
        .setTitle('Welcome to the server')
        .setDescription('please answer the following questions')
        .setColor('DARK_BUT_NOT_BLACK')
    client.channels.cache.get(ChannelId).send({embeds : Joinmsg});
});

client.login(token);

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json")
const PREFIX = (config.prefix)
client.login(config.token);

const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEnd: false,
    leaveOnStop: true,
    leaveOnEmpty: false,
    deafenOnJoin: true,
    quality: 'high',
});

client.player = player;

//Bot Status
client.on("ready", () => {
    console.log(`Initialized with ${client.users.cache.size} users, ${client.channels.cache.size} channels and ${client.guilds.cache.size} servers.`);
    client.user.setActivity(`Nagi Bot | 凪`)
});
client.on("guildCreate", guild => {
    console.log(`The bot initialized in a server: ${guild.name}. Population: ${guild.memeberCount}`);
    client.user.setActivity(`Nagi Bot | 凪`);
});
client.on("guildDelete", guild => {
    console.log(`The bot has been removed from the server: ${guild.name} {id: ${guild.id}}`);
    client.user.setActivity(`Nagi Bot | 凪`);
});

//Music Commands-----------------------------------------------------------------------

//Play
client.player.on('songAdd',  (message, queue, song) =>
    message.channel.send(`**${song.name}** ʜᴀꜱ ʙᴇᴇɴ ᴀᴅᴅᴇᴅ ᴛᴏ ᴛʜᴇ Qᴜᴇᴜᴇ.`))
    .on('songFirst',  (message, song) =>
        message.channel.send(`**${song.name}** ɪꜱ ɴᴏᴡ ᴘʟᴀʏɪɴɢ.`));

client.on('message', async (message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command === 'play'){
        if(client.player.isPlaying(message)) {
            let song = await client.player.addToQueue(message, args.join(' '));
            if(song)
                console.log(`Added ${song.name} to the queue.`); //Console
            return;
        } else {
            let song = await client.player.play(message, args.join(' '));
            if(song)
                console.log(`Started playing ${song.name}.`); //Console
            return;
        }
    }
});

//Playlist
client.player
    .on('playlistAdd',  (message, queue, playlist) => 
        message.channel.send(`${playlist.name} ᴘʟᴀʏʟɪꜱᴛ ᴡɪᴛʜ ${playlist.videoCount} ꜱᴏɴɢꜱ ʜᴀꜱ ʙᴇᴇɴ ᴀᴅᴅᴇᴅ ᴛᴏ ᴛʜᴇ Qᴜᴇᴜᴇ!`));

client.on('message', async (message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if (command === 'pl') {
        await client.player.playlist(message, {
            search: args.join(' '),
            maxSongs: -1
        });
    }
});

//Skip
client.on('message', async (message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command === 'skip'){
        let song = client.player.skip(message);
        if(song)
            message.channel.send(`**${song.name}** ᴡᴀꜱ ꜱᴋɪᴘᴘᴇᴅ.`);
    }
});

//Stop
client.on('message', (message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command === 'stop'){
        let isDone = client.player.stop(message);
        if(isDone)
            message.channel.send('ᴍᴜꜱɪᴄ ꜱᴛᴏᴘᴘᴇᴅ.');
    }
});

//Shuffle
client.on('message', (message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
   
    if(command === 'shuffle'){
        let songs = client.player.shuffle(message);
        if(songs)
            message.channel.send('ꜱᴇʀᴠᴇʀ Qᴜᴇᴜᴇ ᴡᴀꜱ ꜱʜᴜꜰꜰʟᴇᴅ.');
    }
});
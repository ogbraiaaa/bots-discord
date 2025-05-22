const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const map = new Map();

client.on("ready",() =>{
    console.log("Gig online!");
    client.user.setPresence({ game: { name: 'Uma rave no Discord!', type: 1, url: 'https://www.twitch.tv/killuabr_'} });
});

client.on('voiceStateUpdate',(oldMember,newMember)=>{
    if(client.guilds.get(oldMember.guild.id).me.voiceChannel && client.guilds.get(oldMember.guild.id).me.voiceChannel.members.size<2){
        client.guilds.get(oldMember.guild.id).me.voiceChannel.leave();
        map.delete(oldMember.guild.id);
    }
    else if(!client.guilds.get(oldMember.guild.id).me.voiceChannel && map.get(oldMember.guild.id)){
        map.delete(oldMember.guild.id);
        console.log('map da guild '+oldMember.guild.name+' deletado');
    }
});

client.on("message", async message=>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    
    try {
        let opts = {
            dev:'234311548158476288',
            map:map
        }
        fs.readdir('./comandos', (err, files) => {
            if (err) console.log(err);
            let jsFile = files.filter(f => f.split('.').pop() === "js");
            console.log(jsFile);
            if (jsFile.length <= 0) {
                console.log("Comando não encontrado :c");
                return;
            }
            jsFile.forEach((f) => {
                let pull = require(`./comandos/${f}`);
                console.log(`${f} carregado`);
                if (pull.config.aliases.includes(comando)) pull.run(client, message, args, opts);
            });
        });
    } catch (error) {
        console.log(error);
    }
});

client.login(config.token);

require('dotenv').config();
const StaticMaps = require('staticmaps');
//Declare variables for fetch module
const fetch = require('node-fetch');
const ISSURL = "https://api.wheretheiss.at/v1/satellites/25544";
let settings = { method: "Get" };

//Get Discord client
const Discord = require('discord.js');
const client = new Discord.Client();

//Get BOTTOKEN
client.login(process.env.BOTTOKEN);

//Server set up
client.on('ready', readyDiscord);

//Connection with Discord established
function readyDiscord(){
  console.log('Outta this world! 👽');
}

//Get map with marker of ISS location
async function getISSData(){
  const response = await fetch(ISSURL, settings);
  const data = await response.json();
  const { latitude, longitude } = data;
  const options = {
  width: 720,
  height: 720
  };
  const map = new StaticMaps(options);
  const marker = {
  img: './marker.png',
  width: 48,
  height: 48,
  coord: [longitude, latitude]
  };
  map.addMarker(marker);
  map.render([longitude, latitude], 4)
  .then(() => map.image.save('map.png'))
  .then(() => console.log('File saved!'))
  .catch(console.log);
}

function sleep(ms){
      return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('message', gotMessage);
async function gotMessage(msg){
  console.log(msg.content);
  getISSData();
  //Send picture with approximate location
  if(msg.content == '!locate'){
    await sleep(2000);
    const attachment = new Discord.MessageAttachment('./map.png');
    msg.channel.send('This is an approximate location of the ISS', attachment);
  }
  //Give help instructions
  else if(msg.content == '!help'){
    const embed = new Discord.MessageEmbed()
      .setTitle('Instructions')
      .setColor(0xff0000)
      .setDescription('Use \'!locate\' to get the location of the ISS.\nUse\'!help\' to make this menu pop up.');
    msg.channel.send(embed);
  }
}
//Welcome new members
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`здравствуйте, ${member}!`);
});

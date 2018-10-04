const Masteranime = require("./main.js");
require('dotenv').config();
const client = new Masteranime.Client();


client.login(process.env.EMAIL,process.env.PASSWORD).then((User)=>{
  User.getAnimeEpisodes(2504)
  .then(episodes=>{
    episodes.reverse();
    for(let i=0;i<episodes.length;i++){
      console.log(`Episode: ${i} - ID: ${episodes[i].info.id}`);
    }
    //console.log(data.info.title)
    //console.log(episodes);
  })
  .catch(console.error);
}).catch();

const Masteranime = require("./main.js");
require('dotenv').config();
const masterani = new Masteranime(process.env.EMAIL,process.env.PASSWORD)



masterani.login().then((User)=>{
  User.getAnime(2504)
  .then(data=>{
    let episodes = data.episodes;
    episodes.reverse();
    for(let i=0;i<episodes.length;i++){
      console.log(`Episode: ${i} - ID: ${episodes[i].info.id}`);
    }
    console.log(data.info.title)
    //console.log(episodes);
  })
  .catch(console.error);
}).catch();

const Masteranime = require("./main.js");
require('dotenv').config();
const client = new Masteranime.Client();
const fs = require('fs');



// let array = [
//   {
//     anime_name: "name of anime",
//     anime_status: 1 || 2 || 3 || 4 || 6,
//     current_episode: 55  //OPTIONAL
//   }
// ]

let cypher = {
  "item watching": 1,
  "item watched": 2,
  "item onhold": 3,
  "item dropped": 4,
  "item planned": 6
}

let animeData = fs.readFileSync('list1.json');
animeData = JSON.parse(animeData);
client.login(process.env.EMAIL,process.env.PASSWORD).then((User)=>{
  (async()=>{
    for(let i=0;i<animeData.length;i++){
      console.log(animeData[i].anime_name);
      animeData[i].anime_name = animeData[i].anime_name.substring(0,30);
      let anime = await User.searchAnime(animeData[i].anime_name);
      if(anime[0]){
      let animeId = anime[0].id;
      let setStatus = await User.setAnimeStatus(animeId,cypher[animeData[i].anime_status]);
      if(animeData[i].current_episode){
        let animeInformation = await User.getAnimeEpisodes(animeId);
        if(animeInformation[animeData[i].current_episode-1]){
          let watchedEpisode = await User.watchedEpisode(animeId,animeData[i].current_episode,animeInformation[animeData[i].current_episode-1].info.id);
        }
      }
      }
      //29
      //anime[0].id

    }
  })();
}).catch();


// let array = [];
// let x = document.getElementsByClassName("items")[0].children;
// for(let i =0;i<x.length;i++){
//   let anime = x[i];
//   let anime_name = anime.children[1].innerText;
//   let anime_episode = anime.children[4] ? anime.children[2].innerText : false;
//   let status = anime.className;
//   array[i] = {
//     anime_name: anime_name,
//     anime_status: status,
//     current_episode: anime_episode
//   }
// }
// console.log(JSON.stringify(array,null,2));

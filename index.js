const Masteranime = require("./main.js");
require('dotenv').config();
const client = new Masteranime.Client();



// let array = [
//   {
//     anime_name: "name of anime",
//     anime_status: 1 || 2 || 3 || 4 || 6,
//     current_episode: 55  //OPTIONAL
//   }
// ]


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

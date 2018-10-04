const cheerio = require("cheerio");
var request = require('request');
var rp = require('request-promise');
class BasicAPI {
  getAnime(animeId){
    let token = this.token;
    let req = this.req;
    let DefaultHeader = this.DefaultHeader
    let options = {
      uri: `https://www.masterani.me/api/anime/${animeId}/detailed`,
      headers: DefaultHeader,
      json: true
    }
    return new Promise(function(resolve,reject){
      req(options)
      .then(data=>{
        if(data){
          resolve(data);
        }else{
          reject(new Error("NO ANIME WITH THAT ID FOUND"));
        }
      })
      .catch(error=>reject(error));
    });
  }
  getAnimeEpisodes(animeId){
    return new Promise((resolve,reject)=>{
      this.getAnime(animeId)
      .then(data=>{
        let episodes = data.episodes;
        resolve(episodes);
      })
      .catch(err=>reject(err));
    });
  }
  searchAnime(animeName){
    let token = this.token;
    let req = this.req;
    let DefaultHeader = this.DefaultHeader
    let options = {
      uri: `https://www.masterani.me/api/anime/search?search=${animeName.replace(' ','+')}&sb=true`,
      headers: DefaultHeader,
      json: true
    }
    return new Promise(function(resolve,reject){
      req(options)
      .then(data=>{
          if(data){
            resolve(data);
          }else{
            reject(new Error("THERE WAS NO DATA"));
          }

      })
      .catch();
    });
  }
}
class Masteranime extends BasicAPI {

  constructor(){
    super();
  }
  login(email,password){
    this.email = email;
    this.password = password;
    let req = rp.defaults({jar: true});
    this.req = req;
    return new Promise((resolve,reject)=>{
    req({uri: "https://www.masterani.me/"})
      .then((data)=>{
        const $ = cheerio.load(data);
        const token = $('meta[name="csrf-token"]').attr('content');
        this.token = token;
        let DefaultHeader = {
          "X-CSRF-TOKEN": token
        }
        this.DefaultHeader = DefaultHeader;
        let options={
          url: "https://www.masterani.me/auth/sign-in",
          method: "POST",
          form: {email:this.email,password:this.password,remember:false},
          headers: DefaultHeader
        }
        return req(options);
      })
      .then(data=>JSON.parse(data))
      .then(data=>{
        if(!(data.success)) throw new Error(data.errors[0]);
        let token = this.token;
        let DefaultHeader = this.DefaultHeader;
        let options={
          url: "https://www.masterani.me/settings",
          headers: DefaultHeader,
          resolveWithFullResponse: true
        }
        return req(options);
      })
      .then(data=>{
        resolve(new User(this.token,this.req));
      })
      .catch((err)=>{
        reject(err);
      });
      });
  }
}

class User extends BasicAPI{
  constructor(token,req){
    super();
    this.token = token;
    this.req = req;
    this.DefaultHeader = {
      "X-CSRF-TOKEN": token
    }
  }
  setAnimeStatus(animeId,status){
    let token = this.token;
    let req = this.req;
    let DefaultHeader = this.DefaultHeader
    let options = {
      uri: `https://www.masterani.me/api/user/library/status/${animeId}?status=${status}`,
      headers: DefaultHeader,
      json: true
    }
    return new Promise(function(resolve,reject){
      if(status != 1 && status != 2 && status != 3 && status != 4 && status != 6){
        console.log(status);
        let error = new Error("That is not a valid status number")
        reject(error)
        return error;
      };
      req(options)
      .then(data=>resolve(data))
      .catch(error=>reject(error));
    });
  }

//https://www.masterani.me/api/anime/64/detailed
  watchedEpisode(animeId,episodeNumber,episodeId){
    let token = this.token;
    let req = this.req;
    let DefaultHeader = this.DefaultHeader
    let options = {
      uri: `https://www.masterani.me/api/user/library/episode/${animeId}?episode=${episodeNumber}&episode_id=${episodeId}&trigger=2`,
      headers: DefaultHeader,
      json: true
    }
    return new Promise(function(resolve,reject){
      req(options)
      .then(data=>{
        if(data){
          if(data.success){
            resolve(data);
          }else{
            reject(new Error(data.message));
          }
        }
      })
      .catch(error=>reject(error));
    });
  }
  deleteAnime(animeId){
    let token = this.token;
    let req = this.req;
    let DefaultHeader = this.DefaultHeader
    let options = {
      uri: `https://www.masterani.me/api/user/library/delete/${animeId}`,
      headers: DefaultHeader,
      json: true
    }
    return new Promise(function(resolve,reject){
      req(options)
      .then(data=>{
        if(data){
          if(data.success){
            resolve(data);
          }else{
            reject(new Error(data.message));
          }
        }
      })
      .catch(error=>reject(error));
    });  }
}

// https://www.masterani.me/
module.exports = {
  Client: Masteranime,
};

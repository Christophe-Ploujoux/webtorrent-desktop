const PirateBay = require("thepiratebay");
const yify = require("./yify");
const eztv = require('./eztv');

const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

class TorrentSearch {
  static search(name) {
    return new Promise((resolve, reject) => {
      let torrents = [];
      TorrentSearch.EztvSearch(name)
      .then((result) => {
        torrents = torrents.concat(result);
        return TorrentSearch.YifySearch(name);
      })
      .then((result) => {
        torrents = torrents.concat(result);
        return TorrentSearch.PirateBaySearch(name);
      })
      .then((result)=> {
        torrents = torrents.concat(result);
        resolve(torrents)
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  static EztvSearch(name) {
    return new Promise((resolve, reject) => {
      eztv.series(name)
      .then((series) => {
        let shows = series.filter((serie) => {
          return (serie.title.toLowerCase().indexOf(name.toLowerCase()) != -1);
        });
        shows = shows.slice(0, 3);
        let promises = shows.map(show => {
          return eztv.seriesTorrents(show);
        });
        return Promise.all(promises);
      })
      .then((shows) => {
        let torrents = [];
        shows.forEach((show)=>{
          torrents = torrents.concat(show);
        })
        resolve(torrents);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
  static PirateBaySearch(name) {
    return new Promise((resolve, reject) => {
      PirateBay.search(name)
      .then((results) => {
        let torrents = results.map((show) => {
          return {
            category:show.category.name,
            provider:"PIRATE",
            name: show.name,
            magnet: show.magnet,
            size: show.size,
            seeds: show.seeders,
            peers: show.leechers
          }            
        });
        resolve(torrents);
      })
      .catch((err) => {
        reject(err);
      })
    });
  }
  static YifySearch(name) {
    return new Promise((resolve, reject) => {
      yify.search(name, (err, results) => {
        if (err) return reject(err);
        results = results.filter((show) => {
          if (show.torrents.length > 1) return show.torrents[1].seeds > 5; 
          return show.torrents[0].seeds > 5;
        });
        let torrents = results.map((show)=> {
          let torrent = (show.torrents.length > 1) ? show.torrents[1] : show.torrents[0];
          return {
            category:"Vidéo",
            provider:"YIFY",
            name: show.title,
            magnet: show.magnet,
            size: torrent.size,
            seeds: torrent.seeds,
            peers: torrent.peers
          }        
        });
        resolve(torrents);
      });    
    });
  }
}

module.exports = TorrentSearch;

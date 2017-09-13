const {dispatch} = require('../lib/dispatcher')
const PirateBay = require('thepiratebay');

const TorrentSearch = require('../lib/torrent-search');
const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

// Controls the Search torrent screen
module.exports = class SearchController {
 constructor (state, config) {
    this.state = state
    this.config = config
  }

  show () {
    this.state.location.go({
      url: 'search-torrent',
      setup: function (cb) {
        state.window.title = 'Search torrent'
        cb()
      }
    })
  }

  getSearchTorrent() {
    this.state.searchLoading = true
    TorrentSearch.PirateBaySearch(this.state.saved.activeSearchTorrent)
    .then((result) => {
      this.state.searchLoading = false
      this.state.saved.searchTorrents = result;
      this.state.saved.searchTorrents.sort((a, b) => {
        return (b.seeds - a.seeds);
      });
      return TorrentSearch.YifySearch(this.state.saved.activeSearchTorrent);
    })
    .then((result) => {
      this.state.saved.searchTorrents = this.state.saved.searchTorrents.concat(result);
      this.state.saved.searchTorrents.sort((a, b) => {
        return (b.seeds - a.seeds);
      });
      return TorrentSearch.EztvSearch(this.state.saved.activeSearchTorrent);
    })
    .then((result)=> {
      this.state.saved.searchTorrents = this.state.saved.searchTorrents.concat(result);
      this.state.saved.searchTorrents.sort((a, b) => {
        return (b.seeds - a.seeds);
      });
    })
    .catch((err) => {
      this.state.searchLoading = false
      if (err) dispatch('error', err)
    }); 
  }

  setActiveSearchTorrent(name) {
    this.state.saved.activeSearchTorrent = name;    
  }
}

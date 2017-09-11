const {dispatch} = require('../lib/dispatcher')
const PirateBay = require('thepiratebay');


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
        // initialize search torrent
        state.window.title = 'Search torrent'
        cb()
      }
    })
  }

  getSearchTorrent() {
    this.state.searchLoading = true
    PirateBay.search(this.state.saved.activeSearchTorrent)
    .then((results) => {
      this.state.searchLoading = false
      this.state.saved.searchTorrents = results;
    })
    .catch((err) => {
      this.state.searchLoading = false
      if (err) dispatch('error', err)
    })    
  }

  setActiveSearchTorrent(name) {
    this.state.saved.activeSearchTorrent = name;    
  }
}

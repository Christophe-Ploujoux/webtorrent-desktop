var axios = require('axios');
var cheerio = require('cheerio');
var magnet = require('magnet-uri');

var base = "http://eztv.ag";

const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

module.exports = {};
module.exports.series = function getSeries() {
  return axios.get(base + '/showlist/')
    .then((response) => {
      var $ = cheerio.load(response.data);
      var series = [];

      $('.forum_header_border .thread_link').each(function(i, elem) {
        var slug = $(this).attr('href');
        var title = $(this).text();
        series.push({title: title, slug: slug});
      });

      return series;
    });
};

function grabTorrents(response) {
  let $ = cheerio.load(response.data);
  let torrents = [];
  $('table tr.forum_header_border').each(function(i, elem) {
    let el = cheerio.load(elem);
    torrents.push({
      category:"Vidéo",
      provider:"EZTV",
      name: el(".epinfo").text(),
      magnet: el(".magnet").attr('href'),
      seeds: 0,
      peers:0,
      size: el(".forum_thread_post:nth-last-child(3)").text()
    });
  });
  return torrents;
}

module.exports.seriesTorrents = function getTorrents(show) {
  return axios.get(base + show.slug).then(grabTorrents);
};

module.exports.search = function search(query) {
  return axios.get(base + '/search/' + encodeURIComponent(query)).then(grabTorrents);
};

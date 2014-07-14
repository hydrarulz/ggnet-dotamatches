// Generated by CoffeeScript 1.7.1
var dommer, extract_data, fs, links_data, moment, process_link;

dommer = require('./dommer.js');

moment = require('moment');

fs = require('fs');

extract_data = function($element, window, game, time_relative) {
  var increment, index, match, matches, now, team1, team2, time, time_part, tr, type, _i, _j, _len, _len1, _ref, _ref1;
  matches = [];
  _ref = $element.find('tr');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    tr = _ref[_i];
    index = 0;
    team1 = window.$(window.$(tr).find('span').get(0)).text().trim();
    team2 = window.$(window.$(tr).find('span').get(6)).text().trim();
    time = window.$(window.$(tr).find('span').get(9)).text().trim();
    match = {
      'team1': team1,
      'team2': team2,
      'game': game,
      'when': time_relative
    };
    if ((!time.match(/Show/)) && (time !== '')) {
      now = moment();
      _ref1 = time.split(' ');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        time_part = _ref1[_j];
        increment = time_part.match(/\d*/)[0];
        type = time_part.match(/[a-z]/)[0];
        now.add(type, increment);
      }
      match.time = now.unix();
    }
    matches.push(match);
  }
  return matches;
};

links_data = [
  {
    game: 'Dota 2',
    link: 'http://www.gosugamers.net/dota2/gosubet'
  }, {
    game: 'League of Legends',
    link: 'http://www.gosugamers.net/lol/gosubet'
  }, {
    game: 'Hearthstone',
    link: 'http://www.gosugamers.net/hearthstone/gosubet'
  }
];

process_link = function() {
  var game, link, _ref;
  console.log(links_data.length);
  if (!links_data.length) {
    return false;
  }
  _ref = links_data.pop(), game = _ref.game, link = _ref.link;
  return (function(game, link) {
    return dommer.prepare(link, function(error, window) {
      var $box, box, matches, _i, _len, _ref1;
      matches = [];
      _ref1 = window.$('.box');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        box = _ref1[_i];
        $box = window.$(box);
        if ($box.find('h2:contains(Live Matches)').length) {
          console.log('Processing live');
          matches.push(extract_data($box, window, game, 'live'));
        }
        if ($box.find('h2:contains(Upcoming Matches)').length) {
          console.log('Processing upcoming');
          matches.push(extract_data($box, window, game, 'upcoming'));
        }
        if ($box.find('h2:contains(Recent Results)').length) {
          console.log('Processing past');
          matches.push(extract_data($box, window, game, 'past'));
        }
      }
      console.log("Writing to file ./jsons/" + game + ".json");
      fs.writeFileSync("./jsons/" + game + ".json", JSON.stringify(matches, void 0, 2));
      return setTimeout(process_link, 1000 * 5);
    });
  })(game, link);
};

setTimeout(process_link, 1000 * 5);
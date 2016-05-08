var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

console.log('kick it');

$(function(){
  init();
});

var Show = React.createClass({
  render: function() {
    return <li><a href={this.props.venue}>{this.props.name}</a></li>;
  }
});

var Song = React.createClass({
  render: function(){
    return <iframe src="https://embed.spotify.com/?uri={this.props.uri}" width="300" height="80" frameborder="0" allowtransparency="true" />;
  }
});

var ShowList = React.createClass({
  render: function(){
    var shows = [];
    this.props.shows.forEach(function(show){
      shows.push(<Show key={show.id} venue={show.venue.uri} name={show.displayName}/>);
    });
    return <ul>{shows}</ul>;
  }
});

var SearchBox = React.createClass({
  search: function(event){
    if(event.keyCode === 13){
      $.ajax({
        method: 'get',
        url: '/shows',
        data: {
          search : this.refs.citySearch.value
        },
        success: function(response){
          var data = JSON.parse(response);
          ReactDOM.render(
            <ShowList shows={data.shows}/>,
            document.getElementById('showsContainer')
          );
          setCreatePlaylistHandler(data.songs);
        }
      });
    }
  },
  render: function(){
    return <input type="text" id="city-search" placeholder="city" onKeyDown={this.search} ref="citySearch"/>;
  }
});

function setCreatePlaylistHandler(songs){
  $('#create-playlist').click(function(e){
    e.preventDefault();
    var songs = songs.slice(0, 99);
    createPlaylist('some test playlist weeeee', function(id){
      addTracks(id, testSongs);
    });
  });
}

function createPlaylist(name, callback){
  $.ajax({
    method: 'post',
    url: '/spotify/playlist/create',
    data: {name: name},
    success: function(response) {
            var data = JSON.parse(response);
            console.log("createPlaylist response: ", data);
            callback(data.id);
    }
  });
}

function addTracks(id, tracks){
  $.ajax({
    method: 'post',
    url: '/spotify/playlist/add_tracks',
    data: {playlist_id: id, tracks: tracks},
    success: function(response){
      console.log('addTracks Response: ', response);
    }
  });
}

function init(){
  if(document.getElementById('searchContainer')){
    ReactDOM.render(
      <SearchBox/>,
      document.getElementById('searchContainer')
    );
  }
}

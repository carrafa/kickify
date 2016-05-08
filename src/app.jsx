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

var ShowList = React.createClass({
  render: function(){
    var shows = [];
    this.props.shows.forEach(function(show){
      shows.push(<Show key={show.id} venue={show.venue.uri} name={show.displayName}/>);
    });
    return <ul>{shows}</ul>;
  }
});

var Song = React.createClass({
  render: function(){
    return <li><iframe src={"https://embed.spotify.com/?uri=" + this.props.uri} width="300" height="80" frameborder="0" allowtransparency="true" /></li>;
  }
});

var SongList = React.createClass({
  render: function(){
    var songs = [];
    this.props.songs.forEach(function(song, i){
      songs.push(<Song key={i} artist={song.artist} showId={song.show_id} uri={song.uri}/>);
    });
    return <ul>{songs}</ul>;
  }
});

var SearchBox = React.createClass({
  getInitialState: function(){
    return {search: ''};
  },
  handleChange: function(e){
    this.setState({ search: e.target.value });
  },
  onKeyDown: function(e){
    if(e.keyCode === 13){
      var search = this.state.search;
      this.reset();
      $.ajax({
        method: 'get',
        url: '/shows',
        data: {
          search : search
        },
        success: function(response){
          var data = JSON.parse(response);
          ReactDOM.render(
            <ShowList shows={data.shows}/>,
            document.getElementById('showsContainer')
          );
          ReactDOM.render(
            <SongList songs={data.songs}/>,
            document.getElementById('songsContainer')
          );
          setCreatePlaylistHandler(data.songs);
        }
      });
    }
  },
  reset: function(){
    this.setState({search: ''});
  },
  render: function(){
    return <input type="text" 
      id="city-search" 
      placeholder="city" 
      value={this.state.inputValue}
      onChange={this.handleChange}
      onKeyDown={this.onKeyDown} 
      />;
  }
});

// ---------- create playlist stuff, will move to react eventually -----------
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

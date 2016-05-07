console.log('kick it');

$(function(){
  setSearchHandler();
});

function setCreatePlaylistHandler(songs){
  $('#create-playlist').click(function(e){
    e.preventDefault();
    var testSongs = songs.slice(0, 99);
    createPlaylist('some test playlist weeeee', function(id){
      addTracks(id, testSongs);
    });
  });
}

function testPlaylistFunction(){
  var songs = ["spotify:track:1OpFBWPdQCLRB8nopHBKKV",
    "spotify:track:6XpoMBnB85QhDhZGfBBlGk",
    "spotify:track:6bwtSNhG9epzg009Z51ZBH",
    "spotify:track:3UPyOgHTlnGeP9i5V44TbN",
    "spotify:track:4LitpYU9EPKY8AASdLmVWz",
    "spotify:track:7EZCY0KExBJmL6FYyDBZDL",
    "spotify:track:3ZzTDUe3NLWYNgfIMsFuzL",
    "spotify:track:36hJ73nr0vFPk3ZBIGlrBJ",
  "spotify:track:3jWS4SNsT0OYbMaLFNUY62"].join();
  console.log("songs: ", songs);
  createPlaylist('ramen dance party', function(id){
    addTracks(id, songs);
  });
}

function getUserId(callback){
  var accessToken = getAccessToken();
  $.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
           'Authorization': 'Bearer ' + accessToken
    },
    success: function(response) {
           callback(response.id);
    }
  });
}

function getPlaylists(user_id){
  $.ajax({
    url: '/spotify/playlists/',
    success: function(response) {
            console.log(response);
    }
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

function setSearchHandler(){
  $('#city-search').on('keydown', function(e){
    if(e.keyCode === 13){
      search = $('#city-search').val();
      e.preventDefault();
      getShows(search);
      $('#city-search').val('');
    }
  });
  
  $('#artist-search').on('keydown', function(e){
    if(e.keyCode === 13){
      search = $('#artist-search').val();
      e.preventDefault();
      getArtists(search);
      $('#artist-search').val('');
    }
  });

}

function getShows(search){

  $.ajax({
    method: 'get',
    url: '/shows',
    data: {
      search : search
    },
    success: function(response){

      var data = JSON.parse(response);
      var showsCollection = new Kickify.Collections.Shows(data.shows);
      var showsView = new Kickify.Views.Shows({collection: showsCollection});

      setCreatePlaylistHandler(data.songs);
      $('#showsContainer').html(showsView.render().el);
    }
  });

}

function getArtists(search){

  $.ajax({
    method: 'get',
    url: '/artists',
    data: {
      search: search
    },
    success: function(response){
               var songs = JSON.parse(response);
               var songsCollection = new Kickify.Collections.Songs(songs);
               var songsView = new Kickify.Views.Songs({collection: songsCollection});

               $('#songsContainer').html(songsView.render().el);
    }
  });
}

//------------------ backbone --------------------
(function(){
  window.Kickify = {
    Models: {},
    Collections: {},
    Views: {}
  };
  window.template = function(id){
    return _.template( $('#' + id).html() );
  };

  //------------------ models --------------------
  Kickify.Models.Show = Backbone.Model.extend({
  });

  Kickify.Models.Song = Backbone.Model.extend({
  });

  //------------------ collections --------------------
  Kickify.Collections.Shows = Backbone.Collection.extend({
    model: Kickify.Models.Show
  });

  Kickify.Collections.Songs = Backbone.Collection.extend({
    model: Kickify.Models.Song
  });

  //------------------ views --------------------
  Kickify.Views.Shows = Backbone.View.extend({
    tagName: 'ul',
    initialize: function(){
    },
    render: function(){
              this.collection.each( function(show){
                var showView = new Kickify.Views.Show({model: show});
                this.$el.append(showView.render().el);
              }, this);
              
              return this;
    }

  });

  Kickify.Views.Show = Backbone.View.extend({
    tagName: 'li',
    className: 'show',
    template: template('showTemplate'),
    render: function(){
      this.$el.html( this.template(this.model.attributes) );
      return this;
    }
  });

  Kickify.Views.Songs = Backbone.View.extend({
    tagName: 'ul',
    render: function(){
              this.collection.each( function(song){
                var songView = new Kickify.Views.Song({ model: song });
                this.$el.append(songView.render().el);
              }, this);
              
              return this;
    }
  });

  Kickify.Views.Song = Backbone.View.extend({
    tagName: 'li',
    className: 'song',
    template: template('songTemplate'),
    render: function(){
      this.$el.html( this.template(this.model.attributes) );
      return this;
    }
  });


})();

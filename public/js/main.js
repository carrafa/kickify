console.log('kick it');

$(function(){
  setSearchHandler();

});

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

      var shows = JSON.parse(response);
      var showsCollection = new Kickify.Collections.Shows(shows);
      var showsView = new Kickify.Views.Shows({collection: showsCollection});

      console.log(shows)

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

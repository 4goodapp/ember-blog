// ------------------------
// Ember application object
// ------------------------
EmberBlog = Ember.Application.create({
  // Basic logging
  LOG_TRANSITIONS: true,
  // log when Ember generates a controller or a route from a generic class
  LOG_ACTIVE_GENERATION: true,
  // log when Ember looks up a template or a view
  LOG_VIEW_LOOKUPS: true,
  ready: function() {
    console.log('Ember is ready!');
  }
});

// Configure the Store to use the Fixture Adapter
EmberBlog.ApplicationAdapter = DS.FixtureAdapter.extend();

// A simple client-side model for a blog post
EmberBlog.BlogPost = DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string')
});

// Application Router
EmberBlog.Router.map(function() {
  this.resource('BlogPosts', { path: '/posts' }, function() {
    this.route('new');
  });
});

// BlogPosts Route retrieves all BlogPosts
EmberBlog.BlogPostsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('BlogPost');
  }
});

// BlogPosts New Route, creates a new BlogPost
EmberBlog.BlogPostsNewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('BlogPost');
  },
  actions: {
    save: function() {
      var route = this;
      this.get('currentModel').save().then(function(post) {
        route.transitionTo('BlogPosts.index');
      }, function(post) {  
        console.log('Error saving post: ' + post.get('title'));
        route.transitionTo('BlogPosts');
      });
    },
    cancel: function() {
      this.get('currentModel').deleteRecord();
      this.transitionTo('BlogPosts');
    }
  }
});

// Add some fixtures
EmberBlog.BlogPost.FIXTURES = [
  { id: '1', title: 'RWX Rocks!', body: "We're learning Ember" },
  { id: '2', title: 'HTML5 is here', body: '... to stay' },
  { id: '3', title: 'Groovy or Ruby?', body: 'Which one to choose?' },
  { id: '4', title: 'Is Maven making you angry?', body: 'Try Gradle!'}
];


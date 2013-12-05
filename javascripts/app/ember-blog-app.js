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
  body: DS.attr('string'),
  comments: DS.hasMany('BlogPostComment', {async:true})
});

// A BlogPost HAS MANY BlogPostComments and a BlogPostComment BELONGS TO a BlogPost
EmberBlog.BlogPostComment = DS.Model.extend({
  post: DS.belongsTo('BlogPost'),
  body: DS.attr('string')
});

// Application Router
EmberBlog.Router.map(function() {
  this.resource('BlogPosts', { path: '/posts' }, function() {
    this.route('new');
  });
  this.resource('BlogPost', { path: '/posts/:post_id' }, function() {
    this.resource('comments', function() {
      this.route('new');
    });
    this.route('comment', { path: 'comments/:comment_id' });
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

// BlogPost 'show' Route 
EmberBlog.BlogPostRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('BlogPost', params.post_id);
  }
});

// Index controller
EmberBlog.IndexController = Ember.Controller.extend({
  postsCount: 0,
  init: function() {
    cntrl = this;
    this.store.find('BlogPost').then(function(posts) {
      cntrl.set('postsCount', posts.get('length'));
    });
  }
});

// New Comment
EmberBlog.CommentsNewRoute = Ember.Route.extend({
  // http://emberjs.com/guides/routing/setting-up-a-controller/    
  setupController: function(controller, model) {
    controller.set('body', null);
  }  
});

// Comments New Controller
EmberBlog.CommentsNewController = Ember.ObjectController.extend({
  // http://emberjs.com/guides/controllers/dependencies-between-controllers/
  needs: 'BlogPost',
  body: null,
 
  actions: {
    save: function() {
      var post = this.get('controllers.BlogPost.content');
      var comment = this.store.createRecord('BlogPostComment', { post: post, body: this.get('body') });
      comment.save().then(function(comment) {
        post.get('comments').pushObject(comment);
      });
      this.get('target').transitionTo('BlogPost.index');
    }
  }
});

// Add some fixtures
EmberBlog.BlogPost.FIXTURES = [
  { id: '1', title: 'RWX Rocks!', body: "We're learning Ember", comments: ['1', '5'] },
  { id: '2', title: 'HTML5 is here', body: '... to stay', comments: ['2', '6'] },
  { id: '3', title: 'Groovy or Ruby?', body: 'Which one to choose?', comments: ['3', '7'] },
  { id: '4', title: 'Is Maven making you angry?', body: 'Try Gradle!', comments: ['4', '8'] }
];

EmberBlog.BlogPostComment.FIXTURES = [
  { id:"1", body: "First Comment" }, 
  { id:"2", body: "Second Comment" }, 
  { id:"3", body: "Third Comment" }, 
  { id:"4", body: "Fourth Comment" }, 
  { id:"5", body: "Fifth Comment" }, 
  { id:"6", body: "Sixth Comment" }, 
  { id:"7", body: "Seventh Comment" }, 
  { id:"8", body: "Eighth Comment" }
];


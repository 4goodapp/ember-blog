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

// A simple client-side model for a blog post
EmberBlog.BlogPost = DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string')
});


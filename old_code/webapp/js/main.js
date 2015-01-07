var app = app || {};

require.config({
    baseUrl: '/js',
    paths: {
        jquery: 'libs/jquery/jquery-2.1.3.min',
        underscore: 'libs/underscore/underscore-min',
        handlebars: 'libs/handlebars/handlebars-v2.0.0',
        backbone: 'libs/backbone/backbone-min',
        localstorage: 'libs/backbone/backbone.localStorage-min',
        text: 'libs/requirejs/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        handlebars: {
            deps: ['jquery'],
            exports: 'Handlebars'
        },
        localstorage: {
            deps: ['backbone'],
            exports: 'LocalStorage'
        }
    }
});

require(['backbone', 'views/app', 'collections/todos', 'routers/router'], function (Backbone, AppView, TodoCollection, Workspace) {
    app.Todos = new TodoCollection;
    app.Workspace = new Workspace;
    Backbone.history || (Backbone.history = new Backbone.History());
    Backbone.history.start({
        pushState: true,
        root: '/'
    });
    new AppView;
});

define(
    [
        'backbone'
    ],
    function (Backbone) {
        return Backbone.Router.extend({
            routes: {
                '*filter': 'setFilter'
            },
            setFilter: function (param) {
                console.log('Set filter: ' + param);
                app.TodoFilter = param;
                app.Todos.trigger('filter');
            }
        });
    }
);
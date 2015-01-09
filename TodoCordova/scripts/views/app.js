define(
    [
        'underscore',
        'backbone',
        'handlebars',
        'views/todo',
        'collections/todos',
        'text!templates/stats.html'
    ],
    function (_, Backbone, Handlebars, TodoView, TodoCollection, statsTemplate) {
        return Backbone.View.extend({
            el: "#todoapp",
            template: Handlebars.compile(statsTemplate),
            events: {
                'keypress #new-todo': 'createOnEnter',
                'click #clearCompleted': 'clearCompleted',
                'click #toggle-all': 'toggleAllComplete',
                'click #all-link': 'allLinkClicked',
                'click #active-link': 'activeLinkClicked',
                'click #completed-link': 'completedLinkClicked'
            },
            initialize: function () {
                this.allCheckbox = this.$('#toggle-all')[0];
                this.$input = this.$('#new-todo');
                this.$footer = this.$('#footer');
                this.$main = this.$('#main');
                this.$todo_list = this.$('#todo-list');

                this.listenTo(app.Todos, 'add', this.addOne);
                this.listenTo(app.Todos, 'reset', this.addAll);
                this.listenTo(app.Todos, 'change:completed', this.filterOne);
                this.listenTo(app.Todos, 'filter', this.filterAll);
                this.listenTo(app.Todos, 'all', this.render);

                app.Todos.fetch();
            },
            render: function () {
                var completed = app.Todos.completed().length;
                var remaining = app.Todos.remaining().length;
                if (app.Todos.length) {
                    this.$main.show();
                    this.$footer.show();
                    this.$footer.html(this.template({
                        single_remaining: remaining === 1,
                        completed: completed,
                        remaining: remaining
                    }));
                    this.$('#filters li a')
                        .removeClass('selected')
                        .filter('[href="/' + (app.TodoFilter || '') + '"]')
                        .addClass('selected');
                } else {
                    this.$main.hide();
                    this.$footer.hide();
                }
                this.allCheckbox.checked = !remaining;
            },
            addOne: function (todo) {
                var view = new TodoView({model: todo});
                this.$todo_list.append(view.render().el);
            },
            addAll: function () {
                this.$todo_list.html('');
                app.Todos.each(this.addOne, this);
            },
            filterOne: function (todo) {
                todo.trigger('visible');
            },
            filterAll: function () {
                app.Todos.each(this.filterOne, this);
            },
            newAttributes: function () {
                return {
                    title: this.$input.val().trim(),
                    order: app.Todos.nextOrder(),
                    completed: false
                };
            },
            createOnEnter: function (event) {
                if (event.which != 13 || !this.$input.val().trim()) return;
                app.Todos.create(this.newAttributes());
                this.$input.val('');
            },
            clearCompleted: function () {
                _.invoke(app.Todos.completed(), 'destroy');
                return false;
            },
            toggleAllComplete: function () {
                var completed = this.allCheckbox.checked;
                app.Todos.each(function (todo) {
                    todo.save({
                        completed: completed
                    });
                });
            },
            allLinkClicked: function (e) {
                this.linkClicked(e, '');
            },
            activeLinkClicked: function (e) {
                this.linkClicked(e, 'active');
            },
            completedLinkClicked: function (e) {
                this.linkClicked(e, 'completed');
            },
            linkClicked: function (e, param) {
                console.log('Linkclicked called');
                e.preventDefault();
                app.Workspace.navigate('/' + param, { trigger: true });
            }
        });
    }
);
/**
 * Created by guldan on 1/6/15.
 */

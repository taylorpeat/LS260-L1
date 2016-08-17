var App = {
  init: function() {
    this.bind();
  },
  bind: function() {
    $("main").on("submit", "form", function(e) {
      e.preventDefault();

      this.newTodo(e);
      e.target.reset();
    }.bind(this) );

    $("#todos").on("blur", "input", this.rerenderTodo.bind(this));

    $("#clear").on("click", this.clearComplete.bind(this)); 
  },
  newTodo: function(e) {
    var todo_name = $(e.target).find("input").val(),
        model,
        view;

    if (!todo_name) { return; }

    model = this.todos.add({
      name: todo_name,
      complete: false
    });

    view = new this.TodoView(model);
    $("#todos").append(view.$el);
  },
  editTodo: function(e) {
    e.preventDefault();

    var $li = $(e.target).closest("li"),
        idx = +$li.attr("data-id"),
        todo,
        edit_li;
    todo = this.todos.models.filter(function(td) {
      return td.id === idx;
    })[0];
    edit_li = templates.todo_edit(todo.attributes);
    $li.replaceWith(edit_li);
    $li.remove();
    $("li input")[0].focus();
  },
  rerenderTodo: function(e) {
    var $li = $(e.target).closest("li"),
        idx = +$li.attr("data-id"),
        todo,
        name;

    todo = this.todos.models.filter(function(td) {
      return td.id === idx;
    })[0];

    name = e.target.value;

    todo.set("name", name);
    $li.after(todo.view.$el);
    $li.remove();
    $(e.target).off(e);
  },
  toggleComplete: function(e) {
    var $li = $(e.target).closest("li"),
        idx = +$li.attr("data-id"),
        todo;

    todo = this.todos.models.filter(function(td) {
      return td.id === idx;
    })[0];

    if (todo.attributes.complete) {
      todo.set("complete", false);
      $li.removeClass("complete");
    } else {
      todo.set("complete", true);
      $li.addClass("complete");
    }
    return false;
  },
  clearComplete: function(e) {
    var completed = this.todos.models.filter(function(td) {
      return td.attributes.complete;
    });
    completed.forEach(function(td) {
      App.todos.remove(td.id);
    });
  }
};

var templates = {};

$( "[type='text/x-handlebars']" ).each(function( template ) {
  var $t = $(this);
  templates[$t.attr("id")] = Handlebars.compile($t.html());
});

App.TodoConstructor = new ModelConstructor();

App.TodosConstructor = new CollectionConstructor();

App.todos = new App.TodosConstructor(App.TodoConstructor);

App.TodoView = new ViewConstructor({
  tag_name: "li",
  template: templates.todo,
  events: {
    "click": App.editTodo.bind(App),
    "click a.toggle": App.toggleComplete.bind(App),
    "blur input": App.rerenderTodo.bind(App)
  }
});

App.init();




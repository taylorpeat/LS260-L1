var App = {};

var templates = {};

$( "[type='text/x-handlebars']" ).each(function( template ) {
  var $t = $(this);
  templates[$t.attr("id")] = Handlebars.compile($t.html());
});

App.TodoConstructor = new ModelConstructor();

App.TodosConstructor = new CollectionConstructor();

App.todos = new App.TodosConstructor(App.TodoConstructor);

$("form").on("submit", function(e) {
  e.preventDefault();

  var todo_name = $(this).find("input").val();
  App.todos.add({ name: todo_name });
});




$(function() {
  var events_template = Handlebars.compile($("#events").html()),
      event_template = Handlebars.compile($("#event").html());

  Handlebars.registerPartial("event", $("#event").html());

  var events = {
    render: function(events) {
      $("#events_list").html(events_template(events));
    }
  }

  $.ajax({
    url: "/events",
    success: function(stored_events) {

    }
  });
})


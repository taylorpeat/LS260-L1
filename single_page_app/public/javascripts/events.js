$(function() {
  var events_template = Handlebars.compile($("#events").html()),
      event_template = Handlebars.compile($("#event").html());

  Handlebars.registerPartial("event", $("#event").html());

  var events = {
    collection: [],
    add: function(newEvents) {
      if (!Array.isArray(newEvents)) { newEvents = [newEvents] }
      newEvents.forEach(function(evnt) {
        this.collection.push(evnt);
      }.bind(this));
      this.collection.sort(this.sortByDate);
      this.render();
    },
    remove: function(id) {
      this.collection = this.collection.filter(function(event) {
          return event.id !== id;
        });
      this.render();
    },
    render: function() {
      $("#events_list").html(events_template({ events: this.collection }));
    },
    sortByDate: function(a, b) {
      return a.date - b.date;
    }
  }

  $.ajax({
    url: "/events",
    success: function(storedEvents) {
      events.add(storedEvents);
    }
  });

  $("input[type='submit']").on("click", function(e) {
    e.preventDefault();

    var $f = $("form");

    $.ajax({
      url: $f.attr("action"),
      type: $f.attr("method"),
      data: $f.serialize(),
      success: function(event) {
        events.add(event);
      }
    });
  });

  $("#events_list").on("click", "a", function(e) {
    e.preventDefault();

    var id = $(e.target).closest("li").data("id");

    $.ajax({
      url: "/events/delete",
      type: "POST",
      data: { id: id },
      success: function() {
        events.remove(id); 
      }
    })
  });
})


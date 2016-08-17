function ModelConstructor(options) {
  var id_count = 1;

  function Model(attr) {
    this.attributes = attr || {};
    this.id = id_count;
    this.attributes.id = id_count;
    id_count++;
  }

  Model.prototype = {
    __events: [],
    __remove: function() {},
    set: function(propName, value) {
      this.attributes[propName] = value;
      this.triggerChange();
    },
    get: function(propName) {
      return this.attributes[propName]
    },
    triggerChange: function() {
      this.__events.forEach(function(event) {
        event();
      });
    },
    addCallback: function(callback) {
      this.__events.push(callback);
    },
    remove: function(propName) {
      delete this.attributes[propName];
    }
  }
  
  if (options && options.change) { 
    if (!$.isArray(options.change)) {
      options.change = [options.change];
    }
    options.change.forEach(function(option) {
      if ($.isFunction(option)) {
        Model.prototype.__events.push(option);
      }
    });
  }

  $.extend( Model.prototype, options );
  return Model;

}

function CollectionConstructor(options) {

  var Collection = function(modelConstructor) {
    this.model = modelConstructor;
    this.models = [];
  }

  Collection.prototype = {
    reset: function() {
      this.models = [];
    },
    add: function(modelProps) {
      var matchingModel = this.models.find(function(md) {
          return md.id === modelProps.id;
        }),
        newModel;

      if (matchingModel) {
        return matchingModel;
      } else {
        newModel = new this.model(modelProps);
        this.models.push(newModel);
        return newModel;
      }
    },
    remove: function(model) {
      if (Number.isInteger(model)) {
        model_id = model;
        model = this.models.filter(function(md) {
          return md.id === model;
        })[0];
      } else {
        model_id = model.id;
      }

      if (this.models.some(function(md) {
          return md.id === model_id;
        } )) {
        this.models = this.models.filter(function(md) {
            return md.id !== model_id;
          });
      }

      model.remove();
      model.__remove();
    },
    set: function(collection) {
      if (!Array.isArray(collection)) {
        collection = [collection];
      }

      this.reset();
      
      collection.forEach( this.add.bind(this) );
    },
    get: function(modelID) {
      return this.models.find(function(md) {
        return md.id === modelID;
      });
    }
  }

  $.extend( Collection.prototype, options );

  return Collection;
}


function ViewConstructor(options) {
  var View = function(model) {
    this.model = model;
    this.model.view = this;
    this.$el = $("<" + this.tag_name + " data-id=" + this.model.id + " />", this.attributes);
    this.model.addCallback(this.render.bind(this));
    this.model.__remove = this.remove.bind(this);
    this.render();
  };

  View.prototype = {
    events: {},
    tag_name: "div",
    attributes: {},
    template: function() {},
    render: function() {
      this.$el.html(this.template(this.model.attributes))
      this.bindEvents();
      return this.$el;
    },
    remove: function() {
      this.unbindEvents();
      this.$el.remove();
    },
    bindEvents: function() {
      var eventItems,
          eventAction,
          eventSelector;
      for ( var eventName in this.events ) {
        eventItems = eventName.split(" ");
        eventAction = eventItems[0];

        if (eventItems[1]) { eventSelector = eventItems.slice(1).join(" "); }

        if (eventSelector) {
          this.$el.on(eventAction + ".view", eventSelector, this.events[eventName].bind(this) );
        } else { 
          this.$el.on(eventAction + ".view", this.events[eventName].bind(this) );
        }
        eventSelector = undefined;
      }
    },
    unbindEvents: function() {
      this.$el.off(".view");
    }
  };

  $.extend( View.prototype, options );

  return View;
}
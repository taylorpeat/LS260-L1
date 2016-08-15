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
      })
    },
    addCallback: function(callback) {
      this.__events.push(callback);
    },
    remove: function(propName) {
      delete this.attributes[propName];
    }
  }
  console.log(options);
  
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
  console.log(Model.prototype.__events);
  return Model;

}

  
function defineProperties(object) {
  for (let key in object) {
    if (object.hasOwnProperty(key) && key.startsWith('_')) {
      const newKey = key.replace('_', '')
      Object.defineProperty(object, newKey, {
        get: function() {
          return object[key]
        },
        set: function(v) {
          object[key] = v;
        }
      });
    }
  }
}

export default defineProperties;

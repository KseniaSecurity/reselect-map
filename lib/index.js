"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMapSelector = exports.createListSelector = exports.createObjectSelector = exports.createArraySelector = exports.mapMemoize = exports.listMemoize = exports.objectMemoize = exports.arrayMemoize = undefined;

var _reselect = require("reselect");

var _memoize = require("./memoize");

var arrayMemoize = exports.arrayMemoize = function arrayMemoize(fn, equalityCheck) {
  return (0, _memoize.memoizeList)(fn, {
    equalityCheck: equalityCheck,
    mapper: function mapper(arr, callback) {
      var result = [];
      for (var i = 0; i < arr.length; i++) {
        result[i] = callback(arr[i]);
      }
      return result;
    }
  });
};

var objectMemoize = exports.objectMemoize = function objectMemoize(fn, equalityCheck) {
  return (0, _memoize.memoizeMap)(fn, {
    equalityCheck: equalityCheck,
    unique: true,
    mapper: function mapper(obj, callback) {
      var result = {};
      Object.keys(obj).forEach(function (key) {
        var value = callback(key, obj[key]);
        if (!!value) result[key] = value;
      });
      return result;
    }
  });
};

var listMemoize = exports.listMemoize = function listMemoize(fn, equalityCheck) {
  return (0, _memoize.memoizeList)(fn, {
    equalityCheck: equalityCheck,
    mapper: function mapper(mapable, callback) {
      return mapable.map(callback);
    }
  });
};

var mapMemoize = exports.mapMemoize = function mapMemoize(fn, equalityCheck) {
  return (0, _memoize.memoizeMap)(fn, {
    equalityCheck: equalityCheck,
    mapper: function mapper(mapable, callback) {
      return mapable.map(function (v, k) {
        return callback(k, v);
      });
    }
  });
};

// reselect's createSelectorCreator will use the passed memoization function
// for wrapping the result function, but will also (as of v4.0.0) use it to
// memoize the actual selector. Unfortunately our specialized mapped
// memoization functions won't work for general purpose memoization, so this
// breaks.
//
// At the time of writing (reselect v4.0.0) the memoizeOptions passed to
// createSelectorCreator are _only_ passed through to the memoize that wraps
// the result func. We can use this param to determine whether to use our
// special memoize, or to use reselect's defaultMemoize.
//
// In this way we make createSelectorCreator use our mapped memoize for
// wrapping the result func and defaultMemoize for wrapping the selector. It
// sucks that we're relying on an implementation detail but I'll be back to fix
// this code again whenever it breaks :)
function createMappedSelectorCreator(memoize) {
  return (0, _reselect.createSelectorCreator)(function (fn, mapmem) {
    if (mapmem === true) {
      return memoize(fn);
    } else {
      return (0, _reselect.defaultMemoize)(fn);
    }
  }, true);
}

var createArraySelector = exports.createArraySelector = createMappedSelectorCreator(arrayMemoize);
var createObjectSelector = exports.createObjectSelector = createMappedSelectorCreator(objectMemoize);
var createListSelector = exports.createListSelector = createMappedSelectorCreator(listMemoize);
var createMapSelector = exports.createMapSelector = createMappedSelectorCreator(mapMemoize);
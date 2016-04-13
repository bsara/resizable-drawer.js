/*!
 * resizable-drawer.js (1.0.0-beta.7)
 *
 * Copyright (c) 2016 Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/resizable-drawer.js/blob/master/LICENSE.md)
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ResizableDrawer = mod.exports.default;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  exports.default = function () {

    // region Private Constants

    var DRAG_ICON = document.createElement('img');

    // endregion

    // region Private Property WeakMaps

    var _events = new WeakMap();

    var _$el = new WeakMap();
    var _$content = new WeakMap();
    var _$handle = new WeakMap();

    var _contentMinHeight = new WeakMap();
    var _contentOriginalHeight = new WeakMap();
    var _contentStartHeight = new WeakMap();
    var _contentStartScrollTop = new WeakMap();

    var _cursorStartPosY = new WeakMap();

    var _isEnabled = new WeakMap();
    var _isOpen = new WeakMap();

    var _isNotDestroyed = new WeakMap();

    var _boundOnScrollContentWhileDragging = new WeakMap();

    var _boundOnDragStart = new WeakMap();
    var _boundOnDrag = new WeakMap();
    var _boundOnDragEnd = new WeakMap();

    var _boundOnTouchStart = new WeakMap();
    var _boundOnTouchMove = new WeakMap();
    var _boundOnTouchEnd = new WeakMap();

    // endregion

    /**
     * TODO: Add description
     *
     * @class
     */

    var ResizableDrawer = function () {

      /**
       * @param {Object|HTMLElement} options - TODO: Add description
       *
       * @param {HTMLElement} options.el                      - TODO: Add description
       * @param {Number}      [options.contentOriginalHeight] - TODO: Add description
       * @param {Number}      [options.contentMinHeight = 0]  - TODO: Add description
       * @param {Boolean}     [options.startEnabled = true]   - TODO: Add description
       * @param {Boolean}     [options.startOpen = true]      - TODO: Add description
       *
       * @throws {TypeError} If `el` is not given and options is not of type `HTMLElement`.
       *
       * @constructor
       */

      function ResizableDrawer(_ref) {
        var el = _ref.el;
        var contentOriginalHeight = _ref.contentOriginalHeight;
        var _ref$contentMinHeight = _ref.contentMinHeight;
        var contentMinHeight = _ref$contentMinHeight === undefined ? 0 : _ref$contentMinHeight;
        var _ref$startEnabled = _ref.startEnabled;
        var startEnabled = _ref$startEnabled === undefined ? true : _ref$startEnabled;
        var _ref$startOpen = _ref.startOpen;
        var startOpen = _ref$startOpen === undefined ? true : _ref$startOpen;

        _classCallCheck(this, ResizableDrawer);

        if (new.target == null) {
          return new ResizableDrawer.apply(this, arguments);
        }

        if (arguments.length > 0 && arguments[0] instanceof HTMLElement) {
          el = arguments[0];
        } else if (el == null || ~(el instanceof HTMLElement)) {
          throw new ReferenceError('\'el\' is a required parameter and must be of type \'HTMLElement\' when creating a new \'ResizableDrawer\'!');
        }

        _isNotDestroyed.set(this, true);

        this.contentMinHeight = contentMinHeight;

        _events.set(this, {});

        _$el.set(this, el);
        _$content.set(this, this.$el.querySelector('.resizable-drawer-content'));
        _$handle.set(this, this.$el.querySelector('.resizable-drawer-handle'));

        _boundOnDragStart.set(this, _onDragStart.bind(this));
        _boundOnDrag.set(this, _onDrag.bind(this));
        _boundOnDragEnd.set(this, _onDragEnd.bind(this));

        _boundOnTouchStart.set(this, _onTouchStart.bind(this));
        _boundOnTouchMove.set(this, _onTouchMove.bind(this));
        _boundOnTouchEnd.set(this, _onTouchEnd.bind(this));

        if (startEnabled) {
          this.enable(true);
        } else {
          _isEnabled.set(this, false);
        }

        if (startOpen) {
          this.open(true);
        } else {
          _isOpen.set(this, false);
        }
      }

      /**
       * Opens the drawer (only has any effect if a specific `contentMinHeight`
       * is given upon object creation).
       *
       * @param {Boolean} [silent = false] - TODO: Add description
       */


      _createClass(ResizableDrawer, [{
        key: 'open',
        value: function open(silent) {
          if (this.isDestroyed) {
            return;
          }

          var $content = _$content.get(this);

          $content.style.height = '';
          $content.style.padding = '';
          $content.style.border = '';
          $content.style.overflow = '';

          _isOpen.set(this, true);

          if (!silent) {
            _triggerEvent.call(this, 'open');
          }
        }

        /**
         * Closes the drawer.
         *
         * @param {Boolean} [silent = false] - TODO: Add description
         */

      }, {
        key: 'close',
        value: function close(silent) {
          if (this.isDestroyed) {
            return;
          }

          var $content = _$content.get(this);

          $content.style.height = '0';
          $content.style.padding = '0';
          $content.style.border = 'none';
          $content.style.overflow = 'hidden';

          _isOpen.set(this, false);

          if (!silent) {
            _triggerEvent.call(this, 'close');
          }
        }

        /**
         * Toggles the drawer to be open if it is closed, and closed
         * if it is open.
         *
         * @param {Boolean} [silent = false] - TODO: Add description
         */

      }, {
        key: 'toggleOpenClosed',
        value: function toggleOpenClosed(silent) {
          if (this.isDestroyed) {
            return;
          }

          if (this.isOpen) {
            this.close(silent);
            return;
          }
          this.open(silent);
        }

        /**
         * Enables the resizable functionality of the drawer.
         *
         * @param {Boolean} [silent = false] - TODO: Add description
         */

      }, {
        key: 'enable',
        value: function enable(silent) {
          if (this.isDestroyed) {
            return;
          }

          var $handle = _$handle.get(this);

          $handle.addEventListener('dragstart', _boundOnDragStart.get(this));
          $handle.addEventListener('drag', _boundOnDrag.get(this));
          $handle.addEventListener('dragend', _boundOnDragEnd.get(this));

          $handle.addEventListener('touchstart', _boundOnTouchStart.get(this));
          $handle.addEventListener('touchmove', _boundOnTouchMove.get(this));
          $handle.addEventListener('touchend', _boundOnTouchEnd.get(this));

          $handle.setAttribute('draggable', true);

          _isEnabled.set(this, true);

          if (!silent) {
            _triggerEvent.call(this, 'enable');
          }
        }

        /**
         * Disables the resizable functionality of the drawer.
         *
         * @param {Boolean} [silent = false] - TODO: Add description
         */

      }, {
        key: 'disable',
        value: function disable(silent) {
          if (this.isDestroyed) {
            return;
          }

          var $handle = _$handle.get(this);

          $handle.removeAttribute('draggable');

          $handle.removeEventListener('dragstart', _boundOnDragStart.get(this));
          $handle.removeEventListener('drag', _boundOnDrag.get(this));
          $handle.removeEventListener('dragend', _boundOnDragEnd.get(this));

          $handle.removeEventListener('touchstart', _boundOnTouchStart.get(this));
          $handle.removeEventListener('touchmove', _boundOnTouchMove.get(this));
          $handle.removeEventListener('touchend', _boundOnTouchEnd.get(this));

          _isEnabled.set(this, false);

          if (!silent) {
            _triggerEvent.call(this, 'disable');
          }
        }

        /**
         * Toggles the drawer to be enabled if it is disabled, and disabled
         * if it is enabled.
         *
         * @param {Boolean} [silent = false] - TODO: Add description
         */

      }, {
        key: 'toggleEnabled',
        value: function toggleEnabled(silent) {
          if (this.isDestroyed) {
            return;
          }

          if (this.isEnabled) {
            this.disable(silent);
            return;
          }
          this.enable(silent);
        }

        /**
         * Destroys this object, removing all changes it has made to all DOM elements
         * and clearing up all memory that it was using.
         *
         * *WARNING:* Calling this function will result in the object becoming unusable!
         * If you want to just disable the resizable functionality temporarily, use the
         * `disable` & `enable` functions.
         *
         * @param {Boolean} [silent = false] - TODO: Add description
         */

      }, {
        key: 'destroy',
        value: function destroy(silent) {
          if (this.isDestroyed) {
            return;
          }

          this.disable(true);

          _isNotDestroyed.delete(this);

          _$content.get(this).removeEventListener('scroll', _boundOnScrollContentWhileDragging.get(this));

          _$el.delete(this);
          _$content.delete(this);
          _$handle.delete(this);

          _contentMinHeight.delete(this);
          _contentOriginalHeight.delete(this);
          _contentStartHeight.delete(this);
          _contentStartScrollTop.delete(this);

          _cursorStartPosY.delete(this);

          _boundOnScrollContentWhileDragging.delete(this);

          _boundOnDragStart.delete(this);
          _boundOnDrag.delete(this);
          _boundOnDragEnd.delete(this);

          _boundOnTouchStart.delete(this);
          _boundOnTouchMove.delete(this);
          _boundOnTouchEnd.delete(this);

          if (!silent) {
            _triggerEvent.call(this, 'destroy');
          }

          _events.delete(this);
        }

        // region Getters/Setters

        /** @returns {HTMLElement} - The `HTMLElement` represented by this object. */

      }, {
        key: 'addEventListener',


        /**
         * TODO: Add description
         *
         * @param  {String}   eventName    - TODO: Add description
         * @param  {Function} eventHandler - TODO: Add description
         */
        value: function addEventListener(eventName, eventHandler) {
          var events = _events.get(this);
          var eventHandlers = events[eventName];

          if (eventHandlers == null) {
            eventHandlers = events[eventName] = new Set();
          }

          eventHandlers.add(eventHandler);
        }

        /**
         * TODO: Add description
         *
         * @param  {String}   eventName    - TODO: Add description
         * @param  {Function} eventHandler - TODO: Add description
         */

      }, {
        key: 'removeEventListener',
        value: function removeEventListener(eventName, eventHandler) {
          var events = _events.get(this);
          var eventHandlers = events[eventName];

          if (eventHandlers == null) {
            return;
          }

          eventHandlers.delete(eventHandler);

          if (eventHandlers.size === 0) {
            delete events[eventName];
          }
        }

        // endregion

      }, {
        key: '$el',
        get: function get() {
          return this.isDestroyed ? undefined : _$el.get(this);
        }

        /** @returns {Number} - The "original" height of the drawer content element (in pixels). */

      }, {
        key: 'contentOriginalHeight',
        get: function get() {
          return this.isDestroyed ? undefined : _contentOriginalHeight.get(this);
        }

        /** @param {Number} value - The "original" height of the drawer contentElement (in pixels). */
        ,
        set: function set(value) {
          if (this.isDestroyed) {
            return;
          }

          if (typeof value !== 'number' && !(value instanceof Number)) {
            throw new TypeError('\'contentOriginalHeight\' must be a Number, but a ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ' was given.');
          }

          _contentOriginalHeight.set(this, value);
        }

        /** @returns {Number} - The minimum height of the drawer content element (in pixels). */

      }, {
        key: 'contentMinHeight',
        get: function get() {
          return this.isDestroyed ? undefined : _contentMinHeight.get(this);
        }

        /** @param {Number} value - The minimum height of the drawer contentElement (in pixels). */
        ,
        set: function set(value) {
          if (this.isDestroyed) {
            return;
          }

          if (typeof value !== 'number' && !(value instanceof Number)) {
            throw new TypeError('\'contentMinHeight\' must be a Number, but a ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ' was given.');
          }

          _contentMinHeight.set(this, value);
        }

        /** @returns {Boolean} */

      }, {
        key: 'isEnabled',
        get: function get() {
          return !this.isDestroyed && _isEnabled.get(this) === true;
        }

        /** @returns {Boolean} */

      }, {
        key: 'isOpen',
        get: function get() {
          return !this.isDestroyed && _isOpen.get(this) === true;
        }

        /** @returns {Boolean} */

      }, {
        key: 'isDestroyed',
        get: function get() {
          return _isNotDestroyed.get(this) !== true;
        }
      }]);

      return ResizableDrawer;
    }();

    /** @private */


    function _setupDrag(e) {
      var $content = _$content.get(this);
      var onScrollContentWhileDraggingFunc = _onScrollContentWhileDragging.bind(this);

      _contentStartHeight.set(this, $content.getBoundingClientRect().height);
      _contentStartScrollTop.set(this, $content.scrollTop);
      _cursorStartPosY.set(this, e.clientY);

      _boundOnScrollContentWhileDragging.set(this, onScrollContentWhileDraggingFunc);

      $content.addEventListener('scroll', onScrollContentWhileDraggingFunc);
    }

    /** @private */
    function _processDrag(e) {
      if (e.clientY < this.contentMinHeight) {
        return;
      }

      var moveDistance = e.clientY - _cursorStartPosY.get(this);

      _$content.get(this).style.height = _contentStartHeight.get(this) + moveDistance + 'px';
    }

    /** @private */
    function _teardownDrag() {
      _contentStartHeight.delete(this);
      _cursorStartPosY.delete(this);

      _$content.get(this).removeEventListener('scroll', _boundOnScrollContentWhileDragging.get(this));

      _boundOnScrollContentWhileDragging.delete(this);
    }

    /** @private */
    function _triggerEvent(eventName) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var eventHandlers = _events.get(this)[eventName];

      if (eventHandlers == null) {
        return;
      }

      eventHandlers.forEach(function (eventHandler) {
        Promise.resolve().then(function () {
          return eventHandler.apply(undefined, [_this].concat(args));
        });
      });
    }

    // region Event Handlers

    /** @private */
    function _onScrollContentWhileDragging(e) {
      e.preventDefault();
      _$content.get(this).scrollTop = _contentStartScrollTop.get(this);
    }

    /** @private */
    function _onDragStart(e) {
      if (e.dataTransfer != null) {
        e.dataTransfer.setDragImage(DRAG_ICON, -10, -10);
      }

      return _setupDrag.call(this, e);
    }

    /** @private */
    function _onDrag(e) {
      e.preventDefault();
      return _processDrag.call(this, e);
    }

    /** @private */
    function _onDragEnd() {
      return _teardownDrag.call(this);
    }

    /** @private */
    function _onTouchStart(e) {
      if (e.targetTouches.length > 1) {
        return;
      }

      return _setupDrag.call(this, e.targetTouches[0]);
    }

    /** @private */
    function _onTouchMove(e) {
      if (e.targetTouches.length > 1) {
        return;
      }

      e.preventDefault();

      return _processDrag.call(this, e.targetTouches[0]);
    }

    /** @private */
    function _onTouchEnd() {
      return _teardownDrag.call(this);
    }

    // endregion

    return ResizableDrawer;
  }();
});
//# sourceMappingURL=resizable-drawer.es5.js.map

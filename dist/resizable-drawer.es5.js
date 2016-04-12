/*!
 * resizable-drawer.js (1.0.0-alpha.0)
 *
 * Copyright (c) 2016 Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/resizable-drawer.js/blob/master/LICENSE.md)
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = function () {

  // region Private Constants

  var DRAG_ICON = document.createElement('img');

  // endregion

  // region Private Property WeakMaps

  var _$el = new WeakMap();
  var _$content = new WeakMap();
  var _$handle = new WeakMap();

  var _contentMinHeight = new WeakMap();
  var _contentOriginalHeight = new WeakMap();
  var _contentStartHeight = new WeakMap();
  var _contentStartScrollTop = new WeakMap();

  var _cursorStartPosY = new WeakMap();

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
     * [constructor description]
     * @param  {[type]} options.contentMinHeight [description]
     *
     * @throws {TypeError} If `el` is not given.
     *
     * @constructor
     */

    function ResizableDrawer(_ref) {
      var el = _ref.el;
      var contentOriginalHeight = _ref.contentOriginalHeight;
      var _ref$contentMinHeight = _ref.contentMinHeight;
      var contentMinHeight = _ref$contentMinHeight === undefined ? 0 : _ref$contentMinHeight;

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

      var boundOnDragStart = _onDragStart.bind(this);
      var boundOnDrag = _onDrag.bind(this);
      var boundOnDragEnd = _onDragEnd.bind(this);

      var boundOnTouchStart = _onTouchStart.bind(this);
      var boundOnTouchMove = _onTouchMove.bind(this);
      var boundOnTouchEnd = _onTouchEnd.bind(this);

      _boundOnDragStart.set(this, boundOnDragStart);
      _boundOnDrag.set(this, boundOnDrag);
      _boundOnDragEnd.set(this, boundOnDragEnd);

      _boundOnTouchStart.set(this, boundOnTouchStart);
      _boundOnTouchMove.set(this, boundOnTouchMove);
      _boundOnTouchEnd.set(this, boundOnTouchEnd);

      _$el.set(this, el);
      _$content.set(this, this.$el.querySelector('.resizable-drawer-content'));

      var $handle = this.$el.querySelector('.resizable-drawer-handle');

      _$handle.set(this, $handle);

      $handle.addEventListener('dragstart', boundOnDragStart);
      $handle.addEventListener('drag', boundOnDrag);
      $handle.addEventListener('dragend', boundOnDragEnd);

      $handle.addEventListener('touchstart', boundOnTouchStart);
      $handle.addEventListener('touchmove', boundOnTouchMove);
      $handle.addEventListener('touchend', boundOnTouchEnd);
    }

    _createClass(ResizableDrawer, [{
      key: 'destroy',
      value: function destroy() {
        _isNotDestroyed.delete(this);

        _$content.get(this).removeEventListener('scroll', _boundOnScrollContentWhileDragging.get(this));

        var $handle = _$handle.get(this);

        $handle.removeEventListener('dragstart', _boundOnDragStart.get(this));
        $handle.removeEventListener('drag', _boundOnDrag.get(this));
        $handle.removeEventListener('dragend', _boundOnDragEnd.get(this));

        $handle.removeEventListener('touchstart', _boundOnTouchStart.get(this));
        $handle.removeEventListener('touchmove', _boundOnTouchMove.get(this));
        $handle.removeEventListener('touchend', _boundOnTouchEnd.get(this));

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
      }

      // region Getters/Setters

      /** @returns {HTMLElement} - The `HTMLElement` represented by this object. */

    }, {
      key: '$el',
      get: function get() {
        return _$el.get(this);
      }

      /** @returns {Number} - The "original" height of the drawer content element (in pixels). */

    }, {
      key: 'contentOriginalHeight',
      get: function get() {
        return _contentOriginalHeight.get(this);
      }

      /** @param {Number} value - The "original" height of the drawer contentElement (in pixels). */
      ,
      set: function set(value) {
        if (typeof value !== 'number' && !(value instanceof Number)) {
          throw new TypeError('\'contentOriginalHeight\' must be a Number, but a ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ' was given.');
        }
        _contentOriginalHeight.set(this, value);
      }

      /** @returns {Number} - The minimum height of the drawer content element (in pixels). */

    }, {
      key: 'contentMinHeight',
      get: function get() {
        return _contentMinHeight.get(this);
      }

      /** @param {Number} value - The minimum height of the drawer contentElement (in pixels). */
      ,
      set: function set(value) {
        if (typeof value !== 'number' && !(value instanceof Number)) {
          throw new TypeError('\'contentMinHeight\' must be a Number, but a ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ' was given.');
        }
        _contentMinHeight.set(this, value);
      }

      /** @returns {Boolean} */

    }, {
      key: 'isDestroyed',
      get: function get() {
        return _isNotDestroyed.get(this) !== true;
      }

      // endregion

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

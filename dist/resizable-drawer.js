/*!
 * resizable-drawer.js (1.0.0-alpha.0)
 *
 * Copyright (c) 2016 Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/resizable-drawer.js/blob/master/LICENSE.md)
 */

export default (function() {

  // region Private Constants

  const DRAG_ICON = document.createElement('img');

  // endregion


  // region Private Property WeakMaps

  let _$el      = new WeakMap();
  let _$content = new WeakMap();
  let _$handle  = new WeakMap();

  let _contentMinHeight      = new WeakMap();
  let _contentOriginalHeight = new WeakMap();
  let _contentStartHeight    = new WeakMap();
  let _contentStartScrollTop = new WeakMap();

  let _cursorStartPosY = new WeakMap();

  let _isNotDestroyed = new WeakMap();

  let _boundOnScrollContentWhileDragging = new WeakMap();

  let _boundOnDragStart = new WeakMap();
  let _boundOnDrag      = new WeakMap();
  let _boundOnDragEnd   = new WeakMap();

  let _boundOnTouchStart = new WeakMap();
  let _boundOnTouchMove  = new WeakMap();
  let _boundOnTouchEnd   = new WeakMap();

  // endregion



  /**
   * TODO: Add description
   *
   * @class
   */
  class ResizableDrawer {

    /**
     * [constructor description]
     * @param  {[type]} options.contentMinHeight [description]
     *
     * @throws {TypeError} If `el` is not given.
     *
     * @constructor
     */
    constructor({el, contentOriginalHeight, contentMinHeight = 0}) {
      if (new.target == null) {
        return new ResizableDrawer.apply(this, arguments);
      }


      if (arguments.length > 0 && arguments[0] instanceof HTMLElement) {
        el = arguments[0];
      } else if (el == null || ~(el instanceof HTMLElement)) {
        throw new ReferenceError(`'el' is a required parameter and must be of type 'HTMLElement' when creating a new 'ResizableDrawer'!`);
      }


      _isNotDestroyed.set(this, true);


      this.contentMinHeight = contentMinHeight;


      let boundOnDragStart = _onDragStart.bind(this);
      let boundOnDrag      = _onDrag.bind(this);
      let boundOnDragEnd   = _onDragEnd.bind(this);

      let boundOnTouchStart = _onTouchStart.bind(this);
      let boundOnTouchMove  = _onTouchMove.bind(this);
      let boundOnTouchEnd   = _onTouchEnd.bind(this);

      _boundOnDragStart.set(this, boundOnDragStart);
      _boundOnDrag.set(this, boundOnDrag);
      _boundOnDragEnd.set(this, boundOnDragEnd);

      _boundOnTouchStart.set(this, boundOnTouchStart);
      _boundOnTouchMove.set(this, boundOnTouchMove);
      _boundOnTouchEnd.set(this, boundOnTouchEnd);


      _$el.set(this, el);
      _$content.set(this, this.$el.querySelector('.resizable-drawer-content'));


      let $handle = this.$el.querySelector('.resizable-drawer-handle');

      _$handle.set(this, $handle);

      $handle.addEventListener('dragstart', boundOnDragStart);
      $handle.addEventListener('drag', boundOnDrag);
      $handle.addEventListener('dragend', boundOnDragEnd);

      $handle.addEventListener('touchstart', boundOnTouchStart);
      $handle.addEventListener('touchmove', boundOnTouchMove);
      $handle.addEventListener('touchend', boundOnTouchEnd);
    }



    destroy() {
      _isNotDestroyed.delete(this);


      _$content.get(this).removeEventListener('scroll', _boundOnScrollContentWhileDragging.get(this));


      let $handle = _$handle.get(this);

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
    get $el() {
      return _$el.get(this);
    }


    /** @returns {Number} - The "original" height of the drawer content element (in pixels). */
    get contentOriginalHeight() {
      return _contentOriginalHeight.get(this);
    }


    /** @param {Number} value - The "original" height of the drawer contentElement (in pixels). */
    set contentOriginalHeight(value) {
      if (typeof value !== 'number' && !(value instanceof Number)) {
        throw new TypeError(`'contentOriginalHeight' must be a Number, but a ${typeof value} was given.`);
      }
      _contentOriginalHeight.set(this, value);
    }


    /** @returns {Number} - The minimum height of the drawer content element (in pixels). */
    get contentMinHeight() {
      return _contentMinHeight.get(this);
    }


    /** @param {Number} value - The minimum height of the drawer contentElement (in pixels). */
    set contentMinHeight(value) {
      if (typeof value !== 'number' && !(value instanceof Number)) {
        throw new TypeError(`'contentMinHeight' must be a Number, but a ${typeof value} was given.`);
      }
      _contentMinHeight.set(this, value);
    }


    /** @returns {Boolean} */
    get isDestroyed() {
      return (_isNotDestroyed.get(this) !== true);
    }

    // endregion
  }



  /** @private */
  function _setupDrag(e) {
    let $content                         = _$content.get(this);
    let onScrollContentWhileDraggingFunc = _onScrollContentWhileDragging.bind(this);

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

    let moveDistance = (e.clientY - _cursorStartPosY.get(this));

    _$content.get(this).style.height = ((_contentStartHeight.get(this) + moveDistance) + 'px');
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
})();

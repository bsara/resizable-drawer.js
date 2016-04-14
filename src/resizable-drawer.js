export default (function() {

  // region Private Constants

  const DRAG_ICON = document.createElement('img');

  const CSS_CLASS_CONTENT  = 'resizable-drawer-content';
  const CSS_CLASS_HANDLE   = 'resizable-drawer-handle';
  const CSS_CLASS_CLOSED   = 'resizable-drawer-closed';
  const CSS_CLASS_OPEN     = 'resizable-drawer-open';
  const CSS_CLASS_ENABLED  = 'resizable-drawer-enabled';
  const CSS_CLASS_DISABLED = 'resizable-drawer-enabled';

  // endregion


  // region Private Property WeakMaps

  let _events = new WeakMap();

  let _$el      = new WeakMap();
  let _$content = new WeakMap();
  let _$handle  = new WeakMap();

  let _contentMinHeight      = new WeakMap();
  let _contentOriginalHeight = new WeakMap();
  let _contentStartHeight    = new WeakMap();
  let _contentStartScrollTop = new WeakMap();

  let _cursorStartPosY = new WeakMap();

  let _isEnabled = new WeakMap();
  let _isOpen    = new WeakMap();

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
    constructor({el, contentOriginalHeight, contentMinHeight = 0, startEnabled = true, startOpen = true}) {
      if (new.target == null) {
        return new ResizableDrawer(...arguments);
      }


      if (arguments.length > 0 && arguments[0] instanceof HTMLElement) {
        el = arguments[0];
      } else if (el == null || !(el instanceof HTMLElement)) {
        throw new ReferenceError(`'el' is a required parameter and must be of type 'HTMLElement' when creating a new 'ResizableDrawer'!`);
      }


      _isNotDestroyed.set(this, true);


      this.contentMinHeight = contentMinHeight;


      _events.set(this, {});


      _$el.set(this, el);
      _$content.set(this, this.$el.querySelector(`.${CSS_CLASS_CONTENT}`));
      _$handle.set(this, this.$el.querySelector(`.${CSS_CLASS_HANDLE}`));


      _boundOnDragStart.set(this, _onDragStart.bind(this));
      _boundOnDrag.set(this, _onDrag.bind(this));
      _boundOnDragEnd.set(this, _onDragEnd.bind(this));

      _boundOnTouchStart.set(this, _onTouchStart.bind(this));
      _boundOnTouchMove.set(this, _onTouchMove.bind(this));
      _boundOnTouchEnd.set(this, _onTouchEnd.bind(this));



      if (startEnabled) {
        this.enable(true);
      } else {
        this.disable(true);
      }


      if (startOpen) {
        this.open(true);
      } else {
        this.close(true);
      }
    }



    /**
     * Opens the drawer (only has any effect if a specific `contentMinHeight`
     * is given upon object creation).
     *
     * @param {Boolean} [silent = false] - TODO: Add description
     */
    open(silent) {
      if (this.isDestroyed) {
        return;
      }

      _isOpen.set(this, true);

      this.$el.classList.remove(CSS_CLASS_CLOSED);
      this.$el.classList.add(CSS_CLASS_OPEN);

      if (!silent) {
        _triggerEvent.call(this, 'open');
      }
    }


    /**
     * Closes the drawer.
     *
     * @param {Boolean} [silent = false] - TODO: Add description
     */
    close(silent) {
      if (this.isDestroyed) {
        return;
      }

      _$content.get(this).style.height = '';

      _isOpen.set(this, false);

      this.$el.classList.remove(CSS_CLASS_OPEN);
      this.$el.classList.add(CSS_CLASS_CLOSED);

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
    toggleOpenClosed(silent) {
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
    enable(silent) {
      if (this.isDestroyed) {
        return;
      }


      let $handle = _$handle.get(this);

      $handle.addEventListener('dragstart', _boundOnDragStart.get(this));
      $handle.addEventListener('drag',      _boundOnDrag.get(this));
      $handle.addEventListener('dragend',   _boundOnDragEnd.get(this));

      $handle.addEventListener('touchstart', _boundOnTouchStart.get(this));
      $handle.addEventListener('touchmove',  _boundOnTouchMove.get(this));
      $handle.addEventListener('touchend',   _boundOnTouchEnd.get(this));

      $handle.setAttribute('draggable', true);


      _isEnabled.set(this, true);


      this.$el.classList.remove(CSS_CLASS_DISABLED);
      this.$el.classList.add(CSS_CLASS_ENABLED);


      if (!silent) {
        _triggerEvent.call(this, 'enable');
      }
    }


    /**
     * Disables the resizable functionality of the drawer.
     *
     * @param {Boolean} [silent = false] - TODO: Add description
     */
    disable(silent) {
      if (this.isDestroyed) {
        return;
      }


      let $handle = _$handle.get(this);

      $handle.removeAttribute('draggable');

      $handle.removeEventListener('dragstart', _boundOnDragStart.get(this));
      $handle.removeEventListener('drag',      _boundOnDrag.get(this));
      $handle.removeEventListener('dragend',   _boundOnDragEnd.get(this));

      $handle.removeEventListener('touchstart', _boundOnTouchStart.get(this));
      $handle.removeEventListener('touchmove',  _boundOnTouchMove.get(this));
      $handle.removeEventListener('touchend',   _boundOnTouchEnd.get(this));


      _isEnabled.set(this, false);


      this.$el.classList.remove(CSS_CLASS_ENABLED);
      this.$el.classList.add(CSS_CLASS_DISABLED);


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
    toggleEnabled(silent) {
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
    destroy(silent) {
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
    get $el() {
      return (this.isDestroyed ? undefined : _$el.get(this));
    }


    /** @returns {Number} - The "original" height of the drawer content element (in pixels). */
    get contentOriginalHeight() {
      return (this.isDestroyed ? undefined : _contentOriginalHeight.get(this));
    }


    /** @param {Number} value - The "original" height of the drawer contentElement (in pixels). */
    set contentOriginalHeight(value) {
      if (this.isDestroyed) {
        return;
      }

      if (typeof value !== 'number' && !(value instanceof Number)) {
        throw new TypeError(`'contentOriginalHeight' must be a Number, but a ${typeof value} was given.`);
      }

      _contentOriginalHeight.set(this, value);
    }


    /** @returns {Number} - The minimum height of the drawer content element (in pixels). */
    get contentMinHeight() {
      return (this.isDestroyed ? undefined : _contentMinHeight.get(this));
    }


    /** @param {Number} value - The minimum height of the drawer contentElement (in pixels). */
    set contentMinHeight(value) {
      if (this.isDestroyed) {
        return;
      }

      if (typeof value !== 'number' && !(value instanceof Number)) {
        throw new TypeError(`'contentMinHeight' must be a Number, but a ${typeof value} was given.`);
      }

      _contentMinHeight.set(this, value);
    }


    /** @returns {Boolean} */
    get isEnabled() {
      return (!this.isDestroyed && _isEnabled.get(this) === true);
    }


    /** @returns {Boolean} */
    get isOpen() {
      return (!this.isDestroyed && _isOpen.get(this) === true);
    }


    /** @returns {Boolean} */
    get isDestroyed() {
      return (_isNotDestroyed.get(this) !== true);
    }


    /**
     * TODO: Add description
     *
     * @param  {String}   eventName    - TODO: Add description
     * @param  {Function} eventHandler - TODO: Add description
     */
    addEventListener(eventName, eventHandler) {
      let events        = _events.get(this);
      let eventHandlers = events[eventName];

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
    removeEventListener(eventName, eventHandler) {
      let events        = _events.get(this);
      let eventHandlers = events[eventName];

      if (eventHandlers == null) {
        return;
      }

      eventHandlers.delete(eventHandler);

      if (eventHandlers.size === 0) {
        delete events[eventName];
      }
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


  /** @private */
  function _triggerEvent(eventName, ...args) {
    let eventHandlers = _events.get(this)[eventName];

    if (eventHandlers == null) {
      return;
    }

    eventHandlers.forEach((eventHandler) => {
      Promise.resolve().then(() => eventHandler(this, ...args));
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
})();

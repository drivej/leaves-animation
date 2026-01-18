import { jsx as ha } from "react/jsx-runtime";
import { useRef as pi, useEffect as la } from "react";
var I = /* @__PURE__ */ ((s) => (s.Application = "application", s.WebGLPipes = "webgl-pipes", s.WebGLPipesAdaptor = "webgl-pipes-adaptor", s.WebGLSystem = "webgl-system", s.WebGPUPipes = "webgpu-pipes", s.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", s.WebGPUSystem = "webgpu-system", s.CanvasSystem = "canvas-system", s.CanvasPipesAdaptor = "canvas-pipes-adaptor", s.CanvasPipes = "canvas-pipes", s.Asset = "asset", s.LoadParser = "load-parser", s.ResolveParser = "resolve-parser", s.CacheParser = "cache-parser", s.DetectionParser = "detection-parser", s.MaskEffect = "mask-effect", s.BlendMode = "blend-mode", s.TextureSource = "texture-source", s.Environment = "environment", s.ShapeBuilder = "shape-builder", s.Batcher = "batcher", s))(I || {});
const Es = (s) => {
  if (typeof s == "function" || typeof s == "object" && s.extension) {
    if (!s.extension)
      throw new Error("Extension class must have an extension object");
    s = { ...typeof s.extension != "object" ? { type: s.extension } : s.extension, ref: s };
  }
  if (typeof s == "object")
    s = { ...s };
  else
    throw new Error("Invalid extension type");
  return typeof s.type == "string" && (s.type = [s.type]), s;
}, Be = (s, t) => Es(s).priority ?? t, _ = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed. Can be:
   * - Extension class with static `extension` property
   * - Extension format object with `type` and `ref`
   * - Multiple extensions as separate arguments
   * @returns {extensions} this for chaining
   * @example
   * ```ts
   * // Remove a single extension
   * extensions.remove(MyRendererPlugin);
   *
   * // Remove multiple extensions
   * extensions.remove(
   *     MyRendererPlugin,
   *     MySystemPlugin
   * );
   * ```
   * @see {@link ExtensionType} For available extension types
   * @see {@link ExtensionFormat} For extension format details
   */
  remove(...s) {
    return s.map(Es).forEach((t) => {
      t.type.forEach((e) => this._removeHandlers[e]?.(t));
    }), this;
  },
  /**
   * Register new extensions with PixiJS. Extensions can be registered in multiple formats:
   * - As a class with a static `extension` property
   * - As an extension format object
   * - As multiple extensions passed as separate arguments
   * @param extensions - Extensions to add to PixiJS. Each can be:
   * - A class with static `extension` property
   * - An extension format object with `type` and `ref`
   * - Multiple extensions as separate arguments
   * @returns This extensions instance for chaining
   * @example
   * ```ts
   * // Register a simple extension
   * extensions.add(MyRendererPlugin);
   *
   * // Register multiple extensions
   * extensions.add(
   *     MyRendererPlugin,
   *     MySystemPlugin,
   * });
   * ```
   * @see {@link ExtensionType} For available extension types
   * @see {@link ExtensionFormat} For extension format details
   * @see {@link extensions.remove} For removing registered extensions
   */
  add(...s) {
    return s.map(Es).forEach((t) => {
      t.type.forEach((e) => {
        const i = this._addHandlers, r = this._queue;
        i[e] ? i[e]?.(t) : (r[e] = r[e] || [], r[e]?.push(t));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns this for chaining.
   * @internal
   * @ignore
   */
  handle(s, t, e) {
    const i = this._addHandlers, r = this._removeHandlers;
    if (i[s] || r[s])
      throw new Error(`Extension type ${s} already has a handler`);
    i[s] = t, r[s] = e;
    const n = this._queue;
    return n[s] && (n[s]?.forEach((a) => t(a)), delete n[s]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns this for chaining.
   * @ignore
   */
  handleByMap(s, t) {
    return this.handle(
      s,
      (e) => {
        e.name && (t[e.name] = e.ref);
      },
      (e) => {
        e.name && delete t[e.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns this for chaining.
   * @ignore
   */
  handleByNamedList(s, t, e = -1) {
    return this.handle(
      s,
      (i) => {
        t.findIndex((n) => n.name === i.name) >= 0 || (t.push({ name: i.name, value: i.ref }), t.sort((n, a) => Be(a.value, e) - Be(n.value, e)));
      },
      (i) => {
        const r = t.findIndex((n) => n.name === i.name);
        r !== -1 && t.splice(r, 1);
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns this for chaining.
   * @ignore
   */
  handleByList(s, t, e = -1) {
    return this.handle(
      s,
      (i) => {
        t.includes(i.ref) || (t.push(i.ref), t.sort((r, n) => Be(n, e) - Be(r, e)));
      },
      (i) => {
        const r = t.indexOf(i.ref);
        r !== -1 && t.splice(r, 1);
      }
    );
  },
  /**
   * Mixin the source object(s) properties into the target class's prototype.
   * Copies all property descriptors from source objects to the target's prototype.
   * @param Target - The target class to mix properties into
   * @param sources - One or more source objects containing properties to mix in
   * @example
   * ```ts
   * // Create a mixin with shared properties
   * const moveable = {
   *     x: 0,
   *     y: 0,
   *     move(x: number, y: number) {
   *         this.x += x;
   *         this.y += y;
   *     }
   * };
   *
   * // Create a mixin with computed properties
   * const scalable = {
   *     scale: 1,
   *     get scaled() {
   *         return this.scale > 1;
   *     }
   * };
   *
   * // Apply mixins to a class
   * extensions.mixin(Sprite, moveable, scalable);
   *
   * // Use mixed-in properties
   * const sprite = new Sprite();
   * sprite.move(10, 20);
   * console.log(sprite.x, sprite.y); // 10, 20
   * ```
   * @remarks
   * - Copies all properties including getters/setters
   * - Does not modify source objects
   * - Preserves property descriptors
   * @see {@link Object.defineProperties} For details on property descriptors
   * @see {@link Object.getOwnPropertyDescriptors} For details on property copying
   */
  mixin(s, ...t) {
    for (const e of t)
      Object.defineProperties(s.prototype, Object.getOwnPropertyDescriptors(e));
  }
}, ca = {
  extension: {
    type: I.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll-DLijZmee.js");
  }
}, ua = {
  extension: {
    type: I.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll-GETQvShe.js");
  }
};
class $ {
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, i) {
    this._x = e || 0, this._y = i || 0, this._observer = t;
  }
  /**
   * Creates a clone of this point.
   * @example
   * ```ts
   * // Basic cloning
   * const point = new ObservablePoint(observer, 100, 200);
   * const copy = point.clone();
   *
   * // Clone with new observer
   * const newObserver = {
   *     _onUpdate: (p) => console.log(`Clone updated: (${p.x}, ${p.y})`)
   * };
   * const watched = point.clone(newObserver);
   *
   * // Verify independence
   * watched.set(300, 400); // Only triggers new observer
   * ```
   * @param observer - Optional observer to pass to the new observable point
   * @returns A copy of this observable point
   * @see {@link ObservablePoint.copyFrom} For copying into existing point
   * @see {@link Observer} For observer interface details
   */
  clone(t) {
    return new $(t ?? this._observer, this._x, this._y);
  }
  /**
   * Sets the point to a new x and y position.
   *
   * If y is omitted, both x and y will be set to x.
   * @example
   * ```ts
   * // Basic position setting
   * const point = new ObservablePoint(observer);
   * point.set(100, 200);
   *
   * // Set both x and y to same value
   * point.set(50); // x=50, y=50
   * ```
   * @param x - Position on the x axis
   * @param y - Position on the y axis, defaults to x
   * @returns The point instance itself
   * @see {@link ObservablePoint.copyFrom} For copying from another point
   * @see {@link ObservablePoint.equals} For comparing positions
   */
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies x and y from the given point into this point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new ObservablePoint(observer, 100, 200);
   * const target = new ObservablePoint();
   * target.copyFrom(source);
   *
   * // Copy and chain operations
   * const point = new ObservablePoint()
   *     .copyFrom(source)
   *     .set(x + 50, y + 50);
   *
   * // Copy from any PointData
   * const data = { x: 10, y: 20 };
   * point.copyFrom(data);
   * ```
   * @param p - The point to copy from
   * @returns The point instance itself
   * @see {@link ObservablePoint.copyTo} For copying to another point
   * @see {@link ObservablePoint.clone} For creating new point copy
   */
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies this point's x and y into the given point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new ObservablePoint(100, 200);
   * const target = new ObservablePoint();
   * source.copyTo(target);
   * ```
   * @param p - The point to copy to. Can be any type that is or extends `PointLike`
   * @returns The point (`p`) with values updated
   * @see {@link ObservablePoint.copyFrom} For copying from another point
   * @see {@link ObservablePoint.clone} For creating new point copy
   */
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  /**
   * Checks if another point is equal to this point.
   *
   * Compares x and y values using strict equality.
   * @example
   * ```ts
   * // Basic equality check
   * const p1 = new ObservablePoint(100, 200);
   * const p2 = new ObservablePoint(100, 200);
   * console.log(p1.equals(p2)); // true
   *
   * // Compare with PointData
   * const data = { x: 100, y: 200 };
   * console.log(p1.equals(data)); // true
   *
   * // Check different points
   * const p3 = new ObservablePoint(200, 300);
   * console.log(p1.equals(p3)); // false
   * ```
   * @param p - The point to check
   * @returns `true` if both `x` and `y` are equal
   * @see {@link ObservablePoint.copyFrom} For making points equal
   * @see {@link PointData} For point data interface
   */
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  toString() {
    return `[pixi.js/math:ObservablePoint x=${this._x} y=${this._y} scope=${this._observer}]`;
  }
  /**
   * Position of the observable point on the x axis.
   * Triggers observer callback when value changes.
   * @example
   * ```ts
   * // Basic x position
   * const point = new ObservablePoint(observer);
   * point.x = 100; // Triggers observer
   *
   * // Use in calculations
   * const width = rightPoint.x - leftPoint.x;
   * ```
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this._observer._onUpdate(this));
  }
  /**
   * Position of the observable point on the y axis.
   * Triggers observer callback when value changes.
   * @example
   * ```ts
   * // Basic y position
   * const point = new ObservablePoint(observer);
   * point.y = 200; // Triggers observer
   *
   * // Use in calculations
   * const height = bottomPoint.y - topPoint.y;
   * ```
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this._observer._onUpdate(this));
  }
}
function Tr(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var rs = { exports: {} }, mi;
function da() {
  return mi || (mi = 1, (function(s) {
    var t = Object.prototype.hasOwnProperty, e = "~";
    function i() {
    }
    Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (e = !1));
    function r(h, l, c) {
      this.fn = h, this.context = l, this.once = c || !1;
    }
    function n(h, l, c, u, f) {
      if (typeof c != "function")
        throw new TypeError("The listener must be a function");
      var d = new r(c, u || h, f), p = e ? e + l : l;
      return h._events[p] ? h._events[p].fn ? h._events[p] = [h._events[p], d] : h._events[p].push(d) : (h._events[p] = d, h._eventsCount++), h;
    }
    function a(h, l) {
      --h._eventsCount === 0 ? h._events = new i() : delete h._events[l];
    }
    function o() {
      this._events = new i(), this._eventsCount = 0;
    }
    o.prototype.eventNames = function() {
      var l = [], c, u;
      if (this._eventsCount === 0) return l;
      for (u in c = this._events)
        t.call(c, u) && l.push(e ? u.slice(1) : u);
      return Object.getOwnPropertySymbols ? l.concat(Object.getOwnPropertySymbols(c)) : l;
    }, o.prototype.listeners = function(l) {
      var c = e ? e + l : l, u = this._events[c];
      if (!u) return [];
      if (u.fn) return [u.fn];
      for (var f = 0, d = u.length, p = new Array(d); f < d; f++)
        p[f] = u[f].fn;
      return p;
    }, o.prototype.listenerCount = function(l) {
      var c = e ? e + l : l, u = this._events[c];
      return u ? u.fn ? 1 : u.length : 0;
    }, o.prototype.emit = function(l, c, u, f, d, p) {
      var m = e ? e + l : l;
      if (!this._events[m]) return !1;
      var g = this._events[m], A = arguments.length, x, y;
      if (g.fn) {
        switch (g.once && this.removeListener(l, g.fn, void 0, !0), A) {
          case 1:
            return g.fn.call(g.context), !0;
          case 2:
            return g.fn.call(g.context, c), !0;
          case 3:
            return g.fn.call(g.context, c, u), !0;
          case 4:
            return g.fn.call(g.context, c, u, f), !0;
          case 5:
            return g.fn.call(g.context, c, u, f, d), !0;
          case 6:
            return g.fn.call(g.context, c, u, f, d, p), !0;
        }
        for (y = 1, x = new Array(A - 1); y < A; y++)
          x[y - 1] = arguments[y];
        g.fn.apply(g.context, x);
      } else {
        var b = g.length, v;
        for (y = 0; y < b; y++)
          switch (g[y].once && this.removeListener(l, g[y].fn, void 0, !0), A) {
            case 1:
              g[y].fn.call(g[y].context);
              break;
            case 2:
              g[y].fn.call(g[y].context, c);
              break;
            case 3:
              g[y].fn.call(g[y].context, c, u);
              break;
            case 4:
              g[y].fn.call(g[y].context, c, u, f);
              break;
            default:
              if (!x) for (v = 1, x = new Array(A - 1); v < A; v++)
                x[v - 1] = arguments[v];
              g[y].fn.apply(g[y].context, x);
          }
      }
      return !0;
    }, o.prototype.on = function(l, c, u) {
      return n(this, l, c, u, !1);
    }, o.prototype.once = function(l, c, u) {
      return n(this, l, c, u, !0);
    }, o.prototype.removeListener = function(l, c, u, f) {
      var d = e ? e + l : l;
      if (!this._events[d]) return this;
      if (!c)
        return a(this, d), this;
      var p = this._events[d];
      if (p.fn)
        p.fn === c && (!f || p.once) && (!u || p.context === u) && a(this, d);
      else {
        for (var m = 0, g = [], A = p.length; m < A; m++)
          (p[m].fn !== c || f && !p[m].once || u && p[m].context !== u) && g.push(p[m]);
        g.length ? this._events[d] = g.length === 1 ? g[0] : g : a(this, d);
      }
      return this;
    }, o.prototype.removeAllListeners = function(l) {
      var c;
      return l ? (c = e ? e + l : l, this._events[c] && a(this, c)) : (this._events = new i(), this._eventsCount = 0), this;
    }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = e, o.EventEmitter = o, s.exports = o;
  })(rs)), rs.exports;
}
var fa = da();
const ct = /* @__PURE__ */ Tr(fa), ga = Math.PI * 2, pa = 180 / Math.PI, ma = Math.PI / 180;
class J {
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t = 0, e = 0) {
    this.x = 0, this.y = 0, this.x = t, this.y = e;
  }
  /**
   * Creates a clone of this point, which is a new instance with the same `x` and `y` values.
   * @example
   * ```ts
   * // Basic point cloning
   * const original = new Point(100, 200);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.set(300, 400);
   *
   * // Verify independence
   * console.log(original); // Point(100, 200)
   * console.log(modified); // Point(300, 400)
   * ```
   * @remarks
   * - Creates new Point instance
   * - Deep copies x and y values
   * - Independent from original
   * - Useful for preserving values
   * @returns A clone of this point
   * @see {@link Point.copyFrom} For copying into existing point
   * @see {@link Point.copyTo} For copying to existing point
   */
  clone() {
    return new J(this.x, this.y);
  }
  /**
   * Copies x and y from the given point into this point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Point(100, 200);
   * const target = new Point();
   * target.copyFrom(source);
   *
   * // Copy and chain operations
   * const point = new Point()
   *     .copyFrom(source)
   *     .set(x + 50, y + 50);
   *
   * // Copy from any PointData
   * const data = { x: 10, y: 20 };
   * point.copyFrom(data);
   * ```
   * @param p - The point to copy from
   * @returns The point instance itself
   * @see {@link Point.copyTo} For copying to another point
   * @see {@link Point.clone} For creating new point copy
   */
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  /**
   * Copies this point's x and y into the given point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Point(100, 200);
   * const target = new Point();
   * source.copyTo(target);
   * ```
   * @param p - The point to copy to. Can be any type that is or extends `PointLike`
   * @returns The point (`p`) with values updated
   * @see {@link Point.copyFrom} For copying from another point
   * @see {@link Point.clone} For creating new point copy
   */
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  /**
   * Checks if another point is equal to this point.
   *
   * Compares x and y values using strict equality.
   * @example
   * ```ts
   * // Basic equality check
   * const p1 = new Point(100, 200);
   * const p2 = new Point(100, 200);
   * console.log(p1.equals(p2)); // true
   *
   * // Compare with PointData
   * const data = { x: 100, y: 200 };
   * console.log(p1.equals(data)); // true
   *
   * // Check different points
   * const p3 = new Point(200, 300);
   * console.log(p1.equals(p3)); // false
   * ```
   * @param p - The point to check
   * @returns `true` if both `x` and `y` are equal
   * @see {@link Point.copyFrom} For making points equal
   * @see {@link PointData} For point data interface
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets the point to a new x and y position.
   *
   * If y is omitted, both x and y will be set to x.
   * @example
   * ```ts
   * // Basic position setting
   * const point = new Point();
   * point.set(100, 200);
   *
   * // Set both x and y to same value
   * point.set(50); // x=50, y=50
   *
   * // Chain with other operations
   * point
   *     .set(10, 20)
   *     .copyTo(otherPoint);
   * ```
   * @param x - Position on the x axis
   * @param y - Position on the y axis, defaults to x
   * @returns The point instance itself
   * @see {@link Point.copyFrom} For copying from another point
   * @see {@link Point.equals} For comparing positions
   */
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
  toString() {
    return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
  }
  /**
   * A static Point object with `x` and `y` values of `0`.
   *
   * This shared instance is reset to zero values when accessed.
   *
   * > [!IMPORTANT] This point is shared and temporary. Do not store references to it.
   * @example
   * ```ts
   * // Use for temporary calculations
   * const tempPoint = Point.shared;
   * tempPoint.set(100, 200);
   * matrix.apply(tempPoint);
   *
   * // Will be reset to (0,0) on next access
   * const fresh = Point.shared; // x=0, y=0
   * ```
   * @readonly
   * @returns A fresh zeroed point for temporary use
   * @see {@link Point.constructor} For creating new points
   * @see {@link PointData} For basic point interface
   */
  static get shared() {
    return ns.x = 0, ns.y = 0, ns;
  }
}
const ns = new J();
class W {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, i = 0, r = 1, n = 0, a = 0) {
    this.array = null, this.a = t, this.b = e, this.c = i, this.d = r, this.tx = n, this.ty = a;
  }
  /**
   * Creates a Matrix object based on the given array.
   * Populates matrix components from a flat array in column-major order.
   *
   * > [!NOTE] Array mapping order:
   * > ```
   * > array[0] = a  (x scale)
   * > array[1] = b  (y skew)
   * > array[2] = tx (x translation)
   * > array[3] = c  (x skew)
   * > array[4] = d  (y scale)
   * > array[5] = ty (y translation)
   * > ```
   * @example
   * ```ts
   * // Create matrix from array
   * const matrix = new Matrix();
   * matrix.fromArray([
   *     2, 0,  100,  // a, b, tx
   *     0, 2,  100   // c, d, ty
   * ]);
   *
   * // Create matrix from typed array
   * const float32Array = new Float32Array([
   *     1, 0, 0,     // Scale x1, no skew
   *     0, 1, 0      // No skew, scale x1
   * ]);
   * matrix.fromArray(float32Array);
   * ```
   * @param array - The array to populate the matrix from
   * @see {@link Matrix.toArray} For converting matrix to array
   * @see {@link Matrix.set} For setting values directly
   */
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  /**
   * Sets the matrix properties directly.
   * All matrix components can be set in one call.
   * @example
   * ```ts
   * // Set to identity matrix
   * matrix.set(1, 0, 0, 1, 0, 0);
   *
   * // Set to scale matrix
   * matrix.set(2, 0, 0, 2, 0, 0); // Scale 2x
   *
   * // Set to translation matrix
   * matrix.set(1, 0, 0, 1, 100, 50); // Move 100,50
   * ```
   * @param a - Scale on x axis
   * @param b - Shear on y axis
   * @param c - Shear on x axis
   * @param d - Scale on y axis
   * @param tx - Translation on x axis
   * @param ty - Translation on y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.fromArray} For setting from array
   */
  set(t, e, i, r, n, a) {
    return this.a = t, this.b = e, this.c = i, this.d = r, this.tx = n, this.ty = a, this;
  }
  /**
   * Creates an array from the current Matrix object.
   *
   * > [!NOTE] The array format is:
   * > ```
   * > Non-transposed:
   * > [a, c, tx,
   * > b, d, ty,
   * > 0, 0, 1]
   * >
   * > Transposed:
   * > [a, b, 0,
   * > c, d, 0,
   * > tx,ty,1]
   * > ```
   * @example
   * ```ts
   * // Basic array conversion
   * const matrix = new Matrix(2, 0, 0, 2, 100, 100);
   * const array = matrix.toArray();
   *
   * // Using existing array
   * const float32Array = new Float32Array(9);
   * matrix.toArray(false, float32Array);
   *
   * // Get transposed array
   * const transposed = matrix.toArray(true);
   * ```
   * @param transpose - Whether to transpose the matrix
   * @param out - Optional Float32Array to store the result
   * @returns The array containing the matrix values
   * @see {@link Matrix.fromArray} For creating matrix from array
   * @see {@link Matrix.array} For cached array storage
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const i = e || this.array;
    return t ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i;
  }
  /**
   * Get a new position with the current transformation applied.
   *
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @example
   * ```ts
   * // Basic point transformation
   * const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
   * const point = new Point(10, 20);
   * const transformed = matrix.apply(point);
   *
   * // Reuse existing point
   * const output = new Point();
   * matrix.apply(point, output);
   * ```
   * @param pos - The origin point to transform
   * @param newPos - Optional point to store the result
   * @returns The transformed point
   * @see {@link Matrix.applyInverse} For inverse transformation
   * @see {@link Point} For point operations
   */
  apply(t, e) {
    e = e || new J();
    const i = t.x, r = t.y;
    return e.x = this.a * i + this.c * r + this.tx, e.y = this.b * i + this.d * r + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   *
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @example
   * ```ts
   * // Basic inverse transformation
   * const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
   * const worldPoint = new Point(150, 100);
   * const localPoint = matrix.applyInverse(worldPoint);
   *
   * // Reuse existing point
   * const output = new Point();
   * matrix.applyInverse(worldPoint, output);
   *
   * // Convert mouse position to local space
   * const mousePoint = new Point(mouseX, mouseY);
   * const localMouse = matrix.applyInverse(mousePoint);
   * ```
   * @param pos - The origin point to inverse-transform
   * @param newPos - Optional point to store the result
   * @returns The inverse-transformed point
   * @see {@link Matrix.apply} For forward transformation
   * @see {@link Matrix.invert} For getting inverse matrix
   */
  applyInverse(t, e) {
    e = e || new J();
    const i = this.a, r = this.b, n = this.c, a = this.d, o = this.tx, h = this.ty, l = 1 / (i * a + n * -r), c = t.x, u = t.y;
    return e.x = a * l * c + -n * l * u + (h * n - o * a) * l, e.y = i * l * u + -r * l * c + (-h * i + o * r) * l, e;
  }
  /**
   * Translates the matrix on the x and y axes.
   * Adds to the position values while preserving scale, rotation and skew.
   * @example
   * ```ts
   * // Basic translation
   * const matrix = new Matrix();
   * matrix.translate(100, 50); // Move right 100, down 50
   *
   * // Chain with other transformations
   * matrix
   *     .scale(2, 2)
   *     .translate(100, 0)
   *     .rotate(Math.PI / 4);
   * ```
   * @param x - How much to translate on the x axis
   * @param y - How much to translate on the y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.set} For setting position directly
   * @see {@link Matrix.setTransform} For complete transform setup
   */
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * Multiplies the scale values with existing matrix components.
   * @example
   * ```ts
   * // Basic scaling
   * const matrix = new Matrix();
   * matrix.scale(2, 3); // Scale 2x horizontally, 3x vertically
   *
   * // Chain with other transformations
   * matrix
   *     .translate(100, 100)
   *     .scale(2, 2)     // Scales after translation
   *     .rotate(Math.PI / 4);
   * ```
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.setTransform} For setting scale directly
   * @see {@link Matrix.append} For combining transformations
   */
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   *
   * Rotates around the origin (0,0) by the given angle in radians.
   * @example
   * ```ts
   * // Basic rotation
   * const matrix = new Matrix();
   * matrix.rotate(Math.PI / 4); // Rotate 45 degrees
   *
   * // Chain with other transformations
   * matrix
   *     .translate(100, 100) // Move to rotation center
   *     .rotate(Math.PI)     // Rotate 180 degrees
   *     .scale(2, 2);        // Scale after rotation
   *
   * // Common angles
   * matrix.rotate(Math.PI / 2);  // 90 degrees
   * matrix.rotate(Math.PI);      // 180 degrees
   * matrix.rotate(Math.PI * 2);  // 360 degrees
   * ```
   * @remarks
   * - Rotates around origin point (0,0)
   * - Affects position if translation was set
   * - Uses counter-clockwise rotation
   * - Order of operations matters when chaining
   * @param angle - The angle in radians
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.setTransform} For setting rotation directly
   * @see {@link Matrix.append} For combining transformations
   */
  rotate(t) {
    const e = Math.cos(t), i = Math.sin(t), r = this.a, n = this.c, a = this.tx;
    return this.a = r * e - this.b * i, this.b = r * i + this.b * e, this.c = n * e - this.d * i, this.d = n * i + this.d * e, this.tx = a * e - this.ty * i, this.ty = a * i + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * Combines two matrices by multiplying them together: this = this * matrix
   * @example
   * ```ts
   * // Basic matrix combination
   * const matrix = new Matrix();
   * const other = new Matrix().translate(100, 0).rotate(Math.PI / 4);
   * matrix.append(other);
   * ```
   * @remarks
   * - Order matters: A.append(B) !== B.append(A)
   * - Modifies current matrix
   * - Preserves transformation order
   * - Commonly used for combining transforms
   * @param matrix - The matrix to append
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.prepend} For prepending transformations
   * @see {@link Matrix.appendFrom} For appending two external matrices
   */
  append(t) {
    const e = this.a, i = this.b, r = this.c, n = this.d;
    return this.a = t.a * e + t.b * r, this.b = t.a * i + t.b * n, this.c = t.c * e + t.d * r, this.d = t.c * i + t.d * n, this.tx = t.tx * e + t.ty * r + this.tx, this.ty = t.tx * i + t.ty * n + this.ty, this;
  }
  /**
   * Appends two matrices and sets the result to this matrix.
   * Performs matrix multiplication: this = A * B
   * @example
   * ```ts
   * // Basic matrix multiplication
   * const result = new Matrix();
   * const matrixA = new Matrix().scale(2, 2);
   * const matrixB = new Matrix().rotate(Math.PI / 4);
   * result.appendFrom(matrixA, matrixB);
   * ```
   * @remarks
   * - Order matters: A * B !== B * A
   * - Creates a new transformation from two others
   * - More efficient than append() for multiple operations
   * - Does not modify input matrices
   * @param a - The first matrix to multiply
   * @param b - The second matrix to multiply
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.append} For single matrix combination
   * @see {@link Matrix.prepend} For reverse order multiplication
   */
  appendFrom(t, e) {
    const i = t.a, r = t.b, n = t.c, a = t.d, o = t.tx, h = t.ty, l = e.a, c = e.b, u = e.c, f = e.d;
    return this.a = i * l + r * u, this.b = i * c + r * f, this.c = n * l + a * u, this.d = n * c + a * f, this.tx = o * l + h * u + e.tx, this.ty = o * c + h * f + e.ty, this;
  }
  /**
   * Sets the matrix based on all the available properties.
   * Combines position, scale, rotation, skew and pivot in a single operation.
   * @example
   * ```ts
   * // Basic transform setup
   * const matrix = new Matrix();
   * matrix.setTransform(
   *     100, 100,    // position
   *     0, 0,        // pivot
   *     2, 2,        // scale
   *     Math.PI / 4, // rotation (45 degrees)
   *     0, 0         // skew
   * );
   * ```
   * @remarks
   * - Updates all matrix components at once
   * - More efficient than separate transform calls
   * - Uses radians for rotation and skew
   * - Pivot affects rotation center
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.decompose} For extracting transform properties
   * @see {@link TransformableObject} For transform data structure
   */
  setTransform(t, e, i, r, n, a, o, h, l) {
    return this.a = Math.cos(o + l) * n, this.b = Math.sin(o + l) * n, this.c = -Math.sin(o - h) * a, this.d = Math.cos(o - h) * a, this.tx = t - (i * this.a + r * this.c), this.ty = e - (i * this.b + r * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * Combines two matrices by multiplying them together: this = matrix * this
   * @example
   * ```ts
   * // Basic matrix prepend
   * const matrix = new Matrix().scale(2, 2);
   * const other = new Matrix().translate(100, 0);
   * matrix.prepend(other); // Translation happens before scaling
   * ```
   * @remarks
   * - Order matters: A.prepend(B) !== B.prepend(A)
   * - Modifies current matrix
   * - Reverses transformation order compared to append()
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.append} For appending transformations
   * @see {@link Matrix.appendFrom} For combining external matrices
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const i = this.a, r = this.c;
      this.a = i * t.a + this.b * t.c, this.b = i * t.b + this.b * t.d, this.c = r * t.a + this.d * t.c, this.d = r * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix into its individual transform components.
   * Extracts position, scale, rotation and skew values from the matrix.
   * @example
   * ```ts
   * // Basic decomposition
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4)
   *     .scale(2, 2);
   *
   * const transform = {
   *     position: new Point(),
   *     scale: new Point(),
   *     pivot: new Point(),
   *     skew: new Point(),
   *     rotation: 0
   * };
   *
   * matrix.decompose(transform);
   * console.log(transform.position); // Point(100, 100)
   * console.log(transform.rotation); // ~0.785 (PI/4)
   * console.log(transform.scale); // Point(2, 2)
   * ```
   * @remarks
   * - Handles combined transformations
   * - Accounts for pivot points
   * - Chooses between rotation/skew based on transform type
   * - Uses radians for rotation and skew
   * @param transform - The transform object to store the decomposed values
   * @returns The transform with the newly applied properties
   * @see {@link Matrix.setTransform} For composing from components
   * @see {@link TransformableObject} For transform structure
   */
  decompose(t) {
    const e = this.a, i = this.b, r = this.c, n = this.d, a = t.pivot, o = -Math.atan2(-r, n), h = Math.atan2(i, e), l = Math.abs(o + h);
    return l < 1e-5 || Math.abs(ga - l) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = o, t.skew.y = h), t.scale.x = Math.sqrt(e * e + i * i), t.scale.y = Math.sqrt(r * r + n * n), t.position.x = this.tx + (a.x * e + a.y * r), t.position.y = this.ty + (a.x * i + a.y * n), t;
  }
  /**
   * Inverts this matrix.
   * Creates the matrix that when multiplied with this matrix results in an identity matrix.
   * @example
   * ```ts
   * // Basic matrix inversion
   * const matrix = new Matrix()
   *     .translate(100, 50)
   *     .scale(2, 2);
   *
   * matrix.invert(); // Now transforms in opposite direction
   *
   * // Verify inversion
   * const point = new Point(50, 50);
   * const transformed = matrix.apply(point);
   * const original = matrix.invert().apply(transformed);
   * // original ≈ point
   * ```
   * @remarks
   * - Modifies the current matrix
   * - Useful for reversing transformations
   * - Cannot invert matrices with zero determinant
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.applyInverse} For inverse transformations
   */
  invert() {
    const t = this.a, e = this.b, i = this.c, r = this.d, n = this.tx, a = t * r - e * i;
    return this.a = r / a, this.b = -e / a, this.c = -i / a, this.d = t / a, this.tx = (i * this.ty - r * n) / a, this.ty = -(t * this.ty - e * n) / a, this;
  }
  /**
   * Checks if this matrix is an identity matrix.
   *
   * An identity matrix has no transformations applied (default state).
   * @example
   * ```ts
   * // Check if matrix is identity
   * const matrix = new Matrix();
   * console.log(matrix.isIdentity()); // true
   *
   * // Check after transformations
   * matrix.translate(100, 0);
   * console.log(matrix.isIdentity()); // false
   *
   * // Reset and verify
   * matrix.identity();
   * console.log(matrix.isIdentity()); // true
   * ```
   * @remarks
   * - Verifies a = 1, d = 1 (no scale)
   * - Verifies b = 0, c = 0 (no skew)
   * - Verifies tx = 0, ty = 0 (no translation)
   * @returns True if matrix has no transformations
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.IDENTITY} For constant identity matrix
   */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * Sets all components to their default values: scale=1, no skew, no translation.
   * @example
   * ```ts
   * // Reset transformed matrix
   * const matrix = new Matrix()
   *     .scale(2, 2)
   *     .rotate(Math.PI / 4);
   * matrix.identity(); // Back to default state
   *
   * // Chain after reset
   * matrix
   *     .identity()
   *     .translate(100, 100)
   *     .scale(2, 2);
   *
   * // Compare with identity constant
   * const isDefault = matrix.equals(Matrix.IDENTITY);
   * ```
   * @remarks
   * - Sets a=1, d=1 (default scale)
   * - Sets b=0, c=0 (no skew)
   * - Sets tx=0, ty=0 (no translation)
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.IDENTITY} For constant identity matrix
   * @see {@link Matrix.isIdentity} For checking identity state
   */
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const t = new W();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @param matrix
   * @example
   * ```ts
   * // Basic matrix cloning
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4);
   * const copy = matrix.clone();
   *
   * // Clone and modify
   * const modified = matrix.clone()
   *     .scale(2, 2);
   *
   * // Compare matrices
   * console.log(matrix.equals(copy));     // true
   * console.log(matrix.equals(modified)); // false
   * ```
   * @returns A copy of this matrix. Good for chaining method calls.
   * @see {@link Matrix.copyTo} For copying to existing matrix
   * @see {@link Matrix.copyFrom} For copying from another matrix
   */
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix.
   * @example
   * ```ts
   * // Basic matrix copying
   * const source = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4);
   * const target = new Matrix();
   * target.copyFrom(source);
   * ```
   * @param matrix - The matrix to copy from
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.clone} For creating new matrix copy
   * @see {@link Matrix.copyTo} For copying to another matrix
   */
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  /**
   * Checks if this matrix equals another matrix.
   * Compares all components for exact equality.
   * @example
   * ```ts
   * // Basic equality check
   * const m1 = new Matrix();
   * const m2 = new Matrix();
   * console.log(m1.equals(m2)); // true
   *
   * // Compare transformed matrices
   * const transform = new Matrix()
   *     .translate(100, 100)
   * const clone = new Matrix()
   *     .scale(2, 2);
   * console.log(transform.equals(clone)); // false
   * ```
   * @param matrix - The matrix to compare to
   * @returns True if matrices are identical
   * @see {@link Matrix.copyFrom} For copying matrix values
   * @see {@link Matrix.isIdentity} For identity comparison
   */
  equals(t) {
    return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
  }
  toString() {
    return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  /**
   * A default (identity) matrix with no transformations applied.
   *
   * > [!IMPORTANT] This is a shared read-only object. Create a new Matrix if you need to modify it.
   * @example
   * ```ts
   * // Get identity matrix reference
   * const identity = Matrix.IDENTITY;
   * console.log(identity.isIdentity()); // true
   *
   * // Compare with identity
   * const matrix = new Matrix();
   * console.log(matrix.equals(Matrix.IDENTITY)); // true
   *
   * // Create new matrix instead of modifying IDENTITY
   * const transform = new Matrix()
   *     .copyFrom(Matrix.IDENTITY)
   *     .translate(100, 100);
   * ```
   * @readonly
   * @returns A read-only identity matrix
   * @see {@link Matrix.shared} For temporary calculations
   * @see {@link Matrix.identity} For resetting matrices
   */
  static get IDENTITY() {
    return xa.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   *
   * > [!IMPORTANT] This matrix is shared and temporary. Do not store references to it.
   * @example
   * ```ts
   * // Use for temporary calculations
   * const tempMatrix = Matrix.shared;
   * tempMatrix.translate(100, 100).rotate(Math.PI / 4);
   * const point = tempMatrix.apply({ x: 10, y: 20 });
   *
   * // Will be reset to identity on next access
   * const fresh = Matrix.shared; // Back to identity
   * ```
   * @remarks
   * - Always returns identity matrix
   * - Safe to modify temporarily
   * - Not safe to store references
   * - Useful for one-off calculations
   * @readonly
   * @returns A fresh identity matrix for temporary use
   * @see {@link Matrix.IDENTITY} For immutable identity matrix
   * @see {@link Matrix.identity} For resetting matrices
   */
  static get shared() {
    return Aa.identity();
  }
}
const Aa = new W(), xa = new W(), Tt = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], Et = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], kt = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], Ft = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], ks = [], Er = [], Se = Math.sign;
function ya() {
  for (let s = 0; s < 16; s++) {
    const t = [];
    ks.push(t);
    for (let e = 0; e < 16; e++) {
      const i = Se(Tt[s] * Tt[e] + kt[s] * Et[e]), r = Se(Et[s] * Tt[e] + Ft[s] * Et[e]), n = Se(Tt[s] * kt[e] + kt[s] * Ft[e]), a = Se(Et[s] * kt[e] + Ft[s] * Ft[e]);
      for (let o = 0; o < 16; o++)
        if (Tt[o] === i && Et[o] === r && kt[o] === n && Ft[o] === a) {
          t.push(o);
          break;
        }
    }
  }
  for (let s = 0; s < 16; s++) {
    const t = new W();
    t.set(Tt[s], Et[s], kt[s], Ft[s], 0, 0), Er.push(t);
  }
}
ya();
const z = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (s) => Tt[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (s) => Et[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (s) => kt[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (s) => Ft[s],
  /**
   * @group groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (s) => s & 8 ? s & 15 : -s & 7,
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @group groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {GD8Symmetry} Composed operation
   */
  add: (s, t) => ks[s][t],
  /**
   * Reverse of `add`.
   * @group groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (s, t) => ks[s][z.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @group groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (s) => s ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @group groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (s) => (s & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @group groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (s, t) => Math.abs(s) * 2 <= Math.abs(t) ? t >= 0 ? z.S : z.N : Math.abs(t) * 2 <= Math.abs(s) ? s > 0 ? z.E : z.W : t > 0 ? s > 0 ? z.SE : z.SW : s > 0 ? z.NE : z.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @group groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (s, t, e = 0, i = 0) => {
    const r = Er[z.inv(t)];
    r.tx = e, r.ty = i, s.append(r);
  },
  /**
   * Transforms rectangle coordinates based on texture packer rotation.
   * Used when texture atlas pages are rotated and coordinates need to be adjusted.
   * @group groupD8
   * @param {RectangleLike} rect - Rectangle with original coordinates to transform
   * @param {RectangleLike} sourceFrame - Source texture frame (includes offset and dimensions)
   * @param {GD8Symmetry} rotation - The groupD8 rotation value
   * @param {Rectangle} out - Rectangle to store the result
   * @returns {Rectangle} Transformed coordinates (includes source frame offset)
   */
  transformRectCoords: (s, t, e, i) => {
    const { x: r, y: n, width: a, height: o } = s, { x: h, y: l, width: c, height: u } = t;
    return e === z.E ? (i.set(r + h, n + l, a, o), i) : e === z.S ? i.set(
      c - n - o + h,
      r + l,
      o,
      a
    ) : e === z.W ? i.set(
      c - r - a + h,
      u - n - o + l,
      a,
      o
    ) : e === z.N ? i.set(
      n + h,
      u - r - a + l,
      o,
      a
    ) : i.set(r + h, n + l, a, o);
  }
}, Pe = [new J(), new J(), new J(), new J()];
class q {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, i = 0, r = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(i), this.height = Number(r);
  }
  /**
   * Returns the left edge (x-coordinate) of the rectangle.
   * @example
   * ```ts
   * // Get left edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.left); // 100
   *
   * // Use in alignment calculations
   * sprite.x = rect.left + padding;
   *
   * // Compare positions
   * if (point.x > rect.left) {
   *     console.log('Point is right of rectangle');
   * }
   * ```
   * @readonly
   * @returns The x-coordinate of the left edge
   * @see {@link Rectangle.right} For right edge position
   * @see {@link Rectangle.x} For direct x-coordinate access
   */
  get left() {
    return this.x;
  }
  /**
   * Returns the right edge (x + width) of the rectangle.
   * @example
   * ```ts
   * // Get right edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.right); // 300
   *
   * // Align to right edge
   * sprite.x = rect.right - sprite.width;
   *
   * // Check boundaries
   * if (point.x < rect.right) {
   *     console.log('Point is inside right bound');
   * }
   * ```
   * @readonly
   * @returns The x-coordinate of the right edge
   * @see {@link Rectangle.left} For left edge position
   * @see {@link Rectangle.width} For width value
   */
  get right() {
    return this.x + this.width;
  }
  /**
   * Returns the top edge (y-coordinate) of the rectangle.
   * @example
   * ```ts
   * // Get top edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.top); // 100
   *
   * // Position above rectangle
   * sprite.y = rect.top - sprite.height;
   *
   * // Check vertical position
   * if (point.y > rect.top) {
   *     console.log('Point is below top edge');
   * }
   * ```
   * @readonly
   * @returns The y-coordinate of the top edge
   * @see {@link Rectangle.bottom} For bottom edge position
   * @see {@link Rectangle.y} For direct y-coordinate access
   */
  get top() {
    return this.y;
  }
  /**
   * Returns the bottom edge (y + height) of the rectangle.
   * @example
   * ```ts
   * // Get bottom edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.bottom); // 250
   *
   * // Stack below rectangle
   * sprite.y = rect.bottom + margin;
   *
   * // Check vertical bounds
   * if (point.y < rect.bottom) {
   *     console.log('Point is above bottom edge');
   * }
   * ```
   * @readonly
   * @returns The y-coordinate of the bottom edge
   * @see {@link Rectangle.top} For top edge position
   * @see {@link Rectangle.height} For height value
   */
  get bottom() {
    return this.y + this.height;
  }
  /**
   * Determines whether the Rectangle is empty (has no area).
   * @example
   * ```ts
   * // Check zero dimensions
   * const rect = new Rectangle(100, 100, 0, 50);
   * console.log(rect.isEmpty()); // true
   * ```
   * @returns True if the rectangle has no area
   * @see {@link Rectangle.width} For width value
   * @see {@link Rectangle.height} For height value
   */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  /**
   * A constant empty rectangle. This is a new object every time the property is accessed.
   * @example
   * ```ts
   * // Get fresh empty rectangle
   * const empty = Rectangle.EMPTY;
   * console.log(empty.isEmpty()); // true
   * ```
   * @returns A new empty rectangle instance
   * @see {@link Rectangle.isEmpty} For empty state testing
   */
  static get EMPTY() {
    return new q(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Rectangle(100, 100, 200, 150);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.width *= 2;
   * modified.height += 50;
   *
   * // Verify independence
   * console.log(original.width);  // 200
   * console.log(modified.width);  // 400
   * ```
   * @returns A copy of the rectangle
   * @see {@link Rectangle.copyFrom} For copying into existing rectangle
   * @see {@link Rectangle.copyTo} For copying to another rectangle
   */
  clone() {
    return new q(this.x, this.y, this.width, this.height);
  }
  /**
   * Converts a Bounds object to a Rectangle object.
   * @example
   * ```ts
   * // Convert bounds to rectangle
   * const bounds = container.getBounds();
   * const rect = new Rectangle().copyFromBounds(bounds);
   * ```
   * @param bounds - The bounds to copy and convert to a rectangle
   * @returns Returns itself
   * @see {@link Bounds} For bounds object structure
   * @see {@link Rectangle.getBounds} For getting rectangle bounds
   */
  copyFromBounds(t) {
    return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
  }
  /**
   * Copies another rectangle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Rectangle(100, 100, 200, 150);
   * const target = new Rectangle();
   * target.copyFrom(source);
   *
   * // Chain with other operations
   * const rect = new Rectangle()
   *     .copyFrom(source)
   *     .pad(10);
   * ```
   * @param rectangle - The rectangle to copy from
   * @returns Returns itself
   * @see {@link Rectangle.copyTo} For copying to another rectangle
   * @see {@link Rectangle.clone} For creating new rectangle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Rectangle(100, 100, 200, 150);
   * const target = new Rectangle();
   * source.copyTo(target);
   *
   * // Chain with other operations
   * const result = source
   *     .copyTo(new Rectangle())
   *     .getBounds();
   * ```
   * @param rectangle - The rectangle to copy to
   * @returns Returns given parameter
   * @see {@link Rectangle.copyFrom} For copying from another rectangle
   * @see {@link Rectangle.clone} For creating new rectangle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @example
   * ```ts
   * // Basic containment check
   * const rect = new Rectangle(100, 100, 200, 150);
   * const isInside = rect.contains(150, 125); // true
   * // Check edge cases
   * console.log(rect.contains(100, 100)); // true (on edge)
   * console.log(rect.contains(300, 250)); // false (outside)
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   * @see {@link Rectangle.containsRect} For rectangle containment
   * @see {@link Rectangle.strokeContains} For checking stroke intersection
   */
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const rect = new Rectangle(100, 100, 200, 150);
   * const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this rectangle's stroke
   * @see {@link Rectangle.contains} For checking fill containment
   * @see {@link Rectangle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const { width: n, height: a } = this;
    if (n <= 0 || a <= 0)
      return !1;
    const o = this.x, h = this.y, l = i * (1 - r), c = i - l, u = o - l, f = o + n + l, d = h - l, p = h + a + l, m = o + c, g = o + n - c, A = h + c, x = h + a - c;
    return t >= u && t <= f && e >= d && e <= p && !(t > m && t < g && e > A && e < x);
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   *
   * Returns true only if the area of the intersection is greater than 0.
   * This means that rectangles sharing only a side are not considered intersecting.
   * @example
   * ```ts
   * // Basic intersection check
   * const rect1 = new Rectangle(0, 0, 100, 100);
   * const rect2 = new Rectangle(50, 50, 100, 100);
   * console.log(rect1.intersects(rect2)); // true
   *
   * // With transformation matrix
   * const matrix = new Matrix();
   * matrix.rotate(Math.PI / 4); // 45 degrees
   * console.log(rect1.intersects(rect2, matrix)); // Checks with rotation
   *
   * // Edge cases
   * const zeroWidth = new Rectangle(0, 0, 0, 100);
   * console.log(rect1.intersects(zeroWidth)); // false (no area)
   * ```
   * @remarks
   * - Returns true only if intersection area is > 0
   * - Rectangles sharing only a side are not intersecting
   * - Zero-area rectangles cannot intersect anything
   * - Supports optional transformation matrix
   * @param other - The Rectangle to intersect with `this`
   * @param transform - Optional transformation matrix of `other`
   * @returns True if the transformed `other` Rectangle intersects with `this`
   * @see {@link Rectangle.containsRect} For containment testing
   * @see {@link Rectangle.contains} For point testing
   */
  intersects(t, e) {
    if (!e) {
      const k = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= k)
        return !1;
      const B = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > B;
    }
    const i = this.left, r = this.right, n = this.top, a = this.bottom;
    if (r <= i || a <= n)
      return !1;
    const o = Pe[0].set(t.left, t.top), h = Pe[1].set(t.left, t.bottom), l = Pe[2].set(t.right, t.top), c = Pe[3].set(t.right, t.bottom);
    if (l.x <= o.x || h.y <= o.y)
      return !1;
    const u = Math.sign(e.a * e.d - e.b * e.c);
    if (u === 0 || (e.apply(o, o), e.apply(h, h), e.apply(l, l), e.apply(c, c), Math.max(o.x, h.x, l.x, c.x) <= i || Math.min(o.x, h.x, l.x, c.x) >= r || Math.max(o.y, h.y, l.y, c.y) <= n || Math.min(o.y, h.y, l.y, c.y) >= a))
      return !1;
    const f = u * (h.y - o.y), d = u * (o.x - h.x), p = f * i + d * n, m = f * r + d * n, g = f * i + d * a, A = f * r + d * a;
    if (Math.max(p, m, g, A) <= f * o.x + d * o.y || Math.min(p, m, g, A) >= f * c.x + d * c.y)
      return !1;
    const x = u * (o.y - l.y), y = u * (l.x - o.x), b = x * i + y * n, v = x * r + y * n, C = x * i + y * a, w = x * r + y * a;
    return !(Math.max(b, v, C, w) <= x * o.x + y * o.y || Math.min(b, v, C, w) >= x * c.x + y * c.y);
  }
  /**
   * Pads the rectangle making it grow in all directions.
   *
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @example
   * ```ts
   * // Basic padding
   * const rect = new Rectangle(100, 100, 200, 150);
   * rect.pad(10); // Adds 10px padding on all sides
   *
   * // Different horizontal and vertical padding
   * const uiRect = new Rectangle(0, 0, 100, 50);
   * uiRect.pad(20, 10); // 20px horizontal, 10px vertical
   * ```
   * @remarks
   * - Adjusts x/y by subtracting padding
   * - Increases width/height by padding * 2
   * - Common in UI layout calculations
   * - Chainable with other methods
   * @param paddingX - The horizontal padding amount
   * @param paddingY - The vertical padding amount
   * @returns Returns itself
   * @see {@link Rectangle.enlarge} For growing to include another rectangle
   * @see {@link Rectangle.fit} For shrinking to fit within another rectangle
   */
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @example
   * ```ts
   * // Basic fitting
   * const container = new Rectangle(0, 0, 100, 100);
   * const content = new Rectangle(25, 25, 200, 200);
   * content.fit(container); // Clips to container bounds
   * ```
   * @param rectangle - The rectangle to fit around
   * @returns Returns itself
   * @see {@link Rectangle.enlarge} For growing to include another rectangle
   * @see {@link Rectangle.pad} For adding padding around the rectangle
   */
  fit(t) {
    const e = Math.max(this.x, t.x), i = Math.min(this.x + this.width, t.x + t.width), r = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(i - e, 0), this.y = r, this.height = Math.max(n - r, 0), this;
  }
  /**
   * Enlarges rectangle so that its corners lie on a grid defined by resolution.
   * @example
   * ```ts
   * // Basic grid alignment
   * const rect = new Rectangle(10.2, 10.6, 100.8, 100.4);
   * rect.ceil(); // Aligns to whole pixels
   *
   * // Custom resolution grid
   * const uiRect = new Rectangle(5.3, 5.7, 50.2, 50.8);
   * uiRect.ceil(0.5); // Aligns to half pixels
   *
   * // Use with precision value
   * const preciseRect = new Rectangle(20.001, 20.999, 100.001, 100.999);
   * preciseRect.ceil(1, 0.01); // Handles small decimal variations
   * ```
   * @param resolution - The grid size to align to (1 = whole pixels)
   * @param eps - Small number to prevent floating point errors
   * @returns Returns itself
   * @see {@link Rectangle.fit} For constraining to bounds
   * @see {@link Rectangle.enlarge} For growing dimensions
   */
  ceil(t = 1, e = 1e-3) {
    const i = Math.ceil((this.x + this.width - e) * t) / t, r = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = i - this.x, this.height = r - this.y, this;
  }
  /**
   * Scales the rectangle's dimensions and position by the specified factors.
   * @example
   * ```ts
   * const rect = new Rectangle(50, 50, 100, 100);
   *
   * // Scale uniformly
   * rect.scale(0.5, 0.5);
   * // rect is now: x=25, y=25, width=50, height=50
   *
   * // non-uniformly
   * rect.scale(0.5, 1);
   * // rect is now: x=25, y=50, width=50, height=100
   * ```
   * @param x - The factor by which to scale the horizontal properties (x, width).
   * @param y - The factor by which to scale the vertical properties (y, height).
   * @returns Returns itself
   */
  scale(t, e = t) {
    return this.x *= t, this.y *= e, this.width *= t, this.height *= e, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @example
   * ```ts
   * // Basic enlargement
   * const rect = new Rectangle(50, 50, 100, 100);
   * const other = new Rectangle(0, 0, 200, 75);
   * rect.enlarge(other);
   * // rect is now: x=0, y=0, width=200, height=150
   *
   * // Use for bounding box calculation
   * const bounds = new Rectangle();
   * objects.forEach((obj) => {
   *     bounds.enlarge(obj.getBounds());
   * });
   * ```
   * @param rectangle - The rectangle to include
   * @returns Returns itself
   * @see {@link Rectangle.fit} For shrinking to fit within another rectangle
   * @see {@link Rectangle.pad} For adding padding around the rectangle
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), i = Math.max(this.x + this.width, t.x + t.width), r = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = i - e, this.y = r, this.height = n - r, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @example
   * ```ts
   * // Basic bounds retrieval
   * const rect = new Rectangle(100, 100, 200, 150);
   * const bounds = rect.getBounds();
   *
   * // Reuse existing rectangle
   * const out = new Rectangle();
   * rect.getBounds(out);
   * ```
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle.copyFrom} For direct copying
   * @see {@link Rectangle.clone} For creating new copy
   */
  getBounds(t) {
    return t || (t = new q()), t.copyFrom(this), t;
  }
  /**
   * Determines whether another Rectangle is fully contained within this Rectangle.
   *
   * Rectangles that occupy the same space are considered to be containing each other.
   *
   * Rectangles without area (width or height equal to zero) can't contain anything,
   * not even other arealess rectangles.
   * @example
   * ```ts
   * // Check if one rectangle contains another
   * const container = new Rectangle(0, 0, 100, 100);
   * const inner = new Rectangle(25, 25, 50, 50);
   *
   * console.log(container.containsRect(inner)); // true
   *
   * // Check overlapping rectangles
   * const partial = new Rectangle(75, 75, 50, 50);
   * console.log(container.containsRect(partial)); // false
   *
   * // Zero-area rectangles
   * const empty = new Rectangle(0, 0, 0, 100);
   * console.log(container.containsRect(empty)); // false
   * ```
   * @param other - The Rectangle to check for containment
   * @returns True if other is fully contained within this Rectangle
   * @see {@link Rectangle.contains} For point containment
   * @see {@link Rectangle.intersects} For overlap testing
   */
  containsRect(t) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    const e = t.x, i = t.y, r = t.x + t.width, n = t.y + t.height;
    return e >= this.x && e < this.x + this.width && i >= this.y && i < this.y + this.height && r >= this.x && r < this.x + this.width && n >= this.y && n < this.y + this.height;
  }
  /**
   * Sets the position and dimensions of the rectangle.
   * @example
   * ```ts
   * // Basic usage
   * const rect = new Rectangle();
   * rect.set(100, 100, 200, 150);
   *
   * // Chain with other operations
   * const bounds = new Rectangle()
   *     .set(0, 0, 100, 100)
   *     .pad(10);
   * ```
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   * @returns Returns itself for method chaining
   * @see {@link Rectangle.copyFrom} For copying from another rectangle
   * @see {@link Rectangle.clone} For creating a new copy
   */
  set(t, e, i, r) {
    return this.x = t, this.y = e, this.width = i, this.height = r, this;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const as = {
  default: -1
};
function j(s = "default") {
  return as[s] === void 0 && (as[s] = -1), ++as[s];
}
const Ai = /* @__PURE__ */ new Set(), D = "8.0.0", ba = "8.3.4", Qt = {
  quiet: !1,
  noColor: !1
}, F = (s, t, e = 3) => {
  if (Qt.quiet || Ai.has(t))
    return;
  let i = new Error().stack;
  const r = `${t}
Deprecated since v${s}`, n = typeof console.groupCollapsed == "function" && !Qt.noColor;
  typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", r) : (i = i.split(`
`).splice(e).join(`
`), n ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    r
  ), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", r), console.warn(i))), Ai.add(t);
};
Object.defineProperties(F, {
  quiet: {
    get: () => Qt.quiet,
    set: (s) => {
      Qt.quiet = s;
    },
    enumerable: !0,
    configurable: !1
  },
  noColor: {
    get: () => Qt.noColor,
    set: (s) => {
      Qt.noColor = s;
    },
    enumerable: !0,
    configurable: !1
  }
});
const kr = () => {
};
function Oe(s) {
  return s += s === 0 ? 1 : 0, --s, s |= s >>> 1, s |= s >>> 2, s |= s >>> 4, s |= s >>> 8, s |= s >>> 16, s + 1;
}
function xi(s) {
  return !(s & s - 1) && !!s;
}
function Fr(s) {
  const t = {};
  for (const e in s)
    s[e] !== void 0 && (t[e] = s[e]);
  return t;
}
const yi = /* @__PURE__ */ Object.create(null);
function wa(s) {
  const t = yi[s];
  return t === void 0 && (yi[s] = j("resource")), t;
}
const Wr = class Rr extends ct {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ...Rr.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    F(D, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(t) {
    this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this._sharedResourceId = null, this.emit("change", this);
  }
  _generateResourceId() {
    const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    return this._sharedResourceId = wa(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
Wr.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let Ue = Wr;
const Gr = class zr extends ct {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.uid = j("textureSource"), this._resourceType = "textureSource", this._resourceId = j("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...zr.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new Ue(Fr(t)), this.destroyed = !1, this._refreshPOT();
  }
  /** returns itself */
  get source() {
    return this;
  }
  /** the style of the texture */
  get style() {
    return this._style;
  }
  set style(t) {
    this.style !== t && (this._style?.off("change", this._onStyleChange, this), this._style = t, this._style?.on("change", this._onStyleChange, this), this._onStyleChange());
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._style.maxAnisotropy = t;
  }
  get maxAnisotropy() {
    return this._style.maxAnisotropy;
  }
  /** setting this will set wrapModeU, wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(t) {
    this._style.addressMode = t;
  }
  /** setting this will set wrapModeU, wrapModeV and wrapModeW all at once! */
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(t) {
    this._style.addressMode = t;
  }
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(t) {
    this._style.magFilter = t;
  }
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(t) {
    this._style.minFilter = t;
  }
  /** Specifies behavior for sampling between mipmap levels. */
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(t) {
    this._style.mipmapFilter = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(t) {
    this._style.lodMinClamp = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(t) {
    this._style.lodMaxClamp = t;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  /** call this if you have modified the texture outside of the constructor */
  update() {
    if (this.resource) {
      const t = this._resolution;
      if (this.resize(this.resourceWidth / t, this.resourceHeight / t))
        return;
    }
    this.emit("update", this);
  }
  /** Destroys this texture source */
  destroy() {
    this.destroyed = !0, this.unload(), this.emit("destroy", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
  }
  /**
   * This will unload the Texture source from the GPU. This will free up the GPU memory
   * As soon as it is required fore rendering, it will be re-uploaded.
   */
  unload() {
    this._resourceId = j("resource"), this.emit("change", this), this.emit("unload", this);
    for (const t in this._gpuData)
      this._gpuData[t]?.destroy?.();
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /** the width of the resource. This is the REAL pure number, not accounting resolution   */
  get resourceWidth() {
    const { resource: t } = this;
    return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
  }
  /** the height of the resource. This is the REAL pure number, not accounting resolution */
  get resourceHeight() {
    const { resource: t } = this;
    return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
  }
  /**
   * the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
   * but will the size of the texture when rendered.
   *
   * changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
   * density will have increased)
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
  }
  /**
   * Resize the texture, this is handy if you want to use the texture as a render texture
   * @param width - the new width of the texture
   * @param height - the new height of the texture
   * @param resolution - the new resolution of the texture
   * @returns - if the texture was resized
   */
  resize(t, e, i) {
    i || (i = this._resolution), t || (t = this.width), e || (e = this.height);
    const r = Math.round(t * i), n = Math.round(e * i);
    return this.width = r / i, this.height = n / i, this._resolution = i, this.pixelWidth === r && this.pixelHeight === n ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = n, this.emit("resize", this), this._resourceId = j("resource"), this.emit("change", this), !0);
  }
  /**
   * Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
   * This is only important for RenderTexture instances, as standard Texture instances will have their
   * mipmaps generated on upload. You should call this method after you make any change to the texture
   *
   * The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
   * We want you, the developer to specify when this action should happen.
   *
   * Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
   */
  updateMipmaps() {
    this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
  }
  set wrapMode(t) {
    this._style.wrapMode = t;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(t) {
    this._style.scaleMode = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this._style.scaleMode;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = xi(this.pixelWidth) && xi(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
Gr.defaultOptions = {
  resolution: 1,
  format: "bgra8unorm",
  alphaMode: "premultiply-alpha-on-upload",
  dimensions: "2d",
  mipLevelCount: 1,
  autoGenerateMipmaps: !1,
  sampleCount: 1,
  antialias: !1,
  autoGarbageCollect: !1
};
let ut = Gr;
class Js extends ut {
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let i = t.format;
    i || (e instanceof Float32Array ? i = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? i = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? i = "rgba16uint" : (e instanceof Int8Array, i = "bgra8unorm")), super({
      ...t,
      resource: e,
      format: i
    }), this.uploadMethodId = "buffer";
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
Js.extension = I.TextureSource;
const bi = new W();
class Ca {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new W(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    this.texture !== t && (this._texture?.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update());
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const i = this.mapCoord;
    for (let r = 0; r < t.length; r += 2) {
      const n = t[r], a = t[r + 1];
      e[r] = n * i.a + a * i.c + i.tx, e[r + 1] = n * i.b + a * i.d + i.ty;
    }
    return e;
  }
  /**
   * Updates matrices if texture was changed
   * @returns - whether or not it was updated
   */
  update() {
    const t = this._texture;
    this._updateID++;
    const e = t.uvs;
    this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
    const i = t.orig, r = t.trim;
    r && (bi.set(
      i.width / r.width,
      0,
      0,
      i.height / r.height,
      -r.x / r.width,
      -r.y / r.height
    ), this.mapCoord.append(bi));
    const n = t.source, a = this.uClampFrame, o = this.clampMargin / n._resolution, h = this.clampOffset / n._resolution;
    return a[0] = (t.frame.x + o + h) / n.width, a[1] = (t.frame.y + o + h) / n.height, a[2] = (t.frame.x + t.frame.width - o + h) / n.width, a[3] = (t.frame.y + t.frame.height - o + h) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, !0;
  }
}
class R extends ct {
  /**
   * @param {TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: i,
    orig: r,
    trim: n,
    defaultAnchor: a,
    defaultBorders: o,
    rotate: h,
    dynamic: l
  } = {}) {
    if (super(), this.uid = j("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new q(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = t?.source ?? new ut(), this.noFrame = !i, i)
      this.frame.copyFrom(i);
    else {
      const { width: c, height: u } = this._source;
      this.frame.width = c, this.frame.height = u;
    }
    this.orig = r || this.frame, this.trim = n, this.rotate = h ?? 0, this.defaultAnchor = a, this.defaultBorders = o, this.destroyed = !1, this.dynamic = l || !1, this.updateUvs();
  }
  set source(t) {
    this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
  }
  /** the underlying source of the texture (equivalent of baseTexture in v7) */
  get source() {
    return this._source;
  }
  /** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
  get textureMatrix() {
    return this._textureMatrix || (this._textureMatrix = new Ca(this)), this._textureMatrix;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Call this function when you have modified the frame of this texture. */
  updateUvs() {
    const { uvs: t, frame: e } = this, { width: i, height: r } = this._source, n = e.x / i, a = e.y / r, o = e.width / i, h = e.height / r;
    let l = this.rotate;
    if (l) {
      const c = o / 2, u = h / 2, f = n + c, d = a + u;
      l = z.add(l, z.NW), t.x0 = f + c * z.uX(l), t.y0 = d + u * z.uY(l), l = z.add(l, 2), t.x1 = f + c * z.uX(l), t.y1 = d + u * z.uY(l), l = z.add(l, 2), t.x2 = f + c * z.uX(l), t.y2 = d + u * z.uY(l), l = z.add(l, 2), t.x3 = f + c * z.uX(l), t.y3 = d + u * z.uY(l);
    } else
      t.x0 = n, t.y0 = a, t.x1 = n + o, t.y1 = a, t.x2 = n + o, t.y2 = a + h, t.x3 = n, t.y3 = a + h;
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(t = !1) {
    this._source && (this._source.off("resize", this.update, this), t && (this._source.destroy(), this._source = null)), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
  }
  /**
   * Call this if you have modified the `texture outside` of the constructor.
   *
   * If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
   */
  update() {
    this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
  }
  /** @deprecated since 8.0.0 */
  get baseTexture() {
    return F(D, "Texture.baseTexture is now Texture.source"), this._source;
  }
}
R.EMPTY = new R({
  label: "EMPTY",
  source: new ut({
    label: "EMPTY"
  })
});
R.EMPTY.destroy = kr;
R.WHITE = new R({
  source: new Js({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
R.WHITE.destroy = kr;
function va(s, t, e) {
  const { width: i, height: r } = e.orig, n = e.trim;
  if (n) {
    const a = n.width, o = n.height;
    s.minX = n.x - t._x * i, s.maxX = s.minX + a, s.minY = n.y - t._y * r, s.maxY = s.minY + o;
  } else
    s.minX = -t._x * i, s.maxX = s.minX + i, s.minY = -t._y * r, s.maxY = s.minY + r;
}
const wi = new W();
class lt {
  /**
   * Creates a new Bounds object.
   * @param minX - The minimum X coordinate of the bounds.
   * @param minY - The minimum Y coordinate of the bounds.
   * @param maxX - The maximum X coordinate of the bounds.
   * @param maxY - The maximum Y coordinate of the bounds.
   */
  constructor(t = 1 / 0, e = 1 / 0, i = -1 / 0, r = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = wi, this.minX = t, this.minY = e, this.maxX = i, this.maxY = r;
  }
  /**
   * Checks if bounds are empty, meaning either width or height is zero or negative.
   * Empty bounds occur when min values exceed max values on either axis.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Check if newly created bounds are empty
   * console.log(bounds.isEmpty()); // true, default bounds are empty
   *
   * // Add frame and check again
   * bounds.addFrame(0, 0, 100, 100);
   * console.log(bounds.isEmpty()); // false, bounds now have area
   *
   * // Clear bounds
   * bounds.clear();
   * console.log(bounds.isEmpty()); // true, bounds are empty again
   * ```
   * @returns True if bounds are empty (have no area)
   * @see {@link Bounds#clear} For resetting bounds
   * @see {@link Bounds#isValid} For checking validity
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /**
   * The bounding rectangle representation of these bounds.
   * Lazily creates and updates a Rectangle instance based on the current bounds.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Get rectangle representation
   * const rect = bounds.rectangle;
   * console.log(rect.x, rect.y, rect.width, rect.height);
   *
   * // Use for hit testing
   * if (bounds.rectangle.contains(mouseX, mouseY)) {
   *     console.log('Mouse is inside bounds!');
   * }
   * ```
   * @see {@link Rectangle} For rectangle methods
   * @see {@link Bounds.isEmpty} For bounds validation
   */
  get rectangle() {
    this._rectangle || (this._rectangle = new q());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /**
   * Clears the bounds and resets all coordinates to their default values.
   * Resets the transformation matrix back to identity.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.isEmpty()); // false
   * // Clear the bounds
   * bounds.clear();
   * console.log(bounds.isEmpty()); // true
   * ```
   * @returns This bounds object for chaining
   */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = wi, this;
  }
  /**
   * Sets the bounds directly using coordinate values.
   * Provides a way to set all bounds values at once.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.set(0, 0, 100, 100);
   * ```
   * @param x0 - Left X coordinate of frame
   * @param y0 - Top Y coordinate of frame
   * @param x1 - Right X coordinate of frame
   * @param y1 - Bottom Y coordinate of frame
   * @see {@link Bounds#addFrame} For matrix-aware bounds setting
   * @see {@link Bounds#clear} For resetting bounds
   */
  set(t, e, i, r) {
    this.minX = t, this.minY = e, this.maxX = i, this.maxY = r;
  }
  /**
   * Adds a rectangular frame to the bounds, optionally transformed by a matrix.
   * Updates the bounds to encompass the new frame coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.addFrame(0, 0, 100, 100);
   *
   * // Add transformed frame
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addFrame(0, 0, 100, 100, matrix);
   * ```
   * @param x0 - Left X coordinate of frame
   * @param y0 - Top Y coordinate of frame
   * @param x1 - Right X coordinate of frame
   * @param y1 - Bottom Y coordinate of frame
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addRect} For adding Rectangle objects
   * @see {@link Bounds#addBounds} For adding other Bounds
   */
  addFrame(t, e, i, r, n) {
    n || (n = this.matrix);
    const a = n.a, o = n.b, h = n.c, l = n.d, c = n.tx, u = n.ty;
    let f = this.minX, d = this.minY, p = this.maxX, m = this.maxY, g = a * t + h * e + c, A = o * t + l * e + u;
    g < f && (f = g), A < d && (d = A), g > p && (p = g), A > m && (m = A), g = a * i + h * e + c, A = o * i + l * e + u, g < f && (f = g), A < d && (d = A), g > p && (p = g), A > m && (m = A), g = a * t + h * r + c, A = o * t + l * r + u, g < f && (f = g), A < d && (d = A), g > p && (p = g), A > m && (m = A), g = a * i + h * r + c, A = o * i + l * r + u, g < f && (f = g), A < d && (d = A), g > p && (p = g), A > m && (m = A), this.minX = f, this.minY = d, this.maxX = p, this.maxY = m;
  }
  /**
   * Adds a rectangle to the bounds, optionally transformed by a matrix.
   * Updates the bounds to encompass the given rectangle.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * // Add simple rectangle
   * const rect = new Rectangle(0, 0, 100, 100);
   * bounds.addRect(rect);
   *
   * // Add transformed rectangle
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addRect(rect, matrix);
   * ```
   * @param rect - The rectangle to be added
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding raw coordinates
   * @see {@link Bounds#addBounds} For adding other bounds
   */
  addRect(t, e) {
    this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
  }
  /**
   * Adds another bounds object to this one, optionally transformed by a matrix.
   * Expands the bounds to include the given bounds' area.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Add child bounds
   * const childBounds = sprite.getBounds();
   * bounds.addBounds(childBounds);
   *
   * // Add transformed bounds
   * const matrix = new Matrix()
   *     .scale(2, 2);
   * bounds.addBounds(childBounds, matrix);
   * ```
   * @param bounds - The bounds to be added
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding raw coordinates
   * @see {@link Bounds#addRect} For adding rectangles
   */
  addBounds(t, e) {
    this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
  }
  /**
   * Adds other Bounds as a mask, creating an intersection of the two bounds.
   * Only keeps the overlapping region between current bounds and mask bounds.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Create mask bounds
   * const mask = new Bounds();
   * mask.addFrame(50, 50, 150, 150);
   * // Apply mask - results in bounds of (50,50,100,100)
   * bounds.addBoundsMask(mask);
   * ```
   * @param mask - The Bounds to use as a mask
   * @see {@link Bounds#addBounds} For union operation
   * @see {@link Bounds#fit} For fitting to rectangle
   */
  addBoundsMask(t) {
    this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
  }
  /**
   * Applies a transformation matrix to the bounds, updating its coordinates.
   * Transforms all corners of the bounds using the given matrix.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Apply translation
   * const translateMatrix = new Matrix()
   *     .translate(50, 50);
   * bounds.applyMatrix(translateMatrix);
   * ```
   * @param matrix - The matrix to apply to the bounds
   * @see {@link Matrix} For matrix operations
   * @see {@link Bounds#addFrame} For adding transformed frames
   */
  applyMatrix(t) {
    const e = this.minX, i = this.minY, r = this.maxX, n = this.maxY, { a, b: o, c: h, d: l, tx: c, ty: u } = t;
    let f = a * e + h * i + c, d = o * e + l * i + u;
    this.minX = f, this.minY = d, this.maxX = f, this.maxY = d, f = a * r + h * i + c, d = o * r + l * i + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = a * e + h * n + c, d = o * e + l * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = a * r + h * n + c, d = o * r + l * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY;
  }
  /**
   * Resizes the bounds object to fit within the given rectangle.
   * Clips the bounds if they extend beyond the rectangle's edges.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 200, 200);
   * // Fit within viewport
   * const viewport = new Rectangle(50, 50, 100, 100);
   * bounds.fit(viewport);
   * // bounds are now (50, 50, 150, 150)
   * ```
   * @param rect - The rectangle to fit within
   * @returns This bounds object for chaining
   * @see {@link Bounds#addBoundsMask} For intersection
   * @see {@link Bounds#pad} For expanding bounds
   */
  fit(t) {
    return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * Similar to fit() but works with raw coordinate values instead of a Rectangle.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 200, 200);
   * // Fit to specific coordinates
   * bounds.fitBounds(50, 150, 50, 150);
   * // bounds are now (50, 50, 150, 150)
   * ```
   * @param left - The left value of the bounds
   * @param right - The right value of the bounds
   * @param top - The top value of the bounds
   * @param bottom - The bottom value of the bounds
   * @returns This bounds object for chaining
   * @see {@link Bounds#fit} For fitting to Rectangle
   * @see {@link Bounds#addBoundsMask} For intersection
   */
  fitBounds(t, e, i, r) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < i && (this.minY = i), this.maxY > r && (this.maxY = r), this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Add equal padding
   * bounds.pad(10);
   * // bounds are now (-10, -10, 110, 110)
   *
   * // Add different padding for x and y
   * bounds.pad(20, 10);
   * // bounds are now (-30, -20, 130, 120)
   * ```
   * @param paddingX - The horizontal padding amount
   * @param paddingY - The vertical padding amount
   * @returns This bounds object for chaining
   * @see {@link Bounds#fit} For constraining bounds
   * @see {@link Bounds#scale} For uniform scaling
   */
  pad(t, e = t) {
    return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
  }
  /**
   * Ceils the bounds by rounding up max values and rounding down min values.
   * Useful for pixel-perfect calculations and avoiding fractional pixels.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.set(10.2, 10.9, 50.1, 50.8);
   *
   * // Round to whole pixels
   * bounds.ceil();
   * // bounds are now (10, 10, 51, 51)
   * ```
   * @returns This bounds object for chaining
   * @see {@link Bounds#scale} For size adjustments
   * @see {@link Bounds#fit} For constraining bounds
   */
  ceil() {
    return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
  }
  /**
   * Creates a new Bounds instance with the same values.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Create a copy
   * const copy = bounds.clone();
   *
   * // Original and copy are independent
   * bounds.pad(10);
   * console.log(copy.width === bounds.width); // false
   * ```
   * @returns A new Bounds instance with the same values
   * @see {@link Bounds#copyFrom} For reusing existing bounds
   */
  clone() {
    return new lt(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values, adjusting all edges proportionally.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Scale uniformly
   * bounds.scale(2);
   * // bounds are now (0, 0, 200, 200)
   *
   * // Scale non-uniformly
   * bounds.scale(0.5, 2);
   * // bounds are now (0, 0, 100, 400)
   * ```
   * @param x - The X value to scale by
   * @param y - The Y value to scale by (defaults to x)
   * @returns This bounds object for chaining
   * @see {@link Bounds#pad} For adding padding
   * @see {@link Bounds#fit} For constraining size
   */
  scale(t, e = t) {
    return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
  }
  /**
   * The x position of the bounds in local space.
   * Setting this value will move the bounds while maintaining its width.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get x position
   * console.log(bounds.x); // 0
   *
   * // Move bounds horizontally
   * bounds.x = 50;
   * console.log(bounds.minX, bounds.maxX); // 50, 150
   *
   * // Width stays the same
   * console.log(bounds.width); // Still 100
   * ```
   */
  get x() {
    return this.minX;
  }
  set x(t) {
    const e = this.maxX - this.minX;
    this.minX = t, this.maxX = t + e;
  }
  /**
   * The y position of the bounds in local space.
   * Setting this value will move the bounds while maintaining its height.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get y position
   * console.log(bounds.y); // 0
   *
   * // Move bounds vertically
   * bounds.y = 50;
   * console.log(bounds.minY, bounds.maxY); // 50, 150
   *
   * // Height stays the same
   * console.log(bounds.height); // Still 100
   * ```
   */
  get y() {
    return this.minY;
  }
  set y(t) {
    const e = this.maxY - this.minY;
    this.minY = t, this.maxY = t + e;
  }
  /**
   * The width value of the bounds.
   * Represents the distance between minX and maxX coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get width
   * console.log(bounds.width); // 100
   * // Resize width
   * bounds.width = 200;
   * console.log(bounds.maxX - bounds.minX); // 200
   * ```
   */
  get width() {
    return this.maxX - this.minX;
  }
  set width(t) {
    this.maxX = this.minX + t;
  }
  /**
   * The height value of the bounds.
   * Represents the distance between minY and maxY coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get height
   * console.log(bounds.height); // 100
   * // Resize height
   * bounds.height = 150;
   * console.log(bounds.maxY - bounds.minY); // 150
   * ```
   */
  get height() {
    return this.maxY - this.minY;
  }
  set height(t) {
    this.maxY = this.minY + t;
  }
  /**
   * The left edge coordinate of the bounds.
   * Alias for minX.
   * @example
   * ```ts
   * const bounds = new Bounds(50, 0, 150, 100);
   * console.log(bounds.left); // 50
   * console.log(bounds.left === bounds.minX); // true
   * ```
   * @readonly
   */
  get left() {
    return this.minX;
  }
  /**
   * The right edge coordinate of the bounds.
   * Alias for maxX.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.right); // 100
   * console.log(bounds.right === bounds.maxX); // true
   * ```
   * @readonly
   */
  get right() {
    return this.maxX;
  }
  /**
   * The top edge coordinate of the bounds.
   * Alias for minY.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 25, 100, 125);
   * console.log(bounds.top); // 25
   * console.log(bounds.top === bounds.minY); // true
   * ```
   * @readonly
   */
  get top() {
    return this.minY;
  }
  /**
   * The bottom edge coordinate of the bounds.
   * Alias for maxY.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 200);
   * console.log(bounds.bottom); // 200
   * console.log(bounds.bottom === bounds.maxY); // true
   * ```
   * @readonly
   */
  get bottom() {
    return this.maxY;
  }
  /**
   * Whether the bounds has positive width and height.
   * Checks if both dimensions are greater than zero.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Check if bounds are positive
   * console.log(bounds.isPositive); // true
   *
   * // Negative bounds
   * bounds.maxX = bounds.minX;
   * console.log(bounds.isPositive); // false, width is 0
   * ```
   * @readonly
   * @see {@link Bounds#isEmpty} For checking empty state
   * @see {@link Bounds#isValid} For checking validity
   */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  /**
   * Whether the bounds has valid coordinates.
   * Checks if the bounds has been initialized with real values.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * console.log(bounds.isValid); // false, default state
   *
   * // Set valid bounds
   * bounds.addFrame(0, 0, 100, 100);
   * console.log(bounds.isValid); // true
   * ```
   * @readonly
   * @see {@link Bounds#isEmpty} For checking empty state
   * @see {@link Bounds#isPositive} For checking dimensions
   */
  get isValid() {
    return this.minX + this.minY !== 1 / 0;
  }
  /**
   * Adds vertices from a Float32Array to the bounds, optionally transformed by a matrix.
   * Used for efficiently updating bounds from raw vertex data.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Add vertices from geometry
   * const vertices = new Float32Array([
   *     0, 0,    // Vertex 1
   *     100, 0,  // Vertex 2
   *     100, 100 // Vertex 3
   * ]);
   * bounds.addVertexData(vertices, 0, 6);
   *
   * // Add transformed vertices
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addVertexData(vertices, 0, 6, matrix);
   *
   * // Add subset of vertices
   * bounds.addVertexData(vertices, 2, 4); // Only second vertex
   * ```
   * @param vertexData - The array of vertices to add
   * @param beginOffset - Starting index in the vertex array
   * @param endOffset - Ending index in the vertex array (excluded)
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding rectangular frames
   * @see {@link Matrix} For transformation details
   */
  addVertexData(t, e, i, r) {
    let n = this.minX, a = this.minY, o = this.maxX, h = this.maxY;
    r || (r = this.matrix);
    const l = r.a, c = r.b, u = r.c, f = r.d, d = r.tx, p = r.ty;
    for (let m = e; m < i; m += 2) {
      const g = t[m], A = t[m + 1], x = l * g + u * A + d, y = c * g + f * A + p;
      n = x < n ? x : n, a = y < a ? y : a, o = x > o ? x : o, h = y > h ? y : h;
    }
    this.minX = n, this.minY = a, this.maxX = o, this.maxY = h;
  }
  /**
   * Checks if a point is contained within the bounds.
   * Returns true if the point's coordinates fall within the bounds' area.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Basic point check
   * console.log(bounds.containsPoint(50, 50)); // true
   * console.log(bounds.containsPoint(150, 150)); // false
   *
   * // Check edges
   * console.log(bounds.containsPoint(0, 0));   // true, includes edges
   * console.log(bounds.containsPoint(100, 100)); // true, includes edges
   * ```
   * @param x - x coordinate to check
   * @param y - y coordinate to check
   * @returns True if the point is inside the bounds
   * @see {@link Bounds#isPositive} For valid bounds check
   * @see {@link Bounds#rectangle} For Rectangle representation
   */
  containsPoint(t, e) {
    return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
  }
  /**
   * Returns a string representation of the bounds.
   * Useful for debugging and logging bounds information.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.toString()); // "[pixi.js:Bounds minX=0 minY=0 maxX=100 maxY=100 width=100 height=100]"
   * ```
   * @returns A string describing the bounds
   * @see {@link Bounds#copyFrom} For copying bounds
   * @see {@link Bounds#clone} For creating a new instance
   */
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
  /**
   * Copies the bounds from another bounds object.
   * Useful for reusing bounds objects and avoiding allocations.
   * @example
   * ```ts
   * const sourceBounds = new Bounds(0, 0, 100, 100);
   * // Copy bounds
   * const targetBounds = new Bounds();
   * targetBounds.copyFrom(sourceBounds);
   * ```
   * @param bounds - The bounds to copy from
   * @returns This bounds object for chaining
   * @see {@link Bounds#clone} For creating new instances
   */
  copyFrom(t) {
    return this.minX = t.minX, this.minY = t.minY, this.maxX = t.maxX, this.maxY = t.maxY, this;
  }
}
var Ba = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, pt = function(s) {
  return typeof s == "string" ? s.length > 0 : typeof s == "number";
}, Z = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * s) / e + 0;
}, nt = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), s > e ? e : s > t ? s : t;
}, Dr = function(s) {
  return (s = isFinite(s) ? s % 360 : 0) > 0 ? s : s + 360;
}, Ci = function(s) {
  return { r: nt(s.r, 0, 255), g: nt(s.g, 0, 255), b: nt(s.b, 0, 255), a: nt(s.a) };
}, os = function(s) {
  return { r: Z(s.r), g: Z(s.g), b: Z(s.b), a: Z(s.a, 3) };
}, Sa = /^#([0-9a-f]{3,8})$/i, Me = function(s) {
  var t = s.toString(16);
  return t.length < 2 ? "0" + t : t;
}, Lr = function(s) {
  var t = s.r, e = s.g, i = s.b, r = s.a, n = Math.max(t, e, i), a = n - Math.min(t, e, i), o = a ? n === t ? (e - i) / a : n === e ? 2 + (i - t) / a : 4 + (t - e) / a : 0;
  return { h: 60 * (o < 0 ? o + 6 : o), s: n ? a / n * 100 : 0, v: n / 255 * 100, a: r };
}, Yr = function(s) {
  var t = s.h, e = s.s, i = s.v, r = s.a;
  t = t / 360 * 6, e /= 100, i /= 100;
  var n = Math.floor(t), a = i * (1 - e), o = i * (1 - (t - n) * e), h = i * (1 - (1 - t + n) * e), l = n % 6;
  return { r: 255 * [i, o, a, a, h, i][l], g: 255 * [h, i, i, o, a, a][l], b: 255 * [a, a, h, i, i, o][l], a: r };
}, vi = function(s) {
  return { h: Dr(s.h), s: nt(s.s, 0, 100), l: nt(s.l, 0, 100), a: nt(s.a) };
}, Bi = function(s) {
  return { h: Z(s.h), s: Z(s.s), l: Z(s.l), a: Z(s.a, 3) };
}, Si = function(s) {
  return Yr((e = (t = s).s, { h: t.h, s: (e *= ((i = t.l) < 50 ? i : 100 - i) / 100) > 0 ? 2 * e / (i + e) * 100 : 0, v: i + e, a: t.a }));
  var t, e, i;
}, ce = function(s) {
  return { h: (t = Lr(s)).h, s: (r = (200 - (e = t.s)) * (i = t.v) / 100) > 0 && r < 200 ? e * i / 100 / (r <= 100 ? r : 200 - r) * 100 : 0, l: r / 2, a: t.a };
  var t, e, i, r;
}, Pa = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ma = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ia = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ta = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Fs = { string: [[function(s) {
  var t = Sa.exec(s);
  return t ? (s = t[1]).length <= 4 ? { r: parseInt(s[0] + s[0], 16), g: parseInt(s[1] + s[1], 16), b: parseInt(s[2] + s[2], 16), a: s.length === 4 ? Z(parseInt(s[3] + s[3], 16) / 255, 2) : 1 } : s.length === 6 || s.length === 8 ? { r: parseInt(s.substr(0, 2), 16), g: parseInt(s.substr(2, 2), 16), b: parseInt(s.substr(4, 2), 16), a: s.length === 8 ? Z(parseInt(s.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(s) {
  var t = Ia.exec(s) || Ta.exec(s);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : Ci({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(s) {
  var t = Pa.exec(s) || Ma.exec(s);
  if (!t) return null;
  var e, i, r = vi({ h: (e = t[1], i = t[2], i === void 0 && (i = "deg"), Number(e) * (Ba[i] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return Si(r);
}, "hsl"]], object: [[function(s) {
  var t = s.r, e = s.g, i = s.b, r = s.a, n = r === void 0 ? 1 : r;
  return pt(t) && pt(e) && pt(i) ? Ci({ r: Number(t), g: Number(e), b: Number(i), a: Number(n) }) : null;
}, "rgb"], [function(s) {
  var t = s.h, e = s.s, i = s.l, r = s.a, n = r === void 0 ? 1 : r;
  if (!pt(t) || !pt(e) || !pt(i)) return null;
  var a = vi({ h: Number(t), s: Number(e), l: Number(i), a: Number(n) });
  return Si(a);
}, "hsl"], [function(s) {
  var t = s.h, e = s.s, i = s.v, r = s.a, n = r === void 0 ? 1 : r;
  if (!pt(t) || !pt(e) || !pt(i)) return null;
  var a = (function(o) {
    return { h: Dr(o.h), s: nt(o.s, 0, 100), v: nt(o.v, 0, 100), a: nt(o.a) };
  })({ h: Number(t), s: Number(e), v: Number(i), a: Number(n) });
  return Yr(a);
}, "hsv"]] }, Pi = function(s, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e][0](s);
    if (i) return [i, t[e][1]];
  }
  return [null, void 0];
}, Ea = function(s) {
  return typeof s == "string" ? Pi(s.trim(), Fs.string) : typeof s == "object" && s !== null ? Pi(s, Fs.object) : [null, void 0];
}, hs = function(s, t) {
  var e = ce(s);
  return { h: e.h, s: nt(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, ls = function(s) {
  return (299 * s.r + 587 * s.g + 114 * s.b) / 1e3 / 255;
}, Mi = function(s, t) {
  var e = ce(s);
  return { h: e.h, s: e.s, l: nt(e.l + 100 * t, 0, 100), a: e.a };
}, Ws = (function() {
  function s(t) {
    this.parsed = Ea(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return s.prototype.isValid = function() {
    return this.parsed !== null;
  }, s.prototype.brightness = function() {
    return Z(ls(this.rgba), 2);
  }, s.prototype.isDark = function() {
    return ls(this.rgba) < 0.5;
  }, s.prototype.isLight = function() {
    return ls(this.rgba) >= 0.5;
  }, s.prototype.toHex = function() {
    return t = os(this.rgba), e = t.r, i = t.g, r = t.b, a = (n = t.a) < 1 ? Me(Z(255 * n)) : "", "#" + Me(e) + Me(i) + Me(r) + a;
    var t, e, i, r, n, a;
  }, s.prototype.toRgb = function() {
    return os(this.rgba);
  }, s.prototype.toRgbString = function() {
    return t = os(this.rgba), e = t.r, i = t.g, r = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + i + ", " + r + ", " + n + ")" : "rgb(" + e + ", " + i + ", " + r + ")";
    var t, e, i, r, n;
  }, s.prototype.toHsl = function() {
    return Bi(ce(this.rgba));
  }, s.prototype.toHslString = function() {
    return t = Bi(ce(this.rgba)), e = t.h, i = t.s, r = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + i + "%, " + r + "%, " + n + ")" : "hsl(" + e + ", " + i + "%, " + r + "%)";
    var t, e, i, r, n;
  }, s.prototype.toHsv = function() {
    return t = Lr(this.rgba), { h: Z(t.h), s: Z(t.s), v: Z(t.v), a: Z(t.a, 3) };
    var t;
  }, s.prototype.invert = function() {
    return ft({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, s.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), ft(hs(this.rgba, t));
  }, s.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), ft(hs(this.rgba, -t));
  }, s.prototype.grayscale = function() {
    return ft(hs(this.rgba, -1));
  }, s.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), ft(Mi(this.rgba, t));
  }, s.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), ft(Mi(this.rgba, -t));
  }, s.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, s.prototype.alpha = function(t) {
    return typeof t == "number" ? ft({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : Z(this.rgba.a, 3);
    var e;
  }, s.prototype.hue = function(t) {
    var e = ce(this.rgba);
    return typeof t == "number" ? ft({ h: t, s: e.s, l: e.l, a: e.a }) : Z(e.h);
  }, s.prototype.isEqual = function(t) {
    return this.toHex() === ft(t).toHex();
  }, s;
})(), ft = function(s) {
  return s instanceof Ws ? s : new Ws(s);
}, Ii = [], ka = function(s) {
  s.forEach(function(t) {
    Ii.indexOf(t) < 0 && (t(Ws, Fs), Ii.push(t));
  });
};
function Fa(s, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, i = {};
  for (var r in e) i[e[r]] = r;
  var n = {};
  s.prototype.toName = function(a) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var o, h, l = i[this.toHex()];
    if (l) return l;
    if (a?.closest) {
      var c = this.toRgb(), u = 1 / 0, f = "black";
      if (!n.length) for (var d in e) n[d] = new s(e[d]).toRgb();
      for (var p in e) {
        var m = (o = c, h = n[p], Math.pow(o.r - h.r, 2) + Math.pow(o.g - h.g, 2) + Math.pow(o.b - h.b, 2));
        m < u && (u = m, f = p);
      }
      return f;
    }
  }, t.string.push([function(a) {
    var o = a.toLowerCase(), h = o === "transparent" ? "#0000" : e[o];
    return h ? new s(h).toRgb() : null;
  }, "name"]);
}
ka([Fa]);
const Vt = class ae {
  /**
   * @param {ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  /**
   * Get the red component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('red');
   * console.log(color.red); // 1
   *
   * const green = new Color('#00ff00');
   * console.log(green.red); // 0
   * ```
   */
  get red() {
    return this._components[0];
  }
  /**
   * Get the green component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('lime');
   * console.log(color.green); // 1
   *
   * const red = new Color('#ff0000');
   * console.log(red.green); // 0
   * ```
   */
  get green() {
    return this._components[1];
  }
  /**
   * Get the blue component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('blue');
   * console.log(color.blue); // 1
   *
   * const yellow = new Color('#ffff00');
   * console.log(yellow.blue); // 0
   * ```
   */
  get blue() {
    return this._components[2];
  }
  /**
   * Get the alpha component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('red');
   * console.log(color.alpha); // 1 (fully opaque)
   *
   * const transparent = new Color('rgba(255, 0, 0, 0.5)');
   * console.log(transparent.alpha); // 0.5 (semi-transparent)
   * ```
   */
  get alpha() {
    return this._components[3];
  }
  /**
   * Sets the color value and returns the instance for chaining.
   *
   * This is a chainable version of setting the `value` property.
   * @param value - The color to set. Accepts various formats:
   * - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
   * - RGB/RGBA values (arrays, objects)
   * - CSS color names
   * - HSL/HSLA values
   * - HSV/HSVA values
   * @returns The Color instance for chaining
   * @example
   * ```ts
   * // Basic usage
   * const color = new Color();
   * color.setValue('#ff0000')
   *     .setAlpha(0.5)
   *     .premultiply(0.8);
   *
   * // Different formats
   * color.setValue(0xff0000);          // Hex number
   * color.setValue('#ff0000');         // Hex string
   * color.setValue([1, 0, 0]);         // RGB array
   * color.setValue([1, 0, 0, 0.5]);    // RGBA array
   * color.setValue({ r: 1, g: 0, b: 0 }); // RGB object
   *
   * // Copy from another color
   * const red = new Color('red');
   * color.setValue(red);
   * ```
   * @throws {Error} If the color value is invalid or null
   * @see {@link Color.value} For the underlying value property
   */
  setValue(t) {
    return this.value = t, this;
  }
  /**
   * The current color source. This property allows getting and setting the color value
   * while preserving the original format where possible.
   * @remarks
   * When setting:
   * - Setting to a `Color` instance copies its source and components
   * - Setting to other valid sources normalizes and stores the value
   * - Setting to `null` throws an Error
   * - The color remains unchanged if normalization fails
   *
   * When getting:
   * - Returns `null` if color was modified by {@link Color.multiply} or {@link Color.premultiply}
   * - Otherwise returns the original color source
   * @example
   * ```ts
   * // Setting different color formats
   * const color = new Color();
   *
   * color.value = 0xff0000;         // Hex number
   * color.value = '#ff0000';        // Hex string
   * color.value = [1, 0, 0];        // RGB array
   * color.value = [1, 0, 0, 0.5];   // RGBA array
   * color.value = { r: 1, g: 0, b: 0 }; // RGB object
   *
   * // Copying from another color
   * const red = new Color('red');
   * color.value = red;  // Copies red's components
   *
   * // Getting the value
   * console.log(color.value);  // Returns original format
   *
   * // After modifications
   * color.multiply([0.5, 0.5, 0.5]);
   * console.log(color.value);  // Returns null
   * ```
   * @throws {Error} When attempting to set `null`
   */
  set value(t) {
    if (t instanceof ae)
      this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null)
        throw new Error("Cannot set Color#value to null");
      (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  _cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? { ...t } : t;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  _isSourceEqual(t, e) {
    const i = typeof t;
    if (i !== typeof e)
      return !1;
    if (i === "number" || i === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((n, a) => n === e[a]);
    if (t !== null && e !== null) {
      const n = Object.keys(t), a = Object.keys(e);
      return n.length !== a.length ? !1 : n.every((o) => t[o] === e[o]);
    }
    return t === e;
  }
  /**
   * Convert to a RGBA color object with normalized components (0-1).
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGBA objects
   * new Color('white').toRgba();     // returns { r: 1, g: 1, b: 1, a: 1 }
   * new Color('#ff0000').toRgba();   // returns { r: 1, g: 0, b: 0, a: 1 }
   *
   * // With transparency
   * new Color('rgba(255,0,0,0.5)').toRgba(); // returns { r: 1, g: 0, b: 0, a: 0.5 }
   * ```
   * @returns An RGBA object with normalized components
   */
  toRgba() {
    const [t, e, i, r] = this._components;
    return { r: t, g: e, b: i, a: r };
  }
  /**
   * Convert to a RGB color object with normalized components (0-1).
   *
   * Alpha component is omitted in the output.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGB objects
   * new Color('white').toRgb();     // returns { r: 1, g: 1, b: 1 }
   * new Color('#ff0000').toRgb();   // returns { r: 1, g: 0, b: 0 }
   *
   * // Alpha is ignored
   * new Color('rgba(255,0,0,0.5)').toRgb(); // returns { r: 1, g: 0, b: 0 }
   * ```
   * @returns An RGB object with normalized components
   */
  toRgb() {
    const [t, e, i] = this._components;
    return { r: t, g: e, b: i };
  }
  /**
   * Convert to a CSS-style rgba string representation.
   *
   * RGB components are scaled to 0-255 range, alpha remains 0-1.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGBA strings
   * new Color('white').toRgbaString();     // returns "rgba(255,255,255,1)"
   * new Color('#ff0000').toRgbaString();   // returns "rgba(255,0,0,1)"
   *
   * // With transparency
   * new Color([1, 0, 0, 0.5]).toRgbaString(); // returns "rgba(255,0,0,0.5)"
   * ```
   * @returns A CSS-compatible rgba string
   */
  toRgbaString() {
    const [t, e, i] = this.toUint8RgbArray();
    return `rgba(${t},${e},${i},${this.alpha})`;
  }
  /**
   * Convert to an [R, G, B] array of clamped uint8 values (0 to 255).
   * @param {number[]|Uint8Array|Uint8ClampedArray} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGB components as integers between 0-255
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toUint8RgbArray(); // returns [255, 255, 255]
   * new Color('#ff0000').toUint8RgbArray(); // returns [255, 0, 0]
   *
   * // Using custom output array
   * const rgb = new Uint8Array(3);
   * new Color('blue').toUint8RgbArray(rgb); // rgb is now [0, 0, 255]
   *
   * // Using different array types
   * new Color('red').toUint8RgbArray(new Uint8ClampedArray(3)); // [255, 0, 0]
   * new Color('red').toUint8RgbArray([]); // [255, 0, 0]
   * ```
   * @remarks
   * - Output values are always clamped between 0-255
   * - Alpha component is not included in output
   * - Reuses internal cache array if no output array provided
   */
  toUint8RgbArray(t) {
    const [e, i, r] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb), t[0] = Math.round(e * 255), t[1] = Math.round(i * 255), t[2] = Math.round(r * 255), t;
  }
  /**
   * Convert to an [R, G, B, A] array of normalized floats (numbers from 0.0 to 1.0).
   * @param {number[]|Float32Array} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGBA components as floats between 0-1
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toArray();  // returns [1, 1, 1, 1]
   * new Color('red').toArray();    // returns [1, 0, 0, 1]
   *
   * // With alpha
   * new Color('rgba(255,0,0,0.5)').toArray(); // returns [1, 0, 0, 0.5]
   *
   * // Using custom output array
   * const rgba = new Float32Array(4);
   * new Color('blue').toArray(rgba); // rgba is now [0, 0, 1, 1]
   * ```
   * @remarks
   * - Output values are normalized between 0-1
   * - Includes alpha component as the fourth value
   * - Reuses internal cache array if no output array provided
   */
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t || (t = this._arrayRgba);
    const [e, i, r, n] = this._components;
    return t[0] = e, t[1] = i, t[2] = r, t[3] = n, t;
  }
  /**
   * Convert to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
   * @param {number[]|Float32Array} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGB components as floats between 0-1
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toRgbArray(); // returns [1, 1, 1]
   * new Color('red').toRgbArray();   // returns [1, 0, 0]
   *
   * // Using custom output array
   * const rgb = new Float32Array(3);
   * new Color('blue').toRgbArray(rgb); // rgb is now [0, 0, 1]
   * ```
   * @remarks
   * - Output values are normalized between 0-1
   * - Alpha component is omitted from output
   * - Reuses internal cache array if no output array provided
   */
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb);
    const [e, i, r] = this._components;
    return t[0] = e, t[1] = i, t[2] = r, t;
  }
  /**
   * Convert to a hexadecimal number.
   * @returns The color as a 24-bit RGB integer
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toNumber(); // returns 0xffffff
   * new Color('red').toNumber();   // returns 0xff0000
   *
   * // Store as hex
   * const color = new Color('blue');
   * const hex = color.toNumber(); // 0x0000ff
   * ```
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a BGR number.
   *
   * Useful for platforms that expect colors in BGR format.
   * @returns The color as a 24-bit BGR integer
   * @example
   * ```ts
   * // Convert RGB to BGR
   * new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
   *
   * // Common use case: platform-specific color format
   * const color = new Color('orange');
   * const bgrColor = color.toBgrNumber(); // Color with swapped R/B channels
   * ```
   * @remarks
   * This swaps the red and blue channels compared to the normal RGB format:
   * - RGB 0xRRGGBB becomes BGR 0xBBGGRR
   */
  toBgrNumber() {
    const [t, e, i] = this.toUint8RgbArray();
    return (i << 16) + (e << 8) + t;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   *
   * Useful for platforms that expect colors in little endian byte order.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert RGB color to little endian format
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   *
   * // Common use cases:
   * const color = new Color('orange');
   * const leColor = color.toLittleEndianNumber(); // Swaps byte order for LE systems
   *
   * // Multiple conversions
   * const colors = {
   *     normal: 0xffcc99,
   *     littleEndian: new Color(0xffcc99).toLittleEndianNumber(), // 0x99ccff
   *     backToNormal: new Color(0x99ccff).toLittleEndianNumber()  // 0xffcc99
   * };
   * ```
   * @remarks
   * - Swaps R and B channels in the color value
   * - RGB 0xRRGGBB becomes 0xBBGGRR
   * - Useful for systems that use little endian byte order
   * - Can be used to convert back and forth between formats
   * @returns The color as a number in little endian format (BBGGRR)
   * @see {@link Color.toBgrNumber} For BGR format without byte swapping
   */
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  /**
   * Multiply with another color.
   *
   * This action is destructive and modifies the original color.
   * @param {ColorSource} value - The color to multiply by. Accepts any valid color format:
   * - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
   * - RGB/RGBA arrays ([1, 0, 0], [1, 0, 0, 1])
   * - Color objects ({ r: 1, g: 0, b: 0 })
   * - CSS color names ('red', 'blue')
   * @returns this - The Color instance for chaining
   * @example
   * ```ts
   * // Basic multiplication
   * const color = new Color('#ff0000');
   * color.multiply(0x808080); // 50% darker red
   *
   * // With transparency
   * color.multiply([1, 1, 1, 0.5]); // 50% transparent
   *
   * // Chain operations
   * color
   *     .multiply('#808080')
   *     .multiply({ r: 1, g: 1, b: 1, a: 0.5 });
   * ```
   * @remarks
   * - Multiplies each RGB component and alpha separately
   * - Values are clamped between 0-1
   * - Original color format is lost (value becomes null)
   * - Operation cannot be undone
   */
  multiply(t) {
    const [e, i, r, n] = ae._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= i, this._components[2] *= r, this._components[3] *= n, this._refreshInt(), this._value = null, this;
  }
  /**
   * Converts color to a premultiplied alpha format.
   *
   * This action is destructive and modifies the original color.
   * @param alpha - The alpha value to multiply by (0-1)
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
   * @returns {Color} The Color instance for chaining
   * @example
   * ```ts
   * // Basic premultiplication
   * const color = new Color('red');
   * color.premultiply(0.5); // 50% transparent red with premultiplied RGB
   *
   * // Alpha only (RGB unchanged)
   * color.premultiply(0.5, false); // 50% transparent, original RGB
   *
   * // Chain with other operations
   * color
   *     .multiply(0x808080)
   *     .premultiply(0.5)
   *     .toNumber();
   * ```
   * @remarks
   * - RGB channels are multiplied by alpha when applyToRGB is true
   * - Alpha is always set to the provided value
   * - Values are clamped between 0-1
   * - Original color format is lost (value becomes null)
   * - Operation cannot be undone
   */
  premultiply(t, e = !0) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
  }
  /**
   * Returns the color as a 32-bit premultiplied alpha integer.
   *
   * Format: 0xAARRGGBB
   * @param {number} alpha - The alpha value to multiply by (0-1)
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
   * @returns {number} The premultiplied color as a 32-bit integer
   * @example
   * ```ts
   * // Convert to premultiplied format
   * const color = new Color('red');
   *
   * // Full opacity (0xFFRRGGBB)
   * color.toPremultiplied(1.0); // 0xFFFF0000
   *
   * // 50% transparency with premultiplied RGB
   * color.toPremultiplied(0.5); // 0x7F7F0000
   *
   * // 50% transparency without RGB premultiplication
   * color.toPremultiplied(0.5, false); // 0x7FFF0000
   * ```
   * @remarks
   * - Returns full opacity (0xFF000000) when alpha is 1.0
   * - Returns 0 when alpha is 0.0 and applyToRGB is true
   * - RGB values are rounded during premultiplication
   */
  toPremultiplied(t, e = !0) {
    if (t === 1)
      return (255 << 24) + this._int;
    if (t === 0)
      return e ? 0 : this._int;
    let i = this._int >> 16 & 255, r = this._int >> 8 & 255, n = this._int & 255;
    return e && (i = i * t + 0.5 | 0, r = r * t + 0.5 | 0, n = n * t + 0.5 | 0), (t * 255 << 24) + (i << 16) + (r << 8) + n;
  }
  /**
   * Convert to a hexadecimal string (6 characters).
   * @returns A CSS-compatible hex color string (e.g., "#ff0000")
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Basic colors
   * new Color('red').toHex();    // returns "#ff0000"
   * new Color('white').toHex();  // returns "#ffffff"
   * new Color('black').toHex();  // returns "#000000"
   *
   * // From different formats
   * new Color(0xff0000).toHex(); // returns "#ff0000"
   * new Color([1, 0, 0]).toHex(); // returns "#ff0000"
   * new Color({ r: 1, g: 0, b: 0 }).toHex(); // returns "#ff0000"
   * ```
   * @remarks
   * - Always returns a 6-character hex string
   * - Includes leading "#" character
   * - Alpha channel is ignored
   * - Values are rounded to nearest hex value
   */
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  /**
   * Convert to a hexadecimal string with alpha (8 characters).
   * @returns A CSS-compatible hex color string with alpha (e.g., "#ff0000ff")
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Fully opaque colors
   * new Color('red').toHexa();   // returns "#ff0000ff"
   * new Color('white').toHexa(); // returns "#ffffffff"
   *
   * // With transparency
   * new Color('rgba(255, 0, 0, 0.5)').toHexa(); // returns "#ff00007f"
   * new Color([1, 0, 0, 0]).toHexa(); // returns "#ff000000"
   * ```
   * @remarks
   * - Returns an 8-character hex string
   * - Includes leading "#" character
   * - Alpha is encoded in last two characters
   * - Values are rounded to nearest hex value
   */
  toHexa() {
    const e = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - e.length) + e;
  }
  /**
   * Set alpha (transparency) value while preserving color components.
   *
   * Provides a chainable interface for setting alpha.
   * @param alpha - Alpha value between 0 (fully transparent) and 1 (fully opaque)
   * @returns The Color instance for chaining
   * @example
   * ```ts
   * // Basic alpha setting
   * const color = new Color('red');
   * color.setAlpha(0.5);  // 50% transparent red
   *
   * // Chain with other operations
   * color
   *     .setValue('#ff0000')
   *     .setAlpha(0.8)    // 80% opaque
   *     .premultiply(0.5); // Further modify alpha
   *
   * // Reset to fully opaque
   * color.setAlpha(1);
   * ```
   * @remarks
   * - Alpha value is clamped between 0-1
   * - Can be chained with other color operations
   */
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  _normalize(t) {
    let e, i, r, n;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const a = t;
      e = (a >> 16 & 255) / 255, i = (a >> 8 & 255) / 255, r = (a & 255) / 255, n = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, i, r, n = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, i, r, n = 255] = t, e /= 255, i /= 255, r /= 255, n /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const o = ae.HEX_PATTERN.exec(t);
        o && (t = `#${o[2]}`);
      }
      const a = ft(t);
      a.isValid() && ({ r: e, g: i, b: r, a: n } = a.rgba, e /= 255, i /= 255, r /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = i, this._components[2] = r, this._components[3] = n, this._refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, i] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (i * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, i = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), i) : (t.forEach((r, n) => {
      t[n] = Math.min(Math.max(r, e), i);
    }), t);
  }
  /**
   * Check if a value can be interpreted as a valid color format.
   * Supports all color formats that can be used with the Color class.
   * @param value - Value to check
   * @returns True if the value can be used as a color
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // CSS colors and hex values
   * Color.isColorLike('red');          // true
   * Color.isColorLike('#ff0000');      // true
   * Color.isColorLike(0xff0000);       // true
   *
   * // Arrays (RGB/RGBA)
   * Color.isColorLike([1, 0, 0]);      // true
   * Color.isColorLike([1, 0, 0, 0.5]); // true
   *
   * // TypedArrays
   * Color.isColorLike(new Float32Array([1, 0, 0]));          // true
   * Color.isColorLike(new Uint8Array([255, 0, 0]));          // true
   * Color.isColorLike(new Uint8ClampedArray([255, 0, 0]));   // true
   *
   * // Object formats
   * Color.isColorLike({ r: 1, g: 0, b: 0 });            // true (RGB)
   * Color.isColorLike({ r: 1, g: 0, b: 0, a: 0.5 });    // true (RGBA)
   * Color.isColorLike({ h: 0, s: 100, l: 50 });         // true (HSL)
   * Color.isColorLike({ h: 0, s: 100, l: 50, a: 0.5 }); // true (HSLA)
   * Color.isColorLike({ h: 0, s: 100, v: 100 });        // true (HSV)
   * Color.isColorLike({ h: 0, s: 100, v: 100, a: 0.5 });// true (HSVA)
   *
   * // Color instances
   * Color.isColorLike(new Color('red')); // true
   *
   * // Invalid values
   * Color.isColorLike(null);           // false
   * Color.isColorLike(undefined);      // false
   * Color.isColorLike({});             // false
   * Color.isColorLike([]);             // false
   * Color.isColorLike('not-a-color');  // false
   * ```
   * @remarks
   * Checks for the following formats:
   * - Numbers (0x000000 to 0xffffff)
   * - CSS color strings
   * - RGB/RGBA arrays and objects
   * - HSL/HSLA objects
   * - HSV/HSVA objects
   * - TypedArrays (Float32Array, Uint8Array, Uint8ClampedArray)
   * - Color instances
   * @see {@link ColorSource} For supported color format types
   * @see {@link Color.setValue} For setting color values
   * @category utility
   */
  static isColorLike(t) {
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof ae || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
Vt.shared = new Vt();
Vt._temp = new Vt();
Vt.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let K = Vt;
const Wa = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
let cs = 0;
const Ti = 500;
function Y(...s) {
  cs !== Ti && (cs++, cs === Ti ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...s));
}
const be = {
  /**
   * Set of registered pools and cleanable objects.
   * @private
   */
  _registeredResources: /* @__PURE__ */ new Set(),
  /**
   * Registers a pool or cleanable object for cleanup.
   * @param {Cleanable} pool - The pool or object to register.
   */
  register(s) {
    this._registeredResources.add(s);
  },
  /**
   * Unregisters a pool or cleanable object from cleanup.
   * @param {Cleanable} pool - The pool or object to unregister.
   */
  unregister(s) {
    this._registeredResources.delete(s);
  },
  /** Clears all registered pools and cleanable objects. This will call clear() on each registered item. */
  release() {
    this._registeredResources.forEach((s) => s.clear());
  },
  /**
   * Gets the number of registered pools and cleanable objects.
   * @returns {number} The count of registered items.
   */
  get registeredCount() {
    return this._registeredResources.size;
  },
  /**
   * Checks if a specific pool or cleanable object is registered.
   * @param {Cleanable} pool - The pool or object to check.
   * @returns {boolean} True if the item is registered, false otherwise.
   */
  isRegistered(s) {
    return this._registeredResources.has(s);
  },
  /**
   * Removes all registrations without clearing the pools.
   * Useful if you want to reset the collector without affecting the pools.
   */
  reset() {
    this._registeredResources.clear();
  }
};
class Ra {
  /**
   * Constructs a new Pool.
   * @param ClassType - The constructor of the items in the pool.
   * @param {number} [initialSize] - The initial size of the pool.
   */
  constructor(t, e) {
    this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e);
  }
  /**
   * Prepopulates the pool with a given number of items.
   * @param total - The number of items to add to the pool.
   */
  prepopulate(t) {
    for (let e = 0; e < t; e++)
      this._pool[this._index++] = new this._classType();
    this._count += t;
  }
  /**
   * Gets an item from the pool. Calls the item's `init` method if it exists.
   * If there are no items left in the pool, a new one will be created.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t) {
    let e;
    return this._index > 0 ? e = this._pool[--this._index] : (e = new this._classType(), this._count++), e.init?.(t), e;
  }
  /**
   * Returns an item to the pool. Calls the item's `reset` method if it exists.
   * @param {T} item - The item to return to the pool.
   */
  return(t) {
    t.reset?.(), this._pool[this._index++] = t;
  }
  /**
   * Gets the number of items in the pool.
   * @readonly
   */
  get totalSize() {
    return this._count;
  }
  /**
   * Gets the number of items in the pool that are free to use without needing to create more.
   * @readonly
   */
  get totalFree() {
    return this._index;
  }
  /**
   * Gets the number of items in the pool that are currently in use.
   * @readonly
   */
  get totalUsed() {
    return this._count - this._index;
  }
  /** clears the pool */
  clear() {
    if (this._pool.length > 0 && this._pool[0].destroy)
      for (let t = 0; t < this._index; t++)
        this._pool[t].destroy();
    this._pool.length = 0, this._count = 0, this._index = 0;
  }
}
class Ga {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  /**
   * Prepopulates a specific pool with a given number of items.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {number} total - The number of items to add to the pool.
   */
  prepopulate(t, e) {
    this.getPool(t).prepopulate(e);
  }
  /**
   * Gets an item from a specific pool.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t, e) {
    return this.getPool(t).get(e);
  }
  /**
   * Returns an item to its respective pool.
   * @param {PoolItem} item - The item to return to the pool.
   */
  return(t) {
    this.getPool(t.constructor).return(t);
  }
  /**
   * Gets a specific pool based on the class type.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
   * @returns {Pool<T>} The pool of the given class type.
   */
  getPool(t) {
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new Ra(t)), this._poolsByClass.get(t);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const i = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[i] = {
        free: e.totalFree,
        used: e.totalUsed,
        size: e.totalSize
      };
    }), t;
  }
  /** Clears all pools in the group. This will reset all pools and free their resources. */
  clear() {
    this._poolsByClass.forEach((t) => t.clear()), this._poolsByClass.clear();
  }
}
const at = new Ga();
be.register(at);
const za = {
  get isCachedAsTexture() {
    return !!this.renderGroup?.isCachedAsTexture;
  },
  cacheAsTexture(s) {
    typeof s == "boolean" && s === !1 ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(s === !0 ? {} : s));
  },
  updateCacheTexture() {
    this.renderGroup?.updateCacheTexture();
  },
  get cacheAsBitmap() {
    return this.isCachedAsTexture;
  },
  set cacheAsBitmap(s) {
    F("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead."), this.cacheAsTexture(s);
  }
};
function Da(s, t, e) {
  const i = s.length;
  let r;
  if (t >= i || e === 0)
    return;
  e = t + e > i ? i - t : e;
  const n = i - e;
  for (r = t; r < n; ++r)
    s[r] = s[r + e];
  s.length = n;
}
const La = {
  allowChildren: !0,
  removeChildren(s = 0, t) {
    const e = t ?? this.children.length, i = e - s, r = [];
    if (i > 0 && i <= e) {
      for (let a = e - 1; a >= s; a--) {
        const o = this.children[a];
        o && (r.push(o), o.parent = null);
      }
      Da(this.children, s, e);
      const n = this.renderGroup || this.parentRenderGroup;
      n && n.removeChildren(r);
      for (let a = 0; a < r.length; ++a) {
        const o = r[a];
        o.parentRenderLayer?.detach(o), this.emit("childRemoved", o, this, a), r[a].emit("removed", this);
      }
      return r.length > 0 && this._didViewChangeTick++, r;
    } else if (i === 0 && this.children.length === 0)
      return r;
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  },
  removeChildAt(s) {
    const t = this.getChildAt(s);
    return this.removeChild(t);
  },
  getChildAt(s) {
    if (s < 0 || s >= this.children.length)
      throw new Error(`getChildAt: Index (${s}) does not exist.`);
    return this.children[s];
  },
  setChildIndex(s, t) {
    if (t < 0 || t >= this.children.length)
      throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
    this.getChildIndex(s), this.addChildAt(s, t);
  },
  getChildIndex(s) {
    const t = this.children.indexOf(s);
    if (t === -1)
      throw new Error("The supplied Container must be a child of the caller");
    return t;
  },
  addChildAt(s, t) {
    this.allowChildren || F(D, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${s}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    if (s.parent) {
      const r = s.parent.children.indexOf(s);
      if (s.parent === this && r === t)
        return s;
      r !== -1 && s.parent.children.splice(r, 1);
    }
    t === e.length ? e.push(s) : e.splice(t, 0, s), s.parent = this, s.didChange = !0, s._updateFlags = 15;
    const i = this.renderGroup || this.parentRenderGroup;
    return i && i.addChild(s), this.sortableChildren && (this.sortDirty = !0), this.emit("childAdded", s, this, t), s.emit("added", this), s;
  },
  swapChildren(s, t) {
    if (s === t)
      return;
    const e = this.getChildIndex(s), i = this.getChildIndex(t);
    this.children[e] = t, this.children[i] = s;
    const r = this.renderGroup || this.parentRenderGroup;
    r && (r.structureDidChange = !0), this._didContainerChangeTick++;
  },
  removeFromParent() {
    this.parent?.removeChild(this);
  },
  reparentChild(...s) {
    return s.length === 1 ? this.reparentChildAt(s[0], this.children.length) : (s.forEach((t) => this.reparentChildAt(t, this.children.length)), s[0]);
  },
  reparentChildAt(s, t) {
    if (s.parent === this)
      return this.setChildIndex(s, t), s;
    const e = s.worldTransform.clone();
    s.removeFromParent(), this.addChildAt(s, t);
    const i = this.worldTransform.clone();
    return i.invert(), e.prepend(i), s.setFromMatrix(e), s;
  },
  replaceChild(s, t) {
    s.updateLocalTransform(), this.addChildAt(t, this.getChildIndex(s)), t.setFromMatrix(s.localTransform), t.updateLocalTransform(), this.removeChild(s);
  }
}, Ya = {
  collectRenderables(s, t, e) {
    this.parentRenderLayer && this.parentRenderLayer !== e || this.globalDisplayStatus < 7 || !this.includeInBuild || (this.sortableChildren && this.sortChildren(), this.isSimple ? this.collectRenderablesSimple(s, t, e) : this.renderGroup ? t.renderPipes.renderGroup.addRenderGroup(this.renderGroup, s) : this.collectRenderablesWithEffects(s, t, e));
  },
  collectRenderablesSimple(s, t, e) {
    const i = this.children, r = i.length;
    for (let n = 0; n < r; n++)
      i[n].collectRenderables(s, t, e);
  },
  collectRenderablesWithEffects(s, t, e) {
    const { renderPipes: i } = t;
    for (let r = 0; r < this.effects.length; r++) {
      const n = this.effects[r];
      i[n.pipe].push(n, this, s);
    }
    this.collectRenderablesSimple(s, t, e);
    for (let r = this.effects.length - 1; r >= 0; r--) {
      const n = this.effects[r];
      i[n.pipe].pop(n, this, s);
    }
  }
};
class Ei {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class Qa {
  constructor() {
    this._effectClasses = [], this._tests = [], this._initialized = !1;
  }
  init() {
    this._initialized || (this._initialized = !0, this._effectClasses.forEach((t) => {
      this.add({
        test: t.test,
        maskClass: t
      });
    }));
  }
  add(t) {
    this._tests.push(t);
  }
  getMaskEffect(t) {
    this._initialized || this.init();
    for (let e = 0; e < this._tests.length; e++) {
      const i = this._tests[e];
      if (i.test(t))
        return at.get(i.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    at.return(t);
  }
}
const Rs = new Qa();
_.handleByList(I.MaskEffect, Rs._effectClasses);
const Xa = {
  _maskEffect: null,
  _maskOptions: {
    inverse: !1
  },
  _filterEffect: null,
  effects: [],
  _markStructureAsChanged() {
    const s = this.renderGroup || this.parentRenderGroup;
    s && (s.structureDidChange = !0);
  },
  addEffect(s) {
    this.effects.indexOf(s) === -1 && (this.effects.push(s), this.effects.sort((e, i) => e.priority - i.priority), this._markStructureAsChanged(), this._updateIsSimple());
  },
  removeEffect(s) {
    const t = this.effects.indexOf(s);
    t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple());
  },
  set mask(s) {
    const t = this._maskEffect;
    t?.mask !== s && (t && (this.removeEffect(t), Rs.returnMaskEffect(t), this._maskEffect = null), s != null && (this._maskEffect = Rs.getMaskEffect(s), this.addEffect(this._maskEffect)));
  },
  get mask() {
    return this._maskEffect?.mask;
  },
  setMask(s) {
    this._maskOptions = {
      ...this._maskOptions,
      ...s
    }, s.mask && (this.mask = s.mask), this._markStructureAsChanged();
  },
  set filters(s) {
    !Array.isArray(s) && s && (s = [s]);
    const t = this._filterEffect || (this._filterEffect = new Ei());
    s = s;
    const e = s?.length > 0, i = t.filters?.length > 0, r = e !== i;
    s = Array.isArray(s) ? s.slice(0) : s, t.filters = Object.freeze(s), r && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = s ?? null));
  },
  get filters() {
    return this._filterEffect?.filters;
  },
  set filterArea(s) {
    this._filterEffect || (this._filterEffect = new Ei()), this._filterEffect.filterArea = s;
  },
  get filterArea() {
    return this._filterEffect?.filterArea;
  }
}, Na = {
  label: null,
  get name() {
    return F(D, "Container.name property has been removed, use Container.label instead"), this.label;
  },
  set name(s) {
    F(D, "Container.name property has been removed, use Container.label instead"), this.label = s;
  },
  getChildByName(s, t = !1) {
    return this.getChildByLabel(s, t);
  },
  getChildByLabel(s, t = !1) {
    const e = this.children;
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      if (r.label === s || s instanceof RegExp && s.test(r.label))
        return r;
    }
    if (t)
      for (let i = 0; i < e.length; i++) {
        const n = e[i].getChildByLabel(s, !0);
        if (n)
          return n;
      }
    return null;
  },
  getChildrenByLabel(s, t = !1, e = []) {
    const i = this.children;
    for (let r = 0; r < i.length; r++) {
      const n = i[r];
      (n.label === s || s instanceof RegExp && s.test(n.label)) && e.push(n);
    }
    if (t)
      for (let r = 0; r < i.length; r++)
        i[r].getChildrenByLabel(s, !0, e);
    return e;
  }
}, tt = at.getPool(W), mt = at.getPool(lt), Va = new W(), Oa = {
  getFastGlobalBounds(s, t) {
    t || (t = new lt()), t.clear(), this._getGlobalBoundsRecursive(!!s, t, this.parentRenderLayer), t.isValid || t.set(0, 0, 0, 0);
    const e = this.renderGroup || this.parentRenderGroup;
    return t.applyMatrix(e.worldTransform), t;
  },
  _getGlobalBoundsRecursive(s, t, e) {
    let i = t;
    if (s && this.parentRenderLayer && this.parentRenderLayer !== e || this.localDisplayStatus !== 7 || !this.measurable)
      return;
    const r = !!this.effects.length;
    if ((this.renderGroup || r) && (i = mt.get().clear()), this.boundsArea)
      t.addRect(this.boundsArea, this.worldTransform);
    else {
      if (this.renderPipeId) {
        const a = this.bounds;
        i.addFrame(
          a.minX,
          a.minY,
          a.maxX,
          a.maxY,
          this.groupTransform
        );
      }
      const n = this.children;
      for (let a = 0; a < n.length; a++)
        n[a]._getGlobalBoundsRecursive(s, i, e);
    }
    if (r) {
      let n = !1;
      const a = this.renderGroup || this.parentRenderGroup;
      for (let o = 0; o < this.effects.length; o++)
        this.effects[o].addBounds && (n || (n = !0, i.applyMatrix(a.worldTransform)), this.effects[o].addBounds(i, !0));
      n && i.applyMatrix(a.worldTransform.copyTo(Va).invert()), t.addBounds(i), mt.return(i);
    } else this.renderGroup && (t.addBounds(i, this.relativeGroupTransform), mt.return(i));
  }
};
function Qr(s, t, e) {
  e.clear();
  let i, r;
  return s.parent ? t ? i = s.parent.worldTransform : (r = tt.get().identity(), i = _s(s, r)) : i = W.IDENTITY, Xr(s, e, i, t), r && tt.return(r), e.isValid || e.set(0, 0, 0, 0), e;
}
function Xr(s, t, e, i) {
  if (!s.visible || !s.measurable)
    return;
  let r;
  i ? r = s.worldTransform : (s.updateLocalTransform(), r = tt.get(), r.appendFrom(s.localTransform, e));
  const n = t, a = !!s.effects.length;
  if (a && (t = mt.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, r);
  else {
    const o = s.bounds;
    o && !o.isEmpty() && (t.matrix = r, t.addBounds(o));
    for (let h = 0; h < s.children.length; h++)
      Xr(s.children[h], t, r, i);
  }
  if (a) {
    for (let o = 0; o < s.effects.length; o++)
      s.effects[o].addBounds?.(t);
    n.addBounds(t, W.IDENTITY), mt.return(t);
  }
  i || tt.return(r);
}
function _s(s, t) {
  const e = s.parent;
  return e && (_s(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
function Nr(s, t) {
  if (s === 16777215 || !t)
    return t;
  if (t === 16777215 || !s)
    return s;
  const e = s >> 16 & 255, i = s >> 8 & 255, r = s & 255, n = t >> 16 & 255, a = t >> 8 & 255, o = t & 255, h = e * n / 255 | 0, l = i * a / 255 | 0, c = r * o / 255 | 0;
  return (h << 16) + (l << 8) + c;
}
const ki = 16777215;
function Fi(s, t) {
  return s === ki ? t : t === ki ? s : Nr(s, t);
}
function Qe(s) {
  return ((s & 255) << 16) + (s & 65280) + (s >> 16 & 255);
}
const Ua = {
  getGlobalAlpha(s) {
    if (s)
      return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
    let t = this.alpha, e = this.parent;
    for (; e; )
      t *= e.alpha, e = e.parent;
    return t;
  },
  getGlobalTransform(s = new W(), t) {
    if (t)
      return s.copyFrom(this.worldTransform);
    this.updateLocalTransform();
    const e = _s(this, tt.get().identity());
    return s.appendFrom(this.localTransform, e), tt.return(e), s;
  },
  getGlobalTint(s) {
    if (s)
      return this.renderGroup ? Qe(this.renderGroup.worldColor) : this.parentRenderGroup ? Qe(
        Fi(this.localColor, this.parentRenderGroup.worldColor)
      ) : this.tint;
    let t = this.localColor, e = this.parent;
    for (; e; )
      t = Fi(t, e.localColor), e = e.parent;
    return Qe(t);
  }
};
function Vr(s, t, e) {
  return t.clear(), e || (e = W.IDENTITY), Or(s, t, e, s, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function Or(s, t, e, i, r) {
  let n;
  if (r)
    n = tt.get(), n = e.copyTo(n);
  else {
    if (!s.visible || !s.measurable)
      return;
    s.updateLocalTransform();
    const h = s.localTransform;
    n = tt.get(), n.appendFrom(h, e);
  }
  const a = t, o = !!s.effects.length;
  if (o && (t = mt.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, n);
  else {
    s.renderPipeId && (t.matrix = n, t.addBounds(s.bounds));
    const h = s.children;
    for (let l = 0; l < h.length; l++)
      Or(h[l], t, n, i, !1);
  }
  if (o) {
    for (let h = 0; h < s.effects.length; h++)
      s.effects[h].addLocalBounds?.(t, i);
    a.addBounds(t, W.IDENTITY), mt.return(t);
  }
  tt.return(n);
}
function Ur(s, t) {
  const e = s.children;
  for (let i = 0; i < e.length; i++) {
    const r = e[i], n = r.uid, a = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, o = t.index;
    (t.data[o] !== n || t.data[o + 1] !== a) && (t.data[t.index] = n, t.data[t.index + 1] = a, t.didChange = !0), t.index = o + 2, r.children.length && Ur(r, t);
  }
  return t.didChange;
}
const Ha = new W(), ja = {
  _localBoundsCacheId: -1,
  _localBoundsCacheData: null,
  _setWidth(s, t) {
    const e = Math.sign(this.scale.x) || 1;
    t !== 0 ? this.scale.x = s / t * e : this.scale.x = e;
  },
  _setHeight(s, t) {
    const e = Math.sign(this.scale.y) || 1;
    t !== 0 ? this.scale.y = s / t * e : this.scale.y = e;
  },
  getLocalBounds() {
    this._localBoundsCacheData || (this._localBoundsCacheData = {
      data: [],
      index: 1,
      didChange: !1,
      localBounds: new lt()
    });
    const s = this._localBoundsCacheData;
    return s.index = 1, s.didChange = !1, s.data[0] !== this._didViewChangeTick && (s.didChange = !0, s.data[0] = this._didViewChangeTick), Ur(this, s), s.didChange && Vr(this, s.localBounds, Ha), s.localBounds;
  },
  getBounds(s, t) {
    return Qr(this, s, t || new lt());
  }
}, qa = {
  _onRender: null,
  set onRender(s) {
    const t = this.renderGroup || this.parentRenderGroup;
    if (!s) {
      this._onRender && t?.removeOnRender(this), this._onRender = null;
      return;
    }
    this._onRender || t?.addOnRender(this), this._onRender = s;
  },
  get onRender() {
    return this._onRender;
  }
}, Ka = {
  _zIndex: 0,
  sortDirty: !1,
  sortableChildren: !1,
  get zIndex() {
    return this._zIndex;
  },
  set zIndex(s) {
    this._zIndex !== s && (this._zIndex = s, this.depthOfChildModified());
  },
  depthOfChildModified() {
    this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
  },
  sortChildren() {
    this.sortDirty && (this.sortDirty = !1, this.children.sort(Za));
  }
};
function Za(s, t) {
  return s._zIndex - t._zIndex;
}
const Ja = {
  getGlobalPosition(s = new J(), t = !1) {
    return this.parent ? this.parent.toGlobal(this._position, s, t) : (s.x = this._position.x, s.y = this._position.y), s;
  },
  toGlobal(s, t, e = !1) {
    const i = this.getGlobalTransform(tt.get(), e);
    return t = i.apply(s, t), tt.return(i), t;
  },
  toLocal(s, t, e, i) {
    t && (s = t.toGlobal(s, e, i));
    const r = this.getGlobalTransform(tt.get(), i);
    return e = r.applyInverse(s, e), tt.return(r), e;
  }
};
class Hr {
  constructor() {
    this.uid = j("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0;
  }
  /**
   * Destroy the instruction set, clearing the instructions and renderables.
   * @internal
   */
  destroy() {
    this.instructions.length = 0, this.renderables.length = 0, this.renderPipes = null, this.gcTick = 0;
  }
  /**
   * Add an instruction to the set
   * @param instruction - add an instruction to the set
   */
  add(t) {
    this.instructions[this.instructionSize++] = t;
  }
  /**
   * Log the instructions to the console (for debugging)
   * @internal
   */
  log() {
    this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
  }
}
let _a = 0;
class $a {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
   */
  constructor(t) {
    this._poolKeyHash = /* @__PURE__ */ Object.create(null), this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1, this.textureStyle = new Ue(this.textureOptions);
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   * @param antialias
   */
  createTexture(t, e, i) {
    const r = new ut({
      ...this.textureOptions,
      width: t,
      height: e,
      resolution: 1,
      antialias: i,
      autoGarbageCollect: !1
    });
    return new R({
      source: r,
      label: `texturePool_${_a++}`
    });
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param frameWidth - The minimum width of the render texture.
   * @param frameHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param antialias
   * @returns The new render texture.
   */
  getOptimalTexture(t, e, i = 1, r) {
    let n = Math.ceil(t * i - 1e-6), a = Math.ceil(e * i - 1e-6);
    n = Oe(n), a = Oe(a);
    const o = (n << 17) + (a << 1) + (r ? 1 : 0);
    this._texturePool[o] || (this._texturePool[o] = []);
    let h = this._texturePool[o].pop();
    return h || (h = this.createTexture(n, a, r)), h.source._resolution = i, h.source.width = n / i, h.source.height = a / i, h.source.pixelWidth = n, h.source.pixelHeight = a, h.frame.x = 0, h.frame.y = 0, h.frame.width = t, h.frame.height = e, h.updateUvs(), this._poolKeyHash[h.uid] = o, h;
  }
  /**
   * Gets extra texture of the same size as input renderTexture
   * @param texture - The texture to check what size it is.
   * @param antialias - Whether to use antialias.
   * @returns A texture that is a power of two
   */
  getSameSizeTexture(t, e = !1) {
    const i = t.source;
    return this.getOptimalTexture(t.width, t.height, i._resolution, e);
  }
  /**
   * Place a render texture back into the pool. Optionally reset the style of the texture to the default texture style.
   * useful if you modified the style of the texture after getting it from the pool.
   * @param renderTexture - The renderTexture to free
   * @param resetStyle - Whether to reset the style of the texture to the default texture style
   */
  returnTexture(t, e = !1) {
    const i = this._poolKeyHash[t.uid];
    e && (t.source.style = this.textureStyle), this._texturePool[i].push(t);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(t) {
    if (t = t !== !1, t)
      for (const e in this._texturePool) {
        const i = this._texturePool[e];
        if (i)
          for (let r = 0; r < i.length; r++)
            i[r].destroy(!0);
      }
    this._texturePool = {};
  }
}
const jr = new $a();
be.register(jr);
class to {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new W(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new Hr(), this._onRenderContainers = [], this.textureNeedsUpdate = !0, this.isCachedAsTexture = !1, this._matrixDirty = 7;
  }
  init(t) {
    this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
    const e = t.children;
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      r._updateFlags = 15, this.addChild(r);
    }
  }
  enableCacheAsTexture(t = {}) {
    this.textureOptions = t, this.isCachedAsTexture = !0, this.textureNeedsUpdate = !0;
  }
  disableCacheAsTexture() {
    this.isCachedAsTexture = !1, this.texture && (jr.returnTexture(this.texture, !0), this.texture = null);
  }
  updateCacheTexture() {
    this.textureNeedsUpdate = !0;
    const t = this._parentCacheAsTextureRenderGroup;
    t && !t.textureNeedsUpdate && t.updateCacheTexture();
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const t in this.childrenToUpdate) {
      const e = this.childrenToUpdate[t];
      e.list.fill(null), e.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture();
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(t) {
    t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t);
  }
  _removeRenderGroupChild(t) {
    const e = this.renderGroupChildren.indexOf(t);
    e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null;
  }
  addChild(t) {
    if (this.structureDidChange = !0, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = !0, this.onChildUpdate(t), t.renderGroup) {
      this.addRenderGroupChild(t.renderGroup);
      return;
    }
    t._onRender && this.addOnRender(t);
    const e = t.children;
    for (let i = 0; i < e.length; i++)
      this.addChild(e[i]);
  }
  removeChild(t) {
    if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
      this._removeRenderGroupChild(t.renderGroup);
      return;
    }
    const e = t.children;
    for (let i = 0; i < e.length; i++)
      this.removeChild(e[i]);
  }
  removeChildren(t) {
    for (let e = 0; e < t.length; e++)
      this.removeChild(t[e]);
  }
  onChildUpdate(t) {
    let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
    e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = {
      index: 0,
      list: []
    }), e.list[e.index++] = t;
  }
  updateRenderable(t) {
    t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = !1);
  }
  onChildViewUpdate(t) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(t) {
    this._onRenderContainers.push(t);
  }
  removeOnRender(t) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1);
  }
  runOnRender(t) {
    for (let e = 0; e < this._onRenderContainers.length; e++)
      this._onRenderContainers[e]._onRender(t);
  }
  destroy() {
    this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
  }
  getChildren(t = []) {
    const e = this.root.children;
    for (let i = 0; i < e.length; i++)
      this._getChildren(e[i], t);
    return t;
  }
  _getChildren(t, e = []) {
    if (e.push(t), t.renderGroup)
      return e;
    const i = t.children;
    for (let r = 0; r < i.length; r++)
      this._getChildren(i[r], e);
    return e;
  }
  invalidateMatrices() {
    this._matrixDirty = 7;
  }
  /**
   * Returns the inverse of the world transform matrix.
   * @returns {Matrix} The inverse of the world transform matrix.
   */
  get inverseWorldTransform() {
    return (this._matrixDirty & 1) === 0 ? this._inverseWorldTransform : (this._matrixDirty &= -2, this._inverseWorldTransform || (this._inverseWorldTransform = new W()), this._inverseWorldTransform.copyFrom(this.worldTransform).invert());
  }
  /**
   * Returns the inverse of the texture offset transform matrix.
   * @returns {Matrix} The inverse of the texture offset transform matrix.
   */
  get textureOffsetInverseTransform() {
    return (this._matrixDirty & 2) === 0 ? this._textureOffsetInverseTransform : (this._matrixDirty &= -3, this._textureOffsetInverseTransform || (this._textureOffsetInverseTransform = new W()), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(
      -this._textureBounds.x,
      -this._textureBounds.y
    ));
  }
  /**
   * Returns the inverse of the parent texture transform matrix.
   * This is used to properly transform coordinates when rendering into cached textures.
   * @returns {Matrix} The inverse of the parent texture transform matrix.
   */
  get inverseParentTextureTransform() {
    if ((this._matrixDirty & 4) === 0)
      return this._inverseParentTextureTransform;
    this._matrixDirty &= -5;
    const t = this._parentCacheAsTextureRenderGroup;
    return t ? (this._inverseParentTextureTransform || (this._inverseParentTextureTransform = new W()), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(t.inverseWorldTransform).translate(
      -t._textureBounds.x,
      -t._textureBounds.y
    )) : this.worldTransform;
  }
  /**
   * Returns a matrix that transforms coordinates to the correct coordinate space of the texture being rendered to.
   * This is the texture offset inverse transform of the closest parent RenderGroup that is cached as a texture.
   * @returns {Matrix | null} The transform matrix for the cached texture coordinate space,
   * or null if no parent is cached as texture.
   */
  get cacheToLocalTransform() {
    return this.isCachedAsTexture ? this.textureOffsetInverseTransform : this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null;
  }
}
function eo(s, t, e = {}) {
  for (const i in t)
    !e[i] && t[i] !== void 0 && (s[i] = t[i]);
}
const us = new $(null), Ie = new $(null), ds = new $(null, 1, 1), Te = new $(null), Wi = 1, so = 2, fs = 4;
class wt extends ct {
  constructor(t = {}) {
    super(), this.uid = j("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.parentRenderLayer = null, this.updateTick = -1, this.localTransform = new W(), this.relativeGroupTransform = new W(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new $(this, 0, 0), this._scale = ds, this._pivot = Ie, this._origin = Te, this._skew = us, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], eo(this, t, {
      children: !0,
      parent: !0,
      effects: !0
    }), t.children?.forEach((e) => this.addChild(e)), t.parent?.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   * @deprecated since 8.8.0
   */
  static mixin(t) {
    F("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead."), _.mixin(wt, t);
  }
  // = 'default';
  /**
   * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
   * @deprecated since 8.2.6
   * @ignore
   */
  set _didChangeId(t) {
    this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095;
  }
  /** @ignore */
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  /**
   * Adds one or more children to the container.
   * The children will be rendered as part of this container's display list.
   * @example
   * ```ts
   * // Add a single child
   * container.addChild(sprite);
   *
   * // Add multiple children
   * container.addChild(background, player, foreground);
   *
   * // Add with type checking
   * const sprite = container.addChild<Sprite>(new Sprite(texture));
   * sprite.tint = 'red';
   * ```
   * @param children - The Container(s) to add to the container
   * @returns The first child that was added
   * @see {@link Container#removeChild} For removing children
   * @see {@link Container#addChildAt} For adding at specific index
   */
  addChild(...t) {
    if (this.allowChildren || F(D, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
      for (let r = 0; r < t.length; r++)
        this.addChild(t[r]);
      return t[0];
    }
    const e = t[0], i = this.renderGroup || this.parentRenderGroup;
    return e.parent === this ? (this.children.splice(this.children.indexOf(e), 1), this.children.push(e), i && (i.structureDidChange = !0), e) : (e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15, i && i.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e);
  }
  /**
   * Removes one or more children from the container.
   * When removing multiple children, events will be triggered for each child in sequence.
   * @example
   * ```ts
   * // Remove a single child
   * const removed = container.removeChild(sprite);
   *
   * // Remove multiple children
   * const bg = container.removeChild(background, player, userInterface);
   *
   * // Remove with type checking
   * const sprite = container.removeChild<Sprite>(childSprite);
   * sprite.texture = newTexture;
   * ```
   * @param children - The Container(s) to remove
   * @returns The first child that was removed
   * @see {@link Container#addChild} For adding children
   * @see {@link Container#removeChildren} For removing multiple children
   */
  removeChild(...t) {
    if (t.length > 1) {
      for (let r = 0; r < t.length; r++)
        this.removeChild(t[r]);
      return t[0];
    }
    const e = t[0], i = this.children.indexOf(e);
    return i > -1 && (this._didViewChangeTick++, this.children.splice(i, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parentRenderLayer && e.parentRenderLayer.detach(e), e.parent = null, this.emit("childRemoved", e, this, i), e.emit("removed", this)), e;
  }
  /** @ignore */
  _onUpdate(t) {
    t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
  }
  set isRenderGroup(t) {
    !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup());
  }
  /**
   * Returns true if this container is a render group.
   * This means that it will be rendered as a separate pass, with its own set of instructions
   * @advanced
   */
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  /**
   * Calling this enables a render group for this container.
   * This means it will be rendered as a separate set of instructions.
   * The transform of the container will also be handled on the GPU rather than the CPU.
   * @advanced
   */
  enableRenderGroup() {
    if (this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t?.removeChild(this), this.renderGroup = at.get(to, this), this.groupTransform = W.IDENTITY, t?.addChild(this), this._updateIsSimple();
  }
  /**
   * This will disable the render group for this container.
   * @advanced
   */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t?.removeChild(this), at.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t?.addChild(this), this._updateIsSimple();
  }
  /** @ignore */
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   *
   * This matrix represents the absolute transformation in the scene graph.
   * @example
   * ```ts
   * // Get world position
   * const worldPos = container.worldTransform;
   * console.log(`World position: (${worldPos.tx}, ${worldPos.ty})`);
   * ```
   * @readonly
   * @see {@link Container#localTransform} For local space transform
   */
  get worldTransform() {
    return this._worldTransform || (this._worldTransform = new W()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
  }
  /**
   * The position of the container on the x axis relative to the local coordinates of the parent.
   *
   * An alias to position.x
   * @example
   * ```ts
   * // Basic position
   * container.x = 100;
   * ```
   */
  get x() {
    return this._position.x;
  }
  set x(t) {
    this._position.x = t;
  }
  /**
   * The position of the container on the y axis relative to the local coordinates of the parent.
   *
   * An alias to position.y
   * @example
   * ```ts
   * // Basic position
   * container.y = 200;
   * ```
   */
  get y() {
    return this._position.y;
  }
  set y(t) {
    this._position.y = t;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @example
   * ```ts
   * // Basic position setting
   * container.position.set(100, 200);
   * container.position.set(100); // Sets both x and y to 100
   * // Using point data
   * container.position = { x: 50, y: 75 };
   * ```
   * @since 4.0.0
   */
  get position() {
    return this._position;
  }
  set position(t) {
    this._position.copyFrom(t);
  }
  /**
   * The rotation of the object in radians.
   *
   * > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
   * > rotation is in radians, angle is in degrees.
   * @example
   * ```ts
   * // Basic rotation
   * container.rotation = Math.PI / 4; // 45 degrees
   *
   * // Convert from degrees
   * const degrees = 45;
   * container.rotation = degrees * Math.PI / 180;
   *
   * // Rotate around center
   * container.pivot.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // 180 degrees
   *
   * // Rotate around center with origin
   * container.origin.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // 180 degrees
   * ```
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew));
  }
  /**
   * The angle of the object in degrees.
   *
   * > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
   * > rotation is in radians, angle is in degrees.
   * @example
   * ```ts
   * // Basic angle rotation
   * sprite.angle = 45; // 45 degrees
   *
   * // Rotate around center
   * sprite.pivot.set(sprite.width / 2, sprite.height / 2);
   * sprite.angle = 180; // Half rotation
   *
   * // Rotate around center with origin
   * sprite.origin.set(sprite.width / 2, sprite.height / 2);
   * sprite.angle = 180; // Half rotation
   *
   * // Reset rotation
   * sprite.angle = 0;
   * ```
   */
  get angle() {
    return this.rotation * pa;
  }
  set angle(t) {
    this.rotation = t * ma;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space.
   * The `position` is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @example
   * ```ts
   * // Rotate around center
   * container.pivot.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // Rotates around center
   * ```
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === Ie && (this._pivot = new $(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === Ie && (this._pivot = new $(this, 0, 0), this._origin !== Te && Y("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians. Skewing is a transformation that distorts
   * the object by rotating it differently at each point, creating a non-uniform shape.
   * @example
   * ```ts
   * // Basic skewing
   * container.skew.set(0.5, 0); // Skew horizontally
   * container.skew.set(0, 0.5); // Skew vertically
   *
   * // Skew with point data
   * container.skew = { x: 0.3, y: 0.3 }; // Diagonal skew
   *
   * // Reset skew
   * container.skew.set(0, 0);
   *
   * // Animate skew
   * app.ticker.add(() => {
   *     // Create wave effect
   *     container.skew.x = Math.sin(Date.now() / 1000) * 0.3;
   * });
   *
   * // Combine with rotation
   * container.rotation = Math.PI / 4; // 45 degrees
   * container.skew.set(0.2, 0.2); // Skew the rotated object
   * ```
   * @since 4.0.0
   * @type {ObservablePoint} Point-like object with x/y properties in radians
   * @default {x: 0, y: 0}
   */
  get skew() {
    return this._skew === us && (this._skew = new $(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === us && (this._skew = new $(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @example
   * ```ts
   * // Basic scaling
   * container.scale.set(2, 2); // Scales to double size
   * container.scale.set(2); // Scales uniformly to double size
   * container.scale = 2; // Scales uniformly to double size
   * // Scale to a specific width and height
   * container.setSize(200, 100); // Sets width to 200 and height to 100
   * ```
   * @since 4.0.0
   */
  get scale() {
    return this._scale === ds && (this._scale = new $(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === ds && (this._scale = new $(this, 0, 0)), typeof t == "string" && (t = parseFloat(t)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
  }
  /**
   * @experimental
   * The origin point around which the container rotates and scales without affecting its position.
   * Unlike pivot, changing the origin will not move the container's position.
   * @example
   * ```ts
   * // Rotate around center point
   * container.origin.set(container.width / 2, container.height / 2);
   * container.rotation = Math.PI; // Rotates around center
   *
   * // Reset origin
   * container.origin.set(0, 0);
   * ```
   */
  get origin() {
    return this._origin === Te && (this._origin = new $(this, 0, 0)), this._origin;
  }
  set origin(t) {
    this._origin === Te && (this._origin = new $(this, 0, 0), this._pivot !== Ie && Y("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._origin.set(t) : this._origin.copyFrom(t);
  }
  /**
   * The width of the Container, setting this will actually modify the scale to achieve the value set.
   * > [!NOTE] Changing the width will adjust the scale.x property of the container while maintaining its aspect ratio.
   * > [!NOTE] If you want to set both width and height at the same time, use {@link Container#setSize}
   * as it is more optimized by not recalculating the local bounds twice.
   * @example
   * ```ts
   * // Basic width setting
   * container.width = 100;
   * // Optimized width setting
   * container.setSize(100, 100);
   * ```
   */
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(t) {
    const e = this.getLocalBounds().width;
    this._setWidth(t, e);
  }
  /**
   * The height of the Container,
   * > [!NOTE] Changing the height will adjust the scale.y property of the container while maintaining its aspect ratio.
   * > [!NOTE] If you want to set both width and height at the same time, use {@link Container#setSize}
   * as it is more optimized by not recalculating the local bounds twice.
   * @example
   * ```ts
   * // Basic height setting
   * container.height = 200;
   * // Optimized height setting
   * container.setSize(100, 200);
   * ```
   */
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(t) {
    const e = this.getLocalBounds().height;
    this._setHeight(t, e);
  }
  /**
   * Retrieves the size of the container as a [Size]{@link Size} object.
   *
   * This is faster than get the width and height separately.
   * @example
   * ```ts
   * // Basic size retrieval
   * const size = container.getSize();
   * console.log(`Size: ${size.width}x${size.height}`);
   *
   * // Reuse existing size object
   * const reuseSize = { width: 0, height: 0 };
   * container.getSize(reuseSize);
   * ```
   * @param out - Optional object to store the size in.
   * @returns The size of the container.
   */
  getSize(t) {
    t || (t = {});
    const e = this.getLocalBounds();
    return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t;
  }
  /**
   * Sets the size of the container to the specified width and height.
   * This is more efficient than setting width and height separately as it only recalculates bounds once.
   * @example
   * ```ts
   * // Basic size setting
   * container.setSize(100, 200);
   *
   * // Set uniform size
   * container.setSize(100); // Sets both width and height to 100
   * ```
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    const i = this.getLocalBounds();
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, i.width), e !== void 0 && this._setHeight(e, i.height);
  }
  /** Called when the skew or the rotation changes. */
  _updateSkew() {
    const t = this._rotation, e = this._skew;
    this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x);
  }
  /**
   * Updates the transform properties of the container.
   * Allows partial updates of transform properties for optimized manipulation.
   * @example
   * ```ts
   * // Basic transform update
   * container.updateTransform({
   *     x: 100,
   *     y: 200,
   *     rotation: Math.PI / 4
   * });
   *
   * // Scale and rotate around center
   * sprite.updateTransform({
   *     pivotX: sprite.width / 2,
   *     pivotY: sprite.height / 2,
   *     scaleX: 2,
   *     scaleY: 2,
   *     rotation: Math.PI
   * });
   *
   * // Update position only
   * button.updateTransform({
   *     x: button.x + 10, // Move right
   *     y: button.y      // Keep same y
   * });
   * ```
   * @param opts - Transform options to update
   * @param opts.x - The x position
   * @param opts.y - The y position
   * @param opts.scaleX - The x-axis scale factor
   * @param opts.scaleY - The y-axis scale factor
   * @param opts.rotation - The rotation in radians
   * @param opts.skewX - The x-axis skew factor
   * @param opts.skewY - The y-axis skew factor
   * @param opts.pivotX - The x-axis pivot point
   * @param opts.pivotY - The y-axis pivot point
   * @returns This container, for chaining
   * @see {@link Container#setFromMatrix} For matrix-based transforms
   * @see {@link Container#position} For direct position access
   */
  updateTransform(t) {
    return this.position.set(
      typeof t.x == "number" ? t.x : this.position.x,
      typeof t.y == "number" ? t.y : this.position.y
    ), this.scale.set(
      typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x,
      typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y
    ), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(
      typeof t.skewX == "number" ? t.skewX : this.skew.x,
      typeof t.skewY == "number" ? t.skewY : this.skew.y
    ), this.pivot.set(
      typeof t.pivotX == "number" ? t.pivotX : this.pivot.x,
      typeof t.pivotY == "number" ? t.pivotY : this.pivot.y
    ), this.origin.set(
      typeof t.originX == "number" ? t.originX : this.origin.x,
      typeof t.originY == "number" ? t.originY : this.origin.y
    ), this;
  }
  /**
   * Updates the local transform properties by decomposing the given matrix.
   * Extracts position, scale, rotation, and skew from a transformation matrix.
   * @example
   * ```ts
   * // Basic matrix transform
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4)
   *     .scale(2, 2);
   *
   * container.setFromMatrix(matrix);
   *
   * // Copy transform from another container
   * const source = new Container();
   * source.position.set(100, 100);
   * source.rotation = Math.PI / 2;
   *
   * target.setFromMatrix(source.localTransform);
   *
   * // Reset transform
   * container.setFromMatrix(Matrix.IDENTITY);
   * ```
   * @param matrix - The matrix to use for updating the transform
   * @see {@link Container#updateTransform} For property-based updates
   * @see {@link Matrix#decompose} For matrix decomposition details
   */
  setFromMatrix(t) {
    t.decompose(this);
  }
  /** Updates the local transform. */
  updateLocalTransform() {
    const t = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === t)
      return;
    this._didLocalTransformChangeId = t;
    const e = this.localTransform, i = this._scale, r = this._pivot, n = this._origin, a = this._position, o = i._x, h = i._y, l = r._x, c = r._y, u = -n._x, f = -n._y;
    e.a = this._cx * o, e.b = this._sx * o, e.c = this._cy * h, e.d = this._sy * h, e.tx = a._x - (l * e.a + c * e.c) + (u * e.a + f * e.c) - u, e.ty = a._y - (l * e.b + c * e.d) + (u * e.b + f * e.d) - f;
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= Wi, this._onUpdate());
  }
  /**
   * The opacity of the object relative to its parent's opacity.
   * Value ranges from 0 (fully transparent) to 1 (fully opaque).
   * @example
   * ```ts
   * // Basic transparency
   * sprite.alpha = 0.5; // 50% opacity
   *
   * // Inherited opacity
   * container.alpha = 0.5;
   * const child = new Sprite(texture);
   * child.alpha = 0.5;
   * container.addChild(child);
   * // child's effective opacity is 0.25 (0.5 * 0.5)
   * ```
   * @default 1
   * @see {@link Container#visible} For toggling visibility
   * @see {@link Container#renderable} For render control
   */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const i = K.shared.setValue(t ?? 16777215).toBgrNumber();
    i !== this.localColor && (this.localColor = i, this._updateFlags |= Wi, this._onUpdate());
  }
  /**
   * The tint applied to the sprite.
   *
   * This can be any valid {@link ColorSource}.
   * @example
   * ```ts
   * // Basic color tinting
   * container.tint = 0xff0000; // Red tint
   * container.tint = 'red';    // Same as above
   * container.tint = '#00ff00'; // Green
   * container.tint = 'rgb(0,0,255)'; // Blue
   *
   * // Remove tint
   * container.tint = 0xffffff; // White = no tint
   * container.tint = null;     // Also removes tint
   * ```
   * @default 0xFFFFFF
   * @see {@link Container#alpha} For transparency
   * @see {@link Container#visible} For visibility control
   */
  get tint() {
    return Qe(this.localColor);
  }
  // / //////////////// blend related stuff
  set blendMode(t) {
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= so, this.localBlendMode = t, this._onUpdate());
  }
  /**
   * The blend mode to be applied to the sprite. Controls how pixels are blended when rendering.
   *
   * Setting to 'normal' will reset to default blending.
   * > [!NOTE] More blend modes are available after importing the `pixi.js/advanced-blend-modes` sub-export.
   * @example
   * ```ts
   * // Basic blend modes
   * sprite.blendMode = 'add';        // Additive blending
   * sprite.blendMode = 'multiply';   // Multiply colors
   * sprite.blendMode = 'screen';     // Screen blend
   *
   * // Reset blend mode
   * sprite.blendMode = 'normal';     // Normal blending
   * ```
   * @default 'normal'
   * @see {@link Container#alpha} For transparency
   * @see {@link Container#tint} For color adjustments
   */
  get blendMode() {
    return this.localBlendMode;
  }
  // / ///////// VISIBILITY / RENDERABLE /////////////////
  /**
   * The visibility of the object. If false the object will not be drawn,
   * and the transform will not be updated.
   * @example
   * ```ts
   * // Basic visibility toggle
   * sprite.visible = false; // Hide sprite
   * sprite.visible = true;  // Show sprite
   * ```
   * @default true
   * @see {@link Container#renderable} For render-only control
   * @see {@link Container#alpha} For transparency
   */
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(t) {
    const e = t ? 2 : 0;
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= fs, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= fs, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /**
   * Controls whether this object can be rendered. If false the object will not be drawn,
   * but the transform will still be updated. This is different from visible, which skips
   * transform updates.
   * @example
   * ```ts
   * // Basic render control
   * sprite.renderable = false; // Skip rendering
   * sprite.renderable = true;  // Enable rendering
   * ```
   * @default true
   * @see {@link Container#visible} For skipping transform updates
   * @see {@link Container#alpha} For transparency
   */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= fs, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
  }
  /**
   * Whether or not the object should be rendered.
   * @advanced
   */
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * ```ts
   * container.destroy();
   * container.destroy(true);
   * container.destroy({ children: true });
   * container.destroy({ children: true, texture: true, textureSource: true });
   * ```
   */
  destroy(t = !1) {
    if (this.destroyed)
      return;
    this.destroyed = !0;
    let e;
    if (this.children.length && (e = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._origin = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t?.children) && e)
      for (let r = 0; r < e.length; ++r)
        e[r].destroy(t);
    this.renderGroup?.destroy(), this.renderGroup = null;
  }
}
_.mixin(
  wt,
  La,
  Oa,
  Ja,
  qa,
  ja,
  Xa,
  Na,
  Ka,
  Wa,
  za,
  Ua,
  Ya
);
class qr extends wt {
  constructor(t) {
    super(t), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = -1, this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this._bounds = new lt(0, 1, 0, 0), this._boundsDirty = !0, this.autoGarbageCollect = t.autoGarbageCollect ?? !0;
  }
  /**
   * The local bounds of the view in its own coordinate space.
   * Bounds are automatically updated when the view's content changes.
   * @example
   * ```ts
   * // Get bounds dimensions
   * const bounds = view.bounds;
   * console.log(`Width: ${bounds.maxX - bounds.minX}`);
   * console.log(`Height: ${bounds.maxY - bounds.minY}`);
   * ```
   * @returns The rectangular bounds of the view
   * @see {@link Bounds} For bounds operations
   */
  get bounds() {
    return this._boundsDirty ? (this.updateBounds(), this._boundsDirty = !1, this._bounds) : this._bounds;
  }
  /**
   * Whether or not to round the x/y position of the sprite.
   * @example
   * ```ts
   * // Enable pixel rounding for crisp rendering
   * view.roundPixels = true;
   * ```
   * @default false
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(t) {
    this._roundPixels = t ? 1 : 0;
  }
  /**
   * Checks if the object contains the given point in local coordinates.
   * Uses the view's bounds for hit testing.
   * @example
   * ```ts
   * // Basic point check
   * const localPoint = { x: 50, y: 25 };
   * const contains = view.containsPoint(localPoint);
   * console.log('Point is inside:', contains);
   * ```
   * @param point - The point to check in local coordinates
   * @returns True if the point is within the view's bounds
   * @see {@link ViewContainer#bounds} For the bounds used in hit testing
   * @see {@link Container#toLocal} For converting global coordinates to local
   */
  containsPoint(t) {
    const e = this.bounds, { x: i, y: r } = t;
    return i >= e.minX && i <= e.maxX && r >= e.minY && r <= e.maxY;
  }
  /** @private */
  onViewUpdate() {
    if (this._didViewChangeTick++, this._boundsDirty = !0, this.didViewUpdate)
      return;
    this.didViewUpdate = !0;
    const t = this.renderGroup || this.parentRenderGroup;
    t && t.onChildViewUpdate(this);
  }
  /** Unloads the GPU data from the view. */
  unload() {
    this.emit("unload", this);
    for (const t in this._gpuData)
      this._gpuData[t]?.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null), this.onViewUpdate();
  }
  destroy(t) {
    this.unload(), super.destroy(t), this._bounds = null;
  }
  /**
   * Collects renderables for the view container.
   * @param instructionSet - The instruction set to collect renderables for.
   * @param renderer - The renderer to collect renderables for.
   * @param currentLayer - The current render layer.
   * @internal
   */
  collectRenderablesSimple(t, e, i) {
    const { renderPipes: r } = e;
    r.blendMode.pushBlendMode(this, this.groupBlendMode, t), r[this.renderPipeId].addRenderable(this, t), this.didViewUpdate = !1;
    const a = this.children, o = a.length;
    for (let h = 0; h < o; h++)
      a[h].collectRenderables(t, e, i);
    r.blendMode.popBlendMode(t);
  }
}
class Ct extends qr {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = R.EMPTY) {
    t instanceof R && (t = { texture: t });
    const { texture: e = R.EMPTY, anchor: i, roundPixels: r, width: n, height: a, ...o } = t;
    super({
      label: "Sprite",
      ...o
    }), this.renderPipeId = "sprite", this.batched = !0, this._visualBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._anchor = new $(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), i ? this.anchor = i : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = r ?? !1, n !== void 0 && (this.width = n), a !== void 0 && (this.height = a);
  }
  /**
   * Creates a new sprite based on a source texture, image, video, or canvas element.
   * This is a convenience method that automatically creates and manages textures.
   * @example
   * ```ts
   * // Create from path or URL
   * const sprite = Sprite.from('assets/image.png');
   *
   * // Create from existing texture
   * const sprite = Sprite.from(texture);
   *
   * // Create from canvas
   * const canvas = document.createElement('canvas');
   * const sprite = Sprite.from(canvas, true); // Skip caching new texture
   * ```
   * @param source - The source to create the sprite from. Can be a path to an image, a texture,
   * or any valid texture source (canvas, video, etc.)
   * @param skipCache - Whether to skip adding to the texture cache when creating a new texture
   * @returns A new sprite based on the source
   * @see {@link Texture.from} For texture creation details
   * @see {@link Assets} For asset loading and management
   */
  static from(t, e = !1) {
    return t instanceof R ? new Ct(t) : new Ct(R.from(t, e));
  }
  set texture(t) {
    t || (t = R.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
  }
  /**
   * The texture that is displayed by the sprite. When changed, automatically updates
   * the sprite dimensions and manages texture event listeners.
   * @example
   * ```ts
   * // Create sprite with texture
   * const sprite = new Sprite({
   *     texture: Texture.from('sprite.png')
   * });
   *
   * // Update texture
   * sprite.texture = Texture.from('newSprite.png');
   *
   * // Use texture from spritesheet
   * const sheet = await Assets.load('spritesheet.json');
   * sprite.texture = sheet.textures['frame1.png'];
   *
   * // Reset to empty texture
   * sprite.texture = Texture.EMPTY;
   * ```
   * @see {@link Texture} For texture creation and management
   * @see {@link Assets} For asset loading
   */
  get texture() {
    return this._texture;
  }
  /**
   * The bounds of the sprite, taking into account the texture's trim area.
   * @example
   * ```ts
   * const texture = new Texture({
   *     source: new TextureSource({ width: 300, height: 300 }),
   *     frame: new Rectangle(196, 66, 58, 56),
   *     trim: new Rectangle(4, 4, 58, 56),
   *     orig: new Rectangle(0, 0, 64, 64),
   *     rotate: 2,
   * });
   * const sprite = new Sprite(texture);
   * const visualBounds = sprite.visualBounds;
   * // console.log(visualBounds); // { minX: -4, maxX: 62, minY: -4, maxY: 60 }
   */
  get visualBounds() {
    return va(this._visualBounds, this._anchor, this._texture), this._visualBounds;
  }
  /**
   * @deprecated
   * @ignore
   */
  get sourceBounds() {
    return F("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead."), this.visualBounds;
  }
  /** @private */
  updateBounds() {
    const t = this._anchor, e = this._texture, i = this._bounds, { width: r, height: n } = e.orig;
    i.minX = -t._x * r, i.maxX = i.minX + r, i.minY = -t._y * n, i.maxY = i.minY + n;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * sprite.destroy();
   * sprite.destroy(true);
   * sprite.destroy({ texture: true, textureSource: true });
   */
  destroy(t = !1) {
    if (super.destroy(t), typeof t == "boolean" ? t : t?.texture) {
      const i = typeof t == "boolean" ? t : t?.textureSource;
      this._texture.destroy(i);
    }
    this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * - The default is `(0,0)`, this means the sprite's origin is the top left.
   * - Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   * - Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * ```ts
   * // Center the anchor point
   * sprite.anchor = 0.5; // Sets both x and y to 0.5
   * sprite.position.set(400, 300); // Sprite will be centered at this position
   *
   * // Set specific x/y anchor points
   * sprite.anchor = {
   *     x: 1, // Right edge
   *     y: 0  // Top edge
   * };
   *
   * // Using individual coordinates
   * sprite.anchor.set(0.5, 1); // Center-bottom
   *
   * // For rotation around center
   * sprite.anchor.set(0.5);
   * sprite.rotation = Math.PI / 4; // 45 degrees around center
   *
   * // For scaling from center
   * sprite.anchor.set(0.5);
   * sprite.scale.set(2); // Scales from center point
   * ```
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /**
   * The width of the sprite, setting this will actually modify the scale to achieve the value set.
   * @example
   * ```ts
   * // Set width directly
   * sprite.width = 200;
   * console.log(sprite.scale.x); // Scale adjusted to match width
   *
   * // Set width while preserving aspect ratio
   * const ratio = sprite.height / sprite.width;
   * sprite.width = 300;
   * sprite.height = 300 * ratio;
   *
   * // For better performance when setting both width and height
   * sprite.setSize(300, 400); // Avoids recalculating bounds twice
   *
   * // Reset to original texture size
   * sprite.width = sprite.texture.orig.width;
   * ```
   */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    this._setWidth(t, this._texture.orig.width), this._width = t;
  }
  /**
   * The height of the sprite, setting this will actually modify the scale to achieve the value set.
   * @example
   * ```ts
   * // Set height directly
   * sprite.height = 150;
   * console.log(sprite.scale.y); // Scale adjusted to match height
   *
   * // Set height while preserving aspect ratio
   * const ratio = sprite.width / sprite.height;
   * sprite.height = 200;
   * sprite.width = 200 * ratio;
   *
   * // For better performance when setting both width and height
   * sprite.setSize(300, 400); // Avoids recalculating bounds twice
   *
   * // Reset to original texture size
   * sprite.height = sprite.texture.orig.height;
   * ```
   */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    this._setHeight(t, this._texture.orig.height), this._height = t;
  }
  /**
   * Retrieves the size of the Sprite as a [Size]{@link Size} object based on the texture dimensions and scale.
   * This is faster than getting width and height separately as it only calculates the bounds once.
   * @example
   * ```ts
   * // Basic size retrieval
   * const sprite = new Sprite(Texture.from('sprite.png'));
   * const size = sprite.getSize();
   * console.log(`Size: ${size.width}x${size.height}`);
   *
   * // Reuse existing size object
   * const reuseSize = { width: 0, height: 0 };
   * sprite.getSize(reuseSize);
   * ```
   * @param out - Optional object to store the size in, to avoid allocating a new object
   * @returns The size of the Sprite
   * @see {@link Sprite#width} For getting just the width
   * @see {@link Sprite#height} For getting just the height
   * @see {@link Sprite#setSize} For setting both width and height
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t;
  }
  /**
   * Sets the size of the Sprite to the specified width and height.
   * This is faster than setting width and height separately as it only recalculates bounds once.
   * @example
   * ```ts
   * // Basic size setting
   * const sprite = new Sprite(Texture.from('sprite.png'));
   * sprite.setSize(100, 200); // Width: 100, Height: 200
   *
   * // Set uniform size
   * sprite.setSize(100); // Sets both width and height to 100
   *
   * // Set size with object
   * sprite.setSize({
   *     width: 200,
   *     height: 300
   * });
   *
   * // Reset to texture size
   * sprite.setSize(
   *     sprite.texture.orig.width,
   *     sprite.texture.orig.height
   * );
   * ```
   * @param value - This can be either a number or a {@link Size} object
   * @param height - The height to set. Defaults to the value of `width` if not provided
   * @see {@link Sprite#width} For setting width only
   * @see {@link Sprite#height} For setting height only
   * @see {@link Sprite#texture} For the source dimensions
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height);
  }
}
const io = new lt();
function Kr(s, t, e) {
  const i = io;
  s.measurable = !0, Qr(s, e, i), t.addBoundsMask(i), s.measurable = !1;
}
function Zr(s, t, e) {
  const i = mt.get();
  s.measurable = !0;
  const r = tt.get().identity(), n = Jr(s, e, r);
  Vr(s, i, n), s.measurable = !1, t.addBoundsMask(i), tt.return(r), mt.return(i);
}
function Jr(s, t, e) {
  return s ? (s !== t && (Jr(s.parent, t, e), s.updateLocalTransform(), e.append(s.localTransform)), e) : (Y("Mask bounds, renderable is not inside the root container"), e);
}
class _r {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t?.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof Ct), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask !== null && (this.mask.measurable = !0, this.mask = null);
  }
  addBounds(t, e) {
    this.inverse || Kr(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Zr(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Ct;
  }
}
_r.extension = I.MaskEffect;
class $r {
  constructor(t) {
    this.priority = 0, this.pipe = "colorMask", t?.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t;
  }
  destroy() {
  }
  static test(t) {
    return typeof t == "number";
  }
}
$r.extension = I.MaskEffect;
class tn {
  constructor(t) {
    this.priority = 0, this.pipe = "stencilMask", t?.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.mask.includeInBuild = !1, this.mask.measurable = !1;
  }
  reset() {
    this.mask !== null && (this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null);
  }
  addBounds(t, e) {
    Kr(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Zr(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof wt;
  }
}
tn.extension = I.MaskEffect;
const ro = {
  createCanvas: (s, t) => {
    const e = document.createElement("canvas");
    return e.width = s, e.height = t, e;
  },
  createImage: () => new Image(),
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (s, t) => fetch(s, t),
  parseXML: (s) => new DOMParser().parseFromString(s, "text/xml")
};
let Ri = ro;
const Q = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return Ri;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(s) {
    Ri = s;
  }
};
class en extends ut {
  constructor(t) {
    t.resource || (t.resource = Q.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity, this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, i = this._resolution) {
    const r = super.resize(t, e, i);
    return r && this.resizeCanvas(), r;
  }
  static test(t) {
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
  }
  /**
   * Returns the 2D rendering context for the canvas.
   * Caches the context after creating it.
   * @returns The 2D rendering context of the canvas.
   */
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
en.extension = I.TextureSource;
class Gt extends ut {
  constructor(t) {
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
Gt.extension = I.TextureSource;
var Gs = /* @__PURE__ */ ((s) => (s[s.INTERACTION = 50] = "INTERACTION", s[s.HIGH = 25] = "HIGH", s[s.NORMAL = 0] = "NORMAL", s[s.LOW = -25] = "LOW", s[s.UTILITY = -50] = "UTILITY", s))(Gs || {});
class gs {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, i = 0, r = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = i, this._once = r;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(t, e = null) {
    return this._fn === t && this._context === e;
  }
  /**
   * Emit by calling the current function.
   * @param ticker - The ticker emitting.
   * @returns Next ticker
   */
  emit(t) {
    this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
    const e = this.next;
    return this._once && this.destroy(!0), this._destroyed && (this.next = null), e;
  }
  /**
   * Connect to the list.
   * @param previous - Input node, previous listener
   */
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(t = !1) {
    this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
const sn = class st {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new gs(null, null, 1 / 0), this.deltaMS = 1 / st.targetFPMS, this.elapsedMS = 1 / st.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   */
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  /** Conditionally cancels a pending animation frame. */
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   */
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  /**
   * Register a handler for tick events.
   * @param fn - The listener function to add. Receives the Ticker instance as parameter
   * @param context - The context for the listener
   * @param priority - The priority of the listener
   * @example
   * ```ts
   * // Access time properties through the ticker parameter
   * ticker.add((ticker) => {
   *     // Use deltaTime (dimensionless scalar) for frame-independent animations
   *     sprite.rotation += 0.1 * ticker.deltaTime;
   *
   *     // Use deltaMS (milliseconds) for time-based calculations
   *     const progress = ticker.deltaMS / animationDuration;
   *
   *     // Use elapsedMS for raw timing measurements
   *     console.log(`Raw frame time: ${ticker.elapsedMS}ms`);
   * });
   * ```
   */
  add(t, e, i = Gs.NORMAL) {
    return this._addListener(new gs(t, e, i));
  }
  /**
   * Add a handler for the tick event which is only executed once on the next frame.
   * @example
   * ```ts
   * // Basic one-time update
   * ticker.addOnce(() => {
   *     console.log('Runs next frame only');
   * });
   *
   * // With specific context
   * const game = {
   *     init(ticker) {
   *         this.loadResources();
   *         console.log('Game initialized');
   *     }
   * };
   * ticker.addOnce(game.init, game);
   *
   * // With priority
   * ticker.addOnce(
   *     () => {
   *         // High priority one-time setup
   *         physics.init();
   *     },
   *     undefined,
   *     UPDATE_PRIORITY.HIGH
   * );
   * ```
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting (default: UPDATE_PRIORITY.NORMAL)
   * @returns This instance of a ticker
   * @see {@link Ticker#add} For continuous updates
   * @see {@link Ticker#remove} For removing handlers
   */
  addOnce(t, e, i = Gs.NORMAL) {
    return this._addListener(new gs(t, e, i, !0));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(t) {
    let e = this._head.next, i = this._head;
    if (!e)
      t.connect(i);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(i);
          break;
        }
        i = e, e = e.next;
      }
      t.previous || t.connect(i);
    }
    return this._startIfPossible(), this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @example
   * ```ts
   * // Basic removal
   * const onTick = () => {
   *     sprite.rotation += 0.1;
   * };
   * ticker.add(onTick);
   * ticker.remove(onTick);
   *
   * // Remove with context
   * const game = {
   *     update(ticker) {
   *         this.physics.update(ticker.deltaTime);
   *     }
   * };
   * ticker.add(game.update, game);
   * ticker.remove(game.update, game);
   *
   * // Remove all matching handlers
   * // (if same function was added multiple times)
   * ticker.add(onTick);
   * ticker.add(onTick);
   * ticker.remove(onTick); // Removes all instances
   * ```
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   * @see {@link Ticker#add} For adding handlers
   * @see {@link Ticker#addOnce} For one-time handlers
   */
  remove(t, e) {
    let i = this._head.next;
    for (; i; )
      i.match(t, e) ? i = i.destroy() : i = i.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list.
   * @example
   * ```ts
   * // Check number of active listeners
   * const ticker = new Ticker();
   * console.log(ticker.count); // 0
   *
   * // Add some listeners
   * ticker.add(() => {});
   * ticker.add(() => {});
   * console.log(ticker.count); // 2
   *
   * // Check after cleanup
   * ticker.destroy();
   * console.log(ticker.count); // 0
   * ```
   * @readonly
   * @see {@link Ticker#add} For adding listeners
   * @see {@link Ticker#remove} For removing listeners
   */
  get count() {
    if (!this._head)
      return 0;
    let t = 0, e = this._head;
    for (; e = e.next; )
      t++;
    return t;
  }
  /**
   * Starts the ticker. If the ticker has listeners a new animation frame is requested at this point.
   * @example
   * ```ts
   * // Basic manual start
   * const ticker = new Ticker();
   * ticker.add(() => {
   *     // Animation code here
   * });
   * ticker.start();
   * ```
   * @see {@link Ticker#stop} For stopping the ticker
   * @see {@link Ticker#autoStart} For automatic starting
   * @see {@link Ticker#started} For checking ticker state
   */
  start() {
    this.started || (this.started = !0, this._requestIfNeeded());
  }
  /**
   * Stops the ticker. If the ticker has requested an animation frame it is canceled at this point.
   * @example
   * ```ts
   * // Basic stop
   * const ticker = new Ticker();
   * ticker.stop();
   * ```
   * @see {@link Ticker#start} For starting the ticker
   * @see {@link Ticker#started} For checking ticker state
   * @see {@link Ticker#destroy} For cleaning up the ticker
   */
  stop() {
    this.started && (this.started = !1, this._cancelIfNeeded());
  }
  /**
   * Destroy the ticker and don't use after this. Calling this method removes all references to internal events.
   * @example
   * ```ts
   * // Clean up with active listeners
   * const ticker = new Ticker();
   * ticker.add(() => {});
   * ticker.destroy(); // Removes all listeners
   * ```
   * @see {@link Ticker#stop} For stopping without destroying
   * @see {@link Ticker#remove} For removing specific listeners
   */
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; )
        t = t.destroy(!0);
      this._head.destroy(), this._head = null;
    }
  }
  /**
   * Triggers an update.
   *
   * An update entails setting the
   * current {@link Ticker#elapsedMS|elapsedMS},
   * the current {@link Ticker#deltaTime|deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link Ticker#lastTime|lastTime}
   * with the value of currentTime that was provided.
   *
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @example
   * ```ts
   * // Basic manual update
   * const ticker = new Ticker();
   * ticker.update(performance.now());
   * ```
   * @param currentTime - The current time of execution (defaults to performance.now())
   * @see {@link Ticker#deltaTime} For frame delta value
   * @see {@link Ticker#elapsedMS} For raw elapsed time
   */
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const n = t - this._lastFrame | 0;
        if (n < this._minElapsedMS)
          return;
        this._lastFrame = t - n % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * st.targetFPMS;
      const i = this._head;
      let r = i.next;
      for (; r; )
        r = r.emit(this);
      i.next || this._cancelIfNeeded();
    } else
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * > [!NOTE] This does not factor in the value of
   * > {@link Ticker#speed|speed}, which is specific
   * > to scaling {@link Ticker#deltaTime|deltaTime}.
   * @example
   * ```ts
   * // Basic FPS monitoring
   * ticker.add(() => {
   *     console.log(`Current FPS: ${Math.round(ticker.FPS)}`);
   * });
   * ```
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link Ticker#update|update}.
   *
   * This value is used to cap {@link Ticker#deltaTime|deltaTime},
   * but does not effect the measured value of {@link Ticker#FPS|FPS}.
   *
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000`.
   * @example
   * ```ts
   * // Set minimum acceptable frame rate
   * const ticker = new Ticker();
   * ticker.minFPS = 30; // Never go below 30 FPS
   *
   * // Use with maxFPS for frame rate clamping
   * ticker.minFPS = 30;
   * ticker.maxFPS = 60;
   *
   * // Monitor delta capping
   * ticker.add(() => {
   *     // Delta time will be capped based on minFPS
   *     console.log(`Delta time: ${ticker.deltaTime}`);
   * });
   * ```
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(this.maxFPS, t), i = Math.min(Math.max(0, e) / 1e3, st.targetFPMS);
    this._maxElapsedMS = 1 / i;
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link Ticker#update|update}.
   *
   * This will effect the measured value of {@link Ticker#FPS|FPS}.
   *
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`
   * @example
   * ```ts
   * // Set minimum acceptable frame rate
   * const ticker = new Ticker();
   * ticker.maxFPS = 60; // Never go above 60 FPS
   *
   * // Use with maxFPS for frame rate clamping
   * ticker.minFPS = 30;
   * ticker.maxFPS = 60;
   *
   * // Monitor delta capping
   * ticker.add(() => {
   *     // Delta time will be capped based on maxFPS
   *     console.log(`Delta time: ${ticker.deltaTime}`);
   * });
   * ```
   * @default 0
   */
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    if (t === 0)
      this._minElapsedMS = 0;
    else {
      const e = Math.max(this.minFPS, t);
      this._minElapsedMS = 1 / (e / 1e3);
    }
  }
  /**
   * The shared ticker instance used by {@link AnimatedSprite} and by
   * {@link VideoSource} to update animation frames / video textures.
   *
   * It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @type {Ticker}
   * @readonly
   */
  static get shared() {
    if (!st._shared) {
      const t = st._shared = new st();
      t.autoStart = !0, t._protected = !0;
    }
    return st._shared;
  }
  /**
   * The system ticker instance used by {@link PrepareBase} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
   * @type {Ticker}
   * @readonly
   * @advanced
   */
  static get system() {
    if (!st._system) {
      const t = st._system = new st();
      t.autoStart = !0, t._protected = !0;
    }
    return st._system;
  }
};
sn.targetFPMS = 0.06;
let Ee = sn, ps;
async function rn() {
  return ps ?? (ps = (async () => {
    const t = Q.get().createCanvas(1, 1).getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((a) => {
      const o = document.createElement("video");
      o.onloadeddata = () => a(o), o.onerror = () => a(null), o.autoplay = !1, o.crossOrigin = "anonymous", o.preload = "auto", o.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", o.load();
    });
    if (!e)
      return "premultiply-alpha-on-upload";
    const i = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, i);
    const r = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      i,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const n = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(r), t.deleteTexture(i), t.getExtension("WEBGL_lose_context")?.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), ps;
}
const _e = class nn extends ut {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ...nn.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = Ee.shared.elapsedMS * this.resource.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
    }
  }
  /** Callback to update the video frame and potentially request the next frame update. */
  _videoFrameRequestCallback() {
    this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    );
  }
  /**
   * Checks if the resource has valid dimensions.
   * @returns {boolean} True if width and height are set, otherwise false.
   */
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<this>} Handle the validate event
   */
  async load() {
    if (this._load)
      return this._load;
    const t = this.resource, e = this.options;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await rn(), this._load = new Promise((i, r) => {
      this.isValid ? i(this) : (this._resolve = i, this._reject = r, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
        this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
      })), t.load());
    }), this._load;
  }
  /**
   * Handle video error events.
   * @param event - The error event
   */
  _onError(t) {
    this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  /**
   * Checks if the underlying source is playing.
   * @returns True if playing.
   */
  _isSourcePlaying() {
    const t = this.resource;
    return !t.paused && !t.ended;
  }
  /**
   * Checks if the underlying source is ready for playing.
   * @returns True if ready.
   */
  _isSourceReady() {
    return this.resource.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    this.isValid || this._mediaReady(), this._configureAutoUpdate();
  }
  /** Stops the update loop when a pause event is triggered. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Handles behavior when the video completes seeking to the current playback position. */
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
  }
  _onCanPlay() {
    this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
  }
  _onCanPlayThrough() {
    this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
  }
  /** Fired when the video is loaded and ready to play. */
  _mediaReady() {
    const t = this.resource;
    this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
  }
  /** Cleans up resources and event listeners associated with this texture. */
  destroy() {
    this._configureAutoUpdate();
    const t = this.resource;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  /**
   * How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  /**
   * Configures the updating mechanism based on the current state and settings.
   *
   * This method decides between using the browser's native video frame callback or a custom ticker
   * for updating the video frame. It ensures optimal performance and responsiveness
   * based on the video's state, playback status, and the desired frames-per-second setting.
   *
   * - If `_autoUpdate` is enabled and the video source is playing:
   *   - It will prefer the native video frame callback if available and no specific FPS is set.
   *   - Otherwise, it will use a custom ticker for manual updates.
   * - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
   */
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (Ee.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (Ee.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (Ee.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
_e.extension = I.TextureSource;
_e.defaultOptions = {
  ...ut.defaultOptions,
  /** If true, the video will start loading immediately. */
  autoLoad: !0,
  /** If true, the video will start playing as soon as it is loaded. */
  autoPlay: !0,
  /** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
  updateFPS: 0,
  /** If true, the video will be loaded with the `crossorigin` attribute. */
  crossorigin: !0,
  /** If true, the video will loop when it ends. */
  loop: !1,
  /** If true, the video will be muted. */
  muted: !0,
  /** If true, the video will play inline. */
  playsinline: !0,
  /** If true, the video will be preloaded. */
  preload: !1
};
_e.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let ue = _e;
const ht = (s, t, e = !1) => (Array.isArray(s) || (s = [s]), t ? s.map((i) => typeof i == "string" || e ? t(i) : i) : s);
class no {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(t) {
    return this._cache.has(t);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(t) {
    const e = this._cache.get(t);
    return e || Y(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const i = ht(t);
    let r;
    for (let h = 0; h < this.parsers.length; h++) {
      const l = this.parsers[h];
      if (l.test(e)) {
        r = l.getCacheableAssets(i, e);
        break;
      }
    }
    const n = new Map(Object.entries(r || {}));
    r || i.forEach((h) => {
      n.set(h, e);
    });
    const a = [...n.keys()], o = {
      cacheKeys: a,
      keys: i
    };
    i.forEach((h) => {
      this._cacheMap.set(h, o);
    }), a.forEach((h) => {
      const l = r ? r[h] : e;
      this._cache.has(h) && this._cache.get(h) !== l && Y("[Cache] already has key:", h), this._cache.set(h, n.get(h));
    });
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(t) {
    if (!this._cacheMap.has(t)) {
      Y(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((r) => {
      this._cache.delete(r);
    }), e.keys.forEach((r) => {
      this._cacheMap.delete(r);
    });
  }
  /**
   * All loader parsers registered
   * @advanced
   */
  get parsers() {
    return this._parsers;
  }
}
const L = new no(), zs = [];
_.handleByList(I.TextureSource, zs);
function an(s = {}) {
  const t = s && s.resource, e = t ? s.resource : s, i = t ? s : { resource: s };
  for (let r = 0; r < zs.length; r++) {
    const n = zs[r];
    if (n.test(e))
      return new n(i);
  }
  throw new Error(`Could not find a source type for resource: ${i.resource}`);
}
function ao(s = {}, t = !1) {
  const e = s && s.resource, i = e ? s.resource : s, r = e ? s : { resource: s };
  if (!t && L.has(i))
    return L.get(i);
  const n = new R({ source: an(r) });
  return n.on("destroy", () => {
    L.has(i) && L.remove(i);
  }), t || L.set(i, n), n;
}
function oo(s, t = !1) {
  return typeof s == "string" ? L.get(s) : s instanceof ut ? new R({ source: s }) : ao(s, t);
}
R.from = oo;
ut.from = an;
_.add(_r, $r, tn, ue, Gt, en, Js);
var vt = /* @__PURE__ */ ((s) => (s[s.Low = 0] = "Low", s[s.Normal = 1] = "Normal", s[s.High = 2] = "High", s))(vt || {});
function ot(s) {
  if (typeof s != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(s)}`);
}
function $t(s) {
  return s.split("?")[0].split("#")[0];
}
function ho(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function lo(s, t, e) {
  return s.replace(new RegExp(ho(t), "g"), e);
}
function co(s, t) {
  let e = "", i = 0, r = -1, n = 0, a = -1;
  for (let o = 0; o <= s.length; ++o) {
    if (o < s.length)
      a = s.charCodeAt(o);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(r === o - 1 || n === 1)) if (r !== o - 1 && n === 2) {
        if (e.length < 2 || i !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const h = e.lastIndexOf("/");
            if (h !== e.length - 1) {
              h === -1 ? (e = "", i = 0) : (e = e.slice(0, h), i = e.length - 1 - e.lastIndexOf("/")), r = o, n = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", i = 0, r = o, n = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${s.slice(r + 1, o)}` : e = s.slice(r + 1, o), i = o - r - 1;
      r = o, n = 0;
    } else a === 46 && n !== -1 ? ++n : n = -1;
  }
  return e;
}
const it = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   * @example
   * ```ts
   * // Convert a Windows path to POSIX format
   * path.toPosix('C:\\Users\\User\\Documents\\file.txt');
   * // -> 'C:/Users/User/Documents/file.txt'
   * ```
   */
  toPosix(s) {
    return lo(s, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a URL
   * path.isUrl('http://www.example.com');
   * // -> true
   * path.isUrl('C:/Users/User/Documents/file.txt');
   * // -> false
   * ```
   */
  isUrl(s) {
    return /^https?:/.test(this.toPosix(s));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a data URL
   * path.isDataUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
   * // -> true
   * ```
   */
  isDataUrl(s) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(s);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a blob URL
   * path.isBlobUrl('blob:http://www.example.com/12345678-1234-1234-1234-123456789012');
   * // -> true
   * ```
   */
  isBlobUrl(s) {
    return s.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path has a protocol
   * path.hasProtocol('http://www.example.com');
   * // -> true
   * path.hasProtocol('C:/Users/User/Documents/file.txt');
   * // -> true
   * ```
   */
  hasProtocol(s) {
    return /^[^/:]+:/.test(this.toPosix(s));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   * @example
   * ```ts
   * // Get the protocol from a URL
   * path.getProtocol('http://www.example.com/path/to/resource');
   * // -> 'http://'
   * // Get the protocol from a file path
   * path.getProtocol('C:/Users/User/Documents/file.txt');
   * // -> 'C:/'
   * ```
   */
  getProtocol(s) {
    ot(s), s = this.toPosix(s);
    const t = /^file:\/\/\//.exec(s);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(s);
    return e ? e[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   * @example
   * ```ts
   * // Convert a relative URL to an absolute path
   * path.toAbsolute('images/texture.png', 'http://example.com/assets/');
   * // -> 'http://example.com/assets/images/texture.png'
   * ```
   */
  toAbsolute(s, t, e) {
    if (ot(s), this.isDataUrl(s) || this.isBlobUrl(s))
      return s;
    const i = $t(this.toPosix(t ?? Q.get().getBaseUrl())), r = $t(this.toPosix(e ?? this.rootname(i)));
    return s = this.toPosix(s), s.startsWith("/") ? it.join(r, s.slice(1)) : this.isAbsolute(s) ? s : this.join(i, s);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   * @example
   * ```ts
   * // Normalize a path with relative segments
   * path.normalize('http://www.example.com/foo/bar/../baz');
   * // -> 'http://www.example.com/foo/baz'
   * // Normalize a file path with relative segments
   * path.normalize('C:\\Users\\User\\Documents\\..\\file.txt');
   * // -> 'C:/Users/User/file.txt'
   * ```
   */
  normalize(s) {
    if (ot(s), s.length === 0)
      return ".";
    if (this.isDataUrl(s) || this.isBlobUrl(s))
      return s;
    s = this.toPosix(s);
    let t = "";
    const e = s.startsWith("/");
    this.hasProtocol(s) && (t = this.rootname(s), s = s.slice(t.length));
    const i = s.endsWith("/");
    return s = co(s), s.length > 0 && i && (s += "/"), e ? `/${s}` : t + s;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   * @example
   * ```ts
   * // Check if a path is absolute
   * path.isAbsolute('http://www.example.com/foo/bar');
   * // -> true
   * path.isAbsolute('C:/Users/User/Documents/file.txt');
   * // -> true
   * ```
   */
  isAbsolute(s) {
    return ot(s), s = this.toPosix(s), this.hasProtocol(s) ? !0 : s.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   * @example
   * ```ts
   * // Join multiple path segments
   * path.join('assets', 'images', 'sprite.png');
   * // -> 'assets/images/sprite.png'
   * // Join with relative segments
   * path.join('assets', 'images', '../textures', 'sprite.png');
   * // -> 'assets/textures/sprite.png'
   * ```
   */
  join(...s) {
    if (s.length === 0)
      return ".";
    let t;
    for (let e = 0; e < s.length; ++e) {
      const i = s[e];
      if (ot(i), i.length > 0)
        if (t === void 0)
          t = i;
        else {
          const r = s[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(r).toLowerCase()) ? t += `/../${i}` : t += `/${i}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the directory name of a path
   * path.dirname('http://www.example.com/foo/bar/baz.png');
   * // -> 'http://www.example.com/foo/bar'
   * // Get the directory name of a file path
   * path.dirname('C:/Users/User/Documents/file.txt');
   * // -> 'C:/Users/User/Documents'
   * ```
   */
  dirname(s) {
    if (ot(s), s.length === 0)
      return ".";
    s = this.toPosix(s);
    let t = s.charCodeAt(0);
    const e = t === 47;
    let i = -1, r = !0;
    const n = this.getProtocol(s), a = s;
    s = s.slice(n.length);
    for (let o = s.length - 1; o >= 1; --o)
      if (t = s.charCodeAt(o), t === 47) {
        if (!r) {
          i = o;
          break;
        }
      } else
        r = !1;
    return i === -1 ? e ? "/" : this.isUrl(a) ? n + s : n : e && i === 1 ? "//" : n + s.slice(0, i);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the root of a URL
   * path.rootname('http://www.example.com/foo/bar/baz.png');
   * // -> 'http://www.example.com/'
   * // Get the root of a file path
   * path.rootname('C:/Users/User/Documents/file.txt');
   * // -> 'C:/'
   * ```
   */
  rootname(s) {
    ot(s), s = this.toPosix(s);
    let t = "";
    if (s.startsWith("/") ? t = "/" : t = this.getProtocol(s), this.isUrl(s)) {
      const e = s.indexOf("/", t.length);
      e !== -1 ? t = s.slice(0, e) : t = s, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   * @example
   * ```ts
   * // Get the basename of a URL
   * path.basename('http://www.example.com/foo/bar/baz.png');
   * // -> 'baz.png'
   * // Get the basename of a file path
   * path.basename('C:/Users/User/Documents/file.txt');
   * // -> 'file.txt'
   * ```
   */
  basename(s, t) {
    ot(s), t && ot(t), s = $t(this.toPosix(s));
    let e = 0, i = -1, r = !0, n;
    if (t !== void 0 && t.length > 0 && t.length <= s.length) {
      if (t.length === s.length && t === s)
        return "";
      let a = t.length - 1, o = -1;
      for (n = s.length - 1; n >= 0; --n) {
        const h = s.charCodeAt(n);
        if (h === 47) {
          if (!r) {
            e = n + 1;
            break;
          }
        } else
          o === -1 && (r = !1, o = n + 1), a >= 0 && (h === t.charCodeAt(a) ? --a === -1 && (i = n) : (a = -1, i = o));
      }
      return e === i ? i = o : i === -1 && (i = s.length), s.slice(e, i);
    }
    for (n = s.length - 1; n >= 0; --n)
      if (s.charCodeAt(n) === 47) {
        if (!r) {
          e = n + 1;
          break;
        }
      } else i === -1 && (r = !1, i = n + 1);
    return i === -1 ? "" : s.slice(e, i);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the extension of a URL
   * path.extname('http://www.example.com/foo/bar/baz.png');
   * // -> '.png'
   * // Get the extension of a file path
   * path.extname('C:/Users/User/Documents/file.txt');
   * // -> '.txt'
   * ```
   */
  extname(s) {
    ot(s), s = $t(this.toPosix(s));
    let t = -1, e = 0, i = -1, r = !0, n = 0;
    for (let a = s.length - 1; a >= 0; --a) {
      const o = s.charCodeAt(a);
      if (o === 47) {
        if (!r) {
          e = a + 1;
          break;
        }
        continue;
      }
      i === -1 && (r = !1, i = a + 1), o === 46 ? t === -1 ? t = a : n !== 1 && (n = 1) : t !== -1 && (n = -1);
    }
    return t === -1 || i === -1 || n === 0 || n === 1 && t === i - 1 && t === e + 1 ? "" : s.slice(t, i);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   * @example
   * ```ts
   * // Parse a URL
   * const parsed = path.parse('http://www.example.com/foo/bar/baz.png');
   * // -> {
   * //   root: 'http://www.example.com/',
   * //   dir: 'http://www.example.com/foo/bar',
   * //   base: 'baz.png',
   * //   ext: '.png',
   * //   name: 'baz'
   * // }
   * // Parse a file path
   * const parsedFile = path.parse('C:/Users/User/Documents/file.txt');
   * // -> {
   * //   root: 'C:/',
   * //   dir: 'C:/Users/User/Documents',
   * //   base: 'file.txt',
   * //   ext: '.txt',
   * //   name: 'file'
   * // }
   * ```
   */
  parse(s) {
    ot(s);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (s.length === 0)
      return t;
    s = $t(this.toPosix(s));
    let e = s.charCodeAt(0);
    const i = this.isAbsolute(s);
    let r;
    t.root = this.rootname(s), i || this.hasProtocol(s) ? r = 1 : r = 0;
    let n = -1, a = 0, o = -1, h = !0, l = s.length - 1, c = 0;
    for (; l >= r; --l) {
      if (e = s.charCodeAt(l), e === 47) {
        if (!h) {
          a = l + 1;
          break;
        }
        continue;
      }
      o === -1 && (h = !1, o = l + 1), e === 46 ? n === -1 ? n = l : c !== 1 && (c = 1) : n !== -1 && (c = -1);
    }
    return n === -1 || o === -1 || c === 0 || c === 1 && n === o - 1 && n === a + 1 ? o !== -1 && (a === 0 && i ? t.base = t.name = s.slice(1, o) : t.base = t.name = s.slice(a, o)) : (a === 0 && i ? (t.name = s.slice(1, n), t.base = s.slice(1, o)) : (t.name = s.slice(a, n), t.base = s.slice(a, o)), t.ext = s.slice(n, o)), t.dir = this.dirname(s), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function on(s, t, e, i, r) {
  const n = t[e];
  for (let a = 0; a < n.length; a++) {
    const o = n[a];
    e < t.length - 1 ? on(s.replace(i[e], o), t, e + 1, i, r) : r.push(s.replace(i[e], o));
  }
}
function uo(s) {
  const t = /\{(.*?)\}/g, e = s.match(t), i = [];
  if (e) {
    const r = [];
    e.forEach((n) => {
      const a = n.substring(1, n.length - 1).split(",");
      r.push(a);
    }), on(s, r, 0, e, i);
  } else
    i.push(s);
  return i;
}
const He = (s) => !Array.isArray(s);
class Ut {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
      extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
    }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(t) {
    if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(t) {
    if (typeof t == "string")
      this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((i) => `${encodeURIComponent(i)}=${encodeURIComponent(e[i])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, src: i } = t;
    return ht(
      e || i,
      (n) => typeof n == "string" ? n : Array.isArray(n) ? n.map((a) => a?.src ?? a) : n?.src ? n.src : n,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && Y("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    const i = [];
    let r = e;
    Array.isArray(e) || (r = Object.entries(e).map(([n, a]) => typeof a == "string" || Array.isArray(a) ? { alias: n, src: a } : { alias: n, ...a })), r.forEach((n) => {
      const a = n.src, o = n.alias;
      let h;
      if (typeof o == "string") {
        const l = this._createBundleAssetId(t, o);
        i.push(l), h = [o, l];
      } else {
        const l = o.map((c) => this._createBundleAssetId(t, c));
        i.push(...l), h = [...o, ...l];
      }
      this.add({
        ...n,
        alias: h,
        src: a
      });
    }), this._bundles[t] = i;
  }
  /**
   * Tells the resolver what keys are associated with witch asset.
   * The most important thing the resolver does
   * @example
   * // Single key, single asset:
   * resolver.add({alias: 'foo', src: 'bar.png');
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Multiple keys, single asset:
   * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
   * resolver.resolveUrl('foo') // => 'bar.png'
   * resolver.resolveUrl('boo') // => 'bar.png'
   *
   * // Multiple keys, multiple assets:
   * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Add custom data attached to the resolver
   * Resolver.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
   * @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
   */
  add(t) {
    const e = [];
    Array.isArray(t) ? e.push(...t) : e.push(t);
    let i;
    i = (n) => {
      this.hasKey(n) && Y(`[Resolver] already has key: ${n} overwriting`);
    }, ht(e).forEach((n) => {
      const { src: a } = n;
      let {
        data: o,
        format: h,
        loadParser: l,
        parser: c
      } = n;
      const u = ht(a).map((m) => typeof m == "string" ? uo(m) : Array.isArray(m) ? m : [m]), f = this.getAlias(n);
      Array.isArray(f) ? f.forEach(i) : i(f);
      const d = [], p = (m) => ({
        ...this._parsers.find((A) => A.test(m))?.parse(m),
        src: m
      });
      u.forEach((m) => {
        m.forEach((g) => {
          let A = {};
          if (typeof g != "object" ? A = p(g) : (o = g.data ?? o, h = g.format ?? h, (g.loadParser || g.parser) && (l = g.loadParser ?? l, c = g.parser ?? c), A = {
            ...p(g.src),
            ...g
          }), !f)
            throw new Error(`[Resolver] alias is undefined for this asset: ${A.src}`);
          A = this._buildResolvedAsset(A, {
            aliases: f,
            data: o,
            format: h,
            loadParser: l,
            parser: c,
            progressSize: n.progressSize
          }), d.push(A);
        });
      }), f.forEach((m) => {
        this._assetMap[m] = d;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(t) {
    const e = He(t);
    t = ht(t);
    const i = {};
    return t.forEach((r) => {
      const n = this._bundles[r];
      if (n) {
        const a = this.resolve(n), o = {};
        for (const h in a) {
          const l = a[h];
          o[this._extractAssetIdFromBundle(r, h)] = l;
        }
        i[r] = o;
      }
    }), e ? i[t[0]] : i;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const i = {};
      for (const r in e)
        i[r] = e[r].src;
      return i;
    }
    return e.src;
  }
  resolve(t) {
    const e = He(t);
    t = ht(t);
    const i = {};
    return t.forEach((r) => {
      if (!this._resolverHash[r])
        if (this._assetMap[r]) {
          let n = this._assetMap[r];
          const a = this._getPreferredOrder(n);
          a?.priority.forEach((o) => {
            a.params[o].forEach((h) => {
              const l = n.filter((c) => c[o] ? c[o] === h : !1);
              l.length && (n = l);
            });
          }), this._resolverHash[r] = n[0];
        } else
          this._resolverHash[r] = this._buildResolvedAsset({
            alias: [r],
            src: r
          }, {});
      i[r] = this._resolverHash[r];
    }), e ? i[t[0]] : i;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(t) {
    return !!this._assetMap[t];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(t) {
    return !!this._bundles[t];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const i = t[e], r = this._preferredOrder.find((n) => n.params.format.includes(i.format));
      if (r)
        return r;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams)
      return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(t, e) {
    const { aliases: i, data: r, loadParser: n, parser: a, format: o, progressSize: h } = e;
    return (this._basePath || this._rootPath) && (t.src = it.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = i ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...r || {}, ...t.data }, t.loadParser = n ?? t.loadParser, t.parser = a ?? t.parser, t.format = o ?? t.format ?? fo(t.src), h !== void 0 && (t.progressSize = h), t;
  }
}
Ut.RETINA_PREFIX = /@([0-9\.]+)x/;
function fo(s) {
  return s.split(".").pop().split("?").shift().split("#").shift();
}
const Ds = (s, t) => {
  const e = t.split("?")[1];
  return e && (s += `?${e}`), s;
}, hn = class oe {
  constructor(t, e) {
    this.linkedSheets = [];
    let i = t;
    t?.source instanceof ut && (i = {
      texture: t,
      data: e
    });
    const { texture: r, data: n, cachePrefix: a = "" } = i;
    this.cachePrefix = a, this._texture = r instanceof R ? r : null, this.textureSource = r.source, this.textures = {}, this.animations = {}, this.data = n;
    const o = parseFloat(n.meta.scale);
    o ? (this.resolution = o, r.source.resolution = this.resolution) : this.resolution = r.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= oe.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const i = oe.BATCH_SIZE;
    for (; e - t < i && e < this._frameKeys.length; ) {
      const r = this._frameKeys[e], n = this._frames[r], a = n.frame;
      if (a) {
        let o = null, h = null;
        const l = n.trimmed !== !1 && n.sourceSize ? n.sourceSize : n.frame, c = new q(
          0,
          0,
          Math.floor(l.w) / this.resolution,
          Math.floor(l.h) / this.resolution
        );
        n.rotated ? o = new q(
          Math.floor(a.x) / this.resolution,
          Math.floor(a.y) / this.resolution,
          Math.floor(a.h) / this.resolution,
          Math.floor(a.w) / this.resolution
        ) : o = new q(
          Math.floor(a.x) / this.resolution,
          Math.floor(a.y) / this.resolution,
          Math.floor(a.w) / this.resolution,
          Math.floor(a.h) / this.resolution
        ), n.trimmed !== !1 && n.spriteSourceSize && (h = new q(
          Math.floor(n.spriteSourceSize.x) / this.resolution,
          Math.floor(n.spriteSourceSize.y) / this.resolution,
          Math.floor(a.w) / this.resolution,
          Math.floor(a.h) / this.resolution
        )), this.textures[r] = new R({
          source: this.textureSource,
          frame: o,
          orig: c,
          trim: h,
          rotate: n.rotated ? 2 : 0,
          defaultAnchor: n.anchor,
          defaultBorders: n.borders,
          label: r.toString()
        });
      }
      e++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const t = this.data.animations || {};
    for (const e in t) {
      this.animations[e] = [];
      for (let i = 0; i < t[e].length; i++) {
        const r = t[e][i];
        this.animations[e].push(this.textures[r]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const t = this._callback;
    this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * oe.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * oe.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(t = !1) {
    for (const e in this.textures)
      this.textures[e].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && (this._texture?.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
  }
};
hn.BATCH_SIZE = 1e3;
let Gi = hn;
const go = [
  "jpg",
  "png",
  "jpeg",
  "avif",
  "webp",
  "basis",
  "etc2",
  "bc7",
  "bc6h",
  "bc5",
  "bc4",
  "bc3",
  "bc2",
  "bc1",
  "eac",
  "astc"
];
function ln(s, t, e) {
  const i = {};
  if (s.forEach((r) => {
    i[r] = t;
  }), Object.keys(t.textures).forEach((r) => {
    i[`${t.cachePrefix}${r}`] = t.textures[r];
  }), !e) {
    const r = it.dirname(s[0]);
    t.linkedSheets.forEach((n, a) => {
      const o = ln([`${r}/${t.data.meta.related_multi_packs[a]}`], n, !0);
      Object.assign(i, o);
    });
  }
  return i;
}
const po = {
  extension: I.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (s) => s instanceof Gi,
    getCacheableAssets: (s, t) => ln(s, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: I.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (s) => {
      const e = s.split("?")[0].split("."), i = e.pop(), r = e.pop();
      return i === "json" && go.includes(r);
    },
    parse: (s) => {
      const t = s.split(".");
      return {
        resolution: parseFloat(Ut.RETINA_PREFIX.exec(s)?.[1] ?? "1"),
        format: t[t.length - 2],
        src: s
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into Spritesheet
   * All textures in the sprite sheet are then added to the cache
   */
  loader: {
    /** used for deprecation purposes */
    name: "spritesheetLoader",
    id: "spritesheet",
    extension: {
      type: I.LoadParser,
      priority: vt.Normal,
      name: "spritesheetLoader"
    },
    async testParse(s, t) {
      return it.extname(t.src).toLowerCase() === ".json" && !!s.frames;
    },
    async parse(s, t, e) {
      const {
        texture: i,
        // if user need to use preloaded texture
        imageFilename: r,
        // if user need to use custom filename (not from jsonFile.meta.image)
        textureOptions: n,
        // if user need to set texture options on texture
        cachePrefix: a
        // if user need to use custom cache prefix
      } = t?.data ?? {};
      let o = it.dirname(t.src);
      o && o.lastIndexOf("/") !== o.length - 1 && (o += "/");
      let h;
      if (i instanceof R)
        h = i;
      else {
        const u = Ds(o + (r ?? s.meta.image), t.src);
        h = (await e.load([{ src: u, data: n }]))[u];
      }
      const l = new Gi({
        texture: h.source,
        data: s,
        cachePrefix: a
      });
      await l.parse();
      const c = s?.meta?.related_multi_packs;
      if (Array.isArray(c)) {
        const u = [];
        for (const d of c) {
          if (typeof d != "string")
            continue;
          let p = o + d;
          t.data?.ignoreMultiPack || (p = Ds(p, t.src), u.push(e.load({
            src: p,
            data: {
              textureOptions: n,
              ignoreMultiPack: !0
            }
          })));
        }
        const f = await Promise.all(u);
        l.linkedSheets = f, f.forEach((d) => {
          d.linkedSheets = [l].concat(l.linkedSheets.filter((p) => p !== d));
        });
      }
      return l;
    },
    async unload(s, t, e) {
      await e.unload(s.textureSource._sourceOrigin), s.destroy(!1);
    }
  }
};
_.add(po);
const ms = /* @__PURE__ */ Object.create(null), zi = /* @__PURE__ */ Object.create(null);
function $s(s, t) {
  let e = zi[s];
  return e === void 0 && (ms[t] === void 0 && (ms[t] = 1), zi[s] = e = ms[t]++), e;
}
let ke;
function cn() {
  return (!ke || ke?.isContextLost()) && (ke = Q.get().createCanvas().getContext("webgl", {})), ke;
}
let Fe;
function mo() {
  if (!Fe) {
    Fe = "mediump";
    const s = cn();
    s && s.getShaderPrecisionFormat && (Fe = s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return Fe;
}
function Ao(s, t, e) {
  return t ? s : e ? (s = s.replace("out vec4 finalColor;", ""), `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${s}
        `) : `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${s}
        `;
}
function xo(s, t, e) {
  const i = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (s.substring(0, 9) !== "precision") {
    let r = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return r === "highp" && i !== "highp" && (r = "mediump"), `precision ${r} float;
${s}`;
  } else if (i !== "highp" && s.substring(0, 15) === "precision highp")
    return s.replace("precision highp", "precision mediump");
  return s;
}
function yo(s, t) {
  return t ? `#version 300 es
${s}` : s;
}
const bo = {}, wo = {};
function Co(s, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const i = e ? bo : wo;
  return i[t] ? (i[t]++, t += `-${i[t]}`) : i[t] = 1, s.indexOf("#define SHADER_NAME") !== -1 ? s : `${`#define SHADER_NAME ${t}`}
${s}`;
}
function vo(s, t) {
  return t ? s.replace("#version 300 es", "") : s;
}
const As = {
  // strips any version headers..
  stripVersion: vo,
  // adds precision string if not already present
  ensurePrecision: xo,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: Ao,
  // add the program name to the shader
  setProgramName: Co,
  // add the version string to the shader header
  insertVersion: yo
}, te = /* @__PURE__ */ Object.create(null), un = class Ls {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...Ls.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, i = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: mo()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let r = t.fragment, n = t.vertex;
    Object.keys(As).forEach((a) => {
      const o = i[a];
      r = As[a](r, o, !0), n = As[a](n, o, !1);
    }), this.fragment = r, this.vertex = n, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = $s(`${this.vertex}:${this.fragment}`, "gl-program");
  }
  /** destroys the program */
  destroy() {
    this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null, te[this._cacheKey] = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex}:${t.fragment}`;
    return te[e] || (te[e] = new Ls(t), te[e]._cacheKey = e), te[e];
  }
};
un.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let dn = un;
const Di = {
  uint8x2: { size: 2, stride: 2, normalised: !1 },
  uint8x4: { size: 4, stride: 4, normalised: !1 },
  sint8x2: { size: 2, stride: 2, normalised: !1 },
  sint8x4: { size: 4, stride: 4, normalised: !1 },
  unorm8x2: { size: 2, stride: 2, normalised: !0 },
  unorm8x4: { size: 4, stride: 4, normalised: !0 },
  snorm8x2: { size: 2, stride: 2, normalised: !0 },
  snorm8x4: { size: 4, stride: 4, normalised: !0 },
  uint16x2: { size: 2, stride: 4, normalised: !1 },
  uint16x4: { size: 4, stride: 8, normalised: !1 },
  sint16x2: { size: 2, stride: 4, normalised: !1 },
  sint16x4: { size: 4, stride: 8, normalised: !1 },
  unorm16x2: { size: 2, stride: 4, normalised: !0 },
  unorm16x4: { size: 4, stride: 8, normalised: !0 },
  snorm16x2: { size: 2, stride: 4, normalised: !0 },
  snorm16x4: { size: 4, stride: 8, normalised: !0 },
  float16x2: { size: 2, stride: 4, normalised: !1 },
  float16x4: { size: 4, stride: 8, normalised: !1 },
  float32: { size: 1, stride: 4, normalised: !1 },
  float32x2: { size: 2, stride: 8, normalised: !1 },
  float32x3: { size: 3, stride: 12, normalised: !1 },
  float32x4: { size: 4, stride: 16, normalised: !1 },
  uint32: { size: 1, stride: 4, normalised: !1 },
  uint32x2: { size: 2, stride: 8, normalised: !1 },
  uint32x3: { size: 3, stride: 12, normalised: !1 },
  uint32x4: { size: 4, stride: 16, normalised: !1 },
  sint32: { size: 1, stride: 4, normalised: !1 },
  sint32x2: { size: 2, stride: 8, normalised: !1 },
  sint32x3: { size: 3, stride: 12, normalised: !1 },
  sint32x4: { size: 4, stride: 16, normalised: !1 }
};
function Bo(s) {
  return Di[s] ?? Di.float32;
}
const So = {
  f32: "float32",
  "vec2<f32>": "float32x2",
  "vec3<f32>": "float32x3",
  "vec4<f32>": "float32x4",
  vec2f: "float32x2",
  vec3f: "float32x3",
  vec4f: "float32x4",
  i32: "sint32",
  "vec2<i32>": "sint32x2",
  "vec3<i32>": "sint32x3",
  "vec4<i32>": "sint32x4",
  u32: "uint32",
  "vec2<u32>": "uint32x2",
  "vec3<u32>": "uint32x3",
  "vec4<u32>": "uint32x4",
  bool: "uint32",
  "vec2<bool>": "uint32x2",
  "vec3<bool>": "uint32x3",
  "vec4<bool>": "uint32x4"
};
function Po({ source: s, entryPoint: t }) {
  const e = {}, i = s.indexOf(`fn ${t}`);
  if (i !== -1) {
    const r = s.indexOf("->", i);
    if (r !== -1) {
      const n = s.substring(i, r), a = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let o;
      for (; (o = a.exec(n)) !== null; ) {
        const h = So[o[3]] ?? "float32";
        e[o[2]] = {
          location: parseInt(o[1], 10),
          format: h,
          stride: Bo(h).stride,
          offset: 0,
          instance: !1,
          start: 0
        };
      }
    }
  }
  return e;
}
function xs(s) {
  const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, e = /@group\((\d+)\)/, i = /@binding\((\d+)\)/, r = /var(<[^>]+>)? (\w+)/, n = /:\s*(\w+)/, a = /struct\s+(\w+)\s*{([^}]+)}/g, o = /(\w+)\s*:\s*([\w\<\>]+)/g, h = /struct\s+(\w+)/, l = s.match(t)?.map((u) => ({
    group: parseInt(u.match(e)[1], 10),
    binding: parseInt(u.match(i)[1], 10),
    name: u.match(r)[2],
    isUniform: u.match(r)[1] === "<uniform>",
    type: u.match(n)[1]
  }));
  if (!l)
    return {
      groups: [],
      structs: []
    };
  const c = s.match(a)?.map((u) => {
    const f = u.match(h)[1], d = u.match(o).reduce((p, m) => {
      const [g, A] = m.split(":");
      return p[g.trim()] = A.trim(), p;
    }, {});
    return d ? { name: f, members: d } : null;
  }).filter(({ name: u }) => l.some((f) => f.type === u)) ?? [];
  return {
    groups: l,
    structs: c
  };
}
var he = /* @__PURE__ */ ((s) => (s[s.VERTEX = 1] = "VERTEX", s[s.FRAGMENT = 2] = "FRAGMENT", s[s.COMPUTE = 4] = "COMPUTE", s))(he || {});
function Mo({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = []), i.isUniform ? t[i.group].push({
      binding: i.binding,
      visibility: he.VERTEX | he.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : i.type === "sampler" ? t[i.group].push({
      binding: i.binding,
      visibility: he.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : i.type === "texture_2d" && t[i.group].push({
      binding: i.binding,
      visibility: he.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    });
  }
  return t;
}
function Io({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = {}), t[i.group][i.name] = i.binding;
  }
  return t;
}
function To(s, t) {
  const e = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [...s.structs, ...t.structs].filter((a) => e.has(a.name) ? !1 : (e.add(a.name), !0)), n = [...s.groups, ...t.groups].filter((a) => {
    const o = `${a.name}-${a.binding}`;
    return i.has(o) ? !1 : (i.add(o), !0);
  });
  return { structs: r, groups: n };
}
const ee = /* @__PURE__ */ Object.create(null);
class $e {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: e, vertex: i, layout: r, gpuLayout: n, name: a } = t;
    if (this.name = a, this.fragment = e, this.vertex = i, e.source === i.source) {
      const o = xs(e.source);
      this.structsAndGroups = o;
    } else {
      const o = xs(i.source), h = xs(e.source);
      this.structsAndGroups = To(o, h);
    }
    this.layout = r ?? Io(this.structsAndGroups), this.gpuLayout = n ?? Mo(this.structsAndGroups), this.autoAssignGlobalUniforms = this.layout[0]?.globalUniforms !== void 0, this.autoAssignLocalUniforms = this.layout[1]?.localUniforms !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, i = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = $s(i, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = Po(this.vertex)), this._attributeData;
  }
  /** destroys the program */
  destroy() {
    this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null, ee[this._cacheKey] = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
    return ee[e] || (ee[e] = new $e(t), ee[e]._cacheKey = e), ee[e];
  }
}
const fn = [
  "f32",
  "i32",
  "vec2<f32>",
  "vec3<f32>",
  "vec4<f32>",
  "mat2x2<f32>",
  "mat3x3<f32>",
  "mat4x4<f32>",
  "mat3x2<f32>",
  "mat4x2<f32>",
  "mat2x3<f32>",
  "mat4x3<f32>",
  "mat2x4<f32>",
  "mat3x4<f32>",
  "vec2<i32>",
  "vec3<i32>",
  "vec4<i32>"
], Eo = fn.reduce((s, t) => (s[t] = !0, s), {});
function ko(s, t) {
  switch (s) {
    case "f32":
      return 0;
    case "vec2<f32>":
      return new Float32Array(2 * t);
    case "vec3<f32>":
      return new Float32Array(3 * t);
    case "vec4<f32>":
      return new Float32Array(4 * t);
    case "mat2x2<f32>":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3x3<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4x4<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
const gn = class pn {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = j("uniform"), this._resourceType = "uniformGroup", this._resourceId = j("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...pn.defaultOptions, ...e }, this.uniformStructures = t;
    const i = {};
    for (const r in t) {
      const n = t[r];
      if (n.name = r, n.size = n.size ?? 1, !Eo[n.type]) {
        const a = n.type.match(/^array<(\w+(?:<\w+>)?),\s*(\d+)>$/);
        if (a) {
          const [, o, h] = a;
          throw new Error(
            `Uniform type ${n.type} is not supported. Use type: '${o}', size: ${h} instead.`
          );
        }
        throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${fn.join(", ")}`);
      }
      n.value ?? (n.value = ko(n.type, n.size)), i[r] = n.value;
    }
    this.uniforms = i, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = $s(Object.keys(i).map(
      (r) => `${r}-${t[r].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
gn.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let mn = gn;
class Xe {
  /**
   * Create a new instance eof the Bind Group.
   * @param resources - The resources that are bound together for use by a shader.
   */
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
    let e = 0;
    for (const i in t) {
      const r = t[i];
      this.setResource(r, e++);
    }
    this._updateKey();
  }
  /**
   * Updates the key if its flagged as dirty. This is used internally to
   * match this bind group to a WebGPU BindGroup.
   * @internal
   */
  _updateKey() {
    if (!this._dirty)
      return;
    this._dirty = !1;
    const t = [];
    let e = 0;
    for (const i in this.resources)
      t[e++] = this.resources[i]._resourceId;
    this._key = t.join("|");
  }
  /**
   * Set a resource at a given index. this function will
   * ensure that listeners will be removed from the current resource
   * and added to the new resource.
   * @param resource - The resource to set.
   * @param index - The index to set the resource at.
   */
  setResource(t, e) {
    const i = this.resources[e];
    t !== i && (i && t.off?.("change", this.onResourceChange, this), t.on?.("change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
  }
  /**
   * Returns the resource at the current specified index.
   * @param index - The index of the resource to get.
   * @returns - The resource at the specified index.
   */
  getResource(t) {
    return this.resources[t];
  }
  /**
   * Used internally to 'touch' each resource, to ensure that the GC
   * knows that all resources in this bind group are still being used.
   * @param now - The current time in milliseconds.
   * @param tick - The current tick.
   * @internal
   */
  _touch(t, e) {
    const i = this.resources;
    for (const r in i)
      i[r]._gcLastUsed = t, i[r]._touched = e;
  }
  /** Destroys this bind group and removes all listeners. */
  destroy() {
    const t = this.resources;
    for (const e in t)
      t[e]?.off?.("change", this.onResourceChange, this);
    this.resources = null;
  }
  onResourceChange(t) {
    if (this._dirty = !0, t.destroyed) {
      const e = this.resources;
      for (const i in e)
        e[i] === t && (e[i] = null);
    } else
      this._updateKey();
  }
}
var Ys = /* @__PURE__ */ ((s) => (s[s.WEBGL = 1] = "WEBGL", s[s.WEBGPU = 2] = "WEBGPU", s[s.BOTH = 3] = "BOTH", s))(Ys || {});
class ti extends ct {
  constructor(t) {
    super(), this.uid = j("shader"), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [], this._destroyed = !1;
    let {
      gpuProgram: e,
      glProgram: i,
      groups: r,
      resources: n,
      compatibleRenderers: a,
      groupMap: o
    } = t;
    this.gpuProgram = e, this.glProgram = i, a === void 0 && (a = 0, e && (a |= Ys.WEBGPU), i && (a |= Ys.WEBGL)), this.compatibleRenderers = a;
    const h = {};
    if (!n && !r && (n = {}), n && r)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && r && !o)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && r && o)
      for (const l in o)
        for (const c in o[l]) {
          const u = o[l][c];
          h[u] = {
            group: l,
            binding: c,
            name: u
          };
        }
    else if (e && r && !o) {
      const l = e.structsAndGroups.groups;
      o = {}, l.forEach((c) => {
        o[c.group] = o[c.group] || {}, o[c.group][c.binding] = c.name, h[c.name] = c;
      });
    } else if (n) {
      r = {}, o = {}, e && e.structsAndGroups.groups.forEach((u) => {
        o[u.group] = o[u.group] || {}, o[u.group][u.binding] = u.name, h[u.name] = u;
      });
      let l = 0;
      for (const c in n)
        h[c] || (r[99] || (r[99] = new Xe(), this._ownedBindGroups.push(r[99])), h[c] = { group: 99, binding: l, name: c }, o[99] = o[99] || {}, o[99][l] = c, l++);
      for (const c in n) {
        const u = c;
        let f = n[c];
        !f.source && !f._resourceType && (f = new mn(f));
        const d = h[u];
        d && (r[d.group] || (r[d.group] = new Xe(), this._ownedBindGroups.push(r[d.group])), r[d.group].setResource(f, d.binding));
      }
    }
    this.groups = r, this._uniformBindMap = o, this.resources = this._buildResourceAccessor(r, h);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, i) {
    var r, n;
    (r = this._uniformBindMap)[e] || (r[e] = {}), (n = this._uniformBindMap[e])[i] || (n[i] = t), this.groups[e] || (this.groups[e] = new Xe(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const i = {};
    for (const r in e) {
      const n = e[r];
      Object.defineProperty(i, n.name, {
        get() {
          return t[n.group].getResource(n.binding);
        },
        set(a) {
          t[n.group].setResource(a, n.binding);
        }
      });
    }
    return i;
  }
  /**
   * Use to destroy the shader when its not longer needed.
   * It will destroy the resources and remove listeners.
   * @param destroyPrograms - if the programs should be destroyed as well.
   * Make sure its not being used by other shaders!
   */
  destroy(t = !1) {
    this._destroyed || (this._destroyed = !0, this.emit("destroy", this), t && (this.gpuProgram?.destroy(), this.glProgram?.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((e) => {
      e.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null);
  }
  static from(t) {
    const { gpu: e, gl: i, ...r } = t;
    let n, a;
    return e && (n = $e.from(e)), i && (a = dn.from(i)), new ti({
      gpuProgram: n,
      glProgram: a,
      ...r
    });
  }
}
const Qs = [];
_.handleByNamedList(I.Environment, Qs);
async function Fo(s) {
  if (!s)
    for (let t = 0; t < Qs.length; t++) {
      const e = Qs[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let se;
function Wo() {
  if (typeof se == "boolean")
    return se;
  try {
    se = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    se = !1;
  }
  return se;
}
function Li(s, t, e = 2) {
  const i = t && t.length, r = i ? t[0] * e : s.length;
  let n = An(s, 0, r, e, !0);
  const a = [];
  if (!n || n.next === n.prev) return a;
  let o, h, l;
  if (i && (n = Lo(s, t, n, e)), s.length > 80 * e) {
    o = s[0], h = s[1];
    let c = o, u = h;
    for (let f = e; f < r; f += e) {
      const d = s[f], p = s[f + 1];
      d < o && (o = d), p < h && (h = p), d > c && (c = d), p > u && (u = p);
    }
    l = Math.max(c - o, u - h), l = l !== 0 ? 32767 / l : 0;
  }
  return pe(n, a, e, o, h, l, 0), a;
}
function An(s, t, e, i, r) {
  let n;
  if (r === Ko(s, t, e, i) > 0)
    for (let a = t; a < e; a += i) n = Yi(a / i | 0, s[a], s[a + 1], n);
  else
    for (let a = e - i; a >= t; a -= i) n = Yi(a / i | 0, s[a], s[a + 1], n);
  return n && Ot(n, n.next) && (Ae(n), n = n.next), n;
}
function zt(s, t) {
  if (!s) return s;
  t || (t = s);
  let e = s, i;
  do
    if (i = !1, !e.steiner && (Ot(e, e.next) || O(e.prev, e, e.next) === 0)) {
      if (Ae(e), e = t = e.prev, e === e.next) break;
      i = !0;
    } else
      e = e.next;
  while (i || e !== t);
  return t;
}
function pe(s, t, e, i, r, n, a) {
  if (!s) return;
  !a && n && Vo(s, i, r, n);
  let o = s;
  for (; s.prev !== s.next; ) {
    const h = s.prev, l = s.next;
    if (n ? Go(s, i, r, n) : Ro(s)) {
      t.push(h.i, s.i, l.i), Ae(s), s = l.next, o = l.next;
      continue;
    }
    if (s = l, s === o) {
      a ? a === 1 ? (s = zo(zt(s), t), pe(s, t, e, i, r, n, 2)) : a === 2 && Do(s, t, e, i, r, n) : pe(zt(s), t, e, i, r, n, 1);
      break;
    }
  }
}
function Ro(s) {
  const t = s.prev, e = s, i = s.next;
  if (O(t, e, i) >= 0) return !1;
  const r = t.x, n = e.x, a = i.x, o = t.y, h = e.y, l = i.y, c = Math.min(r, n, a), u = Math.min(o, h, l), f = Math.max(r, n, a), d = Math.max(o, h, l);
  let p = i.next;
  for (; p !== t; ) {
    if (p.x >= c && p.x <= f && p.y >= u && p.y <= d && le(r, o, n, h, a, l, p.x, p.y) && O(p.prev, p, p.next) >= 0) return !1;
    p = p.next;
  }
  return !0;
}
function Go(s, t, e, i) {
  const r = s.prev, n = s, a = s.next;
  if (O(r, n, a) >= 0) return !1;
  const o = r.x, h = n.x, l = a.x, c = r.y, u = n.y, f = a.y, d = Math.min(o, h, l), p = Math.min(c, u, f), m = Math.max(o, h, l), g = Math.max(c, u, f), A = Xs(d, p, t, e, i), x = Xs(m, g, t, e, i);
  let y = s.prevZ, b = s.nextZ;
  for (; y && y.z >= A && b && b.z <= x; ) {
    if (y.x >= d && y.x <= m && y.y >= p && y.y <= g && y !== r && y !== a && le(o, c, h, u, l, f, y.x, y.y) && O(y.prev, y, y.next) >= 0 || (y = y.prevZ, b.x >= d && b.x <= m && b.y >= p && b.y <= g && b !== r && b !== a && le(o, c, h, u, l, f, b.x, b.y) && O(b.prev, b, b.next) >= 0)) return !1;
    b = b.nextZ;
  }
  for (; y && y.z >= A; ) {
    if (y.x >= d && y.x <= m && y.y >= p && y.y <= g && y !== r && y !== a && le(o, c, h, u, l, f, y.x, y.y) && O(y.prev, y, y.next) >= 0) return !1;
    y = y.prevZ;
  }
  for (; b && b.z <= x; ) {
    if (b.x >= d && b.x <= m && b.y >= p && b.y <= g && b !== r && b !== a && le(o, c, h, u, l, f, b.x, b.y) && O(b.prev, b, b.next) >= 0) return !1;
    b = b.nextZ;
  }
  return !0;
}
function zo(s, t) {
  let e = s;
  do {
    const i = e.prev, r = e.next.next;
    !Ot(i, r) && yn(i, e, e.next, r) && me(i, r) && me(r, i) && (t.push(i.i, e.i, r.i), Ae(e), Ae(e.next), e = s = r), e = e.next;
  } while (e !== s);
  return zt(e);
}
function Do(s, t, e, i, r, n) {
  let a = s;
  do {
    let o = a.next.next;
    for (; o !== a.prev; ) {
      if (a.i !== o.i && Ho(a, o)) {
        let h = bn(a, o);
        a = zt(a, a.next), h = zt(h, h.next), pe(a, t, e, i, r, n, 0), pe(h, t, e, i, r, n, 0);
        return;
      }
      o = o.next;
    }
    a = a.next;
  } while (a !== s);
}
function Lo(s, t, e, i) {
  const r = [];
  for (let n = 0, a = t.length; n < a; n++) {
    const o = t[n] * i, h = n < a - 1 ? t[n + 1] * i : s.length, l = An(s, o, h, i, !1);
    l === l.next && (l.steiner = !0), r.push(Uo(l));
  }
  r.sort(Yo);
  for (let n = 0; n < r.length; n++)
    e = Qo(r[n], e);
  return e;
}
function Yo(s, t) {
  let e = s.x - t.x;
  if (e === 0 && (e = s.y - t.y, e === 0)) {
    const i = (s.next.y - s.y) / (s.next.x - s.x), r = (t.next.y - t.y) / (t.next.x - t.x);
    e = i - r;
  }
  return e;
}
function Qo(s, t) {
  const e = Xo(s, t);
  if (!e)
    return t;
  const i = bn(e, s);
  return zt(i, i.next), zt(e, e.next);
}
function Xo(s, t) {
  let e = t;
  const i = s.x, r = s.y;
  let n = -1 / 0, a;
  if (Ot(s, e)) return e;
  do {
    if (Ot(s, e.next)) return e.next;
    if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
      const u = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (u <= i && u > n && (n = u, a = e.x < e.next.x ? e : e.next, u === i))
        return a;
    }
    e = e.next;
  } while (e !== t);
  if (!a) return null;
  const o = a, h = a.x, l = a.y;
  let c = 1 / 0;
  e = a;
  do {
    if (i >= e.x && e.x >= h && i !== e.x && xn(r < l ? i : n, r, h, l, r < l ? n : i, r, e.x, e.y)) {
      const u = Math.abs(r - e.y) / (i - e.x);
      me(e, s) && (u < c || u === c && (e.x > a.x || e.x === a.x && No(a, e))) && (a = e, c = u);
    }
    e = e.next;
  } while (e !== o);
  return a;
}
function No(s, t) {
  return O(s.prev, s, t.prev) < 0 && O(t.next, s, s.next) < 0;
}
function Vo(s, t, e, i) {
  let r = s;
  do
    r.z === 0 && (r.z = Xs(r.x, r.y, t, e, i)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== s);
  r.prevZ.nextZ = null, r.prevZ = null, Oo(r);
}
function Oo(s) {
  let t, e = 1;
  do {
    let i = s, r;
    s = null;
    let n = null;
    for (t = 0; i; ) {
      t++;
      let a = i, o = 0;
      for (let l = 0; l < e && (o++, a = a.nextZ, !!a); l++)
        ;
      let h = e;
      for (; o > 0 || h > 0 && a; )
        o !== 0 && (h === 0 || !a || i.z <= a.z) ? (r = i, i = i.nextZ, o--) : (r = a, a = a.nextZ, h--), n ? n.nextZ = r : s = r, r.prevZ = n, n = r;
      i = a;
    }
    n.nextZ = null, e *= 2;
  } while (t > 1);
  return s;
}
function Xs(s, t, e, i, r) {
  return s = (s - e) * r | 0, t = (t - i) * r | 0, s = (s | s << 8) & 16711935, s = (s | s << 4) & 252645135, s = (s | s << 2) & 858993459, s = (s | s << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, s | t << 1;
}
function Uo(s) {
  let t = s, e = s;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== s);
  return e;
}
function xn(s, t, e, i, r, n, a, o) {
  return (r - a) * (t - o) >= (s - a) * (n - o) && (s - a) * (i - o) >= (e - a) * (t - o) && (e - a) * (n - o) >= (r - a) * (i - o);
}
function le(s, t, e, i, r, n, a, o) {
  return !(s === a && t === o) && xn(s, t, e, i, r, n, a, o);
}
function Ho(s, t) {
  return s.next.i !== t.i && s.prev.i !== t.i && !jo(s, t) && // doesn't intersect other edges
  (me(s, t) && me(t, s) && qo(s, t) && // locally visible
  (O(s.prev, s, t.prev) || O(s, t.prev, t)) || // does not create opposite-facing sectors
  Ot(s, t) && O(s.prev, s, s.next) > 0 && O(t.prev, t, t.next) > 0);
}
function O(s, t, e) {
  return (t.y - s.y) * (e.x - t.x) - (t.x - s.x) * (e.y - t.y);
}
function Ot(s, t) {
  return s.x === t.x && s.y === t.y;
}
function yn(s, t, e, i) {
  const r = Re(O(s, t, e)), n = Re(O(s, t, i)), a = Re(O(e, i, s)), o = Re(O(e, i, t));
  return !!(r !== n && a !== o || r === 0 && We(s, e, t) || n === 0 && We(s, i, t) || a === 0 && We(e, s, i) || o === 0 && We(e, t, i));
}
function We(s, t, e) {
  return t.x <= Math.max(s.x, e.x) && t.x >= Math.min(s.x, e.x) && t.y <= Math.max(s.y, e.y) && t.y >= Math.min(s.y, e.y);
}
function Re(s) {
  return s > 0 ? 1 : s < 0 ? -1 : 0;
}
function jo(s, t) {
  let e = s;
  do {
    if (e.i !== s.i && e.next.i !== s.i && e.i !== t.i && e.next.i !== t.i && yn(e, e.next, s, t)) return !0;
    e = e.next;
  } while (e !== s);
  return !1;
}
function me(s, t) {
  return O(s.prev, s, s.next) < 0 ? O(s, t, s.next) >= 0 && O(s, s.prev, t) >= 0 : O(s, t, s.prev) < 0 || O(s, s.next, t) < 0;
}
function qo(s, t) {
  let e = s, i = !1;
  const r = (s.x + t.x) / 2, n = (s.y + t.y) / 2;
  do
    e.y > n != e.next.y > n && e.next.y !== e.y && r < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (i = !i), e = e.next;
  while (e !== s);
  return i;
}
function bn(s, t) {
  const e = Ns(s.i, s.x, s.y), i = Ns(t.i, t.x, t.y), r = s.next, n = t.prev;
  return s.next = t, t.prev = s, e.next = r, r.prev = e, i.next = e, e.prev = i, n.next = i, i.prev = n, i;
}
function Yi(s, t, e, i) {
  const r = Ns(s, t, e);
  return i ? (r.next = i.next, r.prev = i, i.next.prev = r, i.next = r) : (r.prev = r, r.next = r), r;
}
function Ae(s) {
  s.next.prev = s.prev, s.prev.next = s.next, s.prevZ && (s.prevZ.nextZ = s.nextZ), s.nextZ && (s.nextZ.prevZ = s.prevZ);
}
function Ns(s, t, e) {
  return {
    i: s,
    // vertex index in coordinates array
    x: t,
    y: e,
    // vertex coordinates
    prev: null,
    // previous and next vertex nodes in a polygon ring
    next: null,
    z: 0,
    // z-order curve value
    prevZ: null,
    // previous and next nodes in z-order
    nextZ: null,
    steiner: !1
    // indicates whether this is a steiner point
  };
}
function Ko(s, t, e, i) {
  let r = 0;
  for (let n = t, a = e - i; n < e; n += i)
    r += (s[a] - s[n]) * (s[n + 1] + s[a + 1]), a = n;
  return r;
}
const Zo = Li.default || Li;
var wn = /* @__PURE__ */ ((s) => (s[s.NONE = 0] = "NONE", s[s.COLOR = 16384] = "COLOR", s[s.STENCIL = 1024] = "STENCIL", s[s.DEPTH = 256] = "DEPTH", s[s.COLOR_DEPTH = 16640] = "COLOR_DEPTH", s[s.COLOR_STENCIL = 17408] = "COLOR_STENCIL", s[s.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", s[s.ALL = 17664] = "ALL", s))(wn || {});
class Jo {
  /**
   * @param name - The function name that will be executed on the listeners added to this Runner.
   */
  constructor(t) {
    this.items = [], this._name = t;
  }
  /* jsdoc/check-param-names */
  /**
   * Dispatch/Broadcast Runner to all listeners added to the queue.
   * @param {...any} params - (optional) parameters to pass to each listener
   */
  /* jsdoc/check-param-names */
  emit(t, e, i, r, n, a, o, h) {
    const { name: l, items: c } = this;
    for (let u = 0, f = c.length; u < f; u++)
      c[u][l](t, e, i, r, n, a, o, h);
    return this;
  }
  /**
   * Add a listener to the Runner
   *
   * Runners do not need to have scope or functions passed to them.
   * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
   * as the name provided to the Runner when it was created.
   *
   * Eg A listener passed to this Runner will require a 'complete' function.
   *
   * ```ts
   * import { Runner } from 'pixi.js';
   *
   * const complete = new Runner('complete');
   * ```
   *
   * The scope used will be the object itself.
   * @param {any} item - The object that will be listening.
   */
  add(t) {
    return t[this._name] && (this.remove(t), this.items.push(t)), this;
  }
  /**
   * Remove a single listener from the dispatch queue.
   * @param {any} item - The listener that you would like to remove.
   */
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && this.items.splice(e, 1), this;
  }
  /**
   * Check to see if the listener is already in the Runner
   * @param {any} item - The listener that you would like to check.
   */
  contains(t) {
    return this.items.indexOf(t) !== -1;
  }
  /** Remove all listeners from the Runner */
  removeAll() {
    return this.items.length = 0, this;
  }
  /** Remove all references, don't use after this. */
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  /**
   * `true` if there are no this Runner contains no listeners
   * @readonly
   */
  get empty() {
    return this.items.length === 0;
  }
  /**
   * The name of the runner.
   * @readonly
   */
  get name() {
    return this._name;
  }
}
const _o = [
  "init",
  "destroy",
  "contextChange",
  "resolutionChange",
  "resetState",
  "renderEnd",
  "renderStart",
  "render",
  "update",
  "postrender",
  "prerender"
], Cn = class vn extends ct {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.tick = 0, this.uid = j("renderer"), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [..._o, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await Fo(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const i in this._systemsHash)
      t = { ...this._systemsHash[i].constructor.defaultOptions, ...t };
    t = { ...vn.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let i = 0; i < this.runners.init.items.length; i++)
      await this.runners.init.items[i].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    this.tick++;
    let i = t;
    if (i instanceof wt && (i = { container: i }, e && (F(D, "passing a second argument is deprecated, please use render options instead"), i.target = e.renderTexture)), i.target || (i.target = this.view.renderTarget), i.target === this.view.renderTarget && (this._lastObjectRendered = i.container, i.clearColor ?? (i.clearColor = this.background.colorRgba), i.clear ?? (i.clear = this.background.clearBeforeRender)), i.clearColor) {
      const r = Array.isArray(i.clearColor) && i.clearColor.length === 4;
      i.clearColor = r ? i.clearColor : K.shared.setValue(i.clearColor).toArray();
    }
    i.transform || (i.container.updateLocalTransform(), i.transform = i.container.localTransform), i.container.visible && (i.container.enableRenderGroup(), this.runners.prerender.emit(i), this.runners.renderStart.emit(i), this.runners.render.emit(i), this.runners.renderEnd.emit(i), this.runners.postrender.emit(i));
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   * @param resolution - The resolution / device pixel ratio of the renderer.
   */
  resize(t, e, i) {
    const r = this.view.resolution;
    this.view.resize(t, e, i), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), i !== void 0 && i !== r && this.runners.resolutionChange.emit(i);
  }
  /**
   * Clears the render target.
   * @param options - The options to use when clearing the render target.
   * @param options.target - The render target to clear.
   * @param options.clearColor - The color to clear with.
   * @param options.clear - The clear mode to use.
   * @advanced
   */
  clear(t = {}) {
    const e = this;
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = wn.ALL);
    const { clear: i, clearColor: r, target: n } = t;
    K.shared.setValue(r ?? this.background.colorRgba), e.renderTarget.clear(n, i, K.shared.toArray());
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.view.resolution;
  }
  set resolution(t) {
    this.view.resolution = t, this.runners.resolutionChange.emit(t);
  }
  /**
   * Same as view.width, actual number of pixels in the canvas by horizontal.
   * @type {number}
   * @readonly
   * @default 800
   */
  get width() {
    return this.view.texture.frame.width;
  }
  /**
   * Same as view.height, actual number of pixels in the canvas by vertical.
   * @default 600
   */
  get height() {
    return this.view.texture.frame.height;
  }
  // NOTE: this was `view` in v7
  /**
   * The canvas element that everything is drawn to.
   * @type {environment.ICanvas}
   */
  get canvas() {
    return this.view.canvas;
  }
  /**
   * the last object rendered by the renderer. Useful for other plugins like interaction managers
   * @readonly
   */
  get lastObjectRendered() {
    return this._lastObjectRendered;
  }
  /**
   * Flag if we are rendering to the screen vs renderTexture
   * @readonly
   * @default true
   */
  get renderingToScreen() {
    return this.renderTarget.renderingToScreen;
  }
  /**
   * Measurements of the screen. (0, 0, screenWidth, screenHeight).
   *
   * Its safe to use as filterArea or hitArea for the whole stage.
   */
  get screen() {
    return this.view.screen;
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  _addRunners(...t) {
    t.forEach((e) => {
      this.runners[e] = new Jo(e);
    });
  }
  _addSystems(t) {
    let e;
    for (e in t) {
      const i = t[e];
      this._addSystem(i.value, i.name);
    }
  }
  /**
   * Add a new system to the renderer.
   * @param ClassRef - Class reference
   * @param name - Property name for system, if not specified
   *        will use a static `name` property on the class itself. This
   *        name will be assigned as s property on the Renderer so make
   *        sure it doesn't collide with properties on Renderer.
   * @returns Return instance of renderer
   */
  _addSystem(t, e) {
    const i = new t(this);
    if (this[e])
      throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = i, this._systemsHash[e] = i;
    for (const r in this.runners)
      this.runners[r].add(i);
    return this;
  }
  _addPipes(t, e) {
    const i = e.reduce((r, n) => (r[n.name] = n.value, r), {});
    t.forEach((r) => {
      const n = r.value, a = r.name, o = i[a];
      this.renderPipes[a] = new n(
        this,
        o ? new o() : null
      ), this.runners.destroy.add(this.renderPipes[a]);
    });
  }
  destroy(t = !1) {
    this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), (t === !0 || typeof t == "object" && t.releaseGlobalResources) && be.release(), Object.values(this.runners).forEach((e) => {
      e.destroy();
    }), this._systemsHash = null, this.renderPipes = null;
  }
  /**
   * Generate a texture from a container.
   * @param options - options or container target to use when generating the texture
   * @returns a texture
   */
  generateTexture(t) {
    return this.textureGenerator.generateTexture(t);
  }
  /**
   * Whether the renderer will round coordinates to whole pixels when rendering.
   * Can be overridden on a per scene item basis.
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  /**
   * Overridable function by `pixi.js/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   * @ignore
   */
  _unsafeEvalCheck() {
    if (!Wo())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
  /**
   * Resets the rendering state of the renderer.
   * This is useful when you want to use the WebGL context directly and need to ensure PixiJS's internal state
   * stays synchronized. When modifying the WebGL context state externally, calling this method before the next Pixi
   * render will reset all internal caches and ensure it executes correctly.
   *
   * This is particularly useful when combining PixiJS with other rendering engines like Three.js:
   * ```js
   * // Reset Three.js state
   * threeRenderer.resetState();
   *
   * // Render a Three.js scene
   * threeRenderer.render(threeScene, threeCamera);
   *
   * // Reset PixiJS state since Three.js modified the WebGL context
   * pixiRenderer.resetState();
   *
   * // Now render Pixi content
   * pixiRenderer.render(pixiScene);
   * ```
   * @advanced
   */
  resetState() {
    this.runners.resetState.emit();
  }
};
Cn.defaultOptions = {
  /**
   * Default resolution / device pixel ratio of the renderer.
   * @default 1
   */
  resolution: 1,
  /**
   * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported`
   * function. If set to true, a WebGL renderer can fail to be created if the browser thinks there could be
   * performance issues when using WebGL.
   *
   * In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many
   * scenarios as possible. However, some users may have a poor experience, for example, if a user has a gpu or
   * driver version blacklisted by the
   * browser.
   *
   * If your application requires high performance rendering, you may wish to set this to false.
   * We recommend one of two options if you decide to set this flag to false:
   *
   * 1: Use the Canvas renderer as a fallback in case high performance WebGL is
   *    not supported.
   *
   * 2: Call `isWebGLSupported` (which if found in the utils package) in your code before attempting to create a
   *    PixiJS renderer, and show an error message to the user if the function returns false, explaining that their
   *    device & browser combination does not support high performance WebGL.
   *    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
   * @default false
   */
  failIfMajorPerformanceCaveat: !1,
  /**
   * Should round pixels be forced when rendering?
   * @default false
   */
  roundPixels: !1
};
let Bn = Cn, Ge;
function $o(s) {
  return Ge !== void 0 || (Ge = (() => {
    const t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: s ?? Bn.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!Q.get().getWebGLRenderingContext())
        return !1;
      let i = Q.get().createCanvas().getContext("webgl", t);
      const r = !!i?.getContextAttributes()?.stencil;
      if (i) {
        const n = i.getExtension("WEBGL_lose_context");
        n && n.loseContext();
      }
      return i = null, r;
    } catch {
      return !1;
    }
  })()), Ge;
}
let ze;
async function th(s = {}) {
  return ze !== void 0 || (ze = await (async () => {
    const t = Q.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(s)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), ze;
}
const Qi = ["webgl", "webgpu", "canvas"];
async function eh(s) {
  let t = [];
  s.preference ? (t.push(s.preference), Qi.forEach((n) => {
    n !== s.preference && t.push(n);
  })) : t = Qi.slice();
  let e, i = {};
  for (let n = 0; n < t.length; n++) {
    const a = t[n];
    if (a === "webgpu" && await th()) {
      const { WebGPURenderer: o } = await import("./WebGPURenderer-BwIvpdSz.js");
      e = o, i = { ...s, ...s.webgpu };
      break;
    } else if (a === "webgl" && $o(
      s.failIfMajorPerformanceCaveat ?? Bn.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: o } = await import("./WebGLRenderer-gw_UzeXA.js");
      e = o, i = { ...s, ...s.webgl };
      break;
    } else if (a === "canvas")
      throw i = { ...s }, new Error("CanvasRenderer is not yet implemented");
  }
  if (delete i.webgpu, delete i.webgl, !e)
    throw new Error("No available renderer for the current environment");
  const r = new e();
  return await r.init(i), r;
}
const Sn = "8.15.0";
class Pn {
  static init() {
    globalThis.__PIXI_APP_INIT__?.(this, Sn);
  }
  static destroy() {
  }
}
Pn.extension = I.Application;
class sh {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    globalThis.__PIXI_RENDERER_INIT__?.(this._renderer, Sn);
  }
  destroy() {
    this._renderer = null;
  }
}
sh.extension = {
  type: [
    I.WebGLSystem,
    I.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
const Mn = class Vs {
  constructor(...t) {
    this.stage = new wt(), t[0] !== void 0 && F(D, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * Initializes the PixiJS application with the specified options.
   *
   * This method must be called after creating a new Application instance.
   * @param options - Configuration options for the application and renderer
   * @returns A promise that resolves when initialization is complete
   * @example
   * ```js
   * const app = new Application();
   *
   * // Initialize with custom options
   * await app.init({
   *     width: 800,
   *     height: 600,
   *     backgroundColor: 0x1099bb,
   *     preference: 'webgl', // or 'webgpu'
   * });
   * ```
   */
  async init(t) {
    t = { ...t }, this.stage || (this.stage = new wt()), this.renderer = await eh(t), Vs._plugins.forEach((e) => {
      e.init.call(this, t);
    });
  }
  /**
   * Renders the current stage to the screen.
   *
   * When using the default setup with {@link TickerPlugin} (enabled by default), you typically don't need to call
   * this method directly as rendering is handled automatically.
   *
   * Only use this method if you've disabled the {@link TickerPlugin} or need custom
   * render timing control.
   * @example
   * ```js
   * // Example 1: Default setup (TickerPlugin handles rendering)
   * const app = new Application();
   * await app.init();
   * // No need to call render() - TickerPlugin handles it
   *
   * // Example 2: Custom rendering loop (if TickerPlugin is disabled)
   * const app = new Application();
   * await app.init({ autoStart: false }); // Disable automatic rendering
   *
   * function animate() {
   *     app.render();
   *     requestAnimationFrame(animate);
   * }
   * animate();
   * ```
   */
  render() {
    this.renderer.render({ container: this.stage });
  }
  /**
   * Reference to the renderer's canvas element. This is the HTML element
   * that displays your application's graphics.
   * @readonly
   * @type {HTMLCanvasElement}
   * @example
   * ```js
   * // Create a new application
   * const app = new Application();
   * // Initialize the application
   * await app.init({...});
   * // Add canvas to the page
   * document.body.appendChild(app.canvas);
   *
   * // Access the canvas directly
   * console.log(app.canvas); // HTMLCanvasElement
   * ```
   */
  get canvas() {
    return this.renderer.canvas;
  }
  /**
   * Reference to the renderer's canvas element.
   * @type {HTMLCanvasElement}
   * @deprecated since 8.0.0
   * @see {@link Application#canvas}
   */
  get view() {
    return F(D, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
  }
  /**
   * Reference to the renderer's screen rectangle. This represents the visible area of your application.
   *
   * It's commonly used for:
   * - Setting filter areas for full-screen effects
   * - Defining hit areas for screen-wide interaction
   * - Determining the visible bounds of your application
   * @readonly
   * @example
   * ```js
   * // Use as filter area for a full-screen effect
   * const blurFilter = new BlurFilter();
   * sprite.filterArea = app.screen;
   *
   * // Use as hit area for screen-wide interaction
   * const screenSprite = new Sprite();
   * screenSprite.hitArea = app.screen;
   *
   * // Get screen dimensions
   * console.log(app.screen.width, app.screen.height);
   * ```
   * @see {@link Rectangle} For all available properties and methods
   */
  get screen() {
    return this.renderer.screen;
  }
  /**
   * Destroys the application and all of its resources.
   *
   * This method should be called when you want to completely
   * clean up the application and free all associated memory.
   * @param rendererDestroyOptions - Options for destroying the renderer:
   *  - `false` or `undefined`: Preserves the canvas element (default)
   *  - `true`: Removes the canvas element
   *  - `{ removeView: boolean }`: Object with removeView property to control canvas removal
   * @param options - Options for destroying the application:
   *  - `false` or `undefined`: Basic cleanup (default)
   *  - `true`: Complete cleanup including children
   *  - Detailed options object:
   *    - `children`: Remove children
   *    - `texture`: Destroy textures
   *    - `textureSource`: Destroy texture sources
   *    - `context`: Destroy WebGL context
   * @example
   * ```js
   * // Basic cleanup
   * app.destroy();
   *
   * // Remove canvas and do complete cleanup
   * app.destroy(true, true);
   *
   * // Remove canvas with explicit options
   * app.destroy({ removeView: true }, true);
   *
   * // Detailed cleanup with specific options
   * app.destroy(
   *     { removeView: true },
   *     {
   *         children: true,
   *         texture: true,
   *         textureSource: true,
   *         context: true
   *     }
   * );
   * ```
   * > [!WARNING] After calling destroy, the application instance should no longer be used.
   * > All properties will be null and further operations will throw errors.
   */
  destroy(t = !1, e = !1) {
    const i = Vs._plugins.slice(0);
    i.reverse(), i.forEach((r) => {
      r.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
Mn._plugins = [];
let In = Mn;
_.handleByList(I.Application, In._plugins);
_.add(Pn);
class Tn extends ct {
  constructor() {
    super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }, this.baseLineOffset = 0, this.distanceField = { type: "none", range: 0 }, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
  }
  /**
   * The name of the font face.
   * @deprecated since 8.0.0 Use `fontFamily` instead.
   */
  get font() {
    return F(D, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
  }
  /**
   * The map of base page textures (i.e., sheets of glyphs).
   * @deprecated since 8.0.0 Use `pages` instead.
   */
  get pageTextures() {
    return F(D, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  /**
   * The size of the font face in pixels.
   * @deprecated since 8.0.0 Use `fontMetrics.fontSize` instead.
   */
  get size() {
    return F(D, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
  }
  /**
   * The kind of distance field for this font or "none".
   * @deprecated since 8.0.0 Use `distanceField.type` instead.
   */
  get distanceFieldRange() {
    return F(D, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
  }
  /**
   * The range of the distance field in pixels.
   * @deprecated since 8.0.0 Use `distanceField.range` instead.
   */
  get distanceFieldType() {
    return F(D, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
  }
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners();
    for (const e in this.chars)
      this.chars[e].texture?.destroy();
    this.chars = null, t && (this.pages.forEach((e) => e.texture.destroy(!0)), this.pages = null);
  }
}
/**
 * tiny-lru
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 11.4.7
 */
class ih {
  /**
   * Creates a new LRU cache instance.
   * Note: Constructor does not validate parameters. Use lru() factory function for parameter validation.
   *
   * @constructor
   * @param {number} [max=0] - Maximum number of items to store. 0 means unlimited.
   * @param {number} [ttl=0] - Time to live in milliseconds. 0 means no expiration.
   * @param {boolean} [resetTtl=false] - Whether to reset TTL when accessing existing items via get().
   * @example
   * const cache = new LRU(1000, 60000, true); // 1000 items, 1 minute TTL, reset on access
   * @see {@link lru} For parameter validation
   * @since 1.0.0
   */
  constructor(t = 0, e = 0, i = !1) {
    this.first = null, this.items = /* @__PURE__ */ Object.create(null), this.last = null, this.max = t, this.resetTtl = i, this.size = 0, this.ttl = e;
  }
  /**
   * Removes all items from the cache.
   *
   * @method clear
   * @memberof LRU
   * @returns {LRU} The LRU instance for method chaining.
   * @example
   * cache.clear();
   * console.log(cache.size); // 0
   * @since 1.0.0
   */
  clear() {
    return this.first = null, this.items = /* @__PURE__ */ Object.create(null), this.last = null, this.size = 0, this;
  }
  /**
   * Removes an item from the cache by key.
   *
   * @method delete
   * @memberof LRU
   * @param {string} key - The key of the item to delete.
   * @returns {LRU} The LRU instance for method chaining.
   * @example
   * cache.set('key1', 'value1');
   * cache.delete('key1');
   * console.log(cache.has('key1')); // false
   * @see {@link LRU#has}
   * @see {@link LRU#clear}
   * @since 1.0.0
   */
  delete(t) {
    if (this.has(t)) {
      const e = this.items[t];
      delete this.items[t], this.size--, e.prev !== null && (e.prev.next = e.next), e.next !== null && (e.next.prev = e.prev), this.first === e && (this.first = e.next), this.last === e && (this.last = e.prev);
    }
    return this;
  }
  /**
   * Returns an array of [key, value] pairs for the specified keys.
   * Order follows LRU order (least to most recently used).
   *
   * @method entries
   * @memberof LRU
   * @param {string[]} [keys=this.keys()] - Array of keys to get entries for. Defaults to all keys.
   * @returns {Array<Array<*>>} Array of [key, value] pairs in LRU order.
   * @example
   * cache.set('a', 1).set('b', 2);
   * console.log(cache.entries()); // [['a', 1], ['b', 2]]
   * console.log(cache.entries(['a'])); // [['a', 1]]
   * @see {@link LRU#keys}
   * @see {@link LRU#values}
   * @since 11.1.0
   */
  entries(t = this.keys()) {
    const e = new Array(t.length);
    for (let i = 0; i < t.length; i++) {
      const r = t[i];
      e[i] = [r, this.get(r)];
    }
    return e;
  }
  /**
   * Removes the least recently used item from the cache.
   *
   * @method evict
   * @memberof LRU
   * @param {boolean} [bypass=false] - Whether to force eviction even when cache is empty.
   * @returns {LRU} The LRU instance for method chaining.
   * @example
   * cache.set('old', 'value').set('new', 'value');
   * cache.evict(); // Removes 'old' item
   * @see {@link LRU#setWithEvicted}
   * @since 1.0.0
   */
  evict(t = !1) {
    if (t || this.size > 0) {
      const e = this.first;
      delete this.items[e.key], --this.size === 0 ? (this.first = null, this.last = null) : (this.first = e.next, this.first.prev = null);
    }
    return this;
  }
  /**
   * Returns the expiration timestamp for a given key.
   *
   * @method expiresAt
   * @memberof LRU
   * @param {string} key - The key to check expiration for.
   * @returns {number|undefined} The expiration timestamp in milliseconds, or undefined if key doesn't exist.
   * @example
   * const cache = new LRU(100, 5000); // 5 second TTL
   * cache.set('key1', 'value1');
   * console.log(cache.expiresAt('key1')); // timestamp 5 seconds from now
   * @see {@link LRU#get}
   * @see {@link LRU#has}
   * @since 1.0.0
   */
  expiresAt(t) {
    let e;
    return this.has(t) && (e = this.items[t].expiry), e;
  }
  /**
   * Retrieves a value from the cache by key. Updates the item's position to most recently used.
   *
   * @method get
   * @memberof LRU
   * @param {string} key - The key to retrieve.
   * @returns {*} The value associated with the key, or undefined if not found or expired.
   * @example
   * cache.set('key1', 'value1');
   * console.log(cache.get('key1')); // 'value1'
   * console.log(cache.get('nonexistent')); // undefined
   * @see {@link LRU#set}
   * @see {@link LRU#has}
   * @since 1.0.0
   */
  get(t) {
    const e = this.items[t];
    if (e !== void 0) {
      if (this.ttl > 0 && e.expiry <= Date.now()) {
        this.delete(t);
        return;
      }
      return this.moveToEnd(e), e.value;
    }
  }
  /**
   * Checks if a key exists in the cache.
   *
   * @method has
   * @memberof LRU
   * @param {string} key - The key to check for.
   * @returns {boolean} True if the key exists, false otherwise.
   * @example
   * cache.set('key1', 'value1');
   * console.log(cache.has('key1')); // true
   * console.log(cache.has('nonexistent')); // false
   * @see {@link LRU#get}
   * @see {@link LRU#delete}
   * @since 9.0.0
   */
  has(t) {
    return t in this.items;
  }
  /**
   * Efficiently moves an item to the end of the LRU list (most recently used position).
   * This is an internal optimization method that avoids the overhead of the full set() operation
   * when only LRU position needs to be updated.
   *
   * @method moveToEnd
   * @memberof LRU
   * @param {Object} item - The cache item with prev/next pointers to reposition.
   * @private
   * @since 11.3.5
   */
  moveToEnd(t) {
    this.last !== t && (t.prev !== null && (t.prev.next = t.next), t.next !== null && (t.next.prev = t.prev), this.first === t && (this.first = t.next), t.prev = this.last, t.next = null, this.last !== null && (this.last.next = t), this.last = t, this.first === null && (this.first = t));
  }
  /**
   * Returns an array of all keys in the cache, ordered from least to most recently used.
   *
   * @method keys
   * @memberof LRU
   * @returns {string[]} Array of keys in LRU order.
   * @example
   * cache.set('a', 1).set('b', 2);
   * cache.get('a'); // Move 'a' to most recent
   * console.log(cache.keys()); // ['b', 'a']
   * @see {@link LRU#values}
   * @see {@link LRU#entries}
   * @since 9.0.0
   */
  keys() {
    const t = new Array(this.size);
    let e = this.first, i = 0;
    for (; e !== null; )
      t[i++] = e.key, e = e.next;
    return t;
  }
  /**
   * Sets a value in the cache and returns any evicted item.
   *
   * @method setWithEvicted
   * @memberof LRU
   * @param {string} key - The key to set.
   * @param {*} value - The value to store.
   * @param {boolean} [resetTtl=this.resetTtl] - Whether to reset the TTL for this operation.
   * @returns {Object|null} The evicted item (if any) with shape {key, value, expiry, prev, next}, or null.
   * @example
   * const cache = new LRU(2);
   * cache.set('a', 1).set('b', 2);
   * const evicted = cache.setWithEvicted('c', 3); // evicted = {key: 'a', value: 1, ...}
   * @see {@link LRU#set}
   * @see {@link LRU#evict}
   * @since 11.3.0
   */
  setWithEvicted(t, e, i = this.resetTtl) {
    let r = null;
    if (this.has(t))
      this.set(t, e, !0, i);
    else {
      this.max > 0 && this.size === this.max && (r = { ...this.first }, this.evict(!0));
      let n = this.items[t] = {
        expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
        key: t,
        prev: this.last,
        next: null,
        value: e
      };
      ++this.size === 1 ? this.first = n : this.last.next = n, this.last = n;
    }
    return r;
  }
  /**
   * Sets a value in the cache. Updates the item's position to most recently used.
   *
   * @method set
   * @memberof LRU
   * @param {string} key - The key to set.
   * @param {*} value - The value to store.
   * @param {boolean} [bypass=false] - Internal parameter for setWithEvicted method.
   * @param {boolean} [resetTtl=this.resetTtl] - Whether to reset the TTL for this operation.
   * @returns {LRU} The LRU instance for method chaining.
   * @example
   * cache.set('key1', 'value1')
   *      .set('key2', 'value2')
   *      .set('key3', 'value3');
   * @see {@link LRU#get}
   * @see {@link LRU#setWithEvicted}
   * @since 1.0.0
   */
  set(t, e, i = !1, r = this.resetTtl) {
    let n = this.items[t];
    return i || n !== void 0 ? (n.value = e, i === !1 && r && (n.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl), this.moveToEnd(n)) : (this.max > 0 && this.size === this.max && this.evict(!0), n = this.items[t] = {
      expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
      key: t,
      prev: this.last,
      next: null,
      value: e
    }, ++this.size === 1 ? this.first = n : this.last.next = n, this.last = n), this;
  }
  /**
   * Returns an array of all values in the cache for the specified keys.
   * Order follows LRU order (least to most recently used).
   *
   * @method values
   * @memberof LRU
   * @param {string[]} [keys=this.keys()] - Array of keys to get values for. Defaults to all keys.
   * @returns {Array<*>} Array of values corresponding to the keys in LRU order.
   * @example
   * cache.set('a', 1).set('b', 2);
   * console.log(cache.values()); // [1, 2]
   * console.log(cache.values(['a'])); // [1]
   * @see {@link LRU#keys}
   * @see {@link LRU#entries}
   * @since 11.1.0
   */
  values(t = this.keys()) {
    const e = new Array(t.length);
    for (let i = 0; i < t.length; i++)
      e[i] = this.get(t[i]);
    return e;
  }
}
function En(s = 1e3, t = 0, e = !1) {
  if (isNaN(s) || s < 0)
    throw new TypeError("Invalid max value");
  if (isNaN(t) || t < 0)
    throw new TypeError("Invalid ttl value");
  if (typeof e != "boolean")
    throw new TypeError("Invalid resetTtl value");
  return new ih(s, t, e);
}
const rh = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
function Os(s) {
  const t = typeof s.fontSize == "number" ? `${s.fontSize}px` : s.fontSize;
  let e = s.fontFamily;
  Array.isArray(s.fontFamily) || (e = s.fontFamily.split(","));
  for (let i = e.length - 1; i >= 0; i--) {
    let r = e[i].trim();
    !/([\"\'])[^\'\"]+\1/.test(r) && !rh.includes(r) && (r = `"${r}"`), e[i] = r;
  }
  return `${s.fontStyle} ${s.fontVariant} ${s.fontWeight} ${t} ${e.join(",")}`;
}
const ys = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, dt = class M {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ICanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let t = M._experimentalLetterSpacingSupported;
    if (t === void 0) {
      const e = Q.get().getCanvasRenderingContext2D().prototype;
      t = M._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e;
    }
    return t;
  }
  /**
   * @param text - the text that was measured
   * @param style - the style that was measured
   * @param width - the measured width of the text
   * @param height - the measured height of the text
   * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
   * @param lineWidths - an array of the line widths for each line matched to `lines`
   * @param lineHeight - the measured line height for this style
   * @param maxLineWidth - the maximum line width for all measured lines
   * @param {FontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
   */
  constructor(t, e, i, r, n, a, o, h, l) {
    this.text = t, this.style = e, this.width = i, this.height = r, this.lines = n, this.lineWidths = a, this.lineHeight = o, this.maxLineWidth = h, this.fontProperties = l;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param canvas - optional specification of the canvas to use for measuring.
   * @param wordWrap
   * @returns Measured width and height of the text.
   */
  static measureText(t = " ", e, i = M._canvas, r = e.wordWrap) {
    const n = `${t}-${e.styleKey}-wordWrap-${r}`;
    if (M._measurementCache.has(n))
      return M._measurementCache.get(n);
    const a = Os(e), o = M.measureFont(a);
    o.fontSize === 0 && (o.fontSize = e.fontSize, o.ascent = e.fontSize);
    const h = M.__context;
    h.font = a;
    const c = (r ? M._wordWrap(t, e, i) : t).split(/(?:\r\n|\r|\n)/), u = new Array(c.length);
    let f = 0;
    for (let x = 0; x < c.length; x++) {
      const y = M._measureText(c[x], e.letterSpacing, h);
      u[x] = y, f = Math.max(f, y);
    }
    const d = e._stroke?.width || 0;
    let p = f + d;
    e.dropShadow && (p += e.dropShadow.distance);
    const m = e.lineHeight || o.fontSize;
    let g = Math.max(m, o.fontSize + d) + (c.length - 1) * (m + e.leading);
    e.dropShadow && (g += e.dropShadow.distance);
    const A = new M(
      t,
      e,
      p,
      g,
      c,
      u,
      m + e.leading,
      f,
      o
    );
    return M._measurementCache.set(n, A), A;
  }
  static _measureText(t, e, i) {
    let r = !1;
    M.experimentalLetterSpacingSupported && (M.experimentalLetterSpacing ? (i.letterSpacing = `${e}px`, i.textLetterSpacing = `${e}px`, r = !0) : (i.letterSpacing = "0px", i.textLetterSpacing = "0px"));
    const n = i.measureText(t);
    let a = n.width;
    const o = -n.actualBoundingBoxLeft;
    let l = n.actualBoundingBoxRight - o;
    if (a > 0)
      if (r)
        a -= e, l -= e;
      else {
        const c = (M.graphemeSegmenter(t).length - 1) * e;
        a += c, l += c;
      }
    return Math.max(a, l);
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static _wordWrap(t, e, i = M._canvas) {
    const r = i.getContext("2d", ys);
    let n = 0, a = "", o = "";
    const h = /* @__PURE__ */ Object.create(null), { letterSpacing: l, whiteSpace: c } = e, u = M._collapseSpaces(c), f = M._collapseNewlines(c);
    let d = !u;
    const p = e.wordWrapWidth + l, m = M._tokenize(t);
    for (let g = 0; g < m.length; g++) {
      let A = m[g];
      if (M._isNewline(A)) {
        if (!f) {
          o += M._addLine(a), d = !u, a = "", n = 0;
          continue;
        }
        A = " ";
      }
      if (u) {
        const y = M.isBreakingSpace(A), b = M.isBreakingSpace(a[a.length - 1]);
        if (y && b)
          continue;
      }
      const x = M._getFromCache(A, l, h, r);
      if (x > p)
        if (a !== "" && (o += M._addLine(a), a = "", n = 0), M.canBreakWords(A, e.breakWords)) {
          const y = M.wordWrapSplit(A);
          for (let b = 0; b < y.length; b++) {
            let v = y[b], C = v, w = 1;
            for (; y[b + w]; ) {
              const T = y[b + w];
              if (!M.canBreakChars(C, T, A, b, e.breakWords))
                v += T;
              else
                break;
              C = T, w++;
            }
            b += w - 1;
            const k = M._getFromCache(v, l, h, r);
            k + n > p && (o += M._addLine(a), d = !1, a = "", n = 0), a += v, n += k;
          }
        } else {
          a.length > 0 && (o += M._addLine(a), a = "", n = 0);
          const y = g === m.length - 1;
          o += M._addLine(A, !y), d = !1, a = "", n = 0;
        }
      else
        x + n > p && (d = !1, o += M._addLine(a), a = "", n = 0), (a.length > 0 || !M.isBreakingSpace(A) || d) && (a += A, n += x);
    }
    return o += M._addLine(a, !1), o;
  }
  /**
   * Convenience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static _addLine(t, e = !0) {
    return t = M._trimRight(t), t = e ? `${t}
` : t, t;
  }
  /**
   * Gets & sets the widths of calculated characters in a cache object
   * @param key            - The key
   * @param letterSpacing  - The letter spacing
   * @param cache          - The cache
   * @param context        - The canvas context
   * @returns The from cache.
   */
  static _getFromCache(t, e, i, r) {
    let n = i[t];
    return typeof n != "number" && (n = M._measureText(t, e, r) + e, i[t] = n), n;
  }
  /**
   * Determines whether we should collapse breaking spaces.
   * @param whiteSpace - The TextStyle property whiteSpace
   * @returns Should collapse
   */
  static _collapseSpaces(t) {
    return t === "normal" || t === "pre-line";
  }
  /**
   * Determines whether we should collapse newLine chars.
   * @param whiteSpace - The white space
   * @returns should collapse
   */
  static _collapseNewlines(t) {
    return t === "normal";
  }
  /**
   * Trims breaking whitespaces from string.
   * @param text - The text
   * @returns Trimmed string
   */
  static _trimRight(t) {
    if (typeof t != "string")
      return "";
    for (let e = t.length - 1; e >= 0; e--) {
      const i = t[e];
      if (!M.isBreakingSpace(i))
        break;
      t = t.slice(0, -1);
    }
    return t;
  }
  /**
   * Determines if char is a newline.
   * @param char - The character
   * @returns True if newline, False otherwise.
   */
  static _isNewline(t) {
    return typeof t != "string" ? !1 : M._newlines.includes(t.charCodeAt(0));
  }
  /**
   * Determines if char is a breaking whitespace.
   *
   * It allows one to determine whether char should be a breaking whitespace
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param char - The character
   * @param [_nextChar] - The next character
   * @returns True if whitespace, False otherwise.
   */
  static isBreakingSpace(t, e) {
    return typeof t != "string" ? !1 : M._breakingSpaces.includes(t.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static _tokenize(t) {
    const e = [];
    let i = "";
    if (typeof t != "string")
      return e;
    for (let r = 0; r < t.length; r++) {
      const n = t[r], a = t[r + 1];
      if (M.isBreakingSpace(n, a) || M._isNewline(n)) {
        i !== "" && (e.push(i), i = ""), n === "\r" && a === `
` ? (e.push(`\r
`), r++) : e.push(n);
        continue;
      }
      i += n;
    }
    return i !== "" && e.push(i), e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   * @param _token - The token
   * @param breakWords - The style attr break words
   * @returns Whether to break word or not
   */
  static canBreakWords(t, e) {
    return e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to determine whether a pair of characters
   * should be broken by newlines
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param _char - The character
   * @param _nextChar - The next character
   * @param _token - The token/word the characters are from
   * @param _index - The index in the token of the char
   * @param _breakWords - The style attr break words
   * @returns whether to break word or not
   */
  static canBreakChars(t, e, i, r, n) {
    return !0;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It is called when a token (usually a word) has to be split into separate pieces
   * in order to determine the point to break a word.
   * It must return an array of characters.
   * @param token - The token to split
   * @returns The characters of the token
   * @see CanvasTextMetrics.graphemeSegmenter
   */
  static wordWrapSplit(t) {
    return M.graphemeSegmenter(t);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(t) {
    if (M._fonts[t])
      return M._fonts[t];
    const e = M._context;
    e.font = t;
    const i = e.measureText(M.METRICS_STRING + M.BASELINE_SYMBOL), r = {
      ascent: i.actualBoundingBoxAscent,
      descent: i.actualBoundingBoxDescent,
      fontSize: i.actualBoundingBoxAscent + i.actualBoundingBoxDescent
    };
    return M._fonts[t] = r, r;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(t = "") {
    t ? delete M._fonts[t] : M._fonts = {};
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    if (!M.__canvas) {
      let t;
      try {
        const e = new OffscreenCanvas(0, 0);
        if (e.getContext("2d", ys)?.measureText)
          return M.__canvas = e, e;
        t = Q.get().createCanvas();
      } catch {
        t = Q.get().createCanvas();
      }
      t.width = t.height = 10, M.__canvas = t;
    }
    return M.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    return M.__context || (M.__context = M._canvas.getContext("2d", ys)), M.__context;
  }
};
dt.METRICS_STRING = "|ÉqÅ";
dt.BASELINE_SYMBOL = "M";
dt.BASELINE_MULTIPLIER = 1.4;
dt.HEIGHT_MULTIPLIER = 2;
dt.graphemeSegmenter = (() => {
  if (typeof Intl?.Segmenter == "function") {
    const s = new Intl.Segmenter();
    return (t) => {
      const e = s.segment(t), i = [];
      let r = 0;
      for (const n of e)
        i[r++] = n.segment;
      return i;
    };
  }
  return (s) => [...s];
})();
dt.experimentalLetterSpacing = !1;
dt._fonts = {};
dt._newlines = [
  10,
  // line feed
  13
  // carriage return
];
dt._breakingSpaces = [
  9,
  // character tabulation
  32,
  // space
  8192,
  // en quad
  8193,
  // em quad
  8194,
  // en space
  8195,
  // em space
  8196,
  // three-per-em space
  8197,
  // four-per-em space
  8198,
  // six-per-em space
  8200,
  // punctuation space
  8201,
  // thin space
  8202,
  // hair space
  8287,
  // medium mathematical space
  12288
  // ideographic space
];
dt._measurementCache = En(1e3);
let Ne = dt;
const Xi = [{ offset: 0, color: "white" }, { offset: 1, color: "black" }], ei = class Us {
  constructor(...t) {
    this.uid = j("fillGradient"), this._tick = 0, this.type = "linear", this.colorStops = [];
    let e = nh(t);
    e = { ...e.type === "radial" ? Us.defaultRadialOptions : Us.defaultLinearOptions, ...Fr(e) }, this._textureSize = e.textureSize, this._wrapMode = e.wrapMode, e.type === "radial" ? (this.center = e.center, this.outerCenter = e.outerCenter ?? this.center, this.innerRadius = e.innerRadius, this.outerRadius = e.outerRadius, this.scale = e.scale, this.rotation = e.rotation) : (this.start = e.start, this.end = e.end), this.textureSpace = e.textureSpace, this.type = e.type, e.colorStops.forEach((r) => {
      this.addColorStop(r.offset, r.color);
    });
  }
  /**
   * Adds a color stop to the gradient
   * @param offset - Position of the stop (0-1)
   * @param color - Color of the stop
   * @returns This gradient instance for chaining
   */
  addColorStop(t, e) {
    return this.colorStops.push({ offset: t, color: K.shared.setValue(e).toHexa() }), this;
  }
  /**
   * Builds the internal texture and transform for the gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildLinearGradient() {
    if (this.texture)
      return;
    let { x: t, y: e } = this.start, { x: i, y: r } = this.end, n = i - t, a = r - e;
    const o = n < 0 || a < 0;
    if (this._wrapMode === "clamp-to-edge") {
      if (n < 0) {
        const g = t;
        t = i, i = g, n *= -1;
      }
      if (a < 0) {
        const g = e;
        e = r, r = g, a *= -1;
      }
    }
    const h = this.colorStops.length ? this.colorStops : Xi, l = this._textureSize, { canvas: c, context: u } = Vi(l, 1), f = o ? u.createLinearGradient(this._textureSize, 0, 0, 0) : u.createLinearGradient(0, 0, this._textureSize, 0);
    Ni(f, h), u.fillStyle = f, u.fillRect(0, 0, l, 1), this.texture = new R({
      source: new Gt({
        resource: c,
        addressMode: this._wrapMode
      })
    });
    const d = Math.sqrt(n * n + a * a), p = Math.atan2(a, n), m = new W();
    m.scale(d / l, 1), m.rotate(p), m.translate(t, e), this.textureSpace === "local" && m.scale(l, l), this.transform = m;
  }
  /**
   * Builds the internal texture and transform for the gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildGradient() {
    this.texture || this._tick++, this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient();
  }
  /**
   * Builds the internal texture and transform for the radial gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildRadialGradient() {
    if (this.texture)
      return;
    const t = this.colorStops.length ? this.colorStops : Xi, e = this._textureSize, { canvas: i, context: r } = Vi(e, e), { x: n, y: a } = this.center, { x: o, y: h } = this.outerCenter, l = this.innerRadius, c = this.outerRadius, u = o - c, f = h - c, d = e / (c * 2), p = (n - u) * d, m = (a - f) * d, g = r.createRadialGradient(
      p,
      m,
      l * d,
      (o - u) * d,
      (h - f) * d,
      c * d
    );
    Ni(g, t), r.fillStyle = t[t.length - 1].color, r.fillRect(0, 0, e, e), r.fillStyle = g, r.translate(p, m), r.rotate(this.rotation), r.scale(1, this.scale), r.translate(-p, -m), r.fillRect(0, 0, e, e), this.texture = new R({
      source: new Gt({
        resource: i,
        addressMode: this._wrapMode
      })
    });
    const A = new W();
    A.scale(1 / d, 1 / d), A.translate(u, f), this.textureSpace === "local" && A.scale(e, e), this.transform = A;
  }
  /** Destroys the gradient, releasing resources. This will also destroy the internal texture. */
  destroy() {
    this.texture?.destroy(!0), this.texture = null, this.transform = null, this.colorStops = [], this.start = null, this.end = null, this.center = null, this.outerCenter = null;
  }
  /**
   * Returns a unique key for this gradient instance.
   * This key is used for caching and texture management.
   * @returns {string} Unique key for the gradient
   */
  get styleKey() {
    return `fill-gradient-${this.uid}-${this._tick}`;
  }
};
ei.defaultLinearOptions = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
  colorStops: [],
  textureSpace: "local",
  type: "linear",
  textureSize: 256,
  wrapMode: "clamp-to-edge"
};
ei.defaultRadialOptions = {
  center: { x: 0.5, y: 0.5 },
  innerRadius: 0,
  outerRadius: 0.5,
  colorStops: [],
  scale: 1,
  textureSpace: "local",
  type: "radial",
  textureSize: 256,
  wrapMode: "clamp-to-edge"
};
let xt = ei;
function Ni(s, t) {
  for (let e = 0; e < t.length; e++) {
    const i = t[e];
    s.addColorStop(i.offset, i.color);
  }
}
function Vi(s, t) {
  const e = Q.get().createCanvas(s, t), i = e.getContext("2d");
  return { canvas: e, context: i };
}
function nh(s) {
  let t = s[0] ?? {};
  return (typeof t == "number" || s[1]) && (F("8.5.2", "use options object instead"), t = {
    type: "linear",
    start: { x: s[0], y: s[1] },
    end: { x: s[2], y: s[3] },
    textureSpace: s[4],
    textureSize: s[5] ?? xt.defaultLinearOptions.textureSize
  }), t;
}
const Oi = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
class ts {
  constructor(t, e) {
    this.uid = j("fillPattern"), this._tick = 0, this.transform = new W(), this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = Oi[e].addressModeU, t.source.style.addressModeV = Oi[e].addressModeV);
  }
  /**
   * Sets the transform for the pattern
   * @param transform - The transform matrix to apply to the pattern.
   * If not provided, the pattern will use the default transform.
   */
  setTransform(t) {
    const e = this.texture;
    this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(
      1 / e.frame.width,
      1 / e.frame.height
    ), this._tick++;
  }
  /** Internal texture used to render the gradient */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    this._texture !== t && (this._texture = t, this._tick++);
  }
  /**
   * Returns a unique key for this instance.
   * This key is used for caching.
   * @returns {string} Unique key for the instance
   */
  get styleKey() {
    return `fill-pattern-${this.uid}-${this._tick}`;
  }
  /** Destroys the fill pattern, releasing resources. This will also destroy the internal texture. */
  destroy() {
    this.texture.destroy(!0), this.texture = null;
  }
}
var bs, Ui;
function ah() {
  if (Ui) return bs;
  Ui = 1, bs = e;
  var s = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, t = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
  function e(n) {
    var a = [];
    return n.replace(t, function(o, h, l) {
      var c = h.toLowerCase();
      for (l = r(l), c == "m" && l.length > 2 && (a.push([h].concat(l.splice(0, 2))), c = "l", h = h == "m" ? "l" : "L"); ; ) {
        if (l.length == s[c])
          return l.unshift(h), a.push(l);
        if (l.length < s[c]) throw new Error("malformed path data");
        a.push([h].concat(l.splice(0, s[c])));
      }
    }), a;
  }
  var i = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
  function r(n) {
    var a = n.match(i);
    return a ? a.map(Number) : [];
  }
  return bs;
}
var oh = ah();
const hh = /* @__PURE__ */ Tr(oh);
function lh(s, t) {
  const e = hh(s), i = [];
  let r = null, n = 0, a = 0;
  for (let o = 0; o < e.length; o++) {
    const h = e[o], l = h[0], c = h;
    switch (l) {
      case "M":
        n = c[1], a = c[2], t.moveTo(n, a);
        break;
      case "m":
        n += c[1], a += c[2], t.moveTo(n, a);
        break;
      case "H":
        n = c[1], t.lineTo(n, a);
        break;
      case "h":
        n += c[1], t.lineTo(n, a);
        break;
      case "V":
        a = c[1], t.lineTo(n, a);
        break;
      case "v":
        a += c[1], t.lineTo(n, a);
        break;
      case "L":
        n = c[1], a = c[2], t.lineTo(n, a);
        break;
      case "l":
        n += c[1], a += c[2], t.lineTo(n, a);
        break;
      case "C":
        n = c[5], a = c[6], t.bezierCurveTo(
          c[1],
          c[2],
          // First control point
          c[3],
          c[4],
          // Second control point
          n,
          a
          // End point
        );
        break;
      case "c":
        t.bezierCurveTo(
          n + c[1],
          a + c[2],
          // First control point
          n + c[3],
          a + c[4],
          // Second control point
          n + c[5],
          a + c[6]
          // End point
        ), n += c[5], a += c[6];
        break;
      case "S":
        n = c[3], a = c[4], t.bezierCurveToShort(
          c[1],
          c[2],
          // Control point
          n,
          a
          // End point
        );
        break;
      case "s":
        t.bezierCurveToShort(
          n + c[1],
          a + c[2],
          // Control point
          n + c[3],
          a + c[4]
          // End point
        ), n += c[3], a += c[4];
        break;
      case "Q":
        n = c[3], a = c[4], t.quadraticCurveTo(
          c[1],
          c[2],
          // Control point
          n,
          a
          // End point
        );
        break;
      case "q":
        t.quadraticCurveTo(
          n + c[1],
          a + c[2],
          // Control point
          n + c[3],
          a + c[4]
          // End point
        ), n += c[3], a += c[4];
        break;
      case "T":
        n = c[1], a = c[2], t.quadraticCurveToShort(
          n,
          a
          // End point
        );
        break;
      case "t":
        n += c[1], a += c[2], t.quadraticCurveToShort(
          n,
          a
          // End point
        );
        break;
      case "A":
        n = c[6], a = c[7], t.arcToSvg(
          c[1],
          // rx
          c[2],
          // ry
          c[3],
          // x-axis-rotation
          c[4],
          // large-arc-flag
          c[5],
          // sweep-flag
          n,
          a
          // End point
        );
        break;
      case "a":
        n += c[6], a += c[7], t.arcToSvg(
          c[1],
          // rx
          c[2],
          // ry
          c[3],
          // x-axis-rotation
          c[4],
          // large-arc-flag
          c[5],
          // sweep-flag
          n,
          a
          // End point
        );
        break;
      case "Z":
      case "z":
        t.closePath(), i.length > 0 && (r = i.pop(), r ? (n = r.startX, a = r.startY) : (n = 0, a = 0)), r = null;
        break;
      default:
        Y(`Unknown SVG path command: ${l}`);
    }
    l !== "Z" && l !== "z" && r === null && (r = { startX: n, startY: a }, i.push(r));
  }
  return t;
}
class si {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, i = 0) {
    this.type = "circle", this.x = t, this.y = e, this.radius = i;
  }
  /**
   * Creates a clone of this Circle instance.
   * @example
   * ```ts
   * // Basic circle cloning
   * const original = new Circle(100, 100, 50);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.radius = 75;
   *
   * // Verify independence
   * console.log(original.radius); // 50
   * console.log(modified.radius); // 75
   * ```
   * @returns A copy of the Circle
   * @see {@link Circle.copyFrom} For copying into existing circle
   * @see {@link Circle.copyTo} For copying to another circle
   */
  clone() {
    return new si(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle.
   *
   * Uses the distance formula to determine if a point is inside the circle's radius.
   *
   * Commonly used for hit testing in PixiJS events and graphics.
   * @example
   * ```ts
   * // Basic containment check
   * const circle = new Circle(100, 100, 50);
   * const isInside = circle.contains(120, 120);
   *
   * // Check mouse position
   * const circle = new Circle(0, 0, 100);
   * container.hitArea = circle;
   * container.on('pointermove', (e) => {
   *     // only called if pointer is within circle
   * });
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   * @see {@link Circle.strokeContains} For checking stroke intersection
   * @see {@link Circle.getBounds} For getting bounding box
   */
  contains(t, e) {
    if (this.radius <= 0)
      return !1;
    const i = this.radius * this.radius;
    let r = this.x - t, n = this.y - e;
    return r *= r, n *= n, r + n <= i;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const circle = new Circle(100, 100, 50);
   * const isOnStroke = circle.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = circle.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = circle.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = circle.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this Circle's stroke
   * @see {@link Circle.contains} For checking fill containment
   * @see {@link Circle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    if (this.radius === 0)
      return !1;
    const n = this.x - t, a = this.y - e, o = this.radius, h = (1 - r) * i, l = Math.sqrt(n * n + a * a);
    return l <= o + h && l > o - (i - h);
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const circle = new Circle(100, 100, 50);
   * const bounds = circle.getBounds();
   * // bounds: x=50, y=50, width=100, height=100
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * circle.getBounds(rect);
   * ```
   * @param out - Optional Rectangle object to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Circle.contains} For point containment
   */
  getBounds(t) {
    return t || (t = new q()), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
  }
  /**
   * Copies another circle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Circle(100, 100, 50);
   * const target = new Circle();
   * target.copyFrom(source);
   * ```
   * @param circle - The circle to copy from
   * @returns Returns itself
   * @see {@link Circle.copyTo} For copying to another circle
   * @see {@link Circle.clone} For creating new circle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
  }
  /**
   * Copies this circle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Circle(100, 100, 50);
   * const target = new Circle();
   * source.copyTo(target);
   * ```
   * @param circle - The circle to copy to
   * @returns Returns given parameter
   * @see {@link Circle.copyFrom} For copying from another circle
   * @see {@link Circle.clone} For creating new circle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
}
class ii {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, i = 0, r = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = i, this.halfHeight = r;
  }
  /**
   * Creates a clone of this Ellipse instance.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Ellipse(100, 100, 50, 25);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.halfWidth *= 2;
   * modified.halfHeight *= 2;
   *
   * // Verify independence
   * console.log(original.halfWidth);  // 50
   * console.log(modified.halfWidth);  // 100
   * ```
   * @returns A copy of the ellipse
   * @see {@link Ellipse.copyFrom} For copying into existing ellipse
   * @see {@link Ellipse.copyTo} For copying to another ellipse
   */
  clone() {
    return new ii(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse.
   * Uses normalized coordinates and the ellipse equation to determine containment.
   * @example
   * ```ts
   * // Basic containment check
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const isInside = ellipse.contains(120, 110);
   * ```
   * @remarks
   * - Uses ellipse equation (x²/a² + y²/b² ≤ 1)
   * - Returns false if dimensions are 0 or negative
   * - Normalized to center (0,0) for calculation
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   * @see {@link Ellipse.strokeContains} For checking stroke intersection
   * @see {@link Ellipse.getBounds} For getting containing rectangle
   */
  contains(t, e) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0)
      return !1;
    let i = (t - this.x) / this.halfWidth, r = (e - this.y) / this.halfHeight;
    return i *= i, r *= r, i + r <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const isOnStroke = ellipse.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = ellipse.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = ellipse.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = ellipse.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @remarks
   * - Uses normalized ellipse equations
   * - Considers stroke alignment
   * - Returns false if dimensions are 0
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coords are within this ellipse's stroke
   * @see {@link Ellipse.contains} For checking fill containment
   * @see {@link Ellipse.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const { halfWidth: n, halfHeight: a } = this;
    if (n <= 0 || a <= 0)
      return !1;
    const o = i * (1 - r), h = i - o, l = n - h, c = a - h, u = n + o, f = a + o, d = t - this.x, p = e - this.y, m = d * d / (l * l) + p * p / (c * c), g = d * d / (u * u) + p * p / (f * f);
    return m > 1 && g <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const bounds = ellipse.getBounds();
   * // bounds: x=50, y=75, width=100, height=50
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * ellipse.getBounds(rect);
   * ```
   * @remarks
   * - Creates Rectangle if none provided
   * - Top-left is (x-halfWidth, y-halfHeight)
   * - Width is halfWidth * 2
   * - Height is halfHeight * 2
   * @param out - Optional Rectangle object to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Ellipse.contains} For checking if a point is inside
   */
  getBounds(t) {
    return t || (t = new q()), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
  }
  /**
   * Copies another ellipse to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Ellipse(100, 100, 50, 25);
   * const target = new Ellipse();
   * target.copyFrom(source);
   * ```
   * @param ellipse - The ellipse to copy from
   * @returns Returns itself
   * @see {@link Ellipse.copyTo} For copying to another ellipse
   * @see {@link Ellipse.clone} For creating new ellipse copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
  }
  /**
   * Copies this ellipse to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Ellipse(100, 100, 50, 25);
   * const target = new Ellipse();
   * source.copyTo(target);
   * ```
   * @param ellipse - The ellipse to copy to
   * @returns Returns given parameter
   * @see {@link Ellipse.copyFrom} For copying from another ellipse
   * @see {@link Ellipse.clone} For creating new ellipse copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
  }
}
function ch(s, t, e, i, r, n) {
  const a = s - e, o = t - i, h = r - e, l = n - i, c = a * h + o * l, u = h * h + l * l;
  let f = -1;
  u !== 0 && (f = c / u);
  let d, p;
  f < 0 ? (d = e, p = i) : f > 1 ? (d = r, p = n) : (d = e + f * h, p = i + f * l);
  const m = s - d, g = t - p;
  return m * m + g * g;
}
let uh, dh;
class de {
  /**
   * @param points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...t) {
    this.type = "polygon";
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const i = [];
      for (let r = 0, n = e.length; r < n; r++)
        i.push(e[r].x, e[r].y);
      e = i;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Determines whether the polygon's points are arranged in a clockwise direction.
   * Uses the shoelace formula (surveyor's formula) to calculate the signed area.
   *
   * A positive area indicates clockwise winding, while negative indicates counter-clockwise.
   *
   * The formula sums up the cross products of adjacent vertices:
   * For each pair of adjacent points (x1,y1) and (x2,y2), we calculate (x1*y2 - x2*y1)
   * The final sum divided by 2 gives the signed area - positive for clockwise.
   * @example
   * ```ts
   * // Check polygon winding
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * console.log(polygon.isClockwise()); // Check direction
   *
   * // Use in path construction
   * const hole = new Polygon([25, 25, 75, 25, 75, 75, 25, 75]);
   * if (hole.isClockwise() === shape.isClockwise()) {
   *     hole.points.reverse(); // Reverse for proper hole winding
   * }
   * ```
   * @returns `true` if the polygon's points are arranged clockwise, `false` if counter-clockwise
   */
  isClockwise() {
    let t = 0;
    const e = this.points, i = e.length;
    for (let r = 0; r < i; r += 2) {
      const n = e[r], a = e[r + 1], o = e[(r + 2) % i], h = e[(r + 3) % i];
      t += (o - n) * (h + a);
    }
    return t < 0;
  }
  /**
   * Checks if this polygon completely contains another polygon.
   * Used for detecting holes in shapes, like when parsing SVG paths.
   * @example
   * ```ts
   * // Basic containment check
   * const outerSquare = new Polygon([0,0, 100,0, 100,100, 0,100]); // A square
   * const innerSquare = new Polygon([25,25, 75,25, 75,75, 25,75]); // A smaller square inside
   *
   * outerSquare.containsPolygon(innerSquare); // Returns true
   * innerSquare.containsPolygon(outerSquare); // Returns false
   * ```
   * @remarks
   * - Uses bounds check for quick rejection
   * - Tests all points for containment
   * @param polygon - The polygon to test for containment
   * @returns True if this polygon completely contains the other polygon
   * @see {@link Polygon.contains} For single point testing
   * @see {@link Polygon.getBounds} For bounds calculation
   */
  containsPolygon(t) {
    const e = this.getBounds(uh), i = t.getBounds(dh);
    if (!e.containsRect(i))
      return !1;
    const r = t.points;
    for (let n = 0; n < r.length; n += 2) {
      const a = r[n], o = r[n + 1];
      if (!this.contains(a, o))
        return !1;
    }
    return !0;
  }
  /**
   * Creates a clone of this polygon.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Polygon([0, 0, 100, 0, 50, 100]);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.points[0] = 10; // Modify first x coordinate
   * ```
   * @returns A copy of the polygon
   * @see {@link Polygon.copyFrom} For copying into existing polygon
   * @see {@link Polygon.copyTo} For copying to another polygon
   */
  clone() {
    const t = this.points.slice(), e = new de(t);
    return e.closePath = this.closePath, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * Uses raycasting algorithm for point-in-polygon testing.
   * @example
   * ```ts
   * // Basic containment check
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const isInside = polygon.contains(25, 25); // true
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this polygon
   * @see {@link Polygon.strokeContains} For checking stroke intersection
   * @see {@link Polygon.containsPolygon} For polygon-in-polygon testing
   */
  contains(t, e) {
    let i = !1;
    const r = this.points.length / 2;
    for (let n = 0, a = r - 1; n < r; a = n++) {
      const o = this.points[n * 2], h = this.points[n * 2 + 1], l = this.points[a * 2], c = this.points[a * 2 + 1];
      h > e != c > e && t < (l - o) * ((e - h) / (c - h)) + o && (i = !i);
    }
    return i;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const isOnStroke = polygon.strokeContains(25, 25, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = polygon.strokeContains(25, 25, 4, 1);   // Inside
   * const centerStroke = polygon.strokeContains(25, 25, 4, 0.5); // Centered
   * const outerStroke = polygon.strokeContains(25, 25, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this polygon's stroke
   * @see {@link Polygon.contains} For checking fill containment
   * @see {@link Polygon.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const n = i * i, a = n * (1 - r), o = n - a, { points: h } = this, l = h.length - (this.closePath ? 0 : 2);
    for (let c = 0; c < l; c += 2) {
      const u = h[c], f = h[c + 1], d = h[(c + 2) % h.length], p = h[(c + 3) % h.length], m = ch(t, e, u, f, d, p), g = Math.sign((d - u) * (e - f) - (p - f) * (t - u));
      if (m <= (g < 0 ? o : a))
        return !0;
    }
    return !1;
  }
  /**
   * Returns the framing rectangle of the polygon as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const bounds = polygon.getBounds();
   * // bounds: x=0, y=0, width=100, height=100
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * polygon.getBounds(rect);
   * ```
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Polygon.contains} For checking if a point is inside
   */
  getBounds(t) {
    t || (t = new q());
    const e = this.points;
    let i = 1 / 0, r = -1 / 0, n = 1 / 0, a = -1 / 0;
    for (let o = 0, h = e.length; o < h; o += 2) {
      const l = e[o], c = e[o + 1];
      i = l < i ? l : i, r = l > r ? l : r, n = c < n ? c : n, a = c > a ? c : a;
    }
    return t.x = i, t.width = r - i, t.y = n, t.height = a - n, t;
  }
  /**
   * Copies another polygon to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Polygon([0, 0, 100, 0, 50, 100]);
   * const target = new Polygon();
   * target.copyFrom(source);
   * ```
   * @param polygon - The polygon to copy from
   * @returns Returns itself
   * @see {@link Polygon.copyTo} For copying to another polygon
   * @see {@link Polygon.clone} For creating new polygon copy
   */
  copyFrom(t) {
    return this.points = t.points.slice(), this.closePath = t.closePath, this;
  }
  /**
   * Copies this polygon to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Polygon([0, 0, 100, 0, 50, 100]);
   * const target = new Polygon();
   * source.copyTo(target);
   * ```
   * @param polygon - The polygon to copy to
   * @returns Returns given parameter
   * @see {@link Polygon.copyFrom} For copying from another polygon
   * @see {@link Polygon.clone} For creating new polygon copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t, e) => `${t}, ${e}`, "")}]`;
  }
  /**
   * Get the last X coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.lastX); // 300
   * ```
   * @readonly
   * @returns The x-coordinate of the last vertex
   * @see {@link Polygon.lastY} For last Y coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get lastX() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.lastY); // 400
   * ```
   * @readonly
   * @returns The y-coordinate of the last vertex
   * @see {@link Polygon.lastX} For last X coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get lastY() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the last X coordinate of the polygon.
   * @readonly
   * @deprecated since 8.11.0, use {@link Polygon.lastX} instead.
   */
  get x() {
    return F("8.11.0", "Polygon.lastX is deprecated, please use Polygon.lastX instead."), this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon.
   * @readonly
   * @deprecated since 8.11.0, use {@link Polygon.lastY} instead.
   */
  get y() {
    return F("8.11.0", "Polygon.y is deprecated, please use Polygon.lastY instead."), this.points[this.points.length - 1];
  }
  /**
   * Get the first X coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.x); // 0
   * ```
   * @readonly
   * @returns The x-coordinate of the first vertex
   * @see {@link Polygon.startY} For first Y coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get startX() {
    return this.points[0];
  }
  /**
   * Get the first Y coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.y); // 0
   * ```
   * @readonly
   * @returns The y-coordinate of the first vertex
   * @see {@link Polygon.startX} For first X coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get startY() {
    return this.points[1];
  }
}
const De = (s, t, e, i, r, n, a) => {
  const o = s - e, h = t - i, l = Math.sqrt(o * o + h * h);
  return l >= r - n && l <= r + a;
};
class ri {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, i = 0, r = 0, n = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = i, this.height = r, this.radius = n;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @example
   * ```ts
   * // Basic bounds calculation
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const bounds = rect.getBounds();
   * // bounds: x=100, y=100, width=200, height=150
   *
   * // Reuse existing rectangle
   * const out = new Rectangle();
   * rect.getBounds(out);
   * ```
   * @remarks
   * - Rectangle matches outer dimensions
   * - Ignores corner radius
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link RoundedRectangle.contains} For checking if a point is inside
   */
  getBounds(t) {
    return t || (t = new q()), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new RoundedRectangle(100, 100, 200, 150, 20);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.radius = 30;
   * modified.width *= 2;
   *
   * // Verify independence
   * console.log(original.radius);  // 20
   * console.log(modified.radius);  // 30
   * ```
   * @returns A copy of the rounded rectangle
   * @see {@link RoundedRectangle.copyFrom} For copying into existing rectangle
   * @see {@link RoundedRectangle.copyTo} For copying to another rectangle
   */
  clone() {
    return new ri(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Copies another rectangle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new RoundedRectangle(100, 100, 200, 150, 20);
   * const target = new RoundedRectangle();
   * target.copyFrom(source);
   *
   * // Chain with other operations
   * const rect = new RoundedRectangle()
   *     .copyFrom(source)
   *     .getBounds(rect);
   * ```
   * @param rectangle - The rectangle to copy from
   * @returns Returns itself
   * @see {@link RoundedRectangle.copyTo} For copying to another rectangle
   * @see {@link RoundedRectangle.clone} For creating new rectangle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new RoundedRectangle(100, 100, 200, 150, 20);
   * const target = new RoundedRectangle();
   * source.copyTo(target);
   *
   * // Chain with other operations
   * const result = source
   *     .copyTo(new RoundedRectangle())
   *     .getBounds();
   * ```
   * @param rectangle - The rectangle to copy to
   * @returns Returns given parameter
   * @see {@link RoundedRectangle.copyFrom} For copying from another rectangle
   * @see {@link RoundedRectangle.clone} For creating new rectangle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @example
   * ```ts
   * // Basic containment check
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const isInside = rect.contains(150, 125); // true
   * // Check corner radius
   * const corner = rect.contains(100, 100); // false if within corner curve
   * ```
   * @remarks
   * - Returns false if width/height is 0 or negative
   * - Handles rounded corners with radius check
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rounded Rectangle
   * @see {@link RoundedRectangle.strokeContains} For checking stroke intersection
   * @see {@link RoundedRectangle.getBounds} For getting containing rectangle
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const i = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + i && e <= this.y + this.height - i || t >= this.x + i && t <= this.x + this.width - i)
        return !0;
      let r = t - (this.x + i), n = e - (this.y + i);
      const a = i * i;
      if (r * r + n * n <= a || (r = t - (this.x + this.width - i), r * r + n * n <= a) || (n = e - (this.y + this.height - i), r * r + n * n <= a) || (r = t - (this.x + i), r * r + n * n <= a))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param pX - The X coordinate of the point to test
   * @param pY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this rectangle's stroke
   * @see {@link RoundedRectangle.contains} For checking fill containment
   * @see {@link RoundedRectangle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, i, r = 0.5) {
    const { x: n, y: a, width: o, height: h, radius: l } = this, c = i * (1 - r), u = i - c, f = n + l, d = a + l, p = o - l * 2, m = h - l * 2, g = n + o, A = a + h;
    return (t >= n - c && t <= n + u || t >= g - u && t <= g + c) && e >= d && e <= d + m || (e >= a - c && e <= a + u || e >= A - u && e <= A + c) && t >= f && t <= f + p ? !0 : (
      // Top-left
      t < f && e < d && De(
        t,
        e,
        f,
        d,
        l,
        u,
        c
      ) || t > g - l && e < d && De(
        t,
        e,
        g - l,
        d,
        l,
        u,
        c
      ) || t > g - l && e > A - l && De(
        t,
        e,
        g - l,
        A - l,
        l,
        u,
        c
      ) || t < f && e > A - l && De(
        t,
        e,
        f,
        A - l,
        l,
        u,
        c
      )
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const kn = {};
function fh(s, t, e) {
  let i = 2166136261;
  for (let r = 0; r < t; r++)
    i ^= s[r].uid, i = Math.imul(i, 16777619), i >>>= 0;
  return kn[i] || gh(s, t, i, e);
}
function gh(s, t, e, i) {
  const r = {};
  let n = 0;
  for (let o = 0; o < i; o++) {
    const h = o < t ? s[o] : R.EMPTY.source;
    r[n++] = h.source, r[n++] = h.style;
  }
  const a = new Xe(r);
  return kn[e] = a, a;
}
class Hi {
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
  }
  /** View on the raw binary data as a `Int8Array`. */
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  /** View on the raw binary data as a `Uint8Array`. */
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  /**  View on the raw binary data as a `Int16Array`. */
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  /** View on the raw binary data as a `Int32Array`. */
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  /** View on the raw binary data as a `Float64Array`. */
  get float64View() {
    return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
  }
  /** View on the raw binary data as a `BigUint64Array`. */
  get bigUint64View() {
    return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
  }
  /**
   * Returns the view of the given type.
   * @param type - One of `int8`, `uint8`, `int16`,
   *    `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - typed array of given type
   */
  view(t) {
    return this[`${t}View`];
  }
  /** Destroys all buffer references. Do not use after calling this. */
  destroy() {
    this.rawBinaryData = null, this.uint32View = null, this.float32View = null, this.uint16View = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._int32View = null, this._float64Array = null, this._bigUint64Array = null;
  }
  /**
   * Returns the size of the given type in bytes.
   * @param type - One of `int8`, `uint8`, `int16`,
   *   `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - size of the type in bytes
   */
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
function ji(s, t) {
  const e = s.byteLength / 8 | 0, i = new Float64Array(s, 0, e);
  new Float64Array(t, 0, e).set(i);
  const n = s.byteLength - e * 8;
  if (n > 0) {
    const a = new Uint8Array(s, e * 8, n);
    new Uint8Array(t, e * 8, n).set(a);
  }
}
const ph = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var mh = /* @__PURE__ */ ((s) => (s[s.DISABLED = 0] = "DISABLED", s[s.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", s[s.MASK_ACTIVE = 2] = "MASK_ACTIVE", s[s.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", s[s.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", s[s.NONE = 5] = "NONE", s))(mh || {});
function qi(s, t) {
  return t.alphaMode === "no-premultiply-alpha" && ph[s] || s;
}
const Ah = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function xh(s) {
  let t = "";
  for (let e = 0; e < s; ++e)
    e > 0 && (t += `
else `), e < s - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function yh(s, t) {
  if (s === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const i = Ah.replace(/%forloop%/gi, xh(s));
      if (t.shaderSource(e, i), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
        s = s / 2 | 0;
      else
        break;
    }
  } finally {
    t.deleteShader(e);
  }
  return s;
}
let Lt = null;
function bh() {
  if (Lt)
    return Lt;
  const s = cn();
  return Lt = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), Lt = yh(
    Lt,
    s
  ), s.getExtension("WEBGL_lose_context")?.loseContext(), Lt;
}
class wh {
  constructor() {
    this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
  }
  /** Clear the textures and their locations. */
  clear() {
    for (let t = 0; t < this.count; t++) {
      const e = this.textures[t];
      this.textures[t] = null, this.ids[e.uid] = null;
    }
    this.count = 0;
  }
}
class Ch {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new wh(), this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const fe = [];
let je = 0;
be.register({
  clear: () => {
    if (fe.length > 0)
      for (const s of fe)
        s && s.destroy();
    fe.length = 0, je = 0;
  }
});
function Ki() {
  return je > 0 ? fe[--je] : new Ch();
}
function Zi(s) {
  fe[je++] = s;
}
let ie = 0;
const Fn = class Wn {
  constructor(t) {
    this.uid = j("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], t = { ...Wn.defaultOptions, ...t }, t.maxTextures || (F("v8.8.0", "maxTextures is a required option for Batcher now, please pass it in the options"), t.maxTextures = bh());
    const { maxTextures: e, attributesInitialSize: i, indicesInitialSize: r } = t;
    this.attributeBuffer = new Hi(i * 4), this.indexBuffer = new Uint16Array(r), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      Zi(this.batches[t]);
    this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
  }
  add(t) {
    this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
  }
  checkAndUpdateTexture(t, e) {
    const i = t._batch.textures.ids[e._source.uid];
    return !i && i !== 0 ? !1 : (t._textureId = i, t.texture = e, !0);
  }
  updateElement(t) {
    this.dirty = !0;
    const e = this.attributeBuffer;
    t.packAsQuad ? this.packQuadAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    ) : this.packAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    );
  }
  /**
   * breaks the batcher. This happens when a batch gets too big,
   * or we need to switch to a different type of rendering (a filter for example)
   * @param instructionSet
   */
  break(t) {
    const e = this._elements;
    if (!e[this.elementStart])
      return;
    let i = Ki(), r = i.textures;
    r.clear();
    const n = e[this.elementStart];
    let a = qi(n.blendMode, n.texture._source), o = n.topology;
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const h = this.attributeBuffer.float32View, l = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let u = this._batchIndexSize, f = this._batchIndexStart, d = "startBatch";
    const p = this.maxTextures;
    for (let m = this.elementStart; m < this.elementSize; ++m) {
      const g = e[m];
      e[m] = null;
      const x = g.texture._source, y = qi(g.blendMode, x), b = a !== y || o !== g.topology;
      if (x._batchTick === ie && !b) {
        g._textureId = x._textureBindLocation, u += g.indexSize, g.packAsQuad ? (this.packQuadAttributes(
          g,
          h,
          l,
          g._attributeStart,
          g._textureId
        ), this.packQuadIndex(
          c,
          g._indexStart,
          g._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          g,
          h,
          l,
          g._attributeStart,
          g._textureId
        ), this.packIndex(
          g,
          c,
          g._indexStart,
          g._attributeStart / this.vertexSize
        )), g._batch = i;
        continue;
      }
      x._batchTick = ie, (r.count >= p || b) && (this._finishBatch(
        i,
        f,
        u - f,
        r,
        a,
        o,
        t,
        d
      ), d = "renderBatch", f = u, a = y, o = g.topology, i = Ki(), r = i.textures, r.clear(), ++ie), g._textureId = x._textureBindLocation = r.count, r.ids[x.uid] = r.count, r.textures[r.count++] = x, g._batch = i, u += g.indexSize, g.packAsQuad ? (this.packQuadAttributes(
        g,
        h,
        l,
        g._attributeStart,
        g._textureId
      ), this.packQuadIndex(
        c,
        g._indexStart,
        g._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        g,
        h,
        l,
        g._attributeStart,
        g._textureId
      ), this.packIndex(
        g,
        c,
        g._indexStart,
        g._attributeStart / this.vertexSize
      ));
    }
    r.count > 0 && (this._finishBatch(
      i,
      f,
      u - f,
      r,
      a,
      o,
      t,
      d
    ), f = u, ++ie), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = u;
  }
  _finishBatch(t, e, i, r, n, a, o, h) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = h, t.batcher = this, t.textures = r, t.blendMode = n, t.topology = a, t.start = e, t.size = i, ++ie, this.batches[this.batchIndex++] = t, o.add(t);
  }
  finish(t) {
    this.break(t);
  }
  /**
   * Resizes the attribute buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureAttributeBuffer(t) {
    t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4);
  }
  /**
   * Resizes the index buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureIndexBuffer(t) {
    t <= this.indexBuffer.length || this._resizeIndexBuffer(t);
  }
  _resizeAttributeBuffer(t) {
    const e = Math.max(t, this.attributeBuffer.size * 2), i = new Hi(e);
    ji(this.attributeBuffer.rawBinaryData, i.rawBinaryData), this.attributeBuffer = i;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let i = Math.max(t, e.length * 1.5);
    i += i % 2;
    const r = i > 65535 ? new Uint32Array(i) : new Uint16Array(i);
    if (r.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let n = 0; n < e.length; n++)
        r[n] = e[n];
    else
      ji(e.buffer, r.buffer);
    this.indexBuffer = r;
  }
  packQuadIndex(t, e, i) {
    t[e] = i + 0, t[e + 1] = i + 1, t[e + 2] = i + 2, t[e + 3] = i + 0, t[e + 4] = i + 2, t[e + 5] = i + 3;
  }
  packIndex(t, e, i, r) {
    const n = t.indices, a = t.indexSize, o = t.indexOffset, h = t.attributeOffset;
    for (let l = 0; l < a; l++)
      e[i++] = r + n[l + o] - h;
  }
  /**
   * Destroys the batch and its resources.
   * @param options - destruction options
   * @param options.shader - whether to destroy the associated shader
   */
  destroy(t = {}) {
    if (this.batches !== null) {
      for (let e = 0; e < this.batchIndex; e++)
        Zi(this.batches[e]);
      this.batches = null, this.geometry.destroy(!0), this.geometry = null, t.shader && (this.shader?.destroy(), this.shader = null);
      for (let e = 0; e < this._elements.length; e++)
        this._elements[e] && (this._elements[e]._batch = null);
      this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
    }
  }
};
Fn.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let vh = Fn;
var et = /* @__PURE__ */ ((s) => (s[s.MAP_READ = 1] = "MAP_READ", s[s.MAP_WRITE = 2] = "MAP_WRITE", s[s.COPY_SRC = 4] = "COPY_SRC", s[s.COPY_DST = 8] = "COPY_DST", s[s.INDEX = 16] = "INDEX", s[s.VERTEX = 32] = "VERTEX", s[s.UNIFORM = 64] = "UNIFORM", s[s.STORAGE = 128] = "STORAGE", s[s.INDIRECT = 256] = "INDIRECT", s[s.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", s[s.STATIC = 1024] = "STATIC", s))(et || {});
class xe extends ct {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: i } = t;
    const { usage: r, label: n, shrinkToFit: a } = t;
    super(), this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.autoGarbageCollect = !0, this.uid = j("buffer"), this._resourceType = "buffer", this._resourceId = j("resource"), this._touched = 0, this._updateID = 1, this._dataInt32 = null, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, i ?? (i = e?.byteLength);
    const o = !!e;
    this.descriptor = {
      size: i,
      usage: r,
      mappedAtCreation: o,
      label: n
    }, this.shrinkToFit = a ?? !0;
  }
  /** the data in the buffer */
  get data() {
    return this._data;
  }
  set data(t) {
    this.setDataWithSize(t, t.length, !0);
  }
  get dataInt32() {
    return this._dataInt32 || (this._dataInt32 = new Int32Array(this.data.buffer)), this._dataInt32;
  }
  /** whether the buffer is static or not */
  get static() {
    return !!(this.descriptor.usage & et.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= et.STATIC : this.descriptor.usage &= ~et.STATIC;
  }
  /**
   * Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
   * If you only want to update a subset of the buffer, you can pass in the size of the data.
   * @param value - the data to set
   * @param size - the size of the data in bytes
   * @param syncGPU - should the buffer be updated on the GPU immediately?
   */
  setDataWithSize(t, e, i) {
    if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
      i && this.emit("update", this);
      return;
    }
    const r = this._data;
    if (this._data = t, this._dataInt32 = null, !r || r.length !== t.length) {
      !this.shrinkToFit && r && t.byteLength < r.byteLength ? i && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = j("resource"), this.emit("change", this));
      return;
    }
    i && this.emit("update", this);
  }
  /**
   * updates the buffer on the GPU to reflect the data in the buffer.
   * By default it will update the entire buffer. If you only want to update a subset of the buffer,
   * you can pass in the size of the buffer to update.
   * @param sizeInBytes - the new size of the buffer in bytes
   */
  update(t) {
    this._updateSize = t ?? this._updateSize, this._updateID++, this.emit("update", this);
  }
  /** Unloads the buffer from the GPU */
  unload() {
    this.emit("unload", this);
    for (const t in this._gpuData)
      this._gpuData[t]?.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /** Destroys the buffer */
  destroy() {
    this.destroyed = !0, this.unload(), this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
  }
}
function Rn(s, t) {
  if (!(s instanceof xe)) {
    let e = t ? et.INDEX : et.VERTEX;
    s instanceof Array && (t ? (s = new Uint32Array(s), e = et.INDEX | et.COPY_DST) : (s = new Float32Array(s), e = et.VERTEX | et.COPY_DST)), s = new xe({
      data: s,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return s;
}
function Bh(s, t, e) {
  const i = s.getAttribute(t);
  if (!i)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const r = i.buffer.data;
  let n = 1 / 0, a = 1 / 0, o = -1 / 0, h = -1 / 0;
  const l = r.BYTES_PER_ELEMENT, c = (i.offset || 0) / l, u = (i.stride || 8) / l;
  for (let f = c; f < r.length; f += u) {
    const d = r[f], p = r[f + 1];
    d > o && (o = d), p > h && (h = p), d < n && (n = d), p < a && (a = p);
  }
  return e.minX = n, e.minY = a, e.maxX = o, e.maxY = h, e;
}
function Sh(s) {
  return (s instanceof xe || Array.isArray(s) || s.BYTES_PER_ELEMENT) && (s = {
    buffer: s
  }), s.buffer = Rn(s.buffer, !1), s;
}
class Ph extends ct {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = j("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new lt(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: i, topology: r } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const n in e)
        this.addAttribute(n, e[n]);
    this.instanceCount = t.instanceCount ?? 1, i && this.addIndex(i), this.topology = r || "triangle-list";
  }
  onBufferUpdate() {
    this._boundsDirty = !0, this.emit("update", this);
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(t) {
    return this.attributes[t];
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(t) {
    return this.getAttribute(t).buffer;
  }
  /**
   * Used to figure out how many vertices there are in this geometry
   * @returns the number of vertices in the geometry
   */
  getSize() {
    for (const t in this.attributes) {
      const e = this.attributes[t];
      return e.buffer.data.length / (e.stride / 4 || e.size);
    }
    return 0;
  }
  /**
   * Adds an attribute to the geometry.
   * @param name - The name of the attribute to add.
   * @param attributeOption - The attribute option to add.
   */
  addAttribute(t, e) {
    const i = Sh(e);
    this.buffers.indexOf(i.buffer) === -1 && (this.buffers.push(i.buffer), i.buffer.on("update", this.onBufferUpdate, this), i.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = i;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = Rn(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, Bh(this, "aPosition", this._bounds)) : this._bounds;
  }
  /** Unloads the geometry from the GPU. */
  unload() {
    this.emit("unload", this);
    for (const t in this._gpuData)
      this._gpuData[t]?.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.unload(), this.indexBuffer?.destroy(), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const Mh = new Float32Array(1), Ih = new Uint32Array(1);
class Th extends Ph {
  constructor() {
    const e = new xe({
      data: Mh,
      label: "attribute-batch-buffer",
      usage: et.VERTEX | et.COPY_DST,
      shrinkToFit: !1
    }), i = new xe({
      data: Ih,
      label: "index-batch-buffer",
      usage: et.INDEX | et.COPY_DST,
      // | BufferUsage.STATIC,
      shrinkToFit: !1
    }), r = 24;
    super({
      attributes: {
        aPosition: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 0
        },
        aUV: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 8
        },
        aColor: {
          buffer: e,
          format: "unorm8x4",
          stride: r,
          offset: 16
        },
        aTextureIdAndRound: {
          buffer: e,
          format: "uint16x2",
          stride: r,
          offset: 20
        }
      },
      indexBuffer: i
    });
  }
}
function Ji(s, t, e) {
  if (s)
    for (const i in s) {
      const r = i.toLocaleLowerCase(), n = t[r];
      if (n) {
        let a = s[i];
        i === "header" && (a = a.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(a);
      } else
        Y(`${i} placement hook does not exist in shader`);
    }
}
const Eh = /\{\{(.*?)\}\}/g;
function _i(s) {
  const t = {};
  return (s.match(Eh)?.map((i) => i.replace(/[{()}]/g, "")) ?? []).forEach((i) => {
    t[i] = [];
  }), t;
}
function $i(s, t) {
  let e;
  const i = /@in\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function tr(s, t, e = !1) {
  const i = [];
  $i(t, i), s.forEach((o) => {
    o.header && $i(o.header, i);
  });
  const r = i;
  e && r.sort();
  const n = r.map((o, h) => `       @location(${h}) ${o},`).join(`
`);
  let a = t.replace(/@in\s+[^;]+;\s*/g, "");
  return a = a.replace("{{in}}", `
${n}
`), a;
}
function er(s, t) {
  let e;
  const i = /@out\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function kh(s) {
  const e = /\b(\w+)\s*:/g.exec(s);
  return e ? e[1] : "";
}
function Fh(s) {
  const t = /@.*?\s+/g;
  return s.replace(t, "");
}
function Wh(s, t) {
  const e = [];
  er(t, e), s.forEach((h) => {
    h.header && er(h.header, e);
  });
  let i = 0;
  const r = e.sort().map((h) => h.indexOf("builtin") > -1 ? h : `@location(${i++}) ${h}`).join(`,
`), n = e.sort().map((h) => `       var ${Fh(h)};`).join(`
`), a = `return VSOutput(
            ${e.sort().map((h) => ` ${kh(h)}`).join(`,
`)});`;
  let o = t.replace(/@out\s+[^;]+;\s*/g, "");
  return o = o.replace("{{struct}}", `
${r}
`), o = o.replace("{{start}}", `
${n}
`), o = o.replace("{{return}}", `
${a}
`), o;
}
function sr(s, t) {
  let e = s;
  for (const i in t) {
    const r = t[i];
    r.join(`
`).length ? e = e.replace(`{{${i}}}`, `//-----${i} START-----//
${r.join(`
`)}
//----${i} FINISH----//`) : e = e.replace(`{{${i}}}`, "");
  }
  return e;
}
const bt = /* @__PURE__ */ Object.create(null), ws = /* @__PURE__ */ new Map();
let Rh = 0;
function Gh({
  template: s,
  bits: t
}) {
  const e = Gn(s, t);
  if (bt[e])
    return bt[e];
  const { vertex: i, fragment: r } = Dh(s, t);
  return bt[e] = zn(i, r, t), bt[e];
}
function zh({
  template: s,
  bits: t
}) {
  const e = Gn(s, t);
  return bt[e] || (bt[e] = zn(s.vertex, s.fragment, t)), bt[e];
}
function Dh(s, t) {
  const e = t.map((a) => a.vertex).filter((a) => !!a), i = t.map((a) => a.fragment).filter((a) => !!a);
  let r = tr(e, s.vertex, !0);
  r = Wh(e, r);
  const n = tr(i, s.fragment, !0);
  return {
    vertex: r,
    fragment: n
  };
}
function Gn(s, t) {
  return t.map((e) => (ws.has(e) || ws.set(e, Rh++), ws.get(e))).sort((e, i) => e - i).join("-") + s.vertex + s.fragment;
}
function zn(s, t, e) {
  const i = _i(s), r = _i(t);
  return e.forEach((n) => {
    Ji(n.vertex, i, n.name), Ji(n.fragment, r, n.name);
  }), {
    vertex: sr(s, i),
    fragment: sr(t, r)
  };
}
const Lh = (
  /* wgsl */
  `
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`
), Yh = (
  /* wgsl */
  `
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`
), Qh = (
  /* glsl */
  `
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`
), Xh = (
  /* glsl */
  `

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`
), Nh = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* wgsl */
      `
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `
    )
  }
}, Vh = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* glsl */
      `
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `
    )
  }
};
function Oh({ bits: s, name: t }) {
  const e = Gh({
    template: {
      fragment: Yh,
      vertex: Lh
    },
    bits: [
      Nh,
      ...s
    ]
  });
  return $e.from({
    name: t,
    vertex: {
      source: e.vertex,
      entryPoint: "main"
    },
    fragment: {
      source: e.fragment,
      entryPoint: "main"
    }
  });
}
function Uh({ bits: s, name: t }) {
  return new dn({
    name: t,
    ...zh({
      template: {
        vertex: Qh,
        fragment: Xh
      },
      bits: [
        Vh,
        ...s
      ]
    })
  });
}
const Hh = {
  name: "color-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            @in aColor: vec4<f32>;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, jh = {
  name: "color-bit",
  vertex: {
    header: (
      /* glsl */
      `
            in vec4 aColor;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, Cs = {};
function qh(s) {
  const t = [];
  if (s === 1)
    t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let i = 0; i < s; i++)
      t.push(`@group(1) @binding(${e++}) var textureSource${i + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${i + 1}: sampler;`);
  }
  return t.join(`
`);
}
function Kh(s) {
  const t = [];
  if (s === 1)
    t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
  else {
    t.push("switch vTextureId {");
    for (let e = 0; e < s; e++)
      e === s - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
    t.push("}");
  }
  return t.join(`
`);
}
function Zh(s) {
  return Cs[s] || (Cs[s] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `
    },
    fragment: {
      header: `
                @in @interpolate(flat) vTextureId: u32;

                ${qh(s)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Kh(s)}
            `
    }
  }), Cs[s];
}
const vs = {};
function Jh(s) {
  const t = [];
  for (let e = 0; e < s; e++)
    e > 0 && t.push("else"), e < s - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function _h(s) {
  return vs[s] || (vs[s] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `
    },
    fragment: {
      header: `
                in float vTextureId;

                uniform sampler2D uTextures[${s}];

            `,
      main: `

                ${Jh(s)}
            `
    }
  }), vs[s];
}
const $h = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, tl = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* glsl */
      `
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, ir = {};
function el(s) {
  let t = ir[s];
  if (t)
    return t;
  const e = new Int32Array(s);
  for (let i = 0; i < s; i++)
    e[i] = i;
  return t = ir[s] = new mn({
    uTextures: { value: e, type: "i32", size: s }
  }, { isStatic: !0 }), t;
}
class rr extends ti {
  constructor(t) {
    const e = Uh({
      name: "batch",
      bits: [
        jh,
        _h(t),
        tl
      ]
    }), i = Oh({
      name: "batch",
      bits: [
        Hh,
        Zh(t),
        $h
      ]
    });
    super({
      glProgram: e,
      gpuProgram: i,
      resources: {
        batchSamplers: el(t)
      }
    }), this.maxTextures = t;
  }
}
let re = null;
const Dn = class Ln extends vh {
  constructor(t) {
    super(t), this.geometry = new Th(), this.name = Ln.extension.name, this.vertexSize = 6, re ?? (re = new rr(t.maxTextures)), this.shader = re;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, i, r, n) {
    const a = n << 16 | t.roundPixels & 65535, o = t.transform, h = o.a, l = o.b, c = o.c, u = o.d, f = o.tx, d = o.ty, { positions: p, uvs: m } = t, g = t.color, A = t.attributeOffset, x = A + t.attributeSize;
    for (let y = A; y < x; y++) {
      const b = y * 2, v = p[b], C = p[b + 1];
      e[r++] = h * v + c * C + f, e[r++] = u * C + l * v + d, e[r++] = m[b], e[r++] = m[b + 1], i[r++] = g, i[r++] = a;
    }
  }
  /**
   * Packs the attributes of a DefaultBatchableQuadElement into the provided views.
   * @param element - The DefaultBatchableQuadElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packQuadAttributes(t, e, i, r, n) {
    const a = t.texture, o = t.transform, h = o.a, l = o.b, c = o.c, u = o.d, f = o.tx, d = o.ty, p = t.bounds, m = p.maxX, g = p.minX, A = p.maxY, x = p.minY, y = a.uvs, b = t.color, v = n << 16 | t.roundPixels & 65535;
    e[r + 0] = h * g + c * x + f, e[r + 1] = u * x + l * g + d, e[r + 2] = y.x0, e[r + 3] = y.y0, i[r + 4] = b, i[r + 5] = v, e[r + 6] = h * m + c * x + f, e[r + 7] = u * x + l * m + d, e[r + 8] = y.x1, e[r + 9] = y.y1, i[r + 10] = b, i[r + 11] = v, e[r + 12] = h * m + c * A + f, e[r + 13] = u * A + l * m + d, e[r + 14] = y.x2, e[r + 15] = y.y2, i[r + 16] = b, i[r + 17] = v, e[r + 18] = h * g + c * A + f, e[r + 19] = u * A + l * g + d, e[r + 20] = y.x3, e[r + 21] = y.y3, i[r + 22] = b, i[r + 23] = v;
  }
  /**
   * Updates the maximum number of textures that can be used in the shader.
   * @param maxTextures - The maximum number of textures that can be used in the shader.
   * @internal
   */
  _updateMaxTextures(t) {
    this.shader.maxTextures !== t && (re = new rr(t), this.shader = re);
  }
  destroy() {
    this.shader = null, super.destroy();
  }
};
Dn.extension = {
  type: [
    I.Batcher
  ],
  name: "default"
};
let sl = Dn;
class il {
  constructor(t) {
    this.items = /* @__PURE__ */ Object.create(null);
    const { renderer: e, type: i, onUnload: r, priority: n, name: a } = t;
    this._renderer = e, e.gc.addResourceHash(this, "items", i, n ?? 0), this._onUnload = r, this.name = a;
  }
  /**
   * Add an item to the hash. No-op if already added.
   * @param item
   * @returns true if the item was added, false if it was already in the hash
   */
  add(t) {
    return this.items[t.uid] ? !1 : (this.items[t.uid] = t, t.once("unload", this.remove, this), t._gcLastUsed = this._renderer.gc.now, !0);
  }
  remove(t, ...e) {
    if (!this.items[t.uid])
      return;
    const i = t._gpuData[this._renderer.uid];
    i && (this._onUnload?.(t, ...e), i.destroy(), t._gpuData[this._renderer.uid] = null, this.items[t.uid] = null);
  }
  removeAll(...t) {
    Object.values(this.items).forEach((e) => e && this.remove(e, ...t));
  }
  destroy(...t) {
    this.removeAll(...t), this.items = /* @__PURE__ */ Object.create(null), this._renderer = null, this._onUnload = null;
  }
}
function rl(s, t, e, i, r, n, a, o = null) {
  let h = 0;
  e *= t, r *= n;
  const l = o.a, c = o.b, u = o.c, f = o.d, d = o.tx, p = o.ty;
  for (; h < a; ) {
    const m = s[e], g = s[e + 1];
    i[r] = l * m + u * g + d, i[r + 1] = c * m + f * g + p, r += n, e += t, h++;
  }
}
function nl(s, t, e, i) {
  let r = 0;
  for (t *= e; r < i; )
    s[t] = 0, s[t + 1] = 0, t += e, r++;
}
function Yn(s, t, e, i, r) {
  const n = t.a, a = t.b, o = t.c, h = t.d, l = t.tx, c = t.ty;
  e || (e = 0), i || (i = 2), r || (r = s.length / i - e);
  let u = e * i;
  for (let f = 0; f < r; f++) {
    const d = s[u], p = s[u + 1];
    s[u] = n * d + o * p + l, s[u + 1] = a * d + h * p + c, u += i;
  }
}
const al = new W();
class Qn {
  constructor() {
    this.packAsQuad = !1, this.batcherName = "default", this.topology = "triangle-list", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
  }
  get uvs() {
    return this.geometryData.uvs;
  }
  get positions() {
    return this.geometryData.vertices;
  }
  get indices() {
    return this.geometryData.indices;
  }
  get blendMode() {
    return this.renderable && this.applyTransform ? this.renderable.groupBlendMode : "normal";
  }
  get color() {
    const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, i = this.renderable;
    return i ? Nr(e, i.groupColor) + (this.alpha * i.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    return this.renderable?.groupTransform || al;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData, t.topology = this.topology;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null, this.topology = "triangle-list";
  }
  destroy() {
    this.renderable = null, this.texture = null, this.geometryData = null, this._batcher = null, this._batch = null;
  }
}
const ye = {
  extension: {
    type: I.ShapeBuilder,
    name: "circle"
  },
  build(s, t) {
    let e, i, r, n, a, o;
    if (s.type === "circle") {
      const b = s;
      if (a = o = b.radius, a <= 0)
        return !1;
      e = b.x, i = b.y, r = n = 0;
    } else if (s.type === "ellipse") {
      const b = s;
      if (a = b.halfWidth, o = b.halfHeight, a <= 0 || o <= 0)
        return !1;
      e = b.x, i = b.y, r = n = 0;
    } else {
      const b = s, v = b.width / 2, C = b.height / 2;
      e = b.x + v, i = b.y + C, a = o = Math.max(0, Math.min(b.radius, Math.min(v, C))), r = v - a, n = C - o;
    }
    if (r < 0 || n < 0)
      return !1;
    const h = Math.ceil(2.3 * Math.sqrt(a + o)), l = h * 8 + (r ? 4 : 0) + (n ? 4 : 0);
    if (l === 0)
      return !1;
    if (h === 0)
      return t[0] = t[6] = e + r, t[1] = t[3] = i + n, t[2] = t[4] = e - r, t[5] = t[7] = i - n, !0;
    let c = 0, u = h * 4 + (r ? 2 : 0) + 2, f = u, d = l, p = r + a, m = n, g = e + p, A = e - p, x = i + m;
    if (t[c++] = g, t[c++] = x, t[--u] = x, t[--u] = A, n) {
      const b = i - m;
      t[f++] = A, t[f++] = b, t[--d] = b, t[--d] = g;
    }
    for (let b = 1; b < h; b++) {
      const v = Math.PI / 2 * (b / h), C = r + Math.cos(v) * a, w = n + Math.sin(v) * o, k = e + C, T = e - C, B = i + w, P = i - w;
      t[c++] = k, t[c++] = B, t[--u] = B, t[--u] = T, t[f++] = T, t[f++] = P, t[--d] = P, t[--d] = k;
    }
    p = r, m = n + o, g = e + p, A = e - p, x = i + m;
    const y = i - m;
    return t[c++] = g, t[c++] = x, t[--d] = y, t[--d] = g, r && (t[c++] = A, t[c++] = x, t[--d] = y, t[--d] = A), !0;
  },
  triangulate(s, t, e, i, r, n) {
    if (s.length === 0)
      return;
    let a = 0, o = 0;
    for (let c = 0; c < s.length; c += 2)
      a += s[c], o += s[c + 1];
    a /= s.length / 2, o /= s.length / 2;
    let h = i;
    t[h * e] = a, t[h * e + 1] = o;
    const l = h++;
    for (let c = 0; c < s.length; c += 2)
      t[h * e] = s[c], t[h * e + 1] = s[c + 1], c > 0 && (r[n++] = h, r[n++] = l, r[n++] = h - 1), h++;
    r[n++] = l + 1, r[n++] = l, r[n++] = h - 1;
  }
}, ol = { ...ye, extension: { ...ye.extension, name: "ellipse" } }, hl = { ...ye, extension: { ...ye.extension, name: "roundedRectangle" } }, Xn = 1e-4, nr = 1e-4;
function ll(s) {
  const t = s.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let i = 0, r = s[t - 2], n = s[t - 1]; i < t; i += 2) {
    const a = s[i], o = s[i + 1];
    e += (a - r) * (o + n), r = a, n = o;
  }
  return e < 0 ? -1 : 1;
}
function ar(s, t, e, i, r, n, a, o) {
  const h = s - e * r, l = t - i * r, c = s + e * n, u = t + i * n;
  let f, d;
  a ? (f = i, d = -e) : (f = -i, d = e);
  const p = h + f, m = l + d, g = c + f, A = u + d;
  return o.push(p, m), o.push(g, A), 2;
}
function It(s, t, e, i, r, n, a, o) {
  const h = e - s, l = i - t;
  let c = Math.atan2(h, l), u = Math.atan2(r - s, n - t);
  o && c < u ? c += Math.PI * 2 : !o && c > u && (u += Math.PI * 2);
  let f = c;
  const d = u - c, p = Math.abs(d), m = Math.sqrt(h * h + l * l), g = (15 * p * Math.sqrt(m) / Math.PI >> 0) + 1, A = d / g;
  if (f += A, o) {
    a.push(s, t), a.push(e, i);
    for (let x = 1, y = f; x < g; x++, y += A)
      a.push(s, t), a.push(
        s + Math.sin(y) * m,
        t + Math.cos(y) * m
      );
    a.push(s, t), a.push(r, n);
  } else {
    a.push(e, i), a.push(s, t);
    for (let x = 1, y = f; x < g; x++, y += A)
      a.push(
        s + Math.sin(y) * m,
        t + Math.cos(y) * m
      ), a.push(s, t);
    a.push(r, n), a.push(s, t);
  }
  return g * 2;
}
function cl(s, t, e, i, r, n) {
  const a = Xn;
  if (s.length === 0)
    return;
  const o = t;
  let h = o.alignment;
  if (t.alignment !== 0.5) {
    let G = ll(s);
    h = (h - 0.5) * G + 0.5;
  }
  const l = new J(s[0], s[1]), c = new J(s[s.length - 2], s[s.length - 1]), u = i, f = Math.abs(l.x - c.x) < a && Math.abs(l.y - c.y) < a;
  if (u) {
    s = s.slice(), f && (s.pop(), s.pop(), c.set(s[s.length - 2], s[s.length - 1]));
    const G = (l.x + c.x) * 0.5, yt = (c.y + l.y) * 0.5;
    s.unshift(G, yt), s.push(G, yt);
  }
  const d = r, p = s.length / 2;
  let m = s.length;
  const g = d.length / 2, A = o.width / 2, x = A * A, y = o.miterLimit * o.miterLimit;
  let b = s[0], v = s[1], C = s[2], w = s[3], k = 0, T = 0, B = -(v - w), P = b - C, X = 0, N = 0, V = Math.sqrt(B * B + P * P);
  B /= V, P /= V, B *= A, P *= A;
  const Dt = h, S = (1 - Dt) * 2, E = Dt * 2;
  u || (o.cap === "round" ? m += It(
    b - B * (S - E) * 0.5,
    v - P * (S - E) * 0.5,
    b - B * S,
    v - P * S,
    b + B * E,
    v + P * E,
    d,
    !0
  ) + 2 : o.cap === "square" && (m += ar(b, v, B, P, S, E, !0, d))), d.push(
    b - B * S,
    v - P * S
  ), d.push(
    b + B * E,
    v + P * E
  );
  for (let G = 1; G < p - 1; ++G) {
    b = s[(G - 1) * 2], v = s[(G - 1) * 2 + 1], C = s[G * 2], w = s[G * 2 + 1], k = s[(G + 1) * 2], T = s[(G + 1) * 2 + 1], B = -(v - w), P = b - C, V = Math.sqrt(B * B + P * P), B /= V, P /= V, B *= A, P *= A, X = -(w - T), N = C - k, V = Math.sqrt(X * X + N * N), X /= V, N /= V, X *= A, N *= A;
    const yt = C - b, Kt = v - w, Zt = C - k, Jt = T - w, ui = yt * Zt + Kt * Jt, we = Kt * Zt - Jt * yt, _t = we < 0;
    if (Math.abs(we) < 1e-3 * Math.abs(ui)) {
      d.push(
        C - B * S,
        w - P * S
      ), d.push(
        C + B * E,
        w + P * E
      ), ui >= 0 && (o.join === "round" ? m += It(
        C,
        w,
        C - B * S,
        w - P * S,
        C - X * S,
        w - N * S,
        d,
        !1
      ) + 4 : m += 2, d.push(
        C - X * E,
        w - N * E
      ), d.push(
        C + X * S,
        w + N * S
      ));
      continue;
    }
    const di = (-B + b) * (-P + w) - (-B + C) * (-P + v), fi = (-X + k) * (-N + w) - (-X + C) * (-N + T), Ce = (yt * fi - Zt * di) / we, ve = (Jt * di - Kt * fi) / we, is = (Ce - C) * (Ce - C) + (ve - w) * (ve - w), Bt = C + (Ce - C) * S, St = w + (ve - w) * S, Pt = C - (Ce - C) * E, Mt = w - (ve - w) * E, aa = Math.min(yt * yt + Kt * Kt, Zt * Zt + Jt * Jt), gi = _t ? S : E, oa = aa + gi * gi * x;
    is <= oa ? o.join === "bevel" || is / x > y ? (_t ? (d.push(Bt, St), d.push(C + B * E, w + P * E), d.push(Bt, St), d.push(C + X * E, w + N * E)) : (d.push(C - B * S, w - P * S), d.push(Pt, Mt), d.push(C - X * S, w - N * S), d.push(Pt, Mt)), m += 2) : o.join === "round" ? _t ? (d.push(Bt, St), d.push(C + B * E, w + P * E), m += It(
      C,
      w,
      C + B * E,
      w + P * E,
      C + X * E,
      w + N * E,
      d,
      !0
    ) + 4, d.push(Bt, St), d.push(C + X * E, w + N * E)) : (d.push(C - B * S, w - P * S), d.push(Pt, Mt), m += It(
      C,
      w,
      C - B * S,
      w - P * S,
      C - X * S,
      w - N * S,
      d,
      !1
    ) + 4, d.push(C - X * S, w - N * S), d.push(Pt, Mt)) : (d.push(Bt, St), d.push(Pt, Mt)) : (d.push(C - B * S, w - P * S), d.push(C + B * E, w + P * E), o.join === "round" ? _t ? m += It(
      C,
      w,
      C + B * E,
      w + P * E,
      C + X * E,
      w + N * E,
      d,
      !0
    ) + 2 : m += It(
      C,
      w,
      C - B * S,
      w - P * S,
      C - X * S,
      w - N * S,
      d,
      !1
    ) + 2 : o.join === "miter" && is / x <= y && (_t ? (d.push(Pt, Mt), d.push(Pt, Mt)) : (d.push(Bt, St), d.push(Bt, St)), m += 2), d.push(C - X * S, w - N * S), d.push(C + X * E, w + N * E), m += 2);
  }
  b = s[(p - 2) * 2], v = s[(p - 2) * 2 + 1], C = s[(p - 1) * 2], w = s[(p - 1) * 2 + 1], B = -(v - w), P = b - C, V = Math.sqrt(B * B + P * P), B /= V, P /= V, B *= A, P *= A, d.push(C - B * S, w - P * S), d.push(C + B * E, w + P * E), u || (o.cap === "round" ? m += It(
    C - B * (S - E) * 0.5,
    w - P * (S - E) * 0.5,
    C - B * S,
    w - P * S,
    C + B * E,
    w + P * E,
    d,
    !1
  ) + 2 : o.cap === "square" && (m += ar(C, w, B, P, S, E, !1, d)));
  const qt = nr * nr;
  for (let G = g; G < m + g - 2; ++G)
    b = d[G * 2], v = d[G * 2 + 1], C = d[(G + 1) * 2], w = d[(G + 1) * 2 + 1], k = d[(G + 2) * 2], T = d[(G + 2) * 2 + 1], !(Math.abs(b * (w - T) + C * (T - v) + k * (v - w)) < qt) && n.push(G, G + 1, G + 2);
}
function ul(s, t, e, i) {
  const r = Xn;
  if (s.length === 0)
    return;
  const n = s[0], a = s[1], o = s[s.length - 2], h = s[s.length - 1], l = t || Math.abs(n - o) < r && Math.abs(a - h) < r, c = e, u = s.length / 2, f = c.length / 2;
  for (let d = 0; d < u; d++)
    c.push(s[d * 2]), c.push(s[d * 2 + 1]);
  for (let d = 0; d < u - 1; d++)
    i.push(f + d, f + d + 1);
  l && i.push(f + u - 1, f);
}
function Nn(s, t, e, i, r, n, a) {
  const o = Zo(s, t, 2);
  if (!o)
    return;
  for (let l = 0; l < o.length; l += 3)
    n[a++] = o[l] + r, n[a++] = o[l + 1] + r, n[a++] = o[l + 2] + r;
  let h = r * i;
  for (let l = 0; l < s.length; l += 2)
    e[h] = s[l], e[h + 1] = s[l + 1], h += i;
}
const dl = [], fl = {
  extension: {
    type: I.ShapeBuilder,
    name: "polygon"
  },
  build(s, t) {
    for (let e = 0; e < s.points.length; e++)
      t[e] = s.points[e];
    return !0;
  },
  triangulate(s, t, e, i, r, n) {
    Nn(s, dl, t, e, i, r, n);
  }
}, gl = {
  extension: {
    type: I.ShapeBuilder,
    name: "rectangle"
  },
  build(s, t) {
    const e = s, i = e.x, r = e.y, n = e.width, a = e.height;
    return n > 0 && a > 0 ? (t[0] = i, t[1] = r, t[2] = i + n, t[3] = r, t[4] = i + n, t[5] = r + a, t[6] = i, t[7] = r + a, !0) : !1;
  },
  triangulate(s, t, e, i, r, n) {
    let a = 0;
    i *= e, t[i + a] = s[0], t[i + a + 1] = s[1], a += e, t[i + a] = s[2], t[i + a + 1] = s[3], a += e, t[i + a] = s[6], t[i + a + 1] = s[7], a += e, t[i + a] = s[4], t[i + a + 1] = s[5], a += e;
    const o = i / e;
    r[n++] = o, r[n++] = o + 1, r[n++] = o + 2, r[n++] = o + 1, r[n++] = o + 3, r[n++] = o + 2;
  }
}, pl = {
  extension: {
    type: I.ShapeBuilder,
    name: "triangle"
  },
  build(s, t) {
    return t[0] = s.x, t[1] = s.y, t[2] = s.x2, t[3] = s.y2, t[4] = s.x3, t[5] = s.y3, !0;
  },
  triangulate(s, t, e, i, r, n) {
    let a = 0;
    i *= e, t[i + a] = s[0], t[i + a + 1] = s[1], a += e, t[i + a] = s[2], t[i + a + 1] = s[3], a += e, t[i + a] = s[4], t[i + a + 1] = s[5];
    const o = i / e;
    r[n++] = o, r[n++] = o + 1, r[n++] = o + 2;
  }
}, ml = new W(), Al = new q();
function xl(s, t, e, i) {
  const r = t.matrix ? s.copyFrom(t.matrix).invert() : s.identity();
  if (t.textureSpace === "local") {
    const a = e.getBounds(Al);
    t.width && a.pad(t.width);
    const { x: o, y: h } = a, l = 1 / a.width, c = 1 / a.height, u = -o * l, f = -h * c, d = r.a, p = r.b, m = r.c, g = r.d;
    r.a *= l, r.b *= l, r.c *= c, r.d *= c, r.tx = u * d + f * m + r.tx, r.ty = u * p + f * g + r.ty;
  } else
    r.translate(t.texture.frame.x, t.texture.frame.y), r.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
  const n = t.texture.source.style;
  return !(t.fill instanceof xt) && n.addressMode === "clamp-to-edge" && (n.addressMode = "repeat", n.update()), i && r.append(ml.copyFrom(i).invert()), r;
}
const es = {};
_.handleByMap(I.ShapeBuilder, es);
_.add(gl, fl, pl, ye, ol, hl);
const yl = new q(), bl = new W();
function wl(s, t) {
  const { geometryData: e, batches: i } = t;
  i.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let r = 0; r < s.instructions.length; r++) {
    const n = s.instructions[r];
    if (n.action === "texture")
      Cl(n.data, i, e);
    else if (n.action === "fill" || n.action === "stroke") {
      const a = n.action === "stroke", o = n.data.path.shapePath, h = n.data.style, l = n.data.hole;
      a && l && or(l.shapePath, h, !0, i, e), l && (o.shapePrimitives[o.shapePrimitives.length - 1].holes = l.shapePath.shapePrimitives), or(o, h, a, i, e);
    }
  }
}
function Cl(s, t, e) {
  const i = [], r = es.rectangle, n = yl;
  n.x = s.dx, n.y = s.dy, n.width = s.dw, n.height = s.dh;
  const a = s.transform;
  if (!r.build(n, i))
    return;
  const { vertices: o, uvs: h, indices: l } = e, c = l.length, u = o.length / 2;
  a && Yn(i, a), r.triangulate(i, o, 2, u, l, c);
  const f = s.image, d = f.uvs;
  h.push(
    d.x0,
    d.y0,
    d.x1,
    d.y1,
    d.x3,
    d.y3,
    d.x2,
    d.y2
  );
  const p = at.get(Qn);
  p.indexOffset = c, p.indexSize = l.length - c, p.attributeOffset = u, p.attributeSize = o.length / 2 - u, p.baseColor = s.style, p.alpha = s.alpha, p.texture = f, p.geometryData = e, t.push(p);
}
function or(s, t, e, i, r) {
  const { vertices: n, uvs: a, indices: o } = r;
  s.shapePrimitives.forEach(({ shape: h, transform: l, holes: c }) => {
    const u = [], f = es[h.type];
    if (!f.build(h, u))
      return;
    const d = o.length, p = n.length / 2;
    let m = "triangle-list";
    if (l && Yn(u, l), e) {
      const y = h.closePath ?? !0, b = t;
      b.pixelLine ? (ul(u, y, n, o), m = "line-list") : cl(u, b, !1, y, n, o);
    } else if (c) {
      const y = [], b = u.slice();
      vl(c).forEach((C) => {
        y.push(b.length / 2), b.push(...C);
      }), Nn(b, y, n, 2, p, o, d);
    } else
      f.triangulate(u, n, 2, p, o, d);
    const g = a.length / 2, A = t.texture;
    if (A !== R.WHITE) {
      const y = xl(bl, t, h, l);
      rl(n, 2, p, a, g, 2, n.length / 2 - p, y);
    } else
      nl(a, g, 2, n.length / 2 - p);
    const x = at.get(Qn);
    x.indexOffset = d, x.indexSize = o.length - d, x.attributeOffset = p, x.attributeSize = n.length / 2 - p, x.baseColor = t.color, x.alpha = t.alpha, x.texture = A, x.geometryData = r, x.topology = m, i.push(x);
  });
}
function vl(s) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e].shape, r = [];
    es[i.type].build(i, r) && t.push(r);
  }
  return t;
}
class Bl {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
  reset() {
    this.batches && this.batches.forEach((t) => {
      at.return(t);
    }), this.graphicsData && at.return(this.graphicsData), this.isBatchable = !1, this.context = null, this.batches.length = 0, this.geometryData.indices.length = 0, this.geometryData.vertices.length = 0, this.geometryData.uvs.length = 0, this.graphicsData = null;
  }
  destroy() {
    this.reset(), this.batches = null, this.geometryData = null;
  }
}
class Sl {
  constructor() {
    this.instructions = new Hr();
  }
  init(t) {
    const e = t.maxTextures;
    this.batcher ? this.batcher._updateMaxTextures(e) : this.batcher = new sl({ maxTextures: e }), this.instructions.reset();
  }
  /**
   * @deprecated since version 8.0.0
   * Use `batcher.geometry` instead.
   * @see {Batcher#geometry}
   */
  get geometry() {
    return F(ba, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
  destroy() {
    this.batcher.destroy(), this.instructions.destroy(), this.batcher = null, this.instructions = null;
  }
}
const ni = class Hs {
  constructor(t) {
    this._renderer = t, this._managedContexts = new il({ renderer: t, type: "resource", name: "graphicsContext" });
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    Hs.defaultOptions.bezierSmoothness = t?.bezierSmoothness ?? Hs.defaultOptions.bezierSmoothness;
  }
  /**
   * Returns the render data for a given GraphicsContext.
   * @param context - The GraphicsContext to get the render data for.
   * @internal
   */
  getContextRenderData(t) {
    return t._gpuData[this._renderer.uid].graphicsData || this._initContextRenderData(t);
  }
  /**
   * Updates the GPU context for a given GraphicsContext.
   * If the context is dirty, it will rebuild the batches and geometry data.
   * @param context - The GraphicsContext to update.
   * @returns The updated GpuGraphicsContext.
   * @internal
   */
  updateGpuContext(t) {
    const e = !!t._gpuData[this._renderer.uid], i = t._gpuData[this._renderer.uid] || this._initContext(t);
    if (t.dirty || !e) {
      e && i.reset(), wl(t, i);
      const r = t.batchMode;
      t.customShader || r === "no-batch" ? i.isBatchable = !1 : r === "auto" ? i.isBatchable = i.geometryData.vertices.length < 400 : i.isBatchable = !0, t.dirty = !1;
    }
    return i;
  }
  /**
   * Returns the GpuGraphicsContext for a given GraphicsContext.
   * If it does not exist, it will initialize a new one.
   * @param context - The GraphicsContext to get the GpuGraphicsContext for.
   * @returns The GpuGraphicsContext for the given GraphicsContext.
   * @internal
   */
  getGpuContext(t) {
    return t._gpuData[this._renderer.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = at.get(Sl, {
      maxTextures: this._renderer.limits.maxBatchableTextures
    }), i = t._gpuData[this._renderer.uid], { batches: r, geometryData: n } = i;
    i.graphicsData = e;
    const a = n.vertices.length, o = n.indices.length;
    for (let u = 0; u < r.length; u++)
      r[u].applyTransform = !1;
    const h = e.batcher;
    h.ensureAttributeBuffer(a), h.ensureIndexBuffer(o), h.begin();
    for (let u = 0; u < r.length; u++) {
      const f = r[u];
      h.add(f);
    }
    h.finish(e.instructions);
    const l = h.geometry;
    l.indexBuffer.setDataWithSize(h.indexBuffer, h.indexSize, !0), l.buffers[0].setDataWithSize(h.attributeBuffer.float32View, h.attributeSize, !0);
    const c = h.batches;
    for (let u = 0; u < c.length; u++) {
      const f = c[u];
      f.bindGroup = fh(
        f.textures.textures,
        f.textures.count,
        this._renderer.limits.maxBatchableTextures
      );
    }
    return e;
  }
  _initContext(t) {
    const e = new Bl();
    return e.context = t, t._gpuData[this._renderer.uid] = e, this._managedContexts.add(t), e;
  }
  destroy() {
    this._managedContexts.destroy(), this._renderer = null;
  }
};
ni.extension = {
  type: [
    I.WebGLSystem,
    I.WebGPUSystem,
    I.CanvasSystem
  ],
  name: "graphicsContext"
};
ni.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let Vn = ni;
const Pl = 8, Le = 11920929e-14, Ml = 1;
function On(s, t, e, i, r, n, a, o, h, l) {
  const u = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, l ?? Vn.defaultOptions.bezierSmoothness)
  );
  let f = (Ml - u) / 1;
  return f *= f, Il(t, e, i, r, n, a, o, h, s, f), s;
}
function Il(s, t, e, i, r, n, a, o, h, l) {
  js(s, t, e, i, r, n, a, o, h, l, 0), h.push(a, o);
}
function js(s, t, e, i, r, n, a, o, h, l, c) {
  if (c > Pl)
    return;
  const u = (s + e) / 2, f = (t + i) / 2, d = (e + r) / 2, p = (i + n) / 2, m = (r + a) / 2, g = (n + o) / 2, A = (u + d) / 2, x = (f + p) / 2, y = (d + m) / 2, b = (p + g) / 2, v = (A + y) / 2, C = (x + b) / 2;
  if (c > 0) {
    let w = a - s, k = o - t;
    const T = Math.abs((e - a) * k - (i - o) * w), B = Math.abs((r - a) * k - (n - o) * w);
    if (T > Le && B > Le) {
      if ((T + B) * (T + B) <= l * (w * w + k * k)) {
        h.push(v, C);
        return;
      }
    } else if (T > Le) {
      if (T * T <= l * (w * w + k * k)) {
        h.push(v, C);
        return;
      }
    } else if (B > Le) {
      if (B * B <= l * (w * w + k * k)) {
        h.push(v, C);
        return;
      }
    } else if (w = v - (s + a) / 2, k = C - (t + o) / 2, w * w + k * k <= l) {
      h.push(v, C);
      return;
    }
  }
  js(s, t, u, f, A, x, v, C, h, l, c + 1), js(v, C, y, b, m, g, a, o, h, l, c + 1);
}
const Tl = 8, El = 11920929e-14, kl = 1;
function Fl(s, t, e, i, r, n, a, o) {
  const l = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, o ?? Vn.defaultOptions.bezierSmoothness)
  );
  let c = (kl - l) / 1;
  return c *= c, Wl(t, e, i, r, n, a, s, c), s;
}
function Wl(s, t, e, i, r, n, a, o) {
  qs(a, s, t, e, i, r, n, o, 0), a.push(r, n);
}
function qs(s, t, e, i, r, n, a, o, h) {
  if (h > Tl)
    return;
  const l = (t + i) / 2, c = (e + r) / 2, u = (i + n) / 2, f = (r + a) / 2, d = (l + u) / 2, p = (c + f) / 2;
  let m = n - t, g = a - e;
  const A = Math.abs((i - n) * g - (r - a) * m);
  if (A > El) {
    if (A * A <= o * (m * m + g * g)) {
      s.push(d, p);
      return;
    }
  } else if (m = d - (t + n) / 2, g = p - (e + a) / 2, m * m + g * g <= o) {
    s.push(d, p);
    return;
  }
  qs(s, t, e, l, c, d, p, o, h + 1), qs(s, d, p, u, f, n, a, o, h + 1);
}
function Un(s, t, e, i, r, n, a, o) {
  let h = Math.abs(r - n);
  (!a && r > n || a && n > r) && (h = 2 * Math.PI - h), o || (o = Math.max(6, Math.floor(6 * Math.pow(i, 1 / 3) * (h / Math.PI)))), o = Math.max(o, 3);
  let l = h / o, c = r;
  l *= a ? -1 : 1;
  for (let u = 0; u < o + 1; u++) {
    const f = Math.cos(c), d = Math.sin(c), p = t + f * i, m = e + d * i;
    s.push(p, m), c += l;
  }
}
function Rl(s, t, e, i, r, n) {
  const a = s[s.length - 2], h = s[s.length - 1] - e, l = a - t, c = r - e, u = i - t, f = Math.abs(h * u - l * c);
  if (f < 1e-8 || n === 0) {
    (s[s.length - 2] !== t || s[s.length - 1] !== e) && s.push(t, e);
    return;
  }
  const d = h * h + l * l, p = c * c + u * u, m = h * c + l * u, g = n * Math.sqrt(d) / f, A = n * Math.sqrt(p) / f, x = g * m / d, y = A * m / p, b = g * u + A * l, v = g * c + A * h, C = l * (A + x), w = h * (A + x), k = u * (g + y), T = c * (g + y), B = Math.atan2(w - v, C - b), P = Math.atan2(T - v, k - b);
  Un(
    s,
    b + t,
    v + e,
    n,
    B,
    P,
    l * c > u * h
  );
}
const ge = Math.PI * 2, Bs = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, Ss = ({ x: s, y: t }, e, i, r, n, a, o, h) => {
  s *= e, t *= i;
  const l = r * s - n * t, c = n * s + r * t;
  return h.x = l + a, h.y = c + o, h;
};
function Gl(s, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), i = t === 1.5707963267948966 ? 0.551915024494 : e, r = Math.cos(s), n = Math.sin(s), a = Math.cos(s + t), o = Math.sin(s + t);
  return [
    {
      x: r - n * i,
      y: n + r * i
    },
    {
      x: a + o * i,
      y: o - a * i
    },
    {
      x: a,
      y: o
    }
  ];
}
const hr = (s, t, e, i) => {
  const r = s * i - t * e < 0 ? -1 : 1;
  let n = s * e + t * i;
  return n > 1 && (n = 1), n < -1 && (n = -1), r * Math.acos(n);
}, zl = (s, t, e, i, r, n, a, o, h, l, c, u, f) => {
  const d = Math.pow(r, 2), p = Math.pow(n, 2), m = Math.pow(c, 2), g = Math.pow(u, 2);
  let A = d * p - d * g - p * m;
  A < 0 && (A = 0), A /= d * g + p * m, A = Math.sqrt(A) * (a === o ? -1 : 1);
  const x = A * r / n * u, y = A * -n / r * c, b = l * x - h * y + (s + e) / 2, v = h * x + l * y + (t + i) / 2, C = (c - x) / r, w = (u - y) / n, k = (-c - x) / r, T = (-u - y) / n, B = hr(1, 0, C, w);
  let P = hr(C, w, k, T);
  o === 0 && P > 0 && (P -= ge), o === 1 && P < 0 && (P += ge), f.centerX = b, f.centerY = v, f.ang1 = B, f.ang2 = P;
};
function Dl(s, t, e, i, r, n, a, o = 0, h = 0, l = 0) {
  if (n === 0 || a === 0)
    return;
  const c = Math.sin(o * ge / 360), u = Math.cos(o * ge / 360), f = u * (t - i) / 2 + c * (e - r) / 2, d = -c * (t - i) / 2 + u * (e - r) / 2;
  if (f === 0 && d === 0)
    return;
  n = Math.abs(n), a = Math.abs(a);
  const p = Math.pow(f, 2) / Math.pow(n, 2) + Math.pow(d, 2) / Math.pow(a, 2);
  p > 1 && (n *= Math.sqrt(p), a *= Math.sqrt(p)), zl(
    t,
    e,
    i,
    r,
    n,
    a,
    h,
    l,
    c,
    u,
    f,
    d,
    Bs
  );
  let { ang1: m, ang2: g } = Bs;
  const { centerX: A, centerY: x } = Bs;
  let y = Math.abs(g) / (ge / 4);
  Math.abs(1 - y) < 1e-7 && (y = 1);
  const b = Math.max(Math.ceil(y), 1);
  g /= b;
  let v = s[s.length - 2], C = s[s.length - 1];
  const w = { x: 0, y: 0 };
  for (let k = 0; k < b; k++) {
    const T = Gl(m, g), { x: B, y: P } = Ss(T[0], n, a, u, c, A, x, w), { x: X, y: N } = Ss(T[1], n, a, u, c, A, x, w), { x: V, y: Dt } = Ss(T[2], n, a, u, c, A, x, w);
    On(
      s,
      v,
      C,
      B,
      P,
      X,
      N,
      V,
      Dt
    ), v = V, C = Dt, m += g;
  }
}
function Ll(s, t, e) {
  const i = (a, o) => {
    const h = o.x - a.x, l = o.y - a.y, c = Math.sqrt(h * h + l * l), u = h / c, f = l / c;
    return { len: c, nx: u, ny: f };
  }, r = (a, o) => {
    a === 0 ? s.moveTo(o.x, o.y) : s.lineTo(o.x, o.y);
  };
  let n = t[t.length - 1];
  for (let a = 0; a < t.length; a++) {
    const o = t[a % t.length], h = o.radius ?? e;
    if (h <= 0) {
      r(a, o), n = o;
      continue;
    }
    const l = t[(a + 1) % t.length], c = i(o, n), u = i(o, l);
    if (c.len < 1e-4 || u.len < 1e-4) {
      r(a, o), n = o;
      continue;
    }
    let f = Math.asin(c.nx * u.ny - c.ny * u.nx), d = 1, p = !1;
    c.nx * u.nx - c.ny * -u.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, d = -1, p = !0) : f > 0 && (d = -1, p = !0);
    const m = f / 2;
    let g, A = Math.abs(
      Math.cos(m) * h / Math.sin(m)
    );
    A > Math.min(c.len / 2, u.len / 2) ? (A = Math.min(c.len / 2, u.len / 2), g = Math.abs(A * Math.sin(m) / Math.cos(m))) : g = h;
    const x = o.x + u.nx * A + -u.ny * g * d, y = o.y + u.ny * A + u.nx * g * d, b = Math.atan2(c.ny, c.nx) + Math.PI / 2 * d, v = Math.atan2(u.ny, u.nx) - Math.PI / 2 * d;
    a === 0 && s.moveTo(
      x + Math.cos(b) * g,
      y + Math.sin(b) * g
    ), s.arc(x, y, g, b, v, p), n = o;
  }
}
function Yl(s, t, e, i) {
  const r = (o, h) => Math.sqrt((o.x - h.x) ** 2 + (o.y - h.y) ** 2), n = (o, h, l) => ({
    x: o.x + (h.x - o.x) * l,
    y: o.y + (h.y - o.y) * l
  }), a = t.length;
  for (let o = 0; o < a; o++) {
    const h = t[(o + 1) % a], l = h.radius ?? e;
    if (l <= 0) {
      o === 0 ? s.moveTo(h.x, h.y) : s.lineTo(h.x, h.y);
      continue;
    }
    const c = t[o], u = t[(o + 2) % a], f = r(c, h);
    let d;
    if (f < 1e-4)
      d = h;
    else {
      const g = Math.min(f / 2, l);
      d = n(
        h,
        c,
        g / f
      );
    }
    const p = r(u, h);
    let m;
    if (p < 1e-4)
      m = h;
    else {
      const g = Math.min(p / 2, l);
      m = n(
        h,
        u,
        g / p
      );
    }
    o === 0 ? s.moveTo(d.x, d.y) : s.lineTo(d.x, d.y), s.quadraticCurveTo(h.x, h.y, m.x, m.y, i);
  }
}
const Ql = new q();
class Xl {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new lt(), this._graphicsPath2D = t, this.signed = t.checkForHoles;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    return this.startPoly(t, e), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._ensurePoly();
    const i = this._currentPoly.points, r = i[i.length - 2], n = i[i.length - 1];
    return (r !== t || n !== e) && i.push(t, e), this;
  }
  /**
   * Adds an arc to the path. The arc is centered at (x, y)
   *  position with radius `radius` starting at `startAngle` and ending at `endAngle`.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The radius of the arc.
   * @param startAngle - The starting angle of the arc, in radians.
   * @param endAngle - The ending angle of the arc, in radians.
   * @param counterclockwise - Specifies whether the arc should be drawn in the anticlockwise direction. False by default.
   * @returns The instance of the current object for chaining.
   */
  arc(t, e, i, r, n, a) {
    this._ensurePoly(!1);
    const o = this._currentPoly.points;
    return Un(o, t, e, i, r, n, a), this;
  }
  /**
   * Adds an arc to the path with the arc tangent to the line joining two specified points.
   * The arc radius is specified by `radius`.
   * @param x1 - The x-coordinate of the first point.
   * @param y1 - The y-coordinate of the first point.
   * @param x2 - The x-coordinate of the second point.
   * @param y2 - The y-coordinate of the second point.
   * @param radius - The radius of the arc.
   * @returns The instance of the current object for chaining.
   */
  arcTo(t, e, i, r, n) {
    this._ensurePoly();
    const a = this._currentPoly.points;
    return Rl(a, t, e, i, r, n), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, i, r, n, a, o) {
    const h = this._currentPoly.points;
    return Dl(
      h,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      a,
      o,
      t,
      e,
      i,
      r,
      n
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, i, r, n, a, o) {
    this._ensurePoly();
    const h = this._currentPoly;
    return On(
      this._currentPoly.points,
      h.lastX,
      h.lastY,
      t,
      e,
      i,
      r,
      n,
      a,
      o
    ), this;
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the control point.
   * @param cp1y - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothing - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, i, r, n) {
    this._ensurePoly();
    const a = this._currentPoly;
    return Fl(
      this._currentPoly.points,
      a.lastX,
      a.lastY,
      t,
      e,
      i,
      r,
      n
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.endPoly(!0), this;
  }
  /**
   * Adds another path to the current path. This method allows for the combination of multiple paths into one.
   * @param path - The `GraphicsPath` object representing the path to add.
   * @param transform - An optional `Matrix` object to apply a transformation to the path before adding it.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
    const i = this.shapePrimitives, r = i.length;
    for (let n = 0; n < t.instructions.length; n++) {
      const a = t.instructions[n];
      this[a.action](...a.data);
    }
    if (t.checkForHoles && i.length - r > 1) {
      let n = null;
      for (let a = r; a < i.length; a++) {
        const o = i[a];
        if (o.shape.type === "polygon") {
          const h = o.shape, l = n?.shape;
          l && l.containsPolygon(h) ? (n.holes || (n.holes = []), n.holes.push(o), i.copyWithin(a, a + 1), i.length--, a--) : n = o;
        }
      }
    }
    return this;
  }
  /**
   * Finalizes the drawing of the current path. Optionally, it can close the path.
   * @param closePath - A boolean indicating whether to close the path after finishing. False by default.
   */
  finish(t = !1) {
    this.endPoly(t);
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, r, n) {
    return this.drawShape(new q(t, e, i, r), n), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, r) {
    return this.drawShape(new si(t, e, i), r), this;
  }
  /**
   * Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
   * @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  poly(t, e, i) {
    const r = new de(t);
    return r.closePath = e, this.drawShape(r, i), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, i, r, n = 0, a) {
    r = Math.max(r | 0, 3);
    const o = -1 * Math.PI / 2 + n, h = Math.PI * 2 / r, l = [];
    for (let c = 0; c < r; c++) {
      const u = o - c * h;
      l.push(
        t + i * Math.cos(u),
        e + i * Math.sin(u)
      );
    }
    return this.poly(l, !0, a), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param smoothness - Optional parameter to adjust the smoothness of the rounding.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, i, r, n, a = 0, o) {
    if (r = Math.max(r | 0, 3), n <= 0)
      return this.regularPoly(t, e, i, r, a);
    const h = i * Math.sin(Math.PI / r) - 1e-3;
    n = Math.min(n, h);
    const l = -1 * Math.PI / 2 + a, c = Math.PI * 2 / r, u = (r - 2) * Math.PI / r / 2;
    for (let f = 0; f < r; f++) {
      const d = f * c + l, p = t + i * Math.cos(d), m = e + i * Math.sin(d), g = d + Math.PI + u, A = d - Math.PI - u, x = p + n * Math.cos(g), y = m + n * Math.sin(g), b = p + n * Math.cos(A), v = m + n * Math.sin(A);
      f === 0 ? this.moveTo(x, y) : this.lineTo(x, y), this.quadraticCurveTo(p, m, b, v, o);
    }
    return this.closePath();
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, i = !1, r) {
    return t.length < 3 ? this : (i ? Yl(this, t, e, r) : Ll(this, t, e), this.closePath());
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, i, r, n) {
    if (n === 0)
      return this.rect(t, e, i, r);
    const a = Math.min(i, r) / 2, o = Math.min(a, Math.max(-a, n)), h = t + i, l = e + r, c = o < 0 ? -o : 0, u = Math.abs(o);
    return this.moveTo(t, e + u).arcTo(t + c, e + c, t + u, e, u).lineTo(h - u, e).arcTo(h - c, e + c, h, e + u, u).lineTo(h, l - u).arcTo(h - c, l - c, t + i - u, l, u).lineTo(t + u, l).arcTo(t + c, l - c, t, l - u, u).closePath();
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, i, r, n, a) {
    if (n <= 0)
      return this.rect(t, e, i, r);
    const o = Math.min(n, Math.min(i, r) / 2), h = t + i, l = e + r, c = [
      t + o,
      e,
      h - o,
      e,
      h,
      e + o,
      h,
      l - o,
      h - o,
      l,
      t + o,
      l,
      t,
      l - o,
      t,
      e + o
    ];
    for (let u = c.length - 1; u >= 2; u -= 2)
      c[u] === c[u - 2] && c[u - 1] === c[u - 3] && c.splice(u - 1, 2);
    return this.poly(c, !0, a);
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @param transform - An optional `Matrix` object to apply a transformation to the ellipse. This can include rotations.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, i, r, n) {
    return this.drawShape(new ii(t, e, i, r), n), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, i, r, n, a) {
    return this.drawShape(new ri(t, e, i, r, n), a), this;
  }
  /**
   * Draws a given shape on the canvas.
   * This is a generic method that can draw any type of shape specified by the `ShapePrimitive` parameter.
   * An optional transformation matrix can be applied to the shape, allowing for complex transformations.
   * @param shape - The shape to draw, defined as a `ShapePrimitive` object.
   * @param matrix - An optional `Matrix` for transforming the shape. This can include rotations,
   * scaling, and translations.
   * @returns The instance of the current object for chaining.
   */
  drawShape(t, e) {
    return this.endPoly(), this.shapePrimitives.push({ shape: t, transform: e }), this;
  }
  /**
   * Starts a new polygon path from the specified starting point.
   * This method initializes a new polygon or ends the current one if it exists.
   * @param x - The x-coordinate of the starting point of the new polygon.
   * @param y - The y-coordinate of the starting point of the new polygon.
   * @returns The instance of the current object for chaining.
   */
  startPoly(t, e) {
    let i = this._currentPoly;
    return i && this.endPoly(), i = new de(), i.points.push(t, e), this._currentPoly = i, this;
  }
  /**
   * Ends the current polygon path. If `closePath` is set to true,
   * the path is closed by connecting the last point to the first one.
   * This method finalizes the current polygon and prepares it for drawing or adding to the shape primitives.
   * @param closePath - A boolean indicating whether to close the polygon by connecting the last point
   *  back to the starting point. False by default.
   * @returns The instance of the current object for chaining.
   */
  endPoly(t = !1) {
    const e = this._currentPoly;
    return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({ shape: e })), this._currentPoly = null, this;
  }
  _ensurePoly(t = !0) {
    if (!this._currentPoly && (this._currentPoly = new de(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let i = e.shape.x, r = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const n = e.transform, a = i;
          i = n.a * i + n.c * r + n.tx, r = n.b * a + n.d * r + n.ty;
        }
        this._currentPoly.points.push(i, r);
      } else
        this._currentPoly.points.push(0, 0);
    }
  }
  /** Builds the path. */
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const i = t.instructions[e];
      this[i.action](...i.data);
    }
    this.finish();
  }
  /** Gets the bounds of the path. */
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let i = 0; i < e.length; i++) {
      const r = e[i], n = r.shape.getBounds(Ql);
      r.transform ? t.addRect(n, r.transform) : t.addRect(n);
    }
    return t;
  }
}
class At {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   * @param signed
   */
  constructor(t, e = !1) {
    this.instructions = [], this.uid = j("graphicsPath"), this._dirty = !0, this.checkForHoles = e, typeof t == "string" ? lh(t, this) : this.instructions = t?.slice() ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new Xl(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @param transform - An optional transformation to apply to the added path.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    return t = t.clone(), this.instructions.push({ action: "addPath", data: [t, e] }), this._dirty = !0, this;
  }
  arc(...t) {
    return this.instructions.push({ action: "arc", data: t }), this._dirty = !0, this;
  }
  arcTo(...t) {
    return this.instructions.push({ action: "arcTo", data: t }), this._dirty = !0, this;
  }
  arcToSvg(...t) {
    return this.instructions.push({ action: "arcToSvg", data: t }), this._dirty = !0, this;
  }
  bezierCurveTo(...t) {
    return this.instructions.push({ action: "bezierCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires two points: the second control point and the end point. The first control point is assumed to be
   * The starting point is the last point in the current path.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveToShort(t, e, i, r, n) {
    const a = this.instructions[this.instructions.length - 1], o = this.getLastPoint(J.shared);
    let h = 0, l = 0;
    if (!a || a.action !== "bezierCurveTo")
      h = o.x, l = o.y;
    else {
      h = a.data[2], l = a.data[3];
      const c = o.x, u = o.y;
      h = c + (c - h), l = u + (u - l);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [h, l, t, e, i, r, n] }), this._dirty = !0, this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.instructions.push({ action: "closePath", data: [] }), this._dirty = !0, this;
  }
  ellipse(...t) {
    return this.instructions.push({ action: "ellipse", data: t }), this._dirty = !0, this;
  }
  lineTo(...t) {
    return this.instructions.push({ action: "lineTo", data: t }), this._dirty = !0, this;
  }
  moveTo(...t) {
    return this.instructions.push({ action: "moveTo", data: t }), this;
  }
  quadraticCurveTo(...t) {
    return this.instructions.push({ action: "quadraticCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a quadratic curve to the path. It uses the previous point as the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveToShort(t, e, i) {
    const r = this.instructions[this.instructions.length - 1], n = this.getLastPoint(J.shared);
    let a = 0, o = 0;
    if (!r || r.action !== "quadraticCurveTo")
      a = n.x, o = n.y;
    else {
      a = r.data[0], o = r.data[1];
      const h = n.x, l = n.y;
      a = h + (h - a), o = l + (l - o);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [a, o, t, e, i] }), this._dirty = !0, this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, r, n) {
    return this.instructions.push({ action: "rect", data: [t, e, i, r, n] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, r) {
    return this.instructions.push({ action: "circle", data: [t, e, i, r] }), this._dirty = !0, this;
  }
  roundRect(...t) {
    return this.instructions.push({ action: "roundRect", data: t }), this._dirty = !0, this;
  }
  poly(...t) {
    return this.instructions.push({ action: "poly", data: t }), this._dirty = !0, this;
  }
  regularPoly(...t) {
    return this.instructions.push({ action: "regularPoly", data: t }), this._dirty = !0, this;
  }
  roundPoly(...t) {
    return this.instructions.push({ action: "roundPoly", data: t }), this._dirty = !0, this;
  }
  roundShape(...t) {
    return this.instructions.push({ action: "roundShape", data: t }), this._dirty = !0, this;
  }
  filletRect(...t) {
    return this.instructions.push({ action: "filletRect", data: t }), this._dirty = !0, this;
  }
  chamferRect(...t) {
    return this.instructions.push({ action: "chamferRect", data: t }), this._dirty = !0, this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @param transform - An optional `Matrix` object to apply a transformation to the star.
   * This can include rotations, scaling, and translations.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  // eslint-disable-next-line max-len
  star(t, e, i, r, n, a, o) {
    n || (n = r / 2);
    const h = -1 * Math.PI / 2 + a, l = i * 2, c = Math.PI * 2 / l, u = [];
    for (let f = 0; f < l; f++) {
      const d = f % 2 ? n : r, p = f * c + h;
      u.push(
        t + d * Math.cos(p),
        e + d * Math.sin(p)
      );
    }
    return this.poly(u, !0, o), this;
  }
  /**
   * Creates a copy of the current `GraphicsPath` instance. This method supports both shallow and deep cloning.
   * A shallow clone copies the reference of the instructions array, while a deep clone creates a new array and
   * copies each instruction individually, ensuring that modifications to the instructions of the cloned `GraphicsPath`
   * do not affect the original `GraphicsPath` and vice versa.
   * @param deep - A boolean flag indicating whether the clone should be deep.
   * @returns A new `GraphicsPath` instance that is a clone of the current instance.
   */
  clone(t = !1) {
    const e = new At();
    if (e.checkForHoles = this.checkForHoles, !t)
      e.instructions = this.instructions.slice();
    else
      for (let i = 0; i < this.instructions.length; i++) {
        const r = this.instructions[i];
        e.instructions.push({ action: r.action, data: r.data.slice() });
      }
    return e;
  }
  clear() {
    return this.instructions.length = 0, this._dirty = !0, this;
  }
  /**
   * Applies a transformation matrix to all drawing instructions within the `GraphicsPath`.
   * This method enables the modification of the path's geometry according to the provided
   * transformation matrix, which can include translations, rotations, scaling, and skewing.
   *
   * Each drawing instruction in the path is updated to reflect the transformation,
   * ensuring the visual representation of the path is consistent with the applied matrix.
   *
   * Note: The transformation is applied directly to the coordinates and control points of the drawing instructions,
   * not to the path as a whole. This means the transformation's effects are baked into the individual instructions,
   * allowing for fine-grained control over the path's appearance.
   * @param matrix - A `Matrix` object representing the transformation to apply.
   * @returns The instance of the current object for chaining further operations.
   */
  transform(t) {
    if (t.isIdentity())
      return this;
    const e = t.a, i = t.b, r = t.c, n = t.d, a = t.tx, o = t.ty;
    let h = 0, l = 0, c = 0, u = 0, f = 0, d = 0, p = 0, m = 0;
    for (let g = 0; g < this.instructions.length; g++) {
      const A = this.instructions[g], x = A.data;
      switch (A.action) {
        case "moveTo":
        case "lineTo":
          h = x[0], l = x[1], x[0] = e * h + r * l + a, x[1] = i * h + n * l + o;
          break;
        case "bezierCurveTo":
          c = x[0], u = x[1], f = x[2], d = x[3], h = x[4], l = x[5], x[0] = e * c + r * u + a, x[1] = i * c + n * u + o, x[2] = e * f + r * d + a, x[3] = i * f + n * d + o, x[4] = e * h + r * l + a, x[5] = i * h + n * l + o;
          break;
        case "quadraticCurveTo":
          c = x[0], u = x[1], h = x[2], l = x[3], x[0] = e * c + r * u + a, x[1] = i * c + n * u + o, x[2] = e * h + r * l + a, x[3] = i * h + n * l + o;
          break;
        case "arcToSvg":
          h = x[5], l = x[6], p = x[0], m = x[1], x[0] = e * p + r * m, x[1] = i * p + n * m, x[5] = e * h + r * l + a, x[6] = i * h + n * l + o;
          break;
        case "circle":
          x[4] = ne(x[3], t);
          break;
        case "rect":
          x[4] = ne(x[4], t);
          break;
        case "ellipse":
          x[8] = ne(x[8], t);
          break;
        case "roundRect":
          x[5] = ne(x[5], t);
          break;
        case "addPath":
          x[0].transform(t);
          break;
        case "poly":
          x[2] = ne(x[2], t);
          break;
        default:
          Y("unknown transform action", A.action);
          break;
      }
    }
    return this._dirty = !0, this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
  /**
   * Retrieves the last point from the current drawing instructions in the `GraphicsPath`.
   * This method is useful for operations that depend on the path's current endpoint,
   * such as connecting subsequent shapes or paths. It supports various drawing instructions,
   * ensuring the last point's position is accurately determined regardless of the path's complexity.
   *
   * If the last instruction is a `closePath`, the method iterates backward through the instructions
   *  until it finds an actionable instruction that defines a point (e.g., `moveTo`, `lineTo`,
   * `quadraticCurveTo`, etc.). For compound paths added via `addPath`, it recursively retrieves
   * the last point from the nested path.
   * @param out - A `Point` object where the last point's coordinates will be stored.
   * This object is modified directly to contain the result.
   * @returns The `Point` object containing the last point's coordinates.
   */
  getLastPoint(t) {
    let e = this.instructions.length - 1, i = this.instructions[e];
    if (!i)
      return t.x = 0, t.y = 0, t;
    for (; i.action === "closePath"; ) {
      if (e--, e < 0)
        return t.x = 0, t.y = 0, t;
      i = this.instructions[e];
    }
    switch (i.action) {
      case "moveTo":
      case "lineTo":
        t.x = i.data[0], t.y = i.data[1];
        break;
      case "quadraticCurveTo":
        t.x = i.data[2], t.y = i.data[3];
        break;
      case "bezierCurveTo":
        t.x = i.data[4], t.y = i.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = i.data[5], t.y = i.data[6];
        break;
      case "addPath":
        i.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function ne(s, t) {
  return s ? s.prepend(t) : t.clone();
}
function U(s, t, e) {
  const i = s.getAttribute(t);
  return i ? Number(i) : e;
}
function Nl(s, t) {
  const e = s.querySelectorAll("defs");
  for (let i = 0; i < e.length; i++) {
    const r = e[i];
    for (let n = 0; n < r.children.length; n++) {
      const a = r.children[n];
      switch (a.nodeName.toLowerCase()) {
        case "lineargradient":
          t.defs[a.id] = Vl(a);
          break;
        case "radialgradient":
          t.defs[a.id] = Ol();
          break;
      }
    }
  }
}
function Vl(s) {
  const t = U(s, "x1", 0), e = U(s, "y1", 0), i = U(s, "x2", 1), r = U(s, "y2", 0), n = s.getAttribute("gradientUnits") || "objectBoundingBox", a = new xt(
    t,
    e,
    i,
    r,
    n === "objectBoundingBox" ? "local" : "global"
  );
  for (let o = 0; o < s.children.length; o++) {
    const h = s.children[o], l = U(h, "offset", 0), c = K.shared.setValue(h.getAttribute("stop-color")).toNumber();
    a.addColorStop(l, c);
  }
  return a;
}
function Ol(s) {
  return Y("[SVG Parser] Radial gradients are not yet supported"), new xt(0, 0, 1, 0);
}
function lr(s) {
  const t = s.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
  return t ? t[1] : "";
}
const cr = {
  // Fill properties
  fill: { type: "paint", default: 0 },
  // Fill color/gradient
  "fill-opacity": { type: "number", default: 1 },
  // Fill transparency
  // Stroke properties
  stroke: { type: "paint", default: 0 },
  // Stroke color/gradient
  "stroke-width": { type: "number", default: 1 },
  // Width of stroke
  "stroke-opacity": { type: "number", default: 1 },
  // Stroke transparency
  "stroke-linecap": { type: "string", default: "butt" },
  // End cap style: butt, round, square
  "stroke-linejoin": { type: "string", default: "miter" },
  // Join style: miter, round, bevel
  "stroke-miterlimit": { type: "number", default: 10 },
  // Limit on miter join sharpness
  "stroke-dasharray": { type: "string", default: "none" },
  // Dash pattern
  "stroke-dashoffset": { type: "number", default: 0 },
  // Offset for dash pattern
  // Global properties
  opacity: { type: "number", default: 1 }
  // Overall opacity
};
function Hn(s, t) {
  const e = s.getAttribute("style"), i = {}, r = {}, n = {
    strokeStyle: i,
    fillStyle: r,
    useFill: !1,
    useStroke: !1
  };
  for (const a in cr) {
    const o = s.getAttribute(a);
    o && ur(t, n, a, o.trim());
  }
  if (e) {
    const a = e.split(";");
    for (let o = 0; o < a.length; o++) {
      const h = a[o].trim(), [l, c] = h.split(":");
      cr[l] && ur(t, n, l, c.trim());
    }
  }
  return {
    strokeStyle: n.useStroke ? i : null,
    fillStyle: n.useFill ? r : null,
    useFill: n.useFill,
    useStroke: n.useStroke
  };
}
function ur(s, t, e, i) {
  switch (e) {
    case "stroke":
      if (i !== "none") {
        if (i.startsWith("url(")) {
          const r = lr(i);
          t.strokeStyle.fill = s.defs[r];
        } else
          t.strokeStyle.color = K.shared.setValue(i).toNumber();
        t.useStroke = !0;
      }
      break;
    case "stroke-width":
      t.strokeStyle.width = Number(i);
      break;
    case "fill":
      if (i !== "none") {
        if (i.startsWith("url(")) {
          const r = lr(i);
          t.fillStyle.fill = s.defs[r];
        } else
          t.fillStyle.color = K.shared.setValue(i).toNumber();
        t.useFill = !0;
      }
      break;
    case "fill-opacity":
      t.fillStyle.alpha = Number(i);
      break;
    case "stroke-opacity":
      t.strokeStyle.alpha = Number(i);
      break;
    case "opacity":
      t.fillStyle.alpha = Number(i), t.strokeStyle.alpha = Number(i);
      break;
  }
}
function Ul(s) {
  if (s.length <= 2)
    return !0;
  const t = s.map((o) => o.area).sort((o, h) => h - o), [e, i] = t, r = t[t.length - 1], n = e / i, a = i / r;
  return !(n > 3 && a < 2);
}
function Hl(s) {
  return s.split(/(?=[Mm])/).filter((i) => i.trim().length > 0);
}
function jl(s) {
  const t = s.match(/[-+]?[0-9]*\.?[0-9]+/g);
  if (!t || t.length < 4)
    return 0;
  const e = t.map(Number), i = [], r = [];
  for (let c = 0; c < e.length; c += 2)
    c + 1 < e.length && (i.push(e[c]), r.push(e[c + 1]));
  if (i.length === 0 || r.length === 0)
    return 0;
  const n = Math.min(...i), a = Math.max(...i), o = Math.min(...r), h = Math.max(...r);
  return (a - n) * (h - o);
}
function dr(s, t) {
  const e = new At(s, !1);
  for (const i of e.instructions)
    t.instructions.push(i);
}
function ql(s, t) {
  if (typeof s == "string") {
    const a = document.createElement("div");
    a.innerHTML = s.trim(), s = a.querySelector("svg");
  }
  const e = {
    context: t,
    defs: {},
    path: new At()
  };
  Nl(s, e);
  const i = s.children, { fillStyle: r, strokeStyle: n } = Hn(s, e);
  for (let a = 0; a < i.length; a++) {
    const o = i[a];
    o.nodeName.toLowerCase() !== "defs" && jn(o, e, r, n);
  }
  return t;
}
function jn(s, t, e, i) {
  const r = s.children, { fillStyle: n, strokeStyle: a } = Hn(s, t);
  n && e ? e = { ...e, ...n } : n && (e = n), a && i ? i = { ...i, ...a } : a && (i = a);
  const o = !e && !i;
  o && (e = { color: 0 });
  let h, l, c, u, f, d, p, m, g, A, x, y, b, v, C, w, k;
  switch (s.nodeName.toLowerCase()) {
    case "path": {
      v = s.getAttribute("d");
      const T = s.getAttribute("fill-rule"), B = Hl(v), P = T === "evenodd", X = B.length > 1;
      if (P && X) {
        const V = B.map((S) => ({
          path: S,
          area: jl(S)
        }));
        if (V.sort((S, E) => E.area - S.area), B.length > 3 || !Ul(V))
          for (let S = 0; S < V.length; S++) {
            const E = V[S], qt = S === 0;
            t.context.beginPath();
            const G = new At(void 0, !0);
            dr(E.path, G), t.context.path(G), qt ? (e && t.context.fill(e), i && t.context.stroke(i)) : t.context.cut();
          }
        else
          for (let S = 0; S < V.length; S++) {
            const E = V[S], qt = S % 2 === 1;
            t.context.beginPath();
            const G = new At(void 0, !0);
            dr(E.path, G), t.context.path(G), qt ? t.context.cut() : (e && t.context.fill(e), i && t.context.stroke(i));
          }
      } else {
        const V = T ? T === "evenodd" : !0;
        C = new At(v, V), t.context.path(C), e && t.context.fill(e), i && t.context.stroke(i);
      }
      break;
    }
    case "circle":
      p = U(s, "cx", 0), m = U(s, "cy", 0), g = U(s, "r", 0), t.context.ellipse(p, m, g, g), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "rect":
      h = U(s, "x", 0), l = U(s, "y", 0), w = U(s, "width", 0), k = U(s, "height", 0), A = U(s, "rx", 0), x = U(s, "ry", 0), A || x ? t.context.roundRect(h, l, w, k, A || x) : t.context.rect(h, l, w, k), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "ellipse":
      p = U(s, "cx", 0), m = U(s, "cy", 0), A = U(s, "rx", 0), x = U(s, "ry", 0), t.context.beginPath(), t.context.ellipse(p, m, A, x), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "line":
      c = U(s, "x1", 0), u = U(s, "y1", 0), f = U(s, "x2", 0), d = U(s, "y2", 0), t.context.beginPath(), t.context.moveTo(c, u), t.context.lineTo(f, d), i && t.context.stroke(i);
      break;
    case "polygon":
      b = s.getAttribute("points"), y = b.match(/-?\d+/g).map((T) => parseInt(T, 10)), t.context.poly(y, !0), e && t.context.fill(e), i && t.context.stroke(i);
      break;
    case "polyline":
      b = s.getAttribute("points"), y = b.match(/-?\d+/g).map((T) => parseInt(T, 10)), t.context.poly(y, !1), i && t.context.stroke(i);
      break;
    case "g":
    case "svg":
      break;
    default: {
      Y(`[SVG parser] <${s.nodeName}> elements unsupported`);
      break;
    }
  }
  o && (e = null);
  for (let T = 0; T < r.length; T++)
    jn(r[T], t, e, i);
}
function Kl(s) {
  return K.isColorLike(s);
}
function fr(s) {
  return s instanceof ts;
}
function gr(s) {
  return s instanceof xt;
}
function Zl(s) {
  return s instanceof R;
}
function Jl(s, t, e) {
  const i = K.shared.setValue(t ?? 0);
  return s.color = i.toNumber(), s.alpha = i.alpha === 1 ? e.alpha : i.alpha, s.texture = R.WHITE, { ...e, ...s };
}
function _l(s, t, e) {
  return s.texture = t, { ...e, ...s };
}
function pr(s, t, e) {
  return s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, { ...e, ...s };
}
function mr(s, t, e) {
  return t.buildGradient(), s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, s.textureSpace = t.textureSpace, { ...e, ...s };
}
function $l(s, t) {
  const e = { ...t, ...s }, i = K.shared.setValue(e.color);
  return e.alpha *= i.alpha, e.color = i.toNumber(), e;
}
function Wt(s, t) {
  if (s == null)
    return null;
  const e = {}, i = s;
  return Kl(s) ? Jl(e, s, t) : Zl(s) ? _l(e, s, t) : fr(s) ? pr(e, s, t) : gr(s) ? mr(e, s, t) : i.fill && fr(i.fill) ? pr(i, i.fill, t) : i.fill && gr(i.fill) ? mr(i, i.fill, t) : $l(i, t);
}
function qe(s, t) {
  const { width: e, alignment: i, miterLimit: r, cap: n, join: a, pixelLine: o, ...h } = t, l = Wt(s, h);
  return l ? {
    width: e,
    alignment: i,
    miterLimit: r,
    cap: n,
    join: a,
    pixelLine: o,
    ...l
  } : null;
}
const tc = new J(), Ar = new W(), ai = class gt extends ct {
  constructor() {
    super(...arguments), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = j("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this.destroyed = !1, this._activePath = new At(), this._transform = new W(), this._fillStyle = { ...gt.defaultFillStyle }, this._strokeStyle = { ...gt.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new lt(), this._boundsDirty = !0;
  }
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new gt();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = Wt(t, gt.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = qe(t, gt.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = Wt(t, gt.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = Wt(t, gt.defaultStrokeStyle), this;
  }
  texture(t, e, i, r, n, a) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: i || 0,
        dy: r || 0,
        dw: n || t.frame.width,
        dh: a || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? K.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new At(), this;
  }
  fill(t, e) {
    let i;
    const r = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && r?.action === "stroke" ? i = r.data.path : i = this._activePath.clone(), i ? (t != null && (e !== void 0 && typeof t == "number" && (F(D, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = { color: t, alpha: e }), this._fillStyle = Wt(t, gt.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: i }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(J.shared);
    this._activePath.clear(), this._activePath.moveTo(t, e);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillInput parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param style - (Optional) The stroke style to apply. Can be defined as a simple color or a more complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(t) {
    let e;
    const i = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && i?.action === "fill" ? e = i.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = qe(t, gt.defaultStrokeStyle)), this.instructions.push({
      action: "stroke",
      // TODO copy fill style!
      data: { style: this.strokeStyle, path: e }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  cut() {
    for (let t = 0; t < 2; t++) {
      const e = this.instructions[this.instructions.length - 1 - t], i = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill"))
        if (e.data.hole)
          e.data.hole.addPath(i);
        else {
          e.data.hole = i;
          break;
        }
    }
    return this._initNextPathLocation(), this;
  }
  /**
   * Adds an arc to the current path, which is centered at (x, y) with the specified radius,
   * starting and ending angles, and direction.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The arc's radius.
   * @param startAngle - The starting angle, in radians.
   * @param endAngle - The ending angle, in radians.
   * @param counterclockwise - (Optional) Specifies whether the arc is drawn counterclockwise (true) or clockwise (false). Defaults to false.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arc(t, e, i, r, n, a) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arc(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      i,
      r,
      n,
      a
    ), this;
  }
  /**
   * Adds an arc to the current path with the given control points and radius, connected to the previous point
   * by a straight line if necessary.
   * @param x1 - The x-coordinate of the first control point.
   * @param y1 - The y-coordinate of the first control point.
   * @param x2 - The x-coordinate of the second control point.
   * @param y2 - The y-coordinate of the second control point.
   * @param radius - The arc's radius.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arcTo(t, e, i, r, n) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arcTo(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      a.a * i + a.c * r + a.tx,
      a.b * i + a.d * r + a.ty,
      n
    ), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, i, r, n, a, o) {
    this._tick++;
    const h = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      i,
      // should we rotate this with transform??
      r,
      n,
      h.a * a + h.c * o + h.tx,
      h.b * a + h.d * o + h.ty
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, i, r, n, a, o) {
    this._tick++;
    const h = this._transform;
    return this._activePath.bezierCurveTo(
      h.a * t + h.c * e + h.tx,
      h.b * t + h.d * e + h.ty,
      h.a * i + h.c * r + h.tx,
      h.b * i + h.d * r + h.ty,
      h.a * n + h.c * a + h.tx,
      h.b * n + h.d * a + h.ty,
      o
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this._tick++, this._activePath?.closePath(), this;
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, i, r) {
    return this._tick++, this._activePath.ellipse(t, e, i, r, this._transform.clone()), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i) {
    return this._tick++, this._activePath.circle(t, e, i, this._transform.clone()), this;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @returns The instance of the current object for chaining.
   */
  path(t) {
    return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._tick++;
    const i = this._transform;
    return this._activePath.lineTo(
      i.a * t + i.c * e + i.tx,
      i.b * t + i.d * e + i.ty
    ), this;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    this._tick++;
    const i = this._transform, r = this._activePath.instructions, n = i.a * t + i.c * e + i.tx, a = i.b * t + i.d * e + i.ty;
    return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = n, r[0].data[1] = a, this) : (this._activePath.moveTo(
      n,
      a
    ), this);
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cpx - The x-coordinate of the control point.
   * @param cpy - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, i, r, n) {
    this._tick++;
    const a = this._transform;
    return this._activePath.quadraticCurveTo(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      a.a * i + a.c * r + a.tx,
      a.b * i + a.d * r + a.ty,
      n
    ), this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, r) {
    return this._tick++, this._activePath.rect(t, e, i, r, this._transform.clone()), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, i, r, n) {
    return this._tick++, this._activePath.roundRect(t, e, i, r, n, this._transform.clone()), this;
  }
  /**
   * Draws a polygon shape by specifying a sequence of points. This method allows for the creation of complex polygons,
   * which can be both open and closed. An optional transformation can be applied, enabling the polygon to be scaled,
   * rotated, or translated as needed.
   * @param points - An array of numbers, or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates, of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   */
  poly(t, e) {
    return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, i, r, n = 0, a) {
    return this._tick++, this._activePath.regularPoly(t, e, i, r, n, a), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, i, r, n, a) {
    return this._tick++, this._activePath.roundPoly(t, e, i, r, n, a), this;
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, i, r) {
    return this._tick++, this._activePath.roundShape(t, e, i, r), this;
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, i, r, n) {
    return this._tick++, this._activePath.filletRect(t, e, i, r, n), this;
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, i, r, n, a) {
    return this._tick++, this._activePath.chamferRect(t, e, i, r, n, a), this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  star(t, e, i, r, n = 0, a = 0) {
    return this._tick++, this._activePath.star(t, e, i, r, n, a, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, ql(t, this), this;
  }
  /**
   * Restores the most recently saved graphics state by popping the top of the graphics state stack.
   * This includes transformations, fill styles, and stroke styles.
   */
  restore() {
    const t = this._stateStack.pop();
    return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._stateStack.push({
      transform: this._transform.clone(),
      fillStyle: { ...this._fillStyle },
      strokeStyle: { ...this._strokeStyle }
    }), this;
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this._transform;
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._transform.identity(), this;
  }
  /**
   * Applies a rotation transformation to the graphics context around the current origin.
   * @param angle - The angle of rotation in radians.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  rotate(t) {
    return this._transform.rotate(t), this;
  }
  /**
   * Applies a scaling transformation to the graphics context, scaling drawings by x horizontally and by y vertically.
   * @param x - The scale factor in the horizontal direction.
   * @param y - (Optional) The scale factor in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  scale(t, e = t) {
    return this._transform.scale(t, e), this;
  }
  setTransform(t, e, i, r, n, a) {
    return t instanceof W ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, i, r, n, a), this);
  }
  transform(t, e, i, r, n, a) {
    return t instanceof W ? (this._transform.append(t), this) : (Ar.set(t, e, i, r, n, a), this._transform.append(Ar), this);
  }
  /**
   * Applies a translation transformation to the graphics context, moving the origin by the specified amounts.
   * @param x - The amount to translate in the horizontal direction.
   * @param y - (Optional) The amount to translate in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  translate(t, e = t) {
    return this._transform.translate(t, e), this;
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
  }
  onUpdate() {
    this._boundsDirty = !0, !this.dirty && (this.emit("update", this, 16), this.dirty = !0);
  }
  /** The bounds of the graphic shape. */
  get bounds() {
    if (!this._boundsDirty)
      return this._bounds;
    this._boundsDirty = !1;
    const t = this._bounds;
    t.clear();
    for (let e = 0; e < this.instructions.length; e++) {
      const i = this.instructions[e], r = i.action;
      if (r === "fill") {
        const n = i.data;
        t.addBounds(n.path.bounds);
      } else if (r === "texture") {
        const n = i.data;
        t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform);
      }
      if (r === "stroke") {
        const n = i.data, a = n.style.alignment, o = n.style.width * (1 - a), h = n.path.bounds;
        t.addFrame(
          h.minX - o,
          h.minY - o,
          h.maxX + o,
          h.maxY + o
        );
      }
    }
    return t;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(t) {
    if (!this.bounds.containsPoint(t.x, t.y))
      return !1;
    const e = this.instructions;
    let i = !1;
    for (let r = 0; r < e.length; r++) {
      const n = e[r], a = n.data, o = a.path;
      if (!n.action || !o)
        continue;
      const h = a.style, l = o.shapePath.shapePrimitives;
      for (let c = 0; c < l.length; c++) {
        const u = l[c].shape;
        if (!h || !u)
          continue;
        const f = l[c].transform, d = f ? f.applyInverse(t, tc) : t;
        if (n.action === "fill")
          i = u.contains(d.x, d.y);
        else {
          const m = h;
          i = u.strokeContains(d.x, d.y, m.width, m.alignment);
        }
        const p = a.hole;
        if (p) {
          const m = p.shapePath?.shapePrimitives;
          if (m)
            for (let g = 0; g < m.length; g++)
              m[g].shape.contains(d.x, d.y) && (i = !1);
        }
        if (i)
          return !0;
      }
    }
    return i;
  }
  /** Unloads the GPU data from the graphics context. */
  unload() {
    this.emit("unload", this);
    for (const t in this._gpuData)
      this._gpuData[t]?.destroy();
    this._gpuData = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Destroys the GraphicsData object.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * context.destroy();
   * context.destroy(true);
   * context.destroy({ texture: true, textureSource: true });
   */
  destroy(t = !1) {
    if (this.destroyed)
      return;
    if (this.destroyed = !0, this._stateStack.length = 0, this._transform = null, this.unload(), this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t?.texture) {
      const i = typeof t == "boolean" ? t : t?.textureSource;
      this._fillStyle.texture && (this._fillStyle.fill && "uid" in this._fillStyle.fill ? this._fillStyle.fill.destroy() : this._fillStyle.texture.destroy(i)), this._strokeStyle.texture && (this._strokeStyle.fill && "uid" in this._strokeStyle.fill ? this._strokeStyle.fill.destroy() : this._strokeStyle.texture.destroy(i));
    }
    this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
  }
};
ai.defaultFillStyle = {
  /** The color to use for the fill. */
  color: 16777215,
  /** The alpha value to use for the fill. */
  alpha: 1,
  /** The texture to use for the fill. */
  texture: R.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null,
  /** Whether coordinates are 'global' or 'local' */
  textureSpace: "local"
};
ai.defaultStrokeStyle = {
  /** The width of the stroke. */
  width: 1,
  /** The color to use for the stroke. */
  color: 16777215,
  /** The alpha value to use for the stroke. */
  alpha: 1,
  /** The alignment of the stroke. */
  alignment: 0.5,
  /** The miter limit to use. */
  miterLimit: 10,
  /** The line cap style to use. */
  cap: "butt",
  /** The line join style to use. */
  join: "miter",
  /** The texture to use for the fill. */
  texture: R.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null,
  /** Whether coordinates are 'global' or 'local' */
  textureSpace: "local",
  /** If the stroke is a pixel line. */
  pixelLine: !1
};
let rt = ai;
const oi = class Yt extends ct {
  constructor(t = {}) {
    super(), this.uid = j("textStyle"), this._tick = 0, ec(t);
    const e = { ...Yt.defaultTextStyle, ...t };
    for (const i in e) {
      const r = i;
      this[r] = e[i];
    }
    this.update(), this._tick = 0;
  }
  /**
   * Alignment for multiline text, does not affect single line text.
   * @type {'left'|'center'|'right'|'justify'}
   */
  get align() {
    return this._align;
  }
  set align(t) {
    this._align !== t && (this._align = t, this.update());
  }
  /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(t) {
    this._breakWords !== t && (this._breakWords = t, this.update());
  }
  /** Set a drop shadow for the text. */
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(t) {
    this._dropShadow !== t && (t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({ ...Yt.defaultDropShadow, ...t }) : this._dropShadow = t ? this._createProxy({ ...Yt.defaultDropShadow }) : null, this.update());
  }
  /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(t) {
    this._fontFamily !== t && (this._fontFamily = t, this.update());
  }
  /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    this._fontSize !== t && (typeof t == "string" ? this._fontSize = parseInt(t, 10) : this._fontSize = t, this.update());
  }
  /**
   * The font style.
   * @type {'normal'|'italic'|'oblique'}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(t) {
    this._fontStyle !== t && (this._fontStyle = t.toLowerCase(), this.update());
  }
  /**
   * The font variant.
   * @type {'normal'|'small-caps'}
   */
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(t) {
    this._fontVariant !== t && (this._fontVariant = t, this.update());
  }
  /**
   * The font weight.
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(t) {
    this._fontWeight !== t && (this._fontWeight = t, this.update());
  }
  /** The space between lines. */
  get leading() {
    return this._leading;
  }
  set leading(t) {
    this._leading !== t && (this._leading = t, this.update());
  }
  /** The amount of spacing between letters, default is 0. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(t) {
    this._letterSpacing !== t && (this._letterSpacing = t, this.update());
  }
  /** The line height, a number that represents the vertical space that a letter uses. */
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(t) {
    this._lineHeight !== t && (this._lineHeight = t, this.update());
  }
  /**
   * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
   * by adding padding to all sides of the text.
   * > [!NOTE] This will NOT affect the positioning or bounds of the text.
   */
  get padding() {
    return this._padding;
  }
  set padding(t) {
    this._padding !== t && (this._padding = t, this.update());
  }
  /**
   * An optional filter or array of filters to apply to the text, allowing for advanced visual effects.
   * These filters will be applied to the text as it is created, resulting in faster rendering for static text
   * compared to applying the filter directly to the text object (which would be applied at run time).
   * @default null
   */
  get filters() {
    return this._filters;
  }
  set filters(t) {
    this._filters !== t && (this._filters = Object.freeze(t), this.update());
  }
  /**
   * Trim transparent borders from the text texture.
   * > [!IMPORTANT] PERFORMANCE WARNING:
   * > This is a costly operation as it requires scanning pixel alpha values.
   * > Avoid using `trim: true` for dynamic text, as it could significantly impact performance.
   */
  get trim() {
    return this._trim;
  }
  set trim(t) {
    this._trim !== t && (this._trim = t, this.update());
  }
  /**
   * The baseline of the text that is rendered.
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(t) {
    this._textBaseline !== t && (this._textBaseline = t, this.update());
  }
  /**
   * How newlines and spaces should be handled.
   * Default is 'pre' (preserve, preserve).
   *
   *  value       | New lines     |   Spaces
   *  ---         | ---           |   ---
   * 'normal'     | Collapse      |   Collapse
   * 'pre'        | Preserve      |   Preserve
   * 'pre-line'   | Preserve      |   Collapse
   * @type {'normal'|'pre'|'pre-line'}
   */
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(t) {
    this._whiteSpace !== t && (this._whiteSpace = t, this.update());
  }
  /** Indicates if word wrap should be used. */
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(t) {
    this._wordWrap !== t && (this._wordWrap = t, this.update());
  }
  /** The width at which text will wrap, it needs wordWrap to be set to true. */
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this._wordWrapWidth !== t && (this._wordWrapWidth = t, this.update());
  }
  /**
   * The fill style that will be used to color the text.
   * This can be:
   * - A color string like 'red', '#00FF00', or 'rgba(255,0,0,0.5)'
   * - A hex number like 0xff0000 for red
   * - A FillStyle object with properties like { color: 0xff0000, alpha: 0.5 }
   * - A FillGradient for gradient fills
   * - A FillPattern for pattern/texture fills
   *
   * When using a FillGradient, vertical gradients (angle of 90 degrees) are applied per line of text,
   * while gradients at any other angle are spread across the entire text body as a whole.
   * @example
   * // Vertical gradient applied per line
   * const verticalGradient = new FillGradient(0, 0, 0, 1)
   *     .addColorStop(0, 0xff0000)
   *     .addColorStop(1, 0x0000ff);
   *
   * const text = new Text({
   *     text: 'Line 1\nLine 2',
   *     style: { fill: verticalGradient }
   * });
   *
   * To manage the gradient in a global scope, set the textureSpace property of the FillGradient to 'global'.
   * @type {string|number|FillStyle|FillGradient|FillPattern}
   */
  get fill() {
    return this._originalFill;
  }
  set fill(t) {
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({ ...rt.defaultFillStyle, ...t }, () => {
      this._fill = Wt(
        { ...this._originalFill },
        rt.defaultFillStyle
      );
    })), this._fill = Wt(
      t === 0 ? "black" : t,
      rt.defaultFillStyle
    ), this.update());
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({ ...rt.defaultStrokeStyle, ...t }, () => {
      this._stroke = qe(
        { ...this._originalStroke },
        rt.defaultStrokeStyle
      );
    })), this._stroke = qe(t, rt.defaultStrokeStyle), this.update());
  }
  update() {
    this._tick++, this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const t = Yt.defaultTextStyle;
    for (const e in t)
      this[e] = t[e];
  }
  /**
   * Returns a unique key for this instance.
   * This key is used for caching.
   * @returns {string} Unique key for the instance
   */
  get styleKey() {
    return `${this.uid}-${this._tick}`;
  }
  /**
   * Creates a new TextStyle object with the same values as this one.
   * @returns New cloned TextStyle object
   */
  clone() {
    return new Yt({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this._dropShadow ? { ...this._dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      leading: this.leading,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      textBaseline: this.textBaseline,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth,
      filters: this._filters ? [...this._filters] : void 0
    });
  }
  /**
   * Returns the final padding for the text style, taking into account any filters applied.
   * Used internally for correct measurements
   * @internal
   * @returns {number} The final padding for the text style.
   */
  _getFinalPadding() {
    let t = 0;
    if (this._filters)
      for (let e = 0; e < this._filters.length; e++)
        t += this._filters[e].padding;
    return Math.max(this._padding, t);
  }
  /**
   * Destroys this text style.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * // Destroy the text style and its textures
   * textStyle.destroy({ texture: true, textureSource: true });
   * textStyle.destroy(true);
   */
  destroy(t = !1) {
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t?.texture) {
      const i = typeof t == "boolean" ? t : t?.textureSource;
      this._fill?.texture && this._fill.texture.destroy(i), this._originalFill?.texture && this._originalFill.texture.destroy(i), this._stroke?.texture && this._stroke.texture.destroy(i), this._originalStroke?.texture && this._originalStroke.texture.destroy(i);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, {
      set: (i, r, n) => (i[r] === n || (i[r] = n, e?.(r, n), this.update()), !0)
    });
  }
  _isFillStyle(t) {
    return (t ?? null) !== null && !(K.isColorLike(t) || t instanceof xt || t instanceof ts);
  }
};
oi.defaultDropShadow = {
  alpha: 1,
  angle: Math.PI / 6,
  blur: 0,
  color: "black",
  distance: 5
};
oi.defaultTextStyle = {
  align: "left",
  breakWords: !1,
  dropShadow: null,
  fill: "black",
  fontFamily: "Arial",
  fontSize: 26,
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  leading: 0,
  letterSpacing: 0,
  lineHeight: 0,
  padding: 0,
  stroke: null,
  textBaseline: "alphabetic",
  trim: !1,
  whiteSpace: "pre",
  wordWrap: !1,
  wordWrapWidth: 100
};
let Ke = oi;
function ec(s) {
  const t = s;
  if (typeof t.dropShadow == "boolean" && t.dropShadow) {
    const e = Ke.defaultDropShadow;
    s.dropShadow = {
      alpha: t.dropShadowAlpha ?? e.alpha,
      angle: t.dropShadowAngle ?? e.angle,
      blur: t.dropShadowBlur ?? e.blur,
      color: t.dropShadowColor ?? e.color,
      distance: t.dropShadowDistance ?? e.distance
    };
  }
  if (t.strokeThickness !== void 0) {
    F(D, "strokeThickness is now a part of stroke");
    const e = t.stroke;
    let i = {};
    if (K.isColorLike(e))
      i.color = e;
    else if (e instanceof xt || e instanceof ts)
      i.fill = e;
    else if (Object.hasOwnProperty.call(e, "color") || Object.hasOwnProperty.call(e, "fill"))
      i = e;
    else
      throw new Error("Invalid stroke value.");
    s.stroke = {
      ...i,
      width: t.strokeThickness
    };
  }
  if (Array.isArray(t.fillGradientStops)) {
    if (F(D, "gradient fill is now a fill pattern: `new FillGradient(...)`"), !Array.isArray(t.fill) || t.fill.length === 0)
      throw new Error("Invalid fill value. Expected an array of colors for gradient fill.");
    t.fill.length !== t.fillGradientStops.length && Y("The number of fill colors must match the number of fill gradient stops.");
    const e = new xt({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      textureSpace: "local"
    }), i = t.fillGradientStops.slice(), r = t.fill.map((n) => K.shared.setValue(n).toNumber());
    i.forEach((n, a) => {
      e.addColorStop(n, r[a]);
    }), s.fill = {
      fill: e
    };
  }
}
class sc {
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  _createCanvasAndContext(t, e) {
    const i = Q.get().createCanvas();
    i.width = t, i.height = e;
    const r = i.getContext("2d");
    return { canvas: i, context: r };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(t, e, i = 1) {
    t = Math.ceil(t * i - 1e-6), e = Math.ceil(e * i - 1e-6), t = Oe(t), e = Oe(e);
    const r = (t << 17) + (e << 1);
    this._canvasPool[r] || (this._canvasPool[r] = []);
    let n = this._canvasPool[r].pop();
    return n || (n = this._createCanvasAndContext(t, e)), n;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: i, height: r } = e, n = (i << 17) + (r << 1);
    t.context.resetTransform(), t.context.clearRect(0, 0, i, r), this._canvasPool[n].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const Ks = new sc();
be.register(Ks);
const xr = 1e5;
function yr(s, t, e, i = 0) {
  if (s.texture === R.WHITE && !s.fill)
    return K.shared.setValue(s.color).setAlpha(s.alpha ?? 1).toHexa();
  if (s.fill) {
    if (s.fill instanceof ts) {
      const r = s.fill, n = t.createPattern(r.texture.source.resource, "repeat"), a = r.transform.copyTo(W.shared);
      return a.scale(
        r.texture.frame.width,
        r.texture.frame.height
      ), n.setTransform(a), n;
    } else if (s.fill instanceof xt) {
      const r = s.fill, n = r.type === "linear", a = r.textureSpace === "local";
      let o = 1, h = 1;
      a && e && (o = e.width + i, h = e.height + i);
      let l, c = !1;
      if (n) {
        const { start: u, end: f } = r;
        l = t.createLinearGradient(
          u.x * o,
          u.y * h,
          f.x * o,
          f.y * h
        ), c = Math.abs(f.x - u.x) < Math.abs((f.y - u.y) * 0.1);
      } else {
        const { center: u, innerRadius: f, outerCenter: d, outerRadius: p } = r;
        l = t.createRadialGradient(
          u.x * o,
          u.y * h,
          f * o,
          d.x * o,
          d.y * h,
          p * o
        );
      }
      if (c && a && e) {
        const u = e.lineHeight / h;
        for (let f = 0; f < e.lines.length; f++) {
          const d = (f * e.lineHeight + i / 2) / h;
          r.colorStops.forEach((p) => {
            const m = d + p.offset * u;
            l.addColorStop(
              // fix to 5 decimal places to avoid floating point precision issues
              Math.floor(m * xr) / xr,
              K.shared.setValue(p.color).toHex()
            );
          });
        }
      } else
        r.colorStops.forEach((u) => {
          l.addColorStop(u.offset, K.shared.setValue(u.color).toHex());
        });
      return l;
    }
  } else {
    const r = t.createPattern(s.texture.source.resource, "repeat"), n = s.matrix.copyTo(W.shared);
    return n.scale(s.texture.frame.width, s.texture.frame.height), r.setTransform(n), r;
  }
  return Y("FillStyle not recognised", s), "red";
}
const qn = class Kn extends Tn {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(t) {
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentMaxCharHeight = 0, this._currentPageIndex = -1, this._skipKerning = !1;
    const e = { ...Kn.defaultOptions, ...t };
    this._textureSize = e.textureSize, this._mipmap = e.mipmap;
    const i = e.style.clone();
    e.overrideFill && (i._fill.color = 16777215, i._fill.alpha = 1, i._fill.texture = R.WHITE, i._fill.fill = null), this.applyFillAsTint = e.overrideFill;
    const r = i.fontSize;
    i.fontSize = this.baseMeasurementFontSize;
    const n = Os(i);
    e.overrideSize ? i._stroke && (i._stroke.width *= this.baseRenderedFontSize / r) : i.fontSize = this.baseRenderedFontSize = r, this._style = i, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, e.textureStyle && (this._textureStyle = e.textureStyle instanceof Ue ? e.textureStyle : new Ue(e.textureStyle)), this.fontMetrics = Ne.measureFont(n), this.lineHeight = i.lineHeight || this.fontMetrics.fontSize || i.fontSize;
  }
  ensureCharacters(t) {
    const e = Ne.graphemeSegmenter(t).filter((g) => !this._currentChars.includes(g)).filter((g, A, x) => x.indexOf(g) === A);
    if (!e.length)
      return;
    this._currentChars = [...this._currentChars, ...e];
    let i;
    this._currentPageIndex === -1 ? i = this._nextPage() : i = this.pages[this._currentPageIndex];
    let { canvas: r, context: n } = i.canvasAndContext, a = i.texture.source;
    const o = this._style;
    let h = this._currentX, l = this._currentY, c = this._currentMaxCharHeight;
    const u = this.baseRenderedFontSize / this.baseMeasurementFontSize, f = this._padding * u;
    let d = !1;
    const p = r.width / this.resolution, m = r.height / this.resolution;
    for (let g = 0; g < e.length; g++) {
      const A = e[g], x = Ne.measureText(A, o, r, !1);
      x.lineHeight = x.height;
      const y = x.width * u, b = Math.ceil((o.fontStyle === "italic" ? 2 : 1) * y), v = x.height * u, C = b + f * 2, w = v + f * 2;
      if (d = !1, A !== `
` && A !== "\r" && A !== "	" && A !== " " && (d = !0, c = Math.ceil(Math.max(w, c))), h + C > p && (l += c, c = w, h = 0, l + c > m)) {
        a.update();
        const T = this._nextPage();
        r = T.canvasAndContext.canvas, n = T.canvasAndContext.context, a = T.texture.source, h = 0, l = 0, c = 0;
      }
      const k = y / u - (o.dropShadow?.distance ?? 0) - (o._stroke?.width ?? 0);
      if (this.chars[A] = {
        id: A.codePointAt(0),
        xOffset: -this._padding,
        yOffset: -this._padding,
        xAdvance: k,
        kerning: {}
      }, d) {
        this._drawGlyph(
          n,
          x,
          h + f,
          l + f,
          u,
          o
        );
        const T = a.width * u, B = a.height * u, P = new q(
          h / T * a.width,
          l / B * a.height,
          C / T * a.width,
          w / B * a.height
        );
        this.chars[A].texture = new R({
          source: a,
          frame: P
        }), h += Math.ceil(C);
      }
    }
    a.update(), this._currentX = h, this._currentY = l, this._currentMaxCharHeight = c, this._skipKerning && this._applyKerning(e, n);
  }
  /**
   * @deprecated since 8.0.0
   * The map of base page textures (i.e., sheets of glyphs).
   */
  get pageTextures() {
    return F(D, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  _applyKerning(t, e) {
    const i = this._measureCache;
    for (let r = 0; r < t.length; r++) {
      const n = t[r];
      for (let a = 0; a < this._currentChars.length; a++) {
        const o = this._currentChars[a];
        let h = i[n];
        h || (h = i[n] = e.measureText(n).width);
        let l = i[o];
        l || (l = i[o] = e.measureText(o).width);
        let c = e.measureText(n + o).width, u = c - (h + l);
        u && (this.chars[n].kerning[o] = u), c = e.measureText(n + o).width, u = c - (h + l), u && (this.chars[o].kerning[n] = u);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = Ks.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      t
    );
    this._setupContext(e.context, this._style, t);
    const i = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), r = new R({
      source: new Gt({
        resource: e.canvas,
        resolution: i,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    });
    this._textureStyle && (r.source.style = this._textureStyle);
    const n = {
      canvasAndContext: e,
      texture: r
    };
    return this.pages[this._currentPageIndex] = n, n;
  }
  // canvas style!
  _setupContext(t, e, i) {
    e.fontSize = this.baseRenderedFontSize, t.scale(i, i), t.font = Os(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const r = e._stroke, n = r?.width ?? 0;
    if (r && (t.lineWidth = n, t.lineJoin = r.join, t.miterLimit = r.miterLimit, t.strokeStyle = yr(r, t)), e._fill && (t.fillStyle = yr(e._fill, t)), e.dropShadow) {
      const a = e.dropShadow, o = K.shared.setValue(a.color).toArray(), h = a.blur * i, l = a.distance * i;
      t.shadowColor = `rgba(${o[0] * 255},${o[1] * 255},${o[2] * 255},${a.alpha})`, t.shadowBlur = h, t.shadowOffsetX = Math.cos(a.angle) * l, t.shadowOffsetY = Math.sin(a.angle) * l;
    } else
      t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, i, r, n, a) {
    const o = e.text, h = e.fontProperties, c = (a._stroke?.width ?? 0) * n, u = i + c / 2, f = r - c / 2, d = h.descent * n, p = e.lineHeight * n;
    let m = !1;
    a.stroke && c && (m = !0, t.strokeText(o, u, f + p - d));
    const { shadowBlur: g, shadowOffsetX: A, shadowOffsetY: x } = t;
    a._fill && (m && (t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0), t.fillText(o, u, f + p - d)), m && (t.shadowBlur = g, t.shadowOffsetX = A, t.shadowOffsetY = x);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: i } = this.pages[t];
      Ks.returnCanvasAndContext(e), i.destroy(!0);
    }
    this.pages = null;
  }
};
qn.defaultOptions = {
  textureSize: 512,
  style: new Ke(),
  mipmap: !0
};
let br = qn;
function ic(s, t, e, i) {
  const r = {
    width: 0,
    height: 0,
    offsetY: 0,
    scale: t.fontSize / e.baseMeasurementFontSize,
    lines: [{
      width: 0,
      charPositions: [],
      spaceWidth: 0,
      spacesIndex: [],
      chars: []
    }]
  };
  r.offsetY = e.baseLineOffset;
  let n = r.lines[0], a = null, o = !0;
  const h = {
    width: 0,
    start: 0,
    index: 0,
    // use index to not modify the array as we use it a lot!
    positions: [],
    chars: []
  }, l = e.baseMeasurementFontSize / t.fontSize, c = t.letterSpacing * l, u = t.wordWrapWidth * l, f = t.lineHeight ? t.lineHeight * l : e.lineHeight, d = t.wordWrap && t.breakWords, p = (A) => {
    const x = n.width;
    for (let y = 0; y < h.index; y++) {
      const b = A.positions[y];
      n.chars.push(A.chars[y]), n.charPositions.push(b + x);
    }
    n.width += A.width, o = !1, h.width = 0, h.index = 0, h.chars.length = 0;
  }, m = () => {
    let A = n.chars.length - 1;
    if (i) {
      let x = n.chars[A];
      for (; x === " "; )
        n.width -= e.chars[x].xAdvance, x = n.chars[--A];
    }
    r.width = Math.max(r.width, n.width), n = {
      width: 0,
      charPositions: [],
      chars: [],
      spaceWidth: 0,
      spacesIndex: []
    }, o = !0, r.lines.push(n), r.height += f;
  }, g = (A) => A - c > u;
  for (let A = 0; A < s.length + 1; A++) {
    let x;
    const y = A === s.length;
    y || (x = s[A]);
    const b = e.chars[x] || e.chars[" "];
    if (/(?:\s)/.test(x) || x === "\r" || x === `
` || y) {
      if (!o && t.wordWrap && g(n.width + h.width) ? (m(), p(h), y || n.charPositions.push(0)) : (h.start = n.width, p(h), y || n.charPositions.push(0)), x === "\r" || x === `
`)
        m();
      else if (!y) {
        const k = b.xAdvance + (b.kerning[a] || 0) + c;
        n.width += k, n.spaceWidth = k, n.spacesIndex.push(n.charPositions.length), n.chars.push(x);
      }
    } else {
      const w = b.kerning[a] || 0, k = b.xAdvance + w + c;
      d && g(n.width + h.width + k) && (p(h), m()), h.positions[h.index++] = h.width + w, h.chars.push(x), h.width += k;
    }
    a = x;
  }
  return m(), t.align === "center" ? rc(r) : t.align === "right" ? nc(r) : t.align === "justify" && ac(r), r;
}
function rc(s) {
  for (let t = 0; t < s.lines.length; t++) {
    const e = s.lines[t], i = s.width / 2 - e.width / 2;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += i;
  }
}
function nc(s) {
  for (let t = 0; t < s.lines.length; t++) {
    const e = s.lines[t], i = s.width - e.width;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += i;
  }
}
function ac(s) {
  const t = s.width;
  for (let e = 0; e < s.lines.length; e++) {
    const i = s.lines[e];
    let r = 0, n = i.spacesIndex[r++], a = 0;
    const o = i.spacesIndex.length, l = (t - i.width) / o;
    for (let c = 0; c < i.charPositions.length; c++)
      c === n && (n = i.spacesIndex[r++], a += l), i.charPositions[c] += a;
  }
}
function oc(s) {
  if (s === "")
    return [];
  typeof s == "string" && (s = [s]);
  const t = [];
  for (let e = 0, i = s.length; e < i; e++) {
    const r = s[e];
    if (Array.isArray(r)) {
      if (r.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${r.length}.`);
      if (r[0].length === 0 || r[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const n = r[0].charCodeAt(0), a = r[1].charCodeAt(0);
      if (a < n)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let o = n, h = a; o <= h; o++)
        t.push(String.fromCharCode(o));
    } else
      t.push(...Array.from(r));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
let Ye = 0;
class hc {
  constructor() {
    this.ALPHA = [["a", "z"], ["A", "Z"], " "], this.NUMERIC = [["0", "9"]], this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], this.ASCII = [[" ", "~"]], this.defaultOptions = {
      chars: this.ALPHANUMERIC,
      resolution: 1,
      padding: 4,
      skipKerning: !1,
      textureStyle: null
    }, this.measureCache = En(1e3);
  }
  /**
   * Get a font for the specified text and style.
   * @param text - The text to get the font for
   * @param style - The style to use
   */
  getFont(t, e) {
    let i = `${e.fontFamily}-bitmap`, r = !0;
    if (e._fill.fill && !e._stroke ? (i += e._fill.fill.styleKey, r = !1) : (e._stroke || e.dropShadow) && (i = `${e.styleKey}-bitmap`, r = !1), !L.has(i)) {
      const a = Object.create(e);
      a.lineHeight = 0;
      const o = new br({
        style: a,
        overrideFill: r,
        overrideSize: !0,
        ...this.defaultOptions
      });
      Ye++, Ye > 50 && Y("BitmapText", `You have dynamically created ${Ye} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), o.once("destroy", () => {
        Ye--, L.remove(i);
      }), L.set(
        i,
        o
      );
    }
    const n = L.get(i);
    return n.ensureCharacters?.(t), n;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(t, e, i = !0) {
    const r = this.getFont(t, e), n = `${t}-${e.styleKey}-${i}`;
    if (this.measureCache.has(n))
      return this.measureCache.get(n);
    const a = Ne.graphemeSegmenter(t), o = ic(a, e, r, i);
    return this.measureCache.set(n, o), o;
  }
  /**
   * Measure the text using the specified style.
   * @param text - The text to measure
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  measureText(t, e, i = !0) {
    return this.getLayout(t, e, i);
  }
  // eslint-disable-next-line max-len
  install(...t) {
    let e = t[0];
    typeof e == "string" && (e = {
      name: e,
      style: t[1],
      chars: t[2]?.chars,
      resolution: t[2]?.resolution,
      padding: t[2]?.padding,
      skipKerning: t[2]?.skipKerning
    }, F(D, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
    const i = e?.name;
    if (!i)
      throw new Error("[BitmapFontManager] Property `name` is required.");
    e = { ...this.defaultOptions, ...e };
    const r = e.style, n = r instanceof Ke ? r : new Ke(r), a = e.dynamicFill ?? this._canUseTintForStyle(n), o = new br({
      style: n,
      overrideFill: a,
      skipKerning: e.skipKerning,
      padding: e.padding,
      resolution: e.resolution,
      overrideSize: !1,
      textureStyle: e.textureStyle
    }), h = oc(e.chars);
    return o.ensureCharacters(h.join("")), L.set(`${i}-bitmap`, o), o.once("destroy", () => L.remove(`${i}-bitmap`)), o;
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  uninstall(t) {
    const e = `${t}-bitmap`, i = L.get(e);
    i && i.destroy();
  }
  /**
   * Determines if a style can use tinting instead of baking colors into the bitmap.
   * Tinting is more efficient as it allows reusing the same bitmap with different colors.
   * @param style - The text style to evaluate
   * @returns true if the style can use tinting, false if colors must be baked in
   * @private
   */
  _canUseTintForStyle(t) {
    return !t._stroke && (!t.dropShadow || t.dropShadow.color === 0) && !t._fill.fill && t._fill.color === 16777215;
  }
}
const wr = new hc();
class Zn extends Tn {
  constructor(t, e) {
    super();
    const { textures: i, data: r } = t;
    Object.keys(r.pages).forEach((n) => {
      const a = r.pages[parseInt(n, 10)], o = i[a.id];
      this.pages.push({ texture: o });
    }), Object.keys(r.chars).forEach((n) => {
      const a = r.chars[n], {
        frame: o,
        source: h,
        rotate: l
      } = i[a.page], c = z.transformRectCoords(
        a,
        o,
        l,
        new q()
      ), u = new R({
        frame: c,
        orig: new q(0, 0, a.width, a.height),
        source: h,
        rotate: l
      });
      this.chars[n] = {
        id: n.codePointAt(0),
        xOffset: a.xOffset,
        yOffset: a.yOffset,
        xAdvance: a.xAdvance,
        kerning: a.kerning ?? {},
        texture: u
      };
    }), this.baseRenderedFontSize = r.fontSize, this.baseMeasurementFontSize = r.fontSize, this.fontMetrics = {
      ascent: 0,
      descent: 0,
      fontSize: r.fontSize
    }, this.baseLineOffset = r.baseLineOffset, this.lineHeight = r.lineHeight, this.fontFamily = r.fontFamily, this.distanceField = r.distanceField ?? {
      type: "none",
      range: 0
    }, this.url = e;
  }
  /** Destroys the BitmapFont object. */
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { texture: e } = this.pages[t];
      e.destroy(!0);
    }
    this.pages = null;
  }
  /**
   * Generates and installs a bitmap font with the specified options.
   * The font will be cached and available for use in BitmapText objects.
   * @param options - Setup options for font generation
   * @returns Installed font instance
   * @example
   * ```ts
   * // Install a basic font
   * BitmapFont.install({
   *     name: 'Title',
   *     style: {
   *         fontFamily: 'Arial',
   *         fontSize: 32,
   *         fill: '#ffffff'
   *     }
   * });
   *
   * // Install with advanced options
   * BitmapFont.install({
   *     name: 'Custom',
   *     style: {
   *         fontFamily: 'Arial',
   *         fontSize: 24,
   *         fill: '#00ff00',
   *         stroke: { color: '#000000', width: 2 }
   *     },
   *     chars: [['a', 'z'], ['A', 'Z'], ['0', '9']],
   *     resolution: 2,
   *     padding: 4,
   *     textureStyle: {
   *         scaleMode: 'nearest'
   *     }
   * });
   * ```
   */
  static install(t) {
    wr.install(t);
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * This frees up memory and resources associated with the font.
   * @param name - The name of the bitmap font to uninstall
   * @example
   * ```ts
   * // Remove a font when it's no longer needed
   * BitmapFont.uninstall('MyCustomFont');
   *
   * // Clear multiple fonts
   * ['Title', 'Heading', 'Body'].forEach(BitmapFont.uninstall);
   * ```
   */
  static uninstall(t) {
    wr.uninstall(t);
  }
}
const Ps = {
  test(s) {
    return typeof s == "string" && s.startsWith("info face=");
  },
  parse(s) {
    const t = s.match(/^[a-z]+\s+.+$/gm), e = {
      info: [],
      common: [],
      page: [],
      char: [],
      chars: [],
      kerning: [],
      kernings: [],
      distanceField: []
    };
    for (const u in t) {
      const f = t[u].match(/^[a-z]+/gm)[0], d = t[u].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), p = {};
      for (const m in d) {
        const g = d[m].split("="), A = g[0], x = g[1].replace(/"/gm, ""), y = parseFloat(x), b = isNaN(y) ? x : y;
        p[A] = b;
      }
      e[f].push(p);
    }
    const i = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, [r] = e.info, [n] = e.common, [a] = e.distanceField ?? [];
    a && (i.distanceField = {
      range: parseInt(a.distanceRange, 10),
      type: a.fieldType
    }), i.fontSize = parseInt(r.size, 10), i.fontFamily = r.face, i.lineHeight = parseInt(n.lineHeight, 10);
    const o = e.page;
    for (let u = 0; u < o.length; u++)
      i.pages.push({
        id: parseInt(o[u].id, 10) || 0,
        file: o[u].file
      });
    const h = {};
    i.baseLineOffset = i.lineHeight - parseInt(n.base, 10);
    const l = e.char;
    for (let u = 0; u < l.length; u++) {
      const f = l[u], d = parseInt(f.id, 10);
      let p = f.letter ?? f.char ?? String.fromCharCode(d);
      p === "space" && (p = " "), h[d] = p, i.chars[p] = {
        id: d,
        // texture deets..
        page: parseInt(f.page, 10) || 0,
        x: parseInt(f.x, 10),
        y: parseInt(f.y, 10),
        width: parseInt(f.width, 10),
        height: parseInt(f.height, 10),
        xOffset: parseInt(f.xoffset, 10),
        yOffset: parseInt(f.yoffset, 10),
        xAdvance: parseInt(f.xadvance, 10),
        kerning: {}
      };
    }
    const c = e.kerning || [];
    for (let u = 0; u < c.length; u++) {
      const f = parseInt(c[u].first, 10), d = parseInt(c[u].second, 10), p = parseInt(c[u].amount, 10);
      i.chars[h[d]].kerning[h[f]] = p;
    }
    return i;
  }
}, Cr = {
  test(s) {
    const t = s;
    return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
  },
  parse(s) {
    const t = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, e = s.getElementsByTagName("info")[0], i = s.getElementsByTagName("common")[0], r = s.getElementsByTagName("distanceField")[0];
    r && (t.distanceField = {
      type: r.getAttribute("fieldType"),
      range: parseInt(r.getAttribute("distanceRange"), 10)
    });
    const n = s.getElementsByTagName("page"), a = s.getElementsByTagName("char"), o = s.getElementsByTagName("kerning");
    t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(i.getAttribute("lineHeight"), 10);
    for (let l = 0; l < n.length; l++)
      t.pages.push({
        id: parseInt(n[l].getAttribute("id"), 10) || 0,
        file: n[l].getAttribute("file")
      });
    const h = {};
    t.baseLineOffset = t.lineHeight - parseInt(i.getAttribute("base"), 10);
    for (let l = 0; l < a.length; l++) {
      const c = a[l], u = parseInt(c.getAttribute("id"), 10);
      let f = c.getAttribute("letter") ?? c.getAttribute("char") ?? String.fromCharCode(u);
      f === "space" && (f = " "), h[u] = f, t.chars[f] = {
        id: u,
        // texture deets..
        page: parseInt(c.getAttribute("page"), 10) || 0,
        x: parseInt(c.getAttribute("x"), 10),
        y: parseInt(c.getAttribute("y"), 10),
        width: parseInt(c.getAttribute("width"), 10),
        height: parseInt(c.getAttribute("height"), 10),
        // render deets..
        xOffset: parseInt(c.getAttribute("xoffset"), 10),
        yOffset: parseInt(c.getAttribute("yoffset"), 10),
        // + baseLineOffset,
        xAdvance: parseInt(c.getAttribute("xadvance"), 10),
        kerning: {}
      };
    }
    for (let l = 0; l < o.length; l++) {
      const c = parseInt(o[l].getAttribute("first"), 10), u = parseInt(o[l].getAttribute("second"), 10), f = parseInt(o[l].getAttribute("amount"), 10);
      t.chars[h[u]].kerning[h[c]] = f;
    }
    return t;
  }
}, vr = {
  test(s) {
    return typeof s == "string" && s.match(/<font(\s|>)/) ? Cr.test(Q.get().parseXML(s)) : !1;
  },
  parse(s) {
    return Cr.parse(Q.get().parseXML(s));
  }
}, lc = [".xml", ".fnt"], cc = {
  extension: {
    type: I.CacheParser,
    name: "cacheBitmapFont"
  },
  test: (s) => s instanceof Zn,
  getCacheableAssets(s, t) {
    const e = {};
    return s.forEach((i) => {
      e[i] = t, e[`${i}-bitmap`] = t;
    }), e[`${t.fontFamily}-bitmap`] = t, e;
  }
}, uc = {
  extension: {
    type: I.LoadParser,
    priority: vt.Normal
  },
  /** used for deprecation purposes */
  name: "loadBitmapFont",
  id: "bitmap-font",
  test(s) {
    return lc.includes(it.extname(s).toLowerCase());
  },
  async testParse(s) {
    return Ps.test(s) || vr.test(s);
  },
  async parse(s, t, e) {
    const i = Ps.test(s) ? Ps.parse(s) : vr.parse(s), { src: r } = t, { pages: n } = i, a = [], o = i.distanceField ? {
      scaleMode: "linear",
      alphaMode: "premultiply-alpha-on-upload",
      autoGenerateMipmaps: !1,
      resolution: 1
    } : {};
    for (let u = 0; u < n.length; ++u) {
      const f = n[u].file;
      let d = it.join(it.dirname(r), f);
      d = Ds(d, r), a.push({
        src: d,
        data: o
      });
    }
    const h = await e.load(a), l = a.map((u) => h[u.src]);
    return new Zn({
      data: i,
      textures: l
    }, r);
  },
  async load(s, t) {
    return await (await Q.get().fetch(s)).text();
  },
  async unload(s, t, e) {
    await Promise.all(s.pages.map((i) => e.unload(i.texture.source._sourceOrigin))), s.destroy();
  }
};
class dc {
  /**
   * @param loader
   * @param verbose - should the loader log to the console
   */
  constructor(t, e = !1) {
    this._loader = t, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = e;
  }
  /**
   * Adds assets to the background loading queue. Assets are loaded one at a time to minimize
   * performance impact.
   * @param assetUrls - Array of resolved assets to load in the background
   * @example
   * ```ts
   * // Add assets to background load queue
   * backgroundLoader.add([
   *     { src: 'images/level1/bg.png' },
   *     { src: 'images/level1/characters.json' }
   * ]);
   *
   * // Assets will load sequentially in the background
   * // The loader automatically pauses when high-priority loads occur
   * // e.g. Assets.load() is called
   * ```
   * @remarks
   * - Assets are loaded one at a time to minimize performance impact
   * - Loading automatically pauses when Assets.load() is called
   * - No progress tracking is available for background loading
   * - Assets are cached as they complete loading
   * @internal
   */
  add(t) {
    t.forEach((e) => {
      this._assetList.push(e);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  /**
   * Loads the next set of assets. Will try to load as many assets as it can at the same time.
   *
   * The max assets it will try to load at one time will be 4.
   */
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = !0;
      const t = [], e = Math.min(this._assetList.length, this._maxConcurrent);
      for (let i = 0; i < e; i++)
        t.push(this._assetList.pop());
      await this._loader.load(t), this._isLoading = !1, this._next();
    }
  }
  /**
   * Controls the active state of the background loader. When active, the loader will
   * continue processing its queue. When inactive, loading is paused.
   * @returns Whether the background loader is currently active
   * @example
   * ```ts
   * // Pause background loading
   * backgroundLoader.active = false;
   *
   * // Resume background loading
   * backgroundLoader.active = true;
   *
   * // Check current state
   * console.log(backgroundLoader.active); // true/false
   *
   * // Common use case: Pause during intensive operations
   * backgroundLoader.active = false;  // Pause background loading
   * ... // Perform high-priority tasks
   * backgroundLoader.active = true;   // Resume background loading
   * ```
   * @remarks
   * - Setting to true resumes loading immediately
   * - Setting to false pauses after current asset completes
   * - Background loading is automatically paused during `Assets.load()`
   * - Assets already being loaded will complete even when set to false
   */
  get active() {
    return this._isActive;
  }
  set active(t) {
    this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next());
  }
}
const fc = {
  extension: {
    type: I.CacheParser,
    name: "cacheTextureArray"
  },
  test: (s) => Array.isArray(s) && s.every((t) => t instanceof R),
  getCacheableAssets: (s, t) => {
    const e = {};
    return s.forEach((i) => {
      t.forEach((r, n) => {
        e[i + (n === 0 ? "" : n + 1)] = r;
      });
    }), e;
  }
};
async function Jn(s) {
  if ("Image" in globalThis)
    return new Promise((t) => {
      const e = new Image();
      e.onload = () => {
        t(!0);
      }, e.onerror = () => {
        t(!1);
      }, e.src = s;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(s)).blob();
      await createImageBitmap(t);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
const gc = {
  extension: {
    type: I.DetectionParser,
    priority: 1
  },
  test: async () => Jn(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (s) => [...s, "avif"],
  remove: async (s) => s.filter((t) => t !== "avif")
}, Br = ["png", "jpg", "jpeg"], pc = {
  extension: {
    type: I.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (s) => [...s, ...Br],
  remove: async (s) => s.filter((t) => !Br.includes(t))
}, mc = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function ss(s) {
  return mc ? !1 : document.createElement("video").canPlayType(s) !== "";
}
const Ac = {
  extension: {
    type: I.DetectionParser,
    priority: 0
  },
  test: async () => ss("video/mp4"),
  add: async (s) => [...s, "mp4", "m4v"],
  remove: async (s) => s.filter((t) => t !== "mp4" && t !== "m4v")
}, xc = {
  extension: {
    type: I.DetectionParser,
    priority: 0
  },
  test: async () => ss("video/ogg"),
  add: async (s) => [...s, "ogv"],
  remove: async (s) => s.filter((t) => t !== "ogv")
}, yc = {
  extension: {
    type: I.DetectionParser,
    priority: 0
  },
  test: async () => ss("video/webm"),
  add: async (s) => [...s, "webm"],
  remove: async (s) => s.filter((t) => t !== "webm")
}, bc = {
  extension: {
    type: I.DetectionParser,
    priority: 0
  },
  test: async () => Jn(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (s) => [...s, "webp"],
  remove: async (s) => s.filter((t) => t !== "webp")
}, _n = class Ve {
  constructor() {
    this.loadOptions = { ...Ve.defaultOptions }, this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
      set: (t, e, i) => (this._parsersValidated = !1, t[e] = i, !0)
    }), this.promiseCache = {};
  }
  /** function used for testing */
  reset() {
    this._parsersValidated = !1, this.promiseCache = {};
  }
  /**
   * Used internally to generate a promise for the asset to be loaded.
   * @param url - The URL to be loaded
   * @param data - any custom additional information relevant to the asset being loaded
   * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
   */
  _getLoadPromiseAndParser(t, e) {
    const i = {
      promise: null,
      parser: null
    };
    return i.promise = (async () => {
      let r = null, n = null;
      if ((e.parser || e.loadParser) && (n = this._parserHash[e.parser || e.loadParser], e.loadParser && Y(
        `[Assets] "loadParser" is deprecated, use "parser" instead for ${t}`
      ), n || Y(
        `[Assets] specified load parser "${e.parser || e.loadParser}" not found while loading ${t}`
      )), !n) {
        for (let a = 0; a < this.parsers.length; a++) {
          const o = this.parsers[a];
          if (o.load && o.test?.(t, e, this)) {
            n = o;
            break;
          }
        }
        if (!n)
          return Y(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      r = await n.load(t, e, this), i.parser = n;
      for (let a = 0; a < this.parsers.length; a++) {
        const o = this.parsers[a];
        o.parse && o.parse && await o.testParse?.(r, e, this) && (r = await o.parse(r, e, this) || r, i.parser = o);
      }
      return r;
    })(), i;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    const i = typeof e == "function" ? { ...Ve.defaultOptions, ...this.loadOptions, onProgress: e } : { ...Ve.defaultOptions, ...this.loadOptions, ...e || {} }, { onProgress: r, onError: n, strategy: a, retryCount: o, retryDelay: h } = i;
    let l = 0;
    const c = {}, u = He(t), f = ht(t, (m) => ({
      alias: [m],
      src: m,
      data: {}
    })), d = f.reduce((m, g) => m + (g.progressSize || 1), 0), p = f.map(async (m) => {
      const g = it.toAbsolute(m.src);
      c[m.src] || (await this._loadAssetWithRetry(g, m, { onProgress: r, onError: n, strategy: a, retryCount: o, retryDelay: h }, c), l += m.progressSize || 1, r && r(l / d));
    });
    return await Promise.all(p), u ? c[f[0].src] : c;
  }
  /**
   * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
   * The parser that created the asset, will be the one that unloads it.
   * @example
   * // Single asset:
   * const asset = await Loader.load('cool.png');
   *
   * await Loader.unload('cool.png');
   *
   * console.log(asset.destroyed); // true
   * @param assetsToUnloadIn - urls that you want to unload, or a single one!
   */
  async unload(t) {
    const i = ht(t, (r) => ({
      alias: [r],
      src: r
    })).map(async (r) => {
      const n = it.toAbsolute(r.src), a = this.promiseCache[n];
      if (a) {
        const o = await a.promise;
        delete this.promiseCache[n], await a.parser?.unload?.(o, r, this);
      }
    });
    await Promise.all(i);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name || t.id).reduce((t, e) => (!e.name && !e.id ? Y("[Assets] parser should have an id") : (t[e.name] || t[e.id]) && Y(`[Assets] parser id conflict "${e.id}"`), t[e.name] = e, e.id && (t[e.id] = e), t), {});
  }
  async _loadAssetWithRetry(t, e, i, r) {
    let n = 0;
    const { onError: a, strategy: o, retryCount: h, retryDelay: l } = i, c = (u) => new Promise((f) => setTimeout(f, u));
    for (; ; )
      try {
        this.promiseCache[t] || (this.promiseCache[t] = this._getLoadPromiseAndParser(t, e)), r[e.src] = await this.promiseCache[t].promise;
        return;
      } catch (u) {
        delete this.promiseCache[t], delete r[e.src], n++;
        const f = o !== "retry" || n > h;
        if (o === "retry" && !f) {
          a && a(u, e), await c(l);
          continue;
        }
        if (o === "skip") {
          a && a(u, e);
          return;
        }
        a && a(u, e);
        const d = new Error(`[Loader.load] Failed to load ${t}.
${u}`);
        throw u instanceof Error && u.stack && (d.stack = u.stack), d;
      }
  }
};
_n.defaultOptions = {
  onProgress: void 0,
  onError: void 0,
  strategy: "throw",
  retryCount: 3,
  retryDelay: 250
};
let wc = _n;
function Ht(s, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (s.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return s.startsWith(`data:${t}`);
}
function jt(s, t) {
  const e = s.split("?")[0], i = it.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(i) : i === t;
}
const Cc = ".json", vc = "application/json", Bc = {
  extension: {
    type: I.LoadParser,
    priority: vt.Low
  },
  /** used for deprecation purposes */
  name: "loadJson",
  id: "json",
  test(s) {
    return Ht(s, vc) || jt(s, Cc);
  },
  async load(s) {
    return await (await Q.get().fetch(s)).json();
  }
}, Sc = ".txt", Pc = "text/plain", Mc = {
  /** used for deprecation purposes */
  name: "loadTxt",
  id: "text",
  extension: {
    type: I.LoadParser,
    priority: vt.Low,
    name: "loadTxt"
  },
  test(s) {
    return Ht(s, Pc) || jt(s, Sc);
  },
  async load(s) {
    return await (await Q.get().fetch(s)).text();
  }
}, Ic = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
], Tc = [".ttf", ".otf", ".woff", ".woff2"], Ec = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], kc = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function Fc(s) {
  const t = it.extname(s), r = it.basename(s, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((o) => o.charAt(0).toUpperCase() + o.slice(1));
  let n = r.length > 0;
  for (const o of r)
    if (!o.match(kc)) {
      n = !1;
      break;
    }
  let a = r.join(" ");
  return n || (a = `"${a.replace(/[\\"]/g, "\\$&")}"`), a;
}
const Wc = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function Rc(s) {
  return Wc.test(s) ? s : encodeURI(s);
}
const Gc = {
  extension: {
    type: I.LoadParser,
    priority: vt.Low
  },
  /** used for deprecation purposes */
  name: "loadWebFont",
  id: "web-font",
  test(s) {
    return Ht(s, Ec) || jt(s, Tc);
  },
  async load(s, t) {
    const e = Q.get().getFontFaceSet();
    if (e) {
      const i = [], r = t.data?.family ?? Fc(s), n = t.data?.weights?.filter((o) => Ic.includes(o)) ?? ["normal"], a = t.data ?? {};
      for (let o = 0; o < n.length; o++) {
        const h = n[o], l = new FontFace(r, `url(${Rc(s)})`, {
          ...a,
          weight: h
        });
        await l.load(), e.add(l), i.push(l);
      }
      return L.has(`${r}-and-url`) ? L.get(`${r}-and-url`).entries.push({ url: s, faces: i }) : L.set(`${r}-and-url`, {
        entries: [{ url: s, faces: i }]
      }), i.length === 1 ? i[0] : i;
    }
    return Y("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(s) {
    const t = Array.isArray(s) ? s : [s], e = t[0].family, i = L.get(`${e}-and-url`), r = i.entries.find((n) => n.faces.some((a) => t.indexOf(a) !== -1));
    r.faces = r.faces.filter((n) => t.indexOf(n) === -1), r.faces.length === 0 && (i.entries = i.entries.filter((n) => n !== r)), t.forEach((n) => {
      Q.get().getFontFaceSet().delete(n);
    }), i.entries.length === 0 && L.remove(`${e}-and-url`);
  }
};
function hi(s, t = 1) {
  const e = Ut.RETINA_PREFIX?.exec(s);
  return e ? parseFloat(e[1]) : t;
}
function li(s, t, e) {
  s.label = e, s._sourceOrigin = e;
  const i = new R({
    source: s,
    label: e
  }), r = () => {
    delete t.promiseCache[e], L.has(e) && L.remove(e);
  };
  return i.source.once("destroy", () => {
    t.promiseCache[e] && (Y("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), r());
  }), i.once("destroy", () => {
    s.destroyed || (Y("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), r());
  }), i;
}
const zc = ".svg", Dc = "image/svg+xml", Lc = {
  extension: {
    type: I.LoadParser,
    priority: vt.Low,
    name: "loadSVG"
  },
  /** used for deprecation purposes */
  name: "loadSVG",
  id: "svg",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: !1
  },
  test(s) {
    return Ht(s, Dc) || jt(s, zc);
  },
  async load(s, t, e) {
    return t.data?.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? Qc(s) : Yc(s, t, e, this.config.crossOrigin);
  },
  unload(s) {
    s.destroy(!0);
  }
};
async function Yc(s, t, e, i) {
  const r = await Q.get().fetch(s), n = Q.get().createImage();
  n.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(await r.text())}`, n.crossOrigin = i, await n.decode();
  const a = t.data?.width ?? n.width, o = t.data?.height ?? n.height, h = t.data?.resolution || hi(s), l = Math.ceil(a * h), c = Math.ceil(o * h), u = Q.get().createCanvas(l, c), f = u.getContext("2d");
  f.imageSmoothingEnabled = !0, f.imageSmoothingQuality = "high", f.drawImage(n, 0, 0, a * h, o * h);
  const { parseAsGraphicsContext: d, ...p } = t.data ?? {}, m = new Gt({
    resource: u,
    alphaMode: "premultiply-alpha-on-upload",
    resolution: h,
    ...p
  });
  return li(m, e, s);
}
async function Qc(s) {
  const e = await (await Q.get().fetch(s)).text(), i = new rt();
  return i.svg(e), i;
}
const Xc = `(function () {
    'use strict';

    const WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
    async function checkImageBitmap() {
      try {
        if (typeof createImageBitmap !== "function")
          return false;
        const response = await fetch(WHITE_PNG);
        const imageBlob = await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);
        return imageBitmap.width === 1 && imageBitmap.height === 1;
      } catch (_e) {
        return false;
      }
    }
    void checkImageBitmap().then((result) => {
      self.postMessage(result);
    });

})();
`;
let Xt = null, Zs = class {
  constructor() {
    Xt || (Xt = URL.createObjectURL(new Blob([Xc], { type: "application/javascript" }))), this.worker = new Worker(Xt);
  }
};
Zs.revokeObjectURL = function() {
  Xt && (URL.revokeObjectURL(Xt), Xt = null);
};
const Nc = `(function () {
    'use strict';

    async function loadImageBitmap(url, alphaMode) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \${response.status} \${response.statusText}\`);
      }
      const imageBlob = await response.blob();
      return alphaMode === "premultiplied-alpha" ? createImageBitmap(imageBlob, { premultiplyAlpha: "none" }) : createImageBitmap(imageBlob);
    }
    self.onmessage = async (event) => {
      try {
        const imageBitmap = await loadImageBitmap(event.data.data[0], event.data.data[1]);
        self.postMessage({
          data: imageBitmap,
          uuid: event.data.uuid,
          id: event.data.id
        }, [imageBitmap]);
      } catch (e) {
        self.postMessage({
          error: e,
          uuid: event.data.uuid,
          id: event.data.id
        });
      }
    };

})();
`;
let Nt = null;
class $n {
  constructor() {
    Nt || (Nt = URL.createObjectURL(new Blob([Nc], { type: "application/javascript" }))), this.worker = new Worker(Nt);
  }
}
$n.revokeObjectURL = function() {
  Nt && (URL.revokeObjectURL(Nt), Nt = null);
};
let Sr = 0, Ms;
class Vc {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  /**
   * Checks if ImageBitmap is supported in the current environment.
   *
   * This method uses a dedicated worker to test ImageBitmap support
   * and caches the result for subsequent calls.
   * @returns Promise that resolves to true if ImageBitmap is supported, false otherwise
   */
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new Zs();
      e.addEventListener("message", (i) => {
        e.terminate(), Zs.revokeObjectURL(), t(i.data);
      });
    }), this._isImageBitmapSupported);
  }
  /**
   * Loads an image as an ImageBitmap using a web worker.
   * @param src - The source URL or path of the image to load
   * @param asset - Optional resolved asset containing additional texture source options
   * @returns Promise that resolves to the loaded ImageBitmap
   * @example
   * ```typescript
   * const bitmap = await WorkerManager.loadImageBitmap('image.png');
   * const bitmapWithOptions = await WorkerManager.loadImageBitmap('image.png', asset);
   * ```
   */
  loadImageBitmap(t, e) {
    return this._run("loadImageBitmap", [t, e?.data?.alphaMode]);
  }
  /**
   * Initializes the worker pool if not already initialized.
   * Currently a no-op but reserved for future initialization logic.
   */
  async _initWorkers() {
    this._initialized || (this._initialized = !0);
  }
  /**
   * Gets an available worker from the pool or creates a new one if needed.
   *
   * Workers are created up to the MAX_WORKERS limit (based on navigator.hardwareConcurrency).
   * Each worker is configured with a message handler for processing results.
   * @returns Available worker or undefined if pool is at capacity and no workers are free
   */
  _getWorker() {
    Ms === void 0 && (Ms = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < Ms && (this._createdWorkers++, t = new $n().worker, t.addEventListener("message", (e) => {
      this._complete(e.data), this._returnWorker(e.target), this._next();
    })), t;
  }
  /**
   * Returns a worker to the pool after completing a task.
   * @param worker - The worker to return to the pool
   */
  _returnWorker(t) {
    this._workerPool.push(t);
  }
  /**
   * Handles completion of a worker task by resolving or rejecting the corresponding promise.
   * @param data - Result data from the worker containing uuid, data, and optional error
   */
  _complete(t) {
    this._resolveHash[t.uuid] && (t.error !== void 0 ? this._resolveHash[t.uuid].reject(t.error) : this._resolveHash[t.uuid].resolve(t.data), delete this._resolveHash[t.uuid]);
  }
  /**
   * Executes a task using the worker pool system.
   *
   * Queues the task and processes it when a worker becomes available.
   * @param id - Identifier for the type of task to run
   * @param args - Arguments to pass to the worker
   * @returns Promise that resolves with the worker's result
   */
  async _run(t, e) {
    await this._initWorkers();
    const i = new Promise((r, n) => {
      this._queue.push({ id: t, arguments: e, resolve: r, reject: n });
    });
    return this._next(), i;
  }
  /**
   * Processes the next item in the queue if workers are available.
   *
   * This method is called after worker initialization and when workers
   * complete tasks to continue processing the queue.
   */
  _next() {
    if (!this._queue.length)
      return;
    const t = this._getWorker();
    if (!t)
      return;
    const e = this._queue.pop(), i = e.id;
    this._resolveHash[Sr] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: Sr++,
      id: i
    });
  }
  /**
   * Resets the worker manager, terminating all workers and clearing the queue.
   *
   * This method:
   * - Terminates all active workers
   * - Rejects all pending promises with an error
   * - Clears all internal state
   * - Resets initialization flags
   *
   * This should be called when the worker manager is no longer needed
   * to prevent memory leaks and ensure proper cleanup.
   * @example
   * ```typescript
   * // Clean up when shutting down
   * WorkerManager.reset();
   * ```
   */
  reset() {
    this._workerPool.forEach((t) => t.terminate()), this._workerPool.length = 0, Object.values(this._resolveHash).forEach(({ reject: t }) => {
      t?.(new Error("WorkerManager has been reset before completion"));
    }), this._resolveHash = {}, this._queue.length = 0, this._initialized = !1, this._createdWorkers = 0;
  }
}
const Pr = new Vc(), Oc = [".jpeg", ".jpg", ".png", ".webp", ".avif"], Uc = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function Hc(s, t) {
  const e = await Q.get().fetch(s);
  if (!e.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${s}: ${e.status} ${e.statusText}`);
  const i = await e.blob();
  return t?.data?.alphaMode === "premultiplied-alpha" ? createImageBitmap(i, { premultiplyAlpha: "none" }) : createImageBitmap(i);
}
const ta = {
  /** used for deprecation purposes */
  name: "loadTextures",
  id: "texture",
  extension: {
    type: I.LoadParser,
    priority: vt.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(s) {
    return Ht(s, Uc) || jt(s, Oc);
  },
  async load(s, t, e) {
    let i = null;
    globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await Pr.isImageBitmapSupported() ? i = await Pr.loadImageBitmap(s, t) : i = await Hc(s, t) : i = await new Promise((n, a) => {
      i = Q.get().createImage(), i.crossOrigin = this.config.crossOrigin, i.src = s, i.complete ? n(i) : (i.onload = () => {
        n(i);
      }, i.onerror = a);
    });
    const r = new Gt({
      resource: i,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: t.data?.resolution || hi(s),
      ...t.data
    });
    return li(r, e, s);
  },
  unload(s) {
    s.destroy(!0);
  }
}, jc = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"];
let Is, Ts;
function qc(s, t, e) {
  e === void 0 && !t.startsWith("data:") ? s.crossOrigin = Zc(t) : e !== !1 && (s.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function Kc(s) {
  return new Promise((t, e) => {
    s.addEventListener("canplaythrough", i), s.addEventListener("error", r), s.load();
    function i() {
      n(), t();
    }
    function r(a) {
      n(), e(a);
    }
    function n() {
      s.removeEventListener("canplaythrough", i), s.removeEventListener("error", r);
    }
  });
}
function Zc(s, t = globalThis.location) {
  if (s.startsWith("data:"))
    return "";
  t || (t = globalThis.location);
  const e = new URL(s, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
function Jc() {
  const s = [], t = [];
  for (const e of jc) {
    const i = ue.MIME_TYPES[e.substring(1)] || `video/${e.substring(1)}`;
    ss(i) && (s.push(e), t.includes(i) || t.push(i));
  }
  return {
    validVideoExtensions: s,
    validVideoMime: t
  };
}
const _c = {
  /** used for deprecation purposes */
  name: "loadVideo",
  id: "video",
  extension: {
    type: I.LoadParser,
    name: "loadVideo"
  },
  test(s) {
    if (!Is || !Ts) {
      const { validVideoExtensions: i, validVideoMime: r } = Jc();
      Is = i, Ts = r;
    }
    const t = Ht(s, Ts), e = jt(s, Is);
    return t || e;
  },
  async load(s, t, e) {
    const i = {
      ...ue.defaultOptions,
      resolution: t.data?.resolution || hi(s),
      alphaMode: t.data?.alphaMode || await rn(),
      ...t.data
    }, r = document.createElement("video"), n = {
      preload: i.autoLoad !== !1 ? "auto" : void 0,
      "webkit-playsinline": i.playsinline !== !1 ? "" : void 0,
      playsinline: i.playsinline !== !1 ? "" : void 0,
      muted: i.muted === !0 ? "" : void 0,
      loop: i.loop === !0 ? "" : void 0,
      autoplay: i.autoPlay !== !1 ? "" : void 0
    };
    Object.keys(n).forEach((h) => {
      const l = n[h];
      l !== void 0 && r.setAttribute(h, l);
    }), i.muted === !0 && (r.muted = !0), qc(r, s, i.crossorigin);
    const a = document.createElement("source");
    let o;
    if (i.mime)
      o = i.mime;
    else if (s.startsWith("data:"))
      o = s.slice(5, s.indexOf(";"));
    else if (!s.startsWith("blob:")) {
      const h = s.split("?")[0].slice(s.lastIndexOf(".") + 1).toLowerCase();
      o = ue.MIME_TYPES[h] || `video/${h}`;
    }
    return a.src = s, o && (a.type = o), new Promise((h) => {
      const l = async () => {
        const c = new ue({ ...i, resource: r });
        r.removeEventListener("canplay", l), t.data.preload && await Kc(r), h(li(c, e, s));
      };
      i.preload && !i.autoPlay && r.load(), r.addEventListener("canplay", l), r.appendChild(a);
    });
  },
  unload(s) {
    s.destroy(!0);
  }
}, ea = {
  extension: {
    type: I.ResolveParser,
    name: "resolveTexture"
  },
  test: ta.test,
  parse: (s) => ({
    resolution: parseFloat(Ut.RETINA_PREFIX.exec(s)?.[1] ?? "1"),
    format: s.split(".").pop(),
    src: s
  })
}, $c = {
  extension: {
    type: I.ResolveParser,
    priority: -2,
    name: "resolveJson"
  },
  test: (s) => Ut.RETINA_PREFIX.test(s) && s.endsWith(".json"),
  parse: ea.parse
};
class tu {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Ut(), this.loader = new wc(), this.cache = L, this._backgroundLoader = new dc(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Initializes the Assets class with configuration options. While not required,
   * calling this before loading assets is recommended to set up default behaviors.
   * @param options - Configuration options for the Assets system
   * @example
   * ```ts
   * // Basic initialization (optional as Assets.load will call this automatically)
   * await Assets.init();
   *
   * // With CDN configuration
   * await Assets.init({
   *     basePath: 'https://my-cdn.com/assets/',
   *     defaultSearchParams: { version: '1.0.0' }
   * });
   *
   * // With manifest and preferences
   * await Assets.init({
   *     manifest: {
   *         bundles: [{
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'hero',
   *                     src: 'hero.{png,webp}',
   *                     data: { scaleMode: SCALE_MODES.NEAREST }
   *                 },
   *                 {
   *                     alias: 'map',
   *                     src: 'map.json'
   *                 }
   *             ]
   *         }]
   *     },
   *     // Optimize for device capabilities
   *     texturePreference: {
   *         resolution: window.devicePixelRatio,
   *         format: ['webp', 'png']
   *     },
   *     // Set global preferences
   *     preferences: {
   *         crossOrigin: 'anonymous',
   *     }
   * });
   *
   * // Load assets after initialization
   * const heroTexture = await Assets.load('hero');
   * ```
   * @remarks
   * - Can be called only once; subsequent calls will be ignored with a warning
   * - Format detection runs automatically unless `skipDetections` is true
   * - The manifest can be a URL to a JSON file or an inline object
   * @see {@link AssetInitOptions} For all available initialization options
   * @see {@link AssetsManifest} For manifest format details
   */
  async init(t = {}) {
    if (this._initialized) {
      Y("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let n = t.manifest;
      typeof n == "string" && (n = await this.load(n)), this.resolver.addManifest(n);
    }
    const e = t.texturePreference?.resolution ?? 1, i = typeof e == "number" ? [e] : e, r = await this._detectFormats({
      preferredFormats: t.texturePreference?.format,
      skipDetections: t.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: r,
        resolution: i
      }
    }), t.preferences && this.setPreferences(t.preferences), t.loadOptions && (this.loader.loadOptions = {
      ...this.loader.loadOptions,
      ...t.loadOptions
    });
  }
  /**
   * Registers assets with the Assets resolver. This method maps keys (aliases) to asset sources,
   * allowing you to load assets using friendly names instead of direct URLs.
   * @param assets - The unresolved assets to add to the resolver
   * @example
   * ```ts
   * // Basic usage - single asset
   * Assets.add({
   *     alias: 'myTexture',
   *     src: 'assets/texture.png'
   * });
   * const texture = await Assets.load('myTexture');
   *
   * // Multiple aliases for the same asset
   * Assets.add({
   *     alias: ['hero', 'player'],
   *     src: 'hero.png'
   * });
   * const hero1 = await Assets.load('hero');
   * const hero2 = await Assets.load('player'); // Same texture
   *
   * // Multiple format support
   * Assets.add({
   *     alias: 'character',
   *     src: 'character.{webp,png}' // Will choose best format
   * });
   * Assets.add({
   *     alias: 'character',
   *     src: ['character.webp', 'character.png'], // Explicitly specify formats
   * });
   *
   * // With texture options
   * Assets.add({
   *     alias: 'sprite',
   *     src: 'sprite.png',
   *     data: { scaleMode: 'nearest' }
   * });
   *
   * // Multiple assets at once
   * Assets.add([
   *     { alias: 'bg', src: 'background.png' },
   *     { alias: 'music', src: 'music.mp3' },
   *     { alias: 'spritesheet', src: 'sheet.json', data: { ignoreMultiPack: false } }
   * ]);
   * ```
   * @remarks
   * - Assets are resolved when loaded, not when added
   * - Multiple formats use the best available format for the browser
   * - Adding with same alias overwrites previous definition
   * - The `data` property is passed to the asset loader
   * @see {@link Resolver} For details on asset resolution
   * @see {@link LoaderParser} For asset-specific data options
   * @advanced
   */
  add(t) {
    this.resolver.add(t);
  }
  async load(t, e) {
    this._initialized || await this.init();
    const i = He(t), r = ht(t).map((o) => {
      if (typeof o != "string") {
        const h = this.resolver.getAlias(o);
        return h.some((l) => !this.resolver.hasKey(l)) && this.add(o), Array.isArray(h) ? h[0] : h;
      }
      return this.resolver.hasKey(o) || this.add({ alias: o, src: o }), o;
    }), n = this.resolver.resolve(r), a = await this._mapLoadToResolve(n, e);
    return i ? a[r[0]] : a;
  }
  /**
   * Registers a bundle of assets that can be loaded as a group. Bundles are useful for organizing
   * assets into logical groups, such as game levels or UI screens.
   * @param bundleId - Unique identifier for the bundle
   * @param assets - Assets to include in the bundle
   * @example
   * ```ts
   * // Add a bundle using array format
   * Assets.addBundle('animals', [
   *     { alias: 'bunny', src: 'bunny.png' },
   *     { alias: 'chicken', src: 'chicken.png' },
   *     { alias: 'thumper', src: 'thumper.png' },
   * ]);
   *
   * // Add a bundle using object format
   * Assets.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * // Add a bundle with advanced options
   * Assets.addBundle('ui', [
   *     {
   *         alias: 'button',
   *         src: 'button.{webp,png}',
   *         data: { scaleMode: 'nearest' }
   *     },
   *     {
   *         alias: ['logo', 'brand'],  // Multiple aliases
   *         src: 'logo.svg',
   *         data: { resolution: 2 }
   *     }
   * ]);
   *
   * // Load the bundle
   * await Assets.loadBundle('animals');
   *
   * // Use the loaded assets
   * const bunny = Sprite.from('bunny');
   * const chicken = Sprite.from('chicken');
   * ```
   * @remarks
   * - Bundle IDs must be unique
   * - Assets in bundles are not loaded until `loadBundle` is called
   * - Bundles can be background loaded using `backgroundLoadBundle`
   * - Assets in bundles can be loaded individually using their aliases
   * @see {@link Assets.loadBundle} For loading bundles
   * @see {@link Assets.backgroundLoadBundle} For background loading bundles
   * @see {@link Assets.unloadBundle} For unloading bundles
   * @see {@link AssetsManifest} For manifest format details
   */
  addBundle(t, e) {
    this.resolver.addBundle(t, e);
  }
  /**
   * Loads a bundle or multiple bundles of assets. Bundles are collections of related assets
   * that can be loaded together.
   * @param bundleIds - Single bundle ID or array of bundle IDs to load
   * @param onProgress - Optional callback for load progress (0.0 to 1.0)
   * @returns Promise that resolves with the loaded bundle assets
   * @example
   * ```ts
   * // Define bundles in your manifest
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}', // use an array of individual assets
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * // Initialize with manifest
   * await Assets.init({ manifest });
   *
   * // Or add bundles programmatically
   * Assets.addBundle('load-screen', [...]);
   * Assets.loadBundle('load-screen');
   *
   * // Load a single bundle
   * await Assets.loadBundle('load-screen');
   * const bg = Sprite.from('background'); // Uses alias from bundle
   *
   * // Load multiple bundles
   * await Assets.loadBundle([
   *     'load-screen',
   *     'game-screen'
   * ]);
   *
   * // Load with progress tracking
   * await Assets.loadBundle('game-screen', (progress) => {
   *     console.log(`Loading: ${Math.round(progress * 100)}%`);
   * });
   * ```
   * @remarks
   * - Bundle assets are cached automatically
   * - Bundles can be pre-loaded using `backgroundLoadBundle`
   * - Assets in bundles can be accessed by their aliases
   * - Progress callback receives values from 0.0 to 1.0
   * @throws {Error} If the bundle ID doesn't exist in the manifest
   * @see {@link Assets.addBundle} For adding bundles programmatically
   * @see {@link Assets.backgroundLoadBundle} For background loading bundles
   * @see {@link Assets.unloadBundle} For unloading bundles
   * @see {@link AssetsManifest} For manifest format details
   */
  async loadBundle(t, e) {
    this._initialized || await this.init();
    let i = !1;
    typeof t == "string" && (i = !0, t = [t]);
    const r = this.resolver.resolveBundle(t), n = {}, a = Object.keys(r);
    let o = 0;
    const h = [], l = () => {
      e?.(h.reduce((u, f) => u + f, 0) / o);
    }, c = a.map((u, f) => {
      const d = r[u], p = Object.values(d), g = [...new Set(p.flat())].reduce((A, x) => A + (x.progressSize || 1), 0);
      return h.push(0), o += g, this._mapLoadToResolve(d, (A) => {
        h[f] = A * g, l();
      }).then((A) => {
        n[u] = A;
      });
    });
    return await Promise.all(c), i ? n[t[0]] : n;
  }
  /**
   * Initiates background loading of assets. This allows assets to be loaded passively while other operations
   * continue, making them instantly available when needed later.
   *
   * Background loading is useful for:
   * - Preloading game levels while in a menu
   * - Loading non-critical assets during gameplay
   * - Reducing visible loading screens
   * @param urls - Single URL/alias or array of URLs/aliases to load in the background
   * @example
   * ```ts
   * // Basic background loading
   * Assets.backgroundLoad('images/level2-assets.png');
   *
   * // Background load multiple assets
   * Assets.backgroundLoad([
   *     'images/sprite1.png',
   *     'images/sprite2.png',
   *     'images/background.png'
   * ]);
   *
   * // Later, when you need the assets
   * const textures = await Assets.load([
   *     'images/sprite1.png',
   *     'images/sprite2.png'
   * ]); // Resolves immediately if background loading completed
   * ```
   * @remarks
   * - Background loading happens one asset at a time to avoid blocking the main thread
   * - Loading can be interrupted safely by calling `Assets.load()`
   * - Assets are cached as they complete loading
   * - No progress tracking is available for background loading
   */
  async backgroundLoad(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolve(t);
    this._backgroundLoader.add(Object.values(e));
  }
  /**
   * Initiates background loading of asset bundles. Similar to backgroundLoad but works with
   * predefined bundles of assets.
   *
   * Perfect for:
   * - Preloading level bundles during gameplay
   * - Loading UI assets during splash screens
   * - Preparing assets for upcoming game states
   * @param bundleIds - Single bundle ID or array of bundle IDs to load in the background
   * @example
   * ```ts
   * // Define bundles in your manifest
   * await Assets.init({
   *     manifest: {
   *         bundles: [
   *             {
   *               name: 'home',
   *               assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'images/home-bg.png',
   *                 },
   *                 {
   *                     alias: 'logo',
   *                     src: 'images/logo.png',
   *                 }
   *              ]
   *            },
   *            {
   *             name: 'level-1',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'images/level1/bg.png',
   *                 },
   *                 {
   *                     alias: 'sprites',
   *                     src: 'images/level1/sprites.json'
   *                 }
   *             ]
   *         }]
   *     }
   * });
   *
   * // Load the home screen assets right away
   * await Assets.loadBundle('home');
   * showHomeScreen();
   *
   * // Start background loading while showing home screen
   * Assets.backgroundLoadBundle('level-1');
   *
   * // When player starts level, load completes faster
   * await Assets.loadBundle('level-1');
   * hideHomeScreen();
   * startLevel();
   * ```
   * @remarks
   * - Bundle assets are loaded one at a time
   * - Loading can be interrupted safely by calling `Assets.loadBundle()`
   * - Assets are cached as they complete loading
   * - Requires bundles to be registered via manifest or `addBundle`
   * @see {@link Assets.addBundle} For adding bundles programmatically
   * @see {@link Assets.loadBundle} For immediate bundle loading
   * @see {@link AssetsManifest} For manifest format details
   */
  async backgroundLoadBundle(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolveBundle(t);
    Object.values(e).forEach((i) => {
      this._backgroundLoader.add(Object.values(i));
    });
  }
  /**
   * Only intended for development purposes.
   * This will wipe the resolver and caches.
   * You will need to reinitialize the Asset
   * @internal
   */
  reset() {
    this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1;
  }
  get(t) {
    if (typeof t == "string")
      return L.get(t);
    const e = {};
    for (let i = 0; i < t.length; i++)
      e[i] = L.get(t[i]);
    return e;
  }
  /**
   * helper function to map resolved assets back to loaded assets
   * @param resolveResults - the resolve results from the resolver
   * @param progressOrLoadOptions - the progress callback or load options
   */
  async _mapLoadToResolve(t, e) {
    const i = [...new Set(Object.values(t))];
    this._backgroundLoader.active = !1;
    const r = await this.loader.load(i, e);
    this._backgroundLoader.active = !0;
    const n = {};
    return i.forEach((a) => {
      const o = r[a.src], h = [a.src];
      a.alias && h.push(...a.alias), h.forEach((l) => {
        n[l] = o;
      }), L.set(h, o);
    }), n;
  }
  /**
   * Unloads assets and releases them from memory. This method ensures proper cleanup of
   * loaded assets when they're no longer needed.
   * @param urls - Single URL/alias or array of URLs/aliases to unload
   * @example
   * ```ts
   * // Unload a single asset
   * await Assets.unload('images/sprite.png');
   *
   * // Unload using an alias
   * await Assets.unload('hero'); // Unloads the asset registered with 'hero' alias
   *
   * // Unload multiple assets
   * await Assets.unload([
   *     'images/background.png',
   *     'images/character.png',
   *     'hero'
   * ]);
   *
   * // Unload and handle creation of new instances
   * await Assets.unload('hero');
   * const newHero = await Assets.load('hero'); // Will load fresh from source
   * ```
   * @remarks
   * > [!WARNING]
   * > Make sure assets aren't being used before unloading:
   * > - Remove sprites using the texture
   * > - Clear any references to the asset
   * > - Textures will be destroyed and can't be used after unloading
   * @throws {Error} If the asset is not found in cache
   */
  async unload(t) {
    this._initialized || await this.init();
    const e = ht(t).map((r) => typeof r != "string" ? r.src : r), i = this.resolver.resolve(e);
    await this._unloadFromResolved(i);
  }
  /**
   * Unloads all assets in a bundle. Use this to free memory when a bundle's assets
   * are no longer needed, such as when switching game levels.
   * @param bundleIds - Single bundle ID or array of bundle IDs to unload
   * @example
   * ```ts
   * // Define and load a bundle
   * Assets.addBundle('level-1', {
   *     background: 'level1/bg.png',
   *     sprites: 'level1/sprites.json',
   *     music: 'level1/music.mp3'
   * });
   *
   * // Load the bundle
   * const level1 = await Assets.loadBundle('level-1');
   *
   * // Use the assets
   * const background = Sprite.from(level1.background);
   *
   * // When done with the level, unload everything
   * await Assets.unloadBundle('level-1');
   * // background sprite is now invalid!
   *
   * // Unload multiple bundles
   * await Assets.unloadBundle([
   *     'level-1',
   *     'level-2',
   *     'ui-elements'
   * ]);
   * ```
   * @remarks
   * > [!WARNING]
   * > - All assets in the bundle will be destroyed
   * > - Bundle needs to be reloaded to use assets again
   * > - Make sure no sprites or other objects are using the assets
   * @throws {Error} If the bundle is not found
   * @see {@link Assets.addBundle} For adding bundles
   * @see {@link Assets.loadBundle} For loading bundles
   */
  async unloadBundle(t) {
    this._initialized || await this.init(), t = ht(t);
    const e = this.resolver.resolveBundle(t), i = Object.keys(e).map((r) => this._unloadFromResolved(e[r]));
    await Promise.all(i);
  }
  async _unloadFromResolved(t) {
    const e = Object.values(t);
    e.forEach((i) => {
      L.remove(i.src);
    }), await this.loader.unload(e);
  }
  /**
   * Detects the supported formats for the browser, and returns an array of supported formats, respecting
   * the users preferred formats order.
   * @param options - the options to use when detecting formats
   * @param options.preferredFormats - the preferred formats to use
   * @param options.skipDetections - if we should skip the detections altogether
   * @param options.detections - the detections to use
   * @returns - the detected formats
   */
  async _detectFormats(t) {
    let e = [];
    t.preferredFormats && (e = Array.isArray(t.preferredFormats) ? t.preferredFormats : [t.preferredFormats]);
    for (const i of t.detections)
      t.skipDetections || await i.test() ? e = await i.add(e) : t.skipDetections || (e = await i.remove(e));
    return e = e.filter((i, r) => e.indexOf(i) === r), e;
  }
  /**
   * All the detection parsers currently added to the Assets class.
   * @advanced
   */
  get detections() {
    return this._detections;
  }
  /**
   * Sets global preferences for asset loading behavior. This method configures how assets
   * are loaded and processed across all parsers.
   * @param preferences - Asset loading preferences
   * @example
   * ```ts
   * // Basic preferences
   * Assets.setPreferences({
   *     crossOrigin: 'anonymous',
   *     parseAsGraphicsContext: false
   * });
   * ```
   * @remarks
   * Preferences are applied to all compatible parsers and affect future asset loading.
   * Common preferences include:
   * - `crossOrigin`: CORS setting for loaded assets
   * - `preferWorkers`: Whether to use web workers for loading textures
   * - `preferCreateImageBitmap`: Use `createImageBitmap` for texture creation. Turning this off will use the `Image` constructor instead.
   * @see {@link AssetsPreferences} For all available preferences
   */
  setPreferences(t) {
    this.loader.parsers.forEach((e) => {
      e.config && Object.keys(e.config).filter((i) => i in t).forEach((i) => {
        e.config[i] = t[i];
      });
    });
  }
}
const Rt = new tu();
_.handleByList(I.LoadParser, Rt.loader.parsers).handleByList(I.ResolveParser, Rt.resolver.parsers).handleByList(I.CacheParser, Rt.cache.parsers).handleByList(I.DetectionParser, Rt.detections);
_.add(
  fc,
  pc,
  gc,
  bc,
  Ac,
  xc,
  yc,
  Bc,
  Mc,
  Gc,
  Lc,
  ta,
  _c,
  uc,
  cc,
  ea,
  $c
);
const Mr = {
  loader: I.LoadParser,
  resolver: I.ResolveParser,
  cache: I.CacheParser,
  detection: I.DetectionParser
};
_.handle(I.Asset, (s) => {
  const t = s.ref;
  Object.entries(Mr).filter(([e]) => !!t[e]).forEach(([e, i]) => _.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? i }
  )));
}, (s) => {
  const t = s.ref;
  Object.keys(Mr).filter((e) => !!t[e]).forEach((e) => _.remove(t[e]));
});
class Ze extends qr {
  /**
   * Creates a new Graphics object.
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof rt && (t = { context: t });
    const { context: e, roundPixels: i, ...r } = t || {};
    super({
      label: "Graphics",
      ...r
    }), this.renderPipeId = "graphics", e ? this.context = e : (this.context = this._ownedContext = new rt(), this.context.autoGarbageCollect = this.autoGarbageCollect), this.didViewUpdate = !0, this.allowChildren = !1, this.roundPixels = i ?? !1;
  }
  set context(t) {
    t !== this._context && (this._context && (this._context.off("update", this.onViewUpdate, this), this._context.off("unload", this.unload, this)), this._context = t, this._context.on("update", this.onViewUpdate, this), this._context.on("unload", this.unload, this), this.onViewUpdate());
  }
  /**
   * The underlying graphics context used for drawing operations.
   * Controls how shapes and paths are rendered.
   * @example
   * ```ts
   * // Create a shared context
   * const sharedContext = new GraphicsContext();
   *
   * // Create graphics objects sharing the same context
   * const graphics1 = new Graphics();
   * const graphics2 = new Graphics();
   *
   * // Assign shared context
   * graphics1.context = sharedContext;
   * graphics2.context = sharedContext;
   *
   * // Both graphics will show the same shapes
   * sharedContext
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   * ```
   * @see {@link GraphicsContext} For drawing operations
   * @see {@link GraphicsOptions} For context configuration
   */
  get context() {
    return this._context;
  }
  /**
   * The local bounds of the graphics object.
   * Returns the boundaries after all graphical operations but before any transforms.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw a shape
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   *
   * // Get bounds information
   * const bounds = graphics.bounds;
   * console.log(bounds.width);  // 100
   * console.log(bounds.height); // 100
   * ```
   * @readonly
   * @see {@link Bounds} For bounds operations
   * @see {@link Container#getBounds} For transformed bounds
   */
  get bounds() {
    return this._context.bounds;
  }
  /**
   * Graphics objects do not need to update their bounds as the context handles this.
   * @private
   */
  updateBounds() {
  }
  /**
   * Checks if the object contains the given point.
   * Returns true if the point lies within the Graphics object's rendered area.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw a shape
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   *
   * // Check point intersection
   * if (graphics.containsPoint({ x: 50, y: 50 })) {
   *     console.log('Point is inside rectangle!');
   * }
   * ```
   * @param point - The point to check in local coordinates
   * @returns True if the point is inside the Graphics object
   * @see {@link Graphics#bounds} For bounding box checks
   * @see {@link PointData} For point data structure
   */
  containsPoint(t) {
    return this._context.containsPoint(t);
  }
  /**
   * Destroys this graphics renderable and optionally its context.
   * @param options - Options parameter. A boolean will act as if all options
   *
   * If the context was created by this graphics and `destroy(false)` or `destroy()` is called
   * then the context will still be destroyed.
   *
   * If you want to explicitly not destroy this context that this graphics created,
   * then you should pass destroy({ context: false })
   *
   * If the context was passed in as an argument to the constructor then it will not be destroyed
   * @example
   * ```ts
   * // Destroy the graphics and its context
   * graphics.destroy();
   * graphics.destroy(true);
   * graphics.destroy({ context: true, texture: true, textureSource: true });
   * ```
   */
  destroy(t) {
    this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === !0 || t?.context === !0) && this._context.destroy(t), this._ownedContext = null, this._context = null, super.destroy(t);
  }
  /**
   * @param now - The current time in milliseconds.
   * @internal
   */
  _onTouch(t) {
    this._gcLastUsed = t, this._context._gcLastUsed = t;
  }
  _callContextMethod(t, e) {
    return this.context[t](...e), this;
  }
  // --------------------------------------- GraphicsContext methods ---------------------------------------
  /**
   * Sets the current fill style of the graphics context.
   * The fill style can be a color, gradient, pattern, or a complex style object.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color fill
   * graphics
   *     .setFillStyle({ color: 0xff0000 }) // Red fill
   *     .rect(0, 0, 100, 100)
   *     .fill();
   *
   * // Gradient fill
   * const gradient = new FillGradient({
   *    end: { x: 1, y: 0 },
   *    colorStops: [
   *         { offset: 0, color: 0xff0000 }, // Red at start
   *         { offset: 0.5, color: 0x00ff00 }, // Green at middle
   *         { offset: 1, color: 0x0000ff }, // Blue at end
   *    ],
   * });
   *
   * graphics
   *     .setFillStyle(gradient)
   *     .circle(100, 100, 50)
   *     .fill();
   *
   * // Pattern fill
   * const pattern = new FillPattern(texture);
   * graphics
   *     .setFillStyle({
   *         fill: pattern,
   *         alpha: 0.5
   *     })
   *     .rect(0, 0, 200, 200)
   *     .fill();
   * ```
   * @param {FillInput} args - The fill style to apply
   * @returns The Graphics instance for chaining
   * @see {@link FillStyle} For fill style options
   * @see {@link FillGradient} For gradient fills
   * @see {@link FillPattern} For pattern fills
   */
  setFillStyle(...t) {
    return this._callContextMethod("setFillStyle", t);
  }
  /**
   * Sets the current stroke style of the graphics context.
   * Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color stroke
   * graphics
   *     .setStrokeStyle({
   *         width: 2,
   *         color: 0x000000
   *     })
   *     .rect(0, 0, 100, 100)
   *     .stroke();
   *
   * // Complex stroke style
   * graphics
   *     .setStrokeStyle({
   *         width: 4,
   *         color: 0xff0000,
   *         alpha: 0.5,
   *         join: 'round',
   *         cap: 'round',
   *         alignment: 0.5
   *     })
   *     .circle(100, 100, 50)
   *     .stroke();
   *
   * // Gradient stroke
   * const gradient = new FillGradient({
   *    end: { x: 1, y: 0 },
   *    colorStops: [
   *         { offset: 0, color: 0xff0000 }, // Red at start
   *         { offset: 0.5, color: 0x00ff00 }, // Green at middle
   *         { offset: 1, color: 0x0000ff }, // Blue at end
   *    ],
   * });
   *
   * graphics
   *     .setStrokeStyle({
   *         width: 10,
   *         fill: gradient
   *     })
   *     .poly([0,0, 100,50, 0,100])
   *     .stroke();
   * ```
   * @param {StrokeInput} args - The stroke style to apply
   * @returns The Graphics instance for chaining
   * @see {@link StrokeStyle} For stroke style options
   * @see {@link FillGradient} For gradient strokes
   * @see {@link FillPattern} For pattern strokes
   */
  setStrokeStyle(...t) {
    return this._callContextMethod("setStrokeStyle", t);
  }
  fill(...t) {
    return this._callContextMethod("fill", t);
  }
  /**
   * Strokes the current path with the current stroke style or specified style.
   * Outlines the shape using the stroke settings.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Stroke with direct color
   * graphics
   *     .circle(50, 50, 25)
   *     .stroke({
   *         width: 2,
   *         color: 0xff0000
   *     }); // 2px red stroke
   *
   * // Fill with texture
   * graphics
   *    .rect(0, 0, 100, 100)
   *    .stroke(myTexture); // Fill with texture
   *
   * // Stroke with gradient
   * const gradient = new FillGradient({
   *     end: { x: 1, y: 0 },
   *     colorStops: [
   *         { offset: 0, color: 0xff0000 },
   *         { offset: 0.5, color: 0x00ff00 },
   *         { offset: 1, color: 0x0000ff },
   *     ],
   * });
   *
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .stroke({
   *         width: 4,
   *         fill: gradient,
   *         alignment: 0.5,
   *         join: 'round'
   *     });
   * ```
   * @param {StrokeStyle} args - Optional stroke style to apply. Can be:
   * - A stroke style object with width, color, etc.
   * - A gradient
   * - A pattern
   * If omitted, uses current stroke style.
   * @returns The Graphics instance for chaining
   * @see {@link StrokeStyle} For stroke style options
   * @see {@link FillGradient} For gradient strokes
   * @see {@link setStrokeStyle} For setting default stroke style
   */
  stroke(...t) {
    return this._callContextMethod("stroke", t);
  }
  texture(...t) {
    return this._callContextMethod("texture", t);
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @example
   * ```ts
   * const graphics = new Graphics();
   * graphics
   *     .circle(150, 150, 50)
   *     .fill({ color: 0x00ff00 })
   *     .beginPath() // Starts a new path
   *     .circle(250, 150, 50)
   *     .fill({ color: 0x0000ff });
   * ```
   * @returns The Graphics instance for chaining
   * @see {@link Graphics#moveTo} For starting a new subpath
   * @see {@link Graphics#closePath} For closing the current path
   */
  beginPath() {
    return this._callContextMethod("beginPath", []);
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path.
   *
   * If a hole is not completely in a shape, it will fail to cut correctly.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw outer circle
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 });
   *     .circle(100, 100, 25) // Inner circle
   *     .cut() // Cuts out the inner circle from the outer circle
   * ```
   */
  cut() {
    return this._callContextMethod("cut", []);
  }
  arc(...t) {
    return this._callContextMethod("arc", t);
  }
  arcTo(...t) {
    return this._callContextMethod("arcTo", t);
  }
  arcToSvg(...t) {
    return this._callContextMethod("arcToSvg", t);
  }
  bezierCurveTo(...t) {
    return this._callContextMethod("bezierCurveTo", t);
  }
  /**
   * Closes the current path by drawing a straight line back to the start point.
   *
   * This is useful for completing shapes and ensuring they are properly closed for fills.
   * @example
   * ```ts
   * // Create a triangle with closed path
   * const graphics = new Graphics();
   * graphics
   *     .moveTo(50, 50)
   *     .lineTo(100, 100)
   *     .lineTo(0, 100)
   *     .closePath()
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#beginPath} For starting a new path
   * @see {@link Graphics#fill} For filling closed paths
   * @see {@link Graphics#stroke} For stroking paths
   */
  closePath() {
    return this._callContextMethod("closePath", []);
  }
  ellipse(...t) {
    return this._callContextMethod("ellipse", t);
  }
  circle(...t) {
    return this._callContextMethod("circle", t);
  }
  path(...t) {
    return this._callContextMethod("path", t);
  }
  lineTo(...t) {
    return this._callContextMethod("lineTo", t);
  }
  moveTo(...t) {
    return this._callContextMethod("moveTo", t);
  }
  quadraticCurveTo(...t) {
    return this._callContextMethod("quadraticCurveTo", t);
  }
  rect(...t) {
    return this._callContextMethod("rect", t);
  }
  roundRect(...t) {
    return this._callContextMethod("roundRect", t);
  }
  poly(...t) {
    return this._callContextMethod("poly", t);
  }
  regularPoly(...t) {
    return this._callContextMethod("regularPoly", t);
  }
  roundPoly(...t) {
    return this._callContextMethod("roundPoly", t);
  }
  roundShape(...t) {
    return this._callContextMethod("roundShape", t);
  }
  filletRect(...t) {
    return this._callContextMethod("filletRect", t);
  }
  chamferRect(...t) {
    return this._callContextMethod("chamferRect", t);
  }
  star(...t) {
    return this._callContextMethod("star", t);
  }
  svg(...t) {
    return this._callContextMethod("svg", t);
  }
  restore(...t) {
    return this._callContextMethod("restore", t);
  }
  /**
   * Saves the current graphics state onto a stack. The state includes:
   * - Current transformation matrix
   * - Current fill style
   * - Current stroke style
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Save state before complex operations
   * graphics.save();
   *
   * // Create transformed and styled shape
   * graphics
   *     .translateTransform(100, 100)
   *     .rotateTransform(Math.PI / 4)
   *     .setFillStyle({
   *         color: 0xff0000,
   *         alpha: 0.5
   *     })
   *     .rect(-25, -25, 50, 50)
   *     .fill();
   *
   * // Restore to original state
   * graphics.restore();
   *
   * // Continue drawing with previous state
   * graphics
   *     .circle(50, 50, 25)
   *     .fill();
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#restore} For restoring the saved state
   * @see {@link Graphics#setTransform} For setting transformations
   */
  save() {
    return this._callContextMethod("save", []);
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * This matrix represents all accumulated transformations including translate, scale, and rotate.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Apply some transformations
   * graphics
   *     .translateTransform(100, 100)
   *     .rotateTransform(Math.PI / 4);
   *
   * // Get the current transform matrix
   * const matrix = graphics.getTransform();
   * console.log(matrix.tx, matrix.ty); // 100, 100
   *
   * // Use the matrix for other operations
   * graphics
   *     .setTransform(matrix)
   *     .circle(0, 0, 50)
   *     .fill({ color: 0xff0000 });
   * ```
   * @returns The current transformation matrix.
   * @see {@link Graphics#setTransform} For setting the transform matrix
   * @see {@link Matrix} For matrix operations
   */
  getTransform() {
    return this.context.getTransform();
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing
   * any transformations (rotation, scaling, translation) previously applied.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Apply transformations
   * graphics
   *     .translateTransform(100, 100)
   *     .scaleTransform(2, 2)
   *     .circle(0, 0, 25)
   *     .fill({ color: 0xff0000 });
   * // Reset transform to default state
   * graphics
   *     .resetTransform()
   *     .circle(50, 50, 25) // Will draw at actual coordinates
   *     .fill({ color: 0x00ff00 });
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#getTransform} For getting the current transform
   * @see {@link Graphics#setTransform} For setting a specific transform
   * @see {@link Graphics#save} For saving the current transform state
   * @see {@link Graphics#restore} For restoring a previous transform state
   */
  resetTransform() {
    return this._callContextMethod("resetTransform", []);
  }
  rotateTransform(...t) {
    return this._callContextMethod("rotate", t);
  }
  scaleTransform(...t) {
    return this._callContextMethod("scale", t);
  }
  setTransform(...t) {
    return this._callContextMethod("setTransform", t);
  }
  transform(...t) {
    return this._callContextMethod("transform", t);
  }
  translateTransform(...t) {
    return this._callContextMethod("translate", t);
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it.
   * This includes clearing the current path, fill style, stroke style, and transformations.
   *
   * > [!NOTE] Graphics objects are not designed to be continuously cleared and redrawn.
   * > Instead, they are intended to be used for static or semi-static graphics that
   * > can be redrawn as needed. Frequent clearing and redrawing may lead to performance issues.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw some shapes
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 })
   *     .rect(200, 100, 100, 50)
   *     .fill({ color: 0x00ff00 });
   *
   * // Clear all graphics
   * graphics.clear();
   *
   * // Start fresh with new shapes
   * graphics
   *     .circle(150, 150, 30)
   *     .fill({ color: 0x0000ff });
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#beginPath} For starting a new path without clearing styles
   * @see {@link Graphics#save} For saving the current state
   * @see {@link Graphics#restore} For restoring a previous state
   */
  clear() {
    return this._callContextMethod("clear", []);
  }
  /**
   * Gets or sets the current fill style for the graphics context. The fill style determines
   * how shapes are filled when using the fill() method.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color fill
   * graphics.fillStyle = {
   *     color: 0xff0000,  // Red
   *     alpha: 1
   * };
   *
   * // Using gradients
   * const gradient = new FillGradient({
   *     end: { x: 0, y: 1 }, // Vertical gradient
   *     stops: [
   *         { offset: 0, color: 0xff0000, alpha: 1 }, // Start color
   *         { offset: 1, color: 0x0000ff, alpha: 1 }  // End color
   *     ]
   * });
   *
   * graphics.fillStyle = {
   *     fill: gradient,
   *     alpha: 0.8
   * };
   *
   * // Using patterns
   * graphics.fillStyle = {
   *     texture: myTexture,
   *     alpha: 1,
   *     matrix: new Matrix()
   *         .scale(0.5, 0.5)
   *         .rotate(Math.PI / 4)
   * };
   * ```
   * @type {ConvertedFillStyle}
   * @see {@link FillStyle} For all available fill style options
   * @see {@link FillGradient} For creating gradient fills
   * @see {@link Graphics#fill} For applying the fill to paths
   */
  get fillStyle() {
    return this._context.fillStyle;
  }
  set fillStyle(t) {
    this._context.fillStyle = t;
  }
  /**
   * Gets or sets the current stroke style for the graphics context. The stroke style determines
   * how paths are outlined when using the stroke() method.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic stroke style
   * graphics.strokeStyle = {
   *     width: 2,
   *     color: 0xff0000,
   *     alpha: 1
   * };
   *
   * // Using with gradients
   * const gradient = new FillGradient({
   *   end: { x: 0, y: 1 },
   *   stops: [
   *       { offset: 0, color: 0xff0000, alpha: 1 },
   *       { offset: 1, color: 0x0000ff, alpha: 1 }
   *   ]
   * });
   *
   * graphics.strokeStyle = {
   *     width: 4,
   *     fill: gradient,
   *     alignment: 0.5,
   *     join: 'round',
   *     cap: 'round'
   * };
   *
   * // Complex stroke settings
   * graphics.strokeStyle = {
   *     width: 6,
   *     color: 0x00ff00,
   *     alpha: 0.5,
   *     join: 'miter',
   *     miterLimit: 10,
   * };
   * ```
   * @see {@link StrokeStyle} For all available stroke style options
   * @see {@link Graphics#stroke} For applying the stroke to paths
   */
  get strokeStyle() {
    return this._context.strokeStyle;
  }
  set strokeStyle(t) {
    this._context.strokeStyle = t;
  }
  /**
   * Creates a new Graphics object that copies the current graphics content.
   * The clone can either share the same context (shallow clone) or have its own independent
   * context (deep clone).
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Create original graphics content
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 });
   *
   * // Create a shallow clone (shared context)
   * const shallowClone = graphics.clone();
   *
   * // Changes to original affect the clone
   * graphics
   *     .circle(200, 100, 30)
   *     .fill({ color: 0x00ff00 });
   *
   * // Create a deep clone (independent context)
   * const deepClone = graphics.clone(true);
   *
   * // Modify deep clone independently
   * deepClone
   *     .translateTransform(100, 100)
   *     .circle(0, 0, 40)
   *     .fill({ color: 0x0000ff });
   * ```
   * @param deep - Whether to create a deep clone of the graphics object.
   *              If false (default), the context will be shared between objects.
   *              If true, creates an independent copy of the context.
   * @returns A new Graphics instance with either shared or copied context
   * @see {@link Graphics#context} For accessing the underlying graphics context
   * @see {@link GraphicsContext} For understanding the shared context behavior
   */
  clone(t = !1) {
    return t ? new Ze(this._context.clone()) : (this._ownedContext = null, new Ze(this._context));
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(t, e, i) {
    F(D, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const r = {};
    return t && (r.width = t), e && (r.color = e), i && (r.alpha = i), this.context.strokeStyle = r, this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(t, e) {
    F(D, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const i = {};
    return t !== void 0 && (i.color = t), e !== void 0 && (i.alpha = e), this.context.fillStyle = i, this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    F(D, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== rt.defaultStrokeStyle.width || t.color !== rt.defaultStrokeStyle.color || t.alpha !== rt.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...t) {
    return F(D, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...t) {
    return F(D, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...t) {
    return F(D, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...t) {
    return F(D, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...t) {
    return F(D, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...t) {
    return F(D, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
  }
}
_.add(ca, ua);
const Je = Math.PI / 180;
function H(s, t) {
  return Math.random() * (t - s) + s;
}
function eu(s = 100) {
  return {
    r: H(s * 0.2, s),
    a: H(0, Math.PI * 2),
    s: H(-0.05, 0.05)
  };
}
function sa(s = 4, t = 100) {
  const e = Math.floor(H(2, s)), i = [];
  for (let r = 0; r < e; r++)
    i.push(eu(t));
  return i;
}
function ia(s) {
  const t = { x: 0, y: 0 };
  for (const e of s)
    e.a += e.s, t.x += Math.cos(e.a) * e.r, t.y += Math.sin(e.a) * e.r;
  return t;
}
function ra(s, t, e) {
  e = Math.max(0, Math.min(1, e));
  const i = s >> 16 & 255, r = s >> 8 & 255, n = s & 255, a = t >> 16 & 255, o = t >> 8 & 255, h = t & 255, l = Math.round(i + (a - i) * e), c = Math.round(r + (o - r) * e), u = Math.round(n + (h - n) * e);
  return l << 16 | c << 8 | u;
}
function na(s, t, e) {
  return s + (t - s) * e;
}
class ci extends Ze {
  static SKY_TINT = 161271039;
  constructor(t) {
    super(), this.init(), this.scale.set(1), this.x = H(-500, t.screen.width + 500), this.y = -50;
    const e = ~~H(0, 300), n = na(0.5, 2, e / 300);
    this.tint = ra(ci.SKY_TINT, 16777215, e / 300), this.anim = {
      time: 0,
      baseX: this.x,
      baseY: this.y,
      gears: sa(),
      baseScale: n,
      z: e,
      spinSpeed: H(-0.01, 0.01),
      flipSpeed: H(0.5, 1),
      flipAmount: H(0.2, 0.4),
      spinX: { speed: H(-2, 2), angle: H(0, 360) },
      spinY: { speed: H(-2, 2), angle: H(0, 360) },
      vector: {
        x: H(-2, 2),
        y: 0
      }
    }, this.zIndex = this.anim.z;
  }
  init() {
    this.beginFill(16777215);
    const n = [], a = 5, o = Math.PI * 2 / a, h = 1;
    for (let l = 0; l < a; l++) {
      const c = l * o, u = Math.random() * h - h / 2, f = Math.random() * h - h / 2, d = 5 * (1 + u), p = 5 * (1 + f), m = Math.cos(c) * d, g = Math.sin(c) * p;
      n.push(new J(m, g));
    }
    this.drawPolygon(n), this.endFill();
  }
  onTick(t, e) {
    const i = ia(this.anim.gears);
    this.anim.baseX += e.vector.x * this.anim.baseScale, this.anim.baseY += e.vector.y * this.anim.baseScale, this.x = i.x + this.anim.baseX, this.y = i.y + this.anim.baseY, this.anim.spinY.angle += this.anim.spinY.speed + e.vector.x * 0.5, this.rotation = this.anim.spinY.angle * Je, this.anim.spinX.angle += this.anim.spinX.speed + e.vector.x * 0.5, this.scale.x = this.anim.baseScale * Math.cos(this.anim.spinX.angle * Je), this.scale.y = this.anim.baseScale;
  }
}
const su = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABJCAMAAABVersaAAAC2VBMVEUAAAD39/f28+j17ef47uzy7enn2dPy5Nfhz8vs3M2yinjy4NTQuq7q1rvt2tHAo4vnz8GkdFnbt6fw2qzku6bau7zPqZbpya29mIeteGbfsIXv1p/it5rVtrrJnIa3injqyHjTp6PmtHyzfFzMnZrIi2nal4fGkY3hpHXsx2eyclHEhnuUWkDZk2FyKBXKcUWbWTG0Z1Dtp0jPgUGwWjrjsUvgoFHEoljswFLFXinbgTCcRyzdi0K3XUR+PxHRhSiqVTHnx0zSrz7TcDHjdEGOe0OpQReLOSPonkTww0CvYx7DTyi5o0x7KwndaDb0zD3rsjmxcUr0xifzwRzywRHyvSPvvBzyug71tR3utijvtBrysw7utQvxrxXrrSXnrxntqSPxqwvvqRbypRrrqwnspCDtpRbeqSfmpSTlpxryoBbupAnppQjsnxbwnwnwmCPxmRnnnCPsngjlnhblng/rlyPrmBjxlwrsmArwlA/cmx7mmgfujivklxbskxTrkhrfmg3qlArmkhrujhnqjiHfkx7vjgrllAXtixXpjhDqjgnljhTqiCXnix3uiwrvhiHNmhPfkBDoiRnljgbthxXvhgvriAnjiRXiiw3niA7ligfthA3OkhXmhB7rgCTeiRLYixPlgxfjhgzufhTmhAfqgBDmfSjsfgvkgwblfxTkfhvjgQvegwzreB7lfg3seRLifRDjfgfdfw7dfRfjdyHjeBnieRHkeQrqby3rchrjcynfewjocxPGhBTaeRHlchfgdwjgdRHncgnfcSPicRHYcibPeRnnayLhcwbecgboahPiaSffbBnXcgrScw/kagalgyfgawfkZRrTbRjXaCPlZQfYagfdZRLcYSHVZBrfXxXRZwrKZCbgWR3FaBLKXBbWUCjaURWVcxK4XB/MUCS7XAy/UhvLSxKyUheDaBShVA+qTw63QBKbSRGnPAqUQweTNgh7QQiHLARAvFuuAAAA73RSTlMAAQUKEBUcIyowMzY2PEFFR0ZTW2BiZGdmaHFydHeBgIeLjpKan6Clpq+vsbCyury8x8rLzM7P09bb3d3e4eDm5+jo7e/v7u7x8vPy+fj6/f39///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+///+///////////////////////////////////////////////////+/hgth1oAAAdeSURBVHja3dZ5VFTXHQfw77w3b94bZmGYYUcRUIKi1hqPGpv1VPNH1DaNrSnRYhWDsRoUqBpzXIhLbIsnWguJCo1REcUFqUEIIE1DSMSCC6FUtgCCDMvAMDDbe7zZOjPmD6yE4WT+y+ec+eeee7/v97vvzj0PP04CeM1HhLH5+mFi5iySYCzSX0zFhIgWNyz2H2v8haGJJRDTv/786idRoifGZw3ppmACyOmFhYWfpu/9mRKPYWbptcOBYz8TjwnaD3Rp5VNP3I0eXYZ4wU0b7AQ8E8zf/sHx/e8fP1PX2vFd176xYlH40v5+jUajhGdhGxNT9u9JOXyxrq5uDtyi1UuXql36NSp4QoZt37QhMWVP0onLt/+V/xzp7nLe3Zb7LU5tvb2x8MB3QUpiQsLatXuOHTtZXnGpzP1OhS8W37r1jZNa/VArxfgCj61Zm/DmhrWJp2+eLS7++PwiEgBzM/fLL+/du3e/paF7MNzDuxjMhd1OQMR0IkTJC+U+BAB/LQCIwHWbRviocNG4CdZmPSiaVvjTWqXBKmMkJCCLaRe7pw2R4Nm8O7HjJmCoRm8RKgKCFTYMU2IcjA6KKn6bdiXwVpKROExGUocnCDGKGq+Dkopda4IdPJdngnrABoDgTHYDwIas6PZ0Jof8KSMAicBXJuZNPZxabUG/Cd0sB3NfL+EzbIEHUX/Zt+/wlbyzd+/8u/hibu6F7L1HjqRf/ezajasFly4VNXU/S3rogposkxntDiuBYX2rVUYBCgDfzjU1ICgQwYx9xIHxheadu5Z38uQ/Tn7+6fHD6R9lf5j54ZH09H2X7565WPRVQ0dHx/Sxz4Mfg0fICCtYSCSSEJMgwA6jwWAEALGACpT7MiRgtcOF8fm/hPAXAmkSICWxR2RCvVVIa6UzJWYBwIlkAleCqEXsA842wg6GT5JJFNEvLw4WPHYxh7b3LFs0b8Fzhd/c+uJGnlPG8bazWVnph5w+Ss9Kz7p87YuKioqvis6XlVVdr2xqV/frfhoo82UooYh072T/m7s3+cIKsAZAzOq1Ri5gGCxggF0BwG8wAA6zo7ddAblWY+5hlTOpGwRJrObR899HVUza1yOnA8Lg0PEA+noMjkVtLAAO9qkjvTFSkicJv75mRgnAIRzApLl2SAFOurzR+CiBnPdioF0RDAAGwKztF8xqgosDKhaxNpB2enjYQsDmms5aFkSDhKUz6udqG76jStlx+HDeucvn8q7kncvK2LXtWGpq6s6dqVu27LtyI+/kmeLczMwDTgc//mD7/rQDxdXNzVXn62ePOtX6Bp3enzexOr2ZNwNSuPAGncGGeUpVEKMDbdQCPnIhYADF69Tt2ikq3egLdnZKYuL7pz/ZlXHiREZGxp/efm9X6pbN61b/bt3ZiovFn+XmZmcfevfQ3rS/paXtSEtLO5N/6frXjT2KUafa0aCJfKqpa2FgLxHlTjbSIzDzABRDEVwvzLAwDGfxJRwcHAAzFBShogjzqARY+7QPf2IpC/UbcK+HSSoAbwWmjIQzTT0SFXQyHmRIN8CT7PSnm3yVdFyddVSCK0M9NDv8gSZGMEID7ucLbGAWOtim+yIlAB4w9bFgeCo8VIMwiqjVPPHfNN0PFXLNQX6aEY6zgRmyAJFic3Ob63zb5CwAdpj3jxHp+rkZtHCZdowbxqyzwVzaSHEcB50YgGh+X22j3mrnjSYf3tAVAmVkiEjnBwng0NnGSBAIXL+BPn8wME9l4FDJWzXGEWD4W3uL0U/KQEGbhwSAA6zdONZHj2y5e2+oUGkXh5e6GqzLxZWsgAak9GttDtXDVh9QlJ4Jhb8kyOeZzjHuKL42QkYCGBRParFWPt9AzylkAVJMh1nKrdAoZ8AOP4nBl0AQ/VsLxkSHzV/zh4TEjRs3vv6bv//1n23rEpL+mLQ5dafzusopcCrNvfOfyvr67rlKIb4PIYuYv3HNG796663OvuHObXu2xcev2/zOoQsFBTnOgOqiosqykq5YEuMixKqIGTMWvlzb2Xc6YVVc/Lot77ybfSEnJzentDQ/v6TkQTSBiSACXlte+178qrjVroQ/u5oor64urW8seZ7ExMwMkL/yxqpVv4+PT9iUfKCgvNwVcLu9vmYuJkYxE1C9umLFylUbktavT87McVaRn3+9pqxksRgTEiMHEPbqr1fGxa1Pcko+kHn0VH5+fmlJ47JwEp4JZ7pnqV5ZGbd+U3Jyctr+Hclbdx91hVS19sxRwCPJU3CTPRO/w9lBzlGng1u3bt99Kr+urrmnOzbYUx3ySDwimpGUWVpd19h+u6rqetmp3c6I0qqqjgH9syECwbg1uBPcVE9PD/L3D499aWCg+5dLliwpqaqpebBs7hTpuAGgI5/4xBAqZwUytEgkVgYqFQw8oSLhJaH3CdME3ibEEF7XgInyfieJcYa9Ip4MLykC4KUABbwUScM7lNcHKsDbbRDFkPAKESP3MmCalz1Q3gbIp3nXAh0ZSXmzAczkSO8KEE2W/IBV/wPLQwt/cbJXAgAAAABJRU5ErkJggg==", Ir = await Rt.load(su);
class iu extends Ct {
  TINTS = [16724940, 8969676, 16777011];
  constructor(t) {
    super(Ir), this.anchor.set(0.5), this.scale.set(1), this.x = H(-500, t.screen.width + 500), this.y = Ir.height * -10;
    const e = this.TINTS[Math.floor(Math.random() * this.TINTS.length)];
    this.tint = ra(e, 16777215, H(0, 1));
    const i = ~~H(0, 300), a = na(0.5, 2, i / 300);
    this.anim = {
      time: 0,
      baseX: this.x,
      baseY: this.y,
      gears: sa(),
      baseScale: a,
      z: i,
      spinX: { speed: H(-2, 2), angle: H(0, 360) },
      spinY: { speed: H(-2, 2), angle: H(0, 360) },
      vector: {
        x: H(-2, 2),
        y: 0
      }
    }, this.zIndex = this.anim.z;
  }
  onTick(t, e) {
    const i = ia(this.anim.gears);
    this.anim.baseX += e.vector.x * this.anim.baseScale, this.anim.baseY += e.vector.y * this.anim.baseScale, this.x = i.x + this.anim.baseX, this.y = i.y + this.anim.baseY, this.anim.spinY.angle += this.anim.spinY.speed + e.vector.x * 0.5, this.rotation = this.anim.spinY.angle * Je, this.anim.spinX.angle += this.anim.spinX.speed + e.vector.x * 0.5, this.scale.x = this.anim.baseScale * Math.cos(this.anim.spinX.angle * Je), this.scale.y = this.anim.baseScale;
  }
}
class ru {
  constructor() {
    this.x = 0, this.y = 0, this.position = { x: 0, y: 0 }, this.offset = { x: 0, y: 0 }, this.offsetNormalized = { x: 0, y: 0 }, this.positionNormalized = { x: 0, y: 0 }, window.addEventListener("pointermove", this.onMove.bind(this));
  }
  onMove(t) {
    this.x = t.clientX, this.y = t.clientY, this.position.x = t.clientX, this.position.y = t.clientY, this.positionNormalized.x = t.clientX / window.innerWidth, this.positionNormalized.y = t.clientY / window.innerHeight, this.offset.x = t.clientX - window.innerWidth / 2, this.offset.y = t.clientY - window.innerHeight / 2, this.offsetNormalized.x = this.offset.x / (window.innerWidth / 2), this.offsetNormalized.y = this.offset.y / (window.innerHeight / 2);
  }
}
const nu = "data:image/png;base64,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", au = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5AAAAKZCAMAAAD56jRqAAAC3FBMVEUAAADltoOTWjXwwI3206eoZjv427Ldm1r21611SDDiqWvDbjj33LR0RS7iqm/427LRjEqtXzRoPyrhqm344L+iWjHKh0ryxo3348XWmV63bjlnOyeWTyrqt4D00aGnZjVcNyP35Mi3SSDAe0KJRSPtuHl3QSH669jYl1720JgzHBPHhFCUWC/ywX3np2ioPR18OByqZC343bNmMxn66dT65b740pf2yYfzvn7rs3KkNxf63Knx1cDrxrD6xXbiuab1t23mtZrwtF7tp2Xbp5DpqVHgo4TVnYHgnlXinUTYlnLOlnnpjlLalD/Lj2/PkVrTiWfVjTfFiWbKg13afkjOhjS/g13JgkbDf1XLgCzFfTG3fFTLclO/d0zFeSe8djq+dy3MbD6vdEy+cya7bUi4cSu6byOubkO0bCe2Zj+1aiC/Xz2taiqjakOwaCOuYkCuZR6qZSSmXzqkYyeqYRyyVzeaYTumYCCiXiKhWDWjXBvATB+cXCafWx+eWBmQWTeaWB+aUzKoTC+UVyiWVR+aVBmSUyGPUS+VUhmRUByFUTGMUCG0PReRTRaaRCyOTR2MThuPSSiHTSCMSxiJSxx9Sy6GRymLSBSFSRyHRxeCSB1/RySERhiOPCl+RhyBRRmFRBOBQxZ1RSl+Qxh6Qx1+QRR6QhiUMhl7PxZ3QBlzQCB7PhJtQSd3PhaFNCF9NyZzPhl3OxJ0PBRvPBhyOxVrPB5zORFvORRjPCR1MiJrORh8Lh1rNxRvMiNuNhBnNxljNhxnNRNqNA90KxxqLiBjMxRfMxplMQ9XNR9wKRpsKRtkLB9eMBRgLw9qJxlaLxdnJxlfKh1aLA5jJRhVLBVcJhlgJBhWKBxcIhdYJBdQKBJNJxpTIxdXIBZUHxZIJBZNIRZQHxVIIBVDIhdNHRVGHhVKHBRCHhQ+HxRGGhNDGhNBGRM5HRM+GRI7GBIzGxI3GBEzFxEvFxArFA+WtvQoAAAAqHRSTlMAAwgMFxkjLzY4SEtNVWFkZGtyfX6Ii5WdpKSksLPExMfJyszM0dvd3+Dg4uXp6Ojp6+7v/fz9/f38/f7//////////v/////////////////////////+//////////7///////////////////////////////////////////////////////////////////////////////////////////////4huT3qAAHBx0lEQVR42uzY227bMAyAYcrUgZZFO0KkOkk7p7nYAb3Z+z/QBuxmN/aStJ2b5S0GAvwAPQHxg6BACWeMwTvr0RhQSv1X6D1RuiPyFg0A3J+WKVYDSjKDvk0pEIVgiZxDtIjYICiZdHKCGYPWU/m0Jeo+u03O6Br0HgnNbXsBJZAGKRdaF3youcT3QMOwGYb+wfI25NY1xl70pJRIgxQL0bvNwAP19o0GIHtt3IFd6boNmdurXW94AyWM3pBCGcS2G/L3Q5eY01QB4ApUuKX1j+tKJkqd7kh5NEiZ0DlP/a7j3ALMVE4EgMQMwBj3Ex+OkdDqdMXRkQlkDDofuv6lWWcmigw8nEbOMF9ihbYUSK3ZvQwBdUVKo0FK1LiQj+PkSnOemccypmkfIwD8jSVWXgggxfXxoQ1apDAapETG0uOXqYX6NALALw70c14iML8ty1jgHa6XnPrt9JC0SGE0SIls7gmgjvFUCOA8HxP/XrgCIewu53lN9O35WKmdYgr6jy6KBilQY7uviSnGV+B9AUrnH0uowwaX0AIs/Gyn0XyUWl2xGqQsGqQ86MjT8XSKtltv6an/+MfeWwBJkmT5e7+IcPfgiIzkLG4YWJjd052YmZklk2SSickkmZjBhGZiZmZmZmbplgcai5KDwSlCupme2T2QdCet/tezW990TWZnddfYVNSX7/nz5y/g7T7BjALBcsaW8+Xsa5dZimDlgbiUPRj5ZeJByC8dFrW9kwU2TTV7HN/B95y7793c3a4/OfquN01voyhiy5i6+bc2xHvsWg+l1i8TD2+fXzYMQken03l1qC0zuCus4tntYVvzererjK/mRKgTmyvbEJWy7N5kvBn0Q8POlweCB75cmMz/zbpwFST7hmcCn+QaxoAehKOuRyOSbPy9umwcrMp9GJZuCNU/GPml4UHILxmGZaFzvJ0T7r3iLhW9hgHq2aQuBr07BL6qfduCyN1gU4ZTuEkb9PLByC8LDynrlwnDsEzbdi8X/b2VF8dD2Q29ZRq9MTSSm8ygvShTO/JIN+qwbm2PF4bgvX5IWr80PETILxEGYDhOcoFFK9lNCQ0KQKJztEUdbyHktuz5QYxd3UGsBnSoaiRQ4iFp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";
class ou {
  constructor(t = {}) {
    const { width: e, height: i, container: r } = t;
    this.options = t, this.width = e || window.innerWidth, this.height = i || window.innerHeight, this.container = r, this.pointer = new ru(), this.elements = [], this.world = { vector: { x: 1, y: 0.3 } }, this.app = new In(), this.initialized = !1, this.boundOnTick = this.onTick.bind(this), this.boundOnResize = this.onResize.bind(this), this.initPromise = this.init();
  }
  async init() {
    await this.app.init({
      width: this.width,
      height: this.height,
      backgroundAlpha: 0,
      antialias: !0,
      autoDensity: !0,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      preference: "webgl"
    }), (this.container || document.body).appendChild(this.app.canvas), this.app.stage.sortableChildren = !0;
    const e = await Rt.load(nu);
    this.bg = new Ct(e), this.bg.brightness_a = 0, this.bg.width = this.app.screen.width, this.bg.height = this.app.screen.height, this.bg.zIndex = -1, this.app.stage.addChild(this.bg);
    const i = await Rt.load(au);
    this.girl = new Ct(i), this.girl.brightness_a = 0, this.girl.anchor.set(0.5, 1), this.girl.y = this.app.screen.height, this.girl.x = this.app.screen.width * 0.5, this.girl.scale.set(1), this.girl.zIndex = 150, this.girl.tint = 11184810, this.app.stage.addChild(this.girl), this.app.ticker.add(this.boundOnTick), !this.options.width || !this.options.height ? (window.addEventListener("resize", this.boundOnResize), window.dispatchEvent(new Event("resize"))) : this.positionGirl(), this.initialized = !0;
  }
  onResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight), this.bg.width = this.app.screen.width, this.bg.height = this.app.screen.height, this.positionGirl();
  }
  positionGirl() {
    this.girl.scale.set(this.app.screen.height * 0.7 / this.girl.texture.height), this.girl.x = this.app.screen.width * 0.5, this.girl.y = this.app.screen.height + this.app.screen.height * 0.1;
  }
  onTick(t) {
    this.elements.length < 200 && (Math.random() < 0.2 && this.addLeaf(), Math.random() < 0.7 && this.addSnowflake()), this.world.vector.x = this.pointer.offsetNormalized.x * 5, this.world.vector.y = 1 + this.pointer.positionNormalized.y * 2;
    let e = this.elements.length;
    for (; e--; ) {
      const i = this.elements[e];
      i.y > this.app.screen.height + i.height ? this.removeElement(i) : i.onTick(t, this.world);
    }
  }
  addLeaf() {
    const t = new iu(this.app);
    this.elements.push(t), this.app.stage.addChild(t);
  }
  addSnowflake() {
    const t = new ci(this.app);
    this.elements.push(t), this.app.stage.addChild(t);
  }
  removeElement(t) {
    this.elements.splice(this.elements.indexOf(t), 1), this.app.stage.removeChild(t), t.destroy();
  }
  async destroy() {
    if (this.initPromise)
      try {
        await this.initPromise;
      } catch (t) {
        console.error("Error during initialization:", t);
      }
    if (this.initialized) {
      if (this.app && this.app.stage)
        for (; this.elements.length > 0; ) {
          const t = this.elements.pop();
          this.app.stage.removeChild(t), t.destroy();
        }
      this.boundOnResize && window.removeEventListener("resize", this.boundOnResize), this.app && this.app.canvas && this.app.canvas.parentNode && this.app.canvas.parentNode.removeChild(this.app.canvas), this.app && this.app.destroy(!0, { children: !0, texture: !1, baseTexture: !1 }), this.initialized = !1;
    }
  }
}
const du = ({
  width: s,
  height: t,
  className: e,
  style: i
}) => {
  const r = pi(null), n = pi(null);
  return la(() => {
    if (!r.current) return;
    const a = new ou({
      width: s,
      height: t,
      container: r.current
    });
    return n.current = a, () => {
      n.current && (n.current.destroy(), n.current = null);
    };
  }, [s, t]), /* @__PURE__ */ ha(
    "div",
    {
      ref: r,
      className: e,
      style: {
        width: `${s}px`,
        height: `${t}px`,
        position: "relative",
        overflow: "hidden",
        ...i
      }
    }
  );
};
export {
  K as $,
  Bn as A,
  et as B,
  wt as C,
  Q as D,
  I as E,
  Qr as F,
  $e as G,
  lt as H,
  jr as I,
  Ei as J,
  Ct as K,
  Bo as L,
  W as M,
  Wo as N,
  be as O,
  J as P,
  q as Q,
  Ys as R,
  ti as S,
  Ee as T,
  Gs as U,
  Jo as V,
  Fi as W,
  fs as X,
  Wi as Y,
  so as Z,
  Ue as _,
  dn as a,
  to as a0,
  Vr as a1,
  Sn as a2,
  F as a3,
  D as a4,
  sh as a5,
  Ph as a6,
  yh as a7,
  Uh as a8,
  jh as a9,
  _h as aa,
  tl as ab,
  el as ac,
  Oe as ad,
  Ne as ae,
  Os as af,
  yr as ag,
  Qn as ah,
  qi as ai,
  Hi as aj,
  wr as ak,
  ic as al,
  L as am,
  Ze as an,
  va as ao,
  Ke as ap,
  Vn as aq,
  du as ar,
  iu as as,
  ou as at,
  ru as au,
  ci as av,
  ct as b,
  il as c,
  mh as d,
  _ as e,
  ji as f,
  fh as g,
  xe as h,
  Xe as i,
  $s as j,
  wn as k,
  en as l,
  ut as m,
  mn as n,
  Ks as o,
  Oh as p,
  Hh as q,
  Da as r,
  Zh as s,
  $h as t,
  j as u,
  R as v,
  Y as w,
  Ca as x,
  sl as y,
  at as z
};
//# sourceMappingURL=index-BpHzxPmc.js.map

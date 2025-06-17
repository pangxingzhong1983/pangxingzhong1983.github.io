function init() {
  if (window.__peep_initialized) return;
  window.__peep_initialized = true;
  // ...其余逻辑
}
(function () {
  if (window.__PEOPLE_CANVAS_LOADED__) return;
  window.__PEOPLE_CANVAS_LOADED__ = true;

  "use strict";

  // 所有变量用 var 声明，避免重复声明错误
  var peopleConfig = {
    src: GLOBAL_CONFIG.peoplecanvas.img,
    rows: 15,
    cols: 7,
  };

  var ctx, stage = { width: 0, height: 0 };
  var allPeeps = [];
  var availablePeeps = [];
  var crowd = [];

  function _toConsumableArray(e) {
    return _arrayWithoutHoles(e) || _iterableToArray(e) || _unsupportedIterableToArray(e) || _nonIterableSpread();
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.");
  }
  function _unsupportedIterableToArray(e, r) {
    if (e) {
      if ("string" == typeof e) return _arrayLikeToArray(e, r);
      var t = Object.prototype.toString.call(e).slice(8, -1);
      return (
        "Object" === t && e.constructor && (t = e.constructor.name),
        "Map" === t || "Set" === t
          ? Array.from(e)
          : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
          ? _arrayLikeToArray(e, r)
          : void 0
      );
    }
  }
  function _iterableToArray(e) {
    if (("undefined" != typeof Symbol && null != e[Symbol.iterator]) || null != e["@@iterator"]) return Array.from(e);
  }
  function _arrayWithoutHoles(e) {
    if (Array.isArray(e)) return _arrayLikeToArray(e);
  }
  function _arrayLikeToArray(e, r) {
    (null == r || r > e.length) && (r = e.length);
    for (var t = 0, a = new Array(r); t < r; t++) a[t] = e[t];
    return a;
  }
  function _classCallCheck(e, r) {
    if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var a = r[t];
      (a.enumerable = a.enumerable || !1),
        (a.configurable = !0),
        "value" in a && (a.writable = !0),
        Object.defineProperty(e, a.key, a);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), e;
  }

  // 工具函数
  var randomRange = function (min, max) {
    return min + Math.random() * (max - min);
  };
  var randomIndex = function (arr) {
    return 0 | randomRange(0, arr.length);
  };
  var removeFromArray = function (arr, i) {
    return arr.splice(i, 1)[0];
  };
  var removeItemFromArray = function (arr, item) {
    return removeFromArray(arr, arr.indexOf(item));
  };
  var removeRandomFromArray = function (arr) {
    return removeFromArray(arr, randomIndex(arr));
  };
  var getRandomFromArray = function (arr) {
    return arr[randomIndex(arr)];
  };

  var Peep = (function () {
    function a(e) {
      var r = e.image, t = e.rect;
      _classCallCheck(this, a),
        (this.image = r),
        this.setRect(t),
        (this.x = 0),
        (this.y = 0),
        (this.anchorY = 0),
        (this.scaleX = 1),
        (this.walk = null);
    }
    return _createClass(a, [
      {
        key: "setRect",
        value: function (e) {
          this.rect = e;
          this.width = e[2];
          this.height = e[3];
          this.drawArgs = [this.image].concat(_toConsumableArray(e), [0, 0, this.width, this.height]);
        }
      },
      {
        key: "render",
        value: function (e) {
          e.save();
          e.translate(this.x, this.y);
          e.scale(this.scaleX, 1);
          e.drawImage.apply(e, _toConsumableArray(this.drawArgs));
          e.restore();
        }
      }
    ]), a;
  })();

  var img = document.createElement("img");
  img.onload = init;
  img.src = peopleConfig.src;

  window.peoplecanvasEl = document.getElementById("peoplecanvas");
  if (window.peoplecanvasEl) {
    ctx = window.peoplecanvasEl.getContext("2d");
  }

  function init() {
    if (!peoplecanvasEl) return;
    createPeeps();
    resize();
    gsap.ticker.add(render);
    window.addEventListener("resize", resize);
  }

  document.addEventListener("pjax:success", () => {
    window.peoplecanvasEl = document.getElementById("peoplecanvas");
    if (peoplecanvasEl) {
      ctx = peoplecanvasEl.getContext("2d");
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);

      // ✅ 在这里添加 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      window.__peep_initialized = false;

      setTimeout(() => {
        if (!peoplecanvasEl) return;
        resize();
        gsap.ticker.add(render);
        window.addEventListener("resize", resize);
      }, 300);
    }
  });

  function createPeeps() {
    var rows = peopleConfig.rows;
    var cols = peopleConfig.cols;
    var count = rows * cols;
    var cellWidth = img.naturalWidth / rows;
    var cellHeight = img.naturalHeight / cols;

    for (var i = 0; i < count; i++) {
      allPeeps.push(
        new Peep({
          image: img,
          rect: [(i % rows) * cellWidth, ((i / rows) | 0) * cellHeight, cellWidth, cellHeight],
        })
      );
    }
  }

  function resetPeep(e) {
    var peep = e.peep;
    var direction = Math.random() > 0.5 ? 1 : -1;
    var offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
    var y = stage.height - peep.height + offsetY;
    var startX, endX;
    if (direction === 1) {
      startX = -peep.width;
      endX = stage.width;
      peep.scaleX = 1;
    } else {
      startX = stage.width + peep.width;
      endX = 0;
      peep.scaleX = -1;
    }
    peep.x = startX;
    peep.y = y;

    return {
      startX,
      startY: (peep.anchorY = y),
      endX,
    };
  }

  function normalWalk(e) {
    var peep = e.peep;
    var props = e.props;
    var y = props.startY;
    var x = props.endX;

    var timeline = gsap.timeline();
    timeline.timeScale(randomRange(0.5, 1.5));
    timeline.to(peep, { duration: 10, x: x, ease: "none" }, 0);
    timeline.to(peep, { duration: 0.25, repeat: 40, yoyo: true, y: y - 10 }, 0);

    return timeline;
  }

  var walks = [normalWalk];

  function resize() {
    if (peoplecanvasEl && peoplecanvasEl.clientWidth !== 0) {
      stage.width = peoplecanvasEl.clientWidth;
      stage.height = peoplecanvasEl.clientHeight;
      peoplecanvasEl.width = stage.width * devicePixelRatio;
      peoplecanvasEl.height = stage.height * devicePixelRatio;

      crowd.forEach((p) => p.walk.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    }
  }

  function initCrowd() {
    while (availablePeeps.length) {
      addPeepToCrowd().walk.progress(Math.random());
    }
  }

  function addPeepToCrowd() {
    var peep = removeRandomFromArray(availablePeeps);
    var walk = getRandomFromArray(walks)({
      peep: peep,
      props: resetPeep({ peep: peep, stage: stage }),
    }).eventCallback("onComplete", () => {
      removePeepFromCrowd(peep);
      addPeepToCrowd();
    });

    peep.walk = walk;
    crowd.push(peep);
    crowd.sort((a, b) => a.anchorY - b.anchorY);
    return peep;
  }

  function removePeepFromCrowd(peep) {
    removeItemFromArray(crowd, peep);
    availablePeeps.push(peep);
  }

  function render() {
    if (!peoplecanvasEl || !ctx) return;
    peoplecanvasEl.width = stage.width * devicePixelRatio;
    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);
    crowd.forEach((peep) => peep.render(ctx));
    ctx.restore();
  }
})();

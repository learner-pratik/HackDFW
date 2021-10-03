$(document).ready(function () {
  console.log("jquery loaded");

  const $videos = [].slice.call(document.querySelectorAll('.slide'));
  const $countries = [].slice.call(document.querySelectorAll(".description__country"));
  const $texts = [].slice.call(document.querySelectorAll(".description__text"));

  var fromTo = (from, to, prgrs = 0) => from + (to - from) * prgrs;

  var easing = {
    inCubic: function (t, b, c, d) {// t: current time, b: begInnIng value, c: change In value, d: duration
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (1.7 * tc * ts - 2.05 * ts * ts + 1.5 * tc - 0.2 * ts + 0.05 * t);
    } };


  var transforms = {
    translate3D: function (x = 0, y = 0, z = 0, el = "px") {
      return `translate3D(${x}${el}, ${y}${el}, ${z}${el})`;
    },

    rotate3d: function (x = 0, y = 0, z = 0, deg = 0) {
      return `rotate3d(${x}, ${y}, ${z}, ${deg}deg)`;
    },

    rotate: function (deg = 0) {
      return `rotate(${deg}deg)`;
    },

    scale: function (x = 0, y = 0) {
      return `scale(${x}, ${y})`;
    },

    perspective: function (val = 0, el = "px") {
      return `perspective(${val}${el})`;
    } };


  var descriptions = {
    index: 0,
    timeout: 550,
    countries: $countries.slice(),
    texts: $texts.slice(),

    animateDescription: function () {
      $(this.countries[0]).addClass("fadeout-up");
      $(this.countries[1]).addClass("fadein-up");
      $(this.texts[0]).addClass("fadeout-up");
      $(this.texts[1]).addClass("fadein-up");
    },

    swapDescription: function () {
      let shdC = this.countries.shift();
      let shdT = this.texts.shift();

      let count = $countries.length;
      if (count > this.index + 4) {
        this.countries.push($countries[this.index + 5]);
        this.texts.push($texts[this.index + 5]);
      } else
      {
        this.countries.push(shdC);
        this.texts.push(shdT);
      }
      this.index === count ? this.index = 0 : this.index++;
      this.initDescriptions();
    },

    initDescriptions: function () {
      let length = this.countries.length;
      $(this.countries[0]).removeClass("hide fadein-up");
      $(this.countries[length - 1]).addClass("hide").removeClass("fadeout-up");
      $(this.texts[0]).removeClass("hide fadein-up");
      $(this.texts[length - 1]).addClass("hide").removeClass("fadeout-up");
    } };


  var curBlocks = {
    blocks: $videos.slice(),
    index: 0,

    swapBlocks: function () {
      let shd = this.blocks.shift();
      let count = $videos.length;
      if (count > this.index + 4) {
        this.blocks.push($videos[this.index + 5]);
      } else
      {
        this.blocks.push(shd);
      }
      this.index === count ? this.index = 0 : this.index++;
      initScene();
    } };


  var block = {
    width: 32,
    heigth: 31,
    b2scale: 30 / 32,
    b3scale: 28 / 32,
    upHeigth: 1,

    b2caclH: 0,
    b3caclH: 0 };


  var initScene = function () {
    block.b2caclH =
    block.heigth * (1 - block.b2scale) * (1 / block.b2scale) / 2 +
    block.upHeigth * (1 / block.b2scale);
    block.b3caclH =
    block.heigth * (1 - block.b3scale) * (1 / block.b3scale) / 2 +
    block.upHeigth * 2 * (1 / block.b3scale);

    curBlocks.blocks[0].style.transform = transforms.translate3D(0, 0, 0, "rem");
    curBlocks.blocks[1].style.transform =
    transforms.scale(block.b2scale, block.b2scale) +
    transforms.translate3D(0, block.b2caclH, 0, "rem");
    curBlocks.blocks[2].style.transform =
    transforms.scale(block.b3scale, block.b3scale) +
    transforms.translate3D(0, block.b3caclH, 0, "rem");
    curBlocks.blocks[3].style.transform =
    transforms.scale(block.b3scale, block.b3scale);

    curBlocks.blocks[0].style.opacity = 1;
    curBlocks.blocks[1].style.opacity = 0.1;
    curBlocks.blocks[2].style.opacity = 0.03;
    curBlocks.blocks[3].style.opacity = 0;

    curBlocks.blocks[0].className = "slide slide1 index4";
    curBlocks.blocks[1].className = "slide index3";
    curBlocks.blocks[2].className = "slide index2";
    curBlocks.blocks[3].className = "slide index1";
    bindDrag();
  };

  initScene();

  var drag = {
    degree: 2.7,
    upHeight: 1.5,
    maxDrag: 75,
    b2scale: 0.98,
    b3scale: 0.95,
    dx: 0,
    frameBusy: false,
    helloSafari: 2.9 // need to add this coz of strange behavior
  };

  var dragBlock = function () {
    const maxStep = drag.maxDrag;
    let curStep = drag.dx;
    if (curStep > maxStep) curStep = maxStep;
    if (curStep < -maxStep) curStep = -maxStep;

    let progress = curStep / maxStep;
    let curDeg = drag.degree * progress;
    let curUpLen = drag.upHeight * Math.abs(curStep) / maxStep;
    let curScaleBlock2 = drag.b2scale + (1 - drag.b2scale) * (maxStep - curStep) / maxStep;
    let curScaleBlock3 = drag.b3scale + (1 - drag.b3scale) * (maxStep - curStep) / maxStep;

    curBlocks.blocks[0].style.transform =
    transforms.perspective(220, "rem") +
    transforms.rotate(curDeg) +
    transforms.rotate3d(1, 1, 0, curDeg * 3) +
    transforms.translate3D(0, -curUpLen, 0, "rem");

    curBlocks.blocks[1].style.transform =
    transforms.scale(block.b2scale * curScaleBlock2, block.b2scale * curScaleBlock2) +
    transforms.translate3D(0, block.b2caclH - curUpLen / 4, 0, "rem") +
    transforms.rotate(curDeg / 3) +
    transforms.rotate3d(1, 1, 0, curDeg * drag.helloSafari);

    curBlocks.blocks[2].style.transform =
    transforms.scale(block.b3scale * curScaleBlock3, block.b3scale * curScaleBlock3) +
    transforms.translate3D(0, block.b3caclH + curUpLen / 1.5, 0, "rem") +
    transforms.rotate(-curDeg) +
    transforms.rotate3d(1, 1, 0, curDeg * drag.helloSafari);

    curBlocks.blocks[0].style.opacity = 1;
    curBlocks.blocks[1].style.opacity = fromTo(0.1, 0.7, progress);
    curBlocks.blocks[2].style.opacity = fromTo(0.03, 0.07, progress);
    curBlocks.blocks[3].style.opacity = 0;

    drag.frameBusy = false;
  };

  var throwing = {
    animating: false,
    curStep: 0,
    maxStep: 15 };


  var throwBlock = function () {
    if (++throwing.curStep > throwing.maxStep) {
      $(document).off("mousedown touchstart");
      throwing.curStep = 0;
      drag.dx = 0;
      curBlocks.blocks[0].children[0].pause();
      curBlocks.swapBlocks();
      return;
    }

    let progress = easing.inCubic(throwing.curStep, 0, 1, throwing.maxStep);
    let delta = easing.inCubic(throwing.curStep, 0, 1, throwing.maxStep) * 40;

    curBlocks.blocks[0].style.transform =
    transforms.rotate(drag.degree + delta / 2) +
    transforms.rotate3d(1, 1, 0, drag.degree * 3) +
    transforms.translate3D(delta, -drag.upHeight - delta / 1.2, 0, "rem");

    let b2Scale = fromTo(block.b2scale * drag.b2scale, 1, progress);
    let b2TransY = fromTo(block.b2caclH - drag.upHeight / 4, 0, progress);
    let b2Rot = fromTo(drag.degree / 3, 0, progress);

    curBlocks.blocks[1].style.transform =
    transforms.scale(b2Scale, b2Scale) +
    transforms.translate3D(0, b2TransY, 0, "rem") +
    transforms.rotate(b2Rot) +
    transforms.rotate3d(1, 1, 0, drag.degree * drag.helloSafari);

    let b3Scale = fromTo(block.b3scale * drag.b3scale, block.b2scale, progress);
    let b3TransY = fromTo(block.b3caclH + drag.upHeight / 1.5, block.b2caclH, progress);
    let b3Rot = fromTo(-drag.degree, 0, progress);

    curBlocks.blocks[2].style.transform =
    transforms.scale(b3Scale, b3Scale) +
    transforms.translate3D(0, b3TransY, 0, "rem") +
    transforms.rotate(b3Rot) +
    transforms.rotate3d(1, 1, 0, drag.degree * drag.helloSafari);

    curBlocks.blocks[3].style.transform =
    transforms.scale(block.b3scale, block.b3scale) +
    transforms.translate3D(0, fromTo(0, block.b3caclH, progress), 0, "rem");

    curBlocks.blocks[0].style.opacity = fromTo(1, 0.5, progress);
    curBlocks.blocks[1].style.opacity = fromTo(0.7, 1, progress);
    curBlocks.blocks[2].style.opacity = fromTo(0.07, 0.1, progress);
    curBlocks.blocks[3].style.opacity = fromTo(0, 0.03, progress);

    requestAnimationFrame(throwBlock);
  };

  function bindDrag() {
    $(document).on("mousedown touchstart", ".slide1", function (e) {
      const startX = e.pageX || e.originalEvent.touches[0].pageX;
      const startY = e.pageY || e.originalEvent.touches[0].pageY;

      $(document).on("mousemove touchmove", function (e) {
        let curX = e.pageX || e.originalEvent.touches[0].pageX;
        let curY = e.pageY || e.originalEvent.touches[0].pageY;

        if (curX - startX <= 0) curX = startX;
        if (curY - startY >= 0) curY = startY;

        drag.dx = Math.sqrt(Math.pow(curX - startX, 2) + Math.pow(curY - startY, 2));

        if (!drag.dx) return;
        if (drag.frameBusy) return;
        drag.frameBusy = true;
        requestAnimationFrame(dragBlock);
      });

      $(document).on("mouseup touchend", function (e) {
        $(document).off("mousemove touchmove mouseup touchend");
        if (Math.abs(drag.dx) < drag.maxDrag) {
          drag.dx = 0;
          requestAnimationFrame(dragBlock);
        } else
        {
          descriptions.animateDescription();
          setTimeout(descriptions.swapDescription.bind(descriptions), descriptions.timeout);
          curBlocks.blocks[1].children[0].play();
          requestAnimationFrame(throwBlock);
        }
      });
    });
  };
});
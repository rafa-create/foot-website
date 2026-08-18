(function () {
  var KEY = "rxb-lang";

  function readLang() {
    var q = /(?:\?|&)lang=(fr|nl)\b/.exec(location.search);
    if (q) return q[1];
    try {
      var s = localStorage.getItem(KEY);
      if (s === "fr" || s === "nl") return s;
    } catch (e) {}
    var n = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return n === "nl" ? "nl" : "fr";
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    var titles = window.RXB_TITLES || {};
    if (titles[lang]) document.title = titles[lang];
    var desc = window.RXB_DESC || {};
    var meta = document.querySelector('meta[name="description"]');
    if (meta && desc[lang]) meta.setAttribute("content", desc[lang]);
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-set") === lang ? "true" : "false");
    });
  }

  var lang = readLang();
  document.documentElement.lang = lang;
  if (window.RXB_TITLES && window.RXB_TITLES[lang]) {
    document.title = window.RXB_TITLES[lang];
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(lang);
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-set"));
      });
    });
    var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
    panels.forEach(function (p) {
      p.addEventListener("mouseenter", function () {
        panels.forEach(function (x) { x.classList.remove("open"); });
        p.classList.add("open");
      });
      p.addEventListener("focus", function () {
        panels.forEach(function (x) { x.classList.remove("open"); });
        p.classList.add("open");
      });
    });
  });
})();

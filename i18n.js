(function () {
  var KEY = "foot-lang";

  function readLang() {
    var q = /(?:\?|&)lang=(en|fr)\b/.exec(location.search);
    if (q) return q[1];
    try {
      var s = localStorage.getItem(KEY);
      if (s === "en" || s === "fr") return s;
    } catch (e) {}
    var n = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return n === "en" ? "en" : "fr";
  }

  function val(v, lang) {
    if (v == null) return "";
    if (typeof v === "object") return (v[lang] || v.en || v.fr || "").trim();
    return String(v).trim();
  }

  function fill(el, text) {
    var empty = !text;
    el.textContent = empty ? "—" : text;
    el.classList.toggle("tbd", empty);
  }

  function bind(lang) {
    var p = window.FOOT_PLAYER || {};
    var map = {
      name: p.name,
      nationality: p.nationality,
      position: p.position,
      positionAlt: p.positionAlt,
      foot: p.foot,
      height: p.height,
      weight: p.weight,
      dob: p.dob,
      birthplace: p.birthplace,
      club: p.club,
      league: p.league,
      contractUntil: p.contractUntil,
      status: p.status,
      passport: p.passport,
      languages: p.languages,
      email: p.email,
      phone: p.phone,
      instagram: p.instagram,
      agent: p.agent,
      formedAt: p.formedAt,
      scoutNote: p.scoutNote,
      strength0: (p.strengths && p.strengths[0]) || "",
      strength1: (p.strengths && p.strengths[1]) || "",
      strength2: (p.strengths && p.strengths[2]) || ""
    };
    document.querySelectorAll("[data-k]").forEach(function (el) {
      fill(el, val(map[el.getAttribute("data-k")], lang));
    });

    var body = document.querySelector("[data-career]");
    if (body) {
      body.innerHTML = "";
      (p.career || []).forEach(function (row) {
        var tr = document.createElement("tr");
        ["season", "club", "competition", "apps", "goals", "assists"].forEach(function (k) {
          var td = document.createElement("td");
          fill(td, val(row[k], lang));
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
    }

    var hl = val(p.highlights, lang);
    document.querySelectorAll("[data-highlight]").forEach(function (a) {
      a.hidden = !hl;
      if (hl) a.setAttribute("href", hl);
    });
    document.querySelectorAll("[data-no-highlight]").forEach(function (el) {
      el.hidden = !!hl;
    });

    var mail = val(p.email, lang);
    document.querySelectorAll("[data-mail]").forEach(function (a) {
      a.hidden = !mail;
      if (mail) {
        a.setAttribute(
          "href",
          "mailto:" + mail + "?subject=" + encodeURIComponent("Rafael Orset — player enquiry")
        );
      }
    });
  }

  function brief(lang) {
    var p = window.FOOT_PLAYER || {};
    var dash = function (v) { return val(v, lang) || "—"; };
    var lines = lang === "fr"
      ? [
          "Rafael Orset — dossier joueur",
          dash(p.status),
          "Nationalité: " + dash(p.nationality),
          "Poste: " + dash(p.position) + " / " + dash(p.positionAlt),
          "Pied: " + dash(p.foot) + " · Taille: " + dash(p.height) + " · Poids: " + dash(p.weight),
          "Né: " + dash(p.dob) + " · " + dash(p.birthplace),
          "Club: " + dash(p.club) + " · " + dash(p.league) + " · Contrat: " + dash(p.contractUntil),
          "Passeport: " + dash(p.passport) + " · Langues: " + dash(p.languages),
          "Contact: " + dash(p.email) + " · " + dash(p.phone),
          "Site: https://rafa-create.github.io/foot-website/"
        ]
      : [
          "Rafael Orset — player file",
          dash(p.status),
          "Nationality: " + dash(p.nationality),
          "Position: " + dash(p.position) + " / " + dash(p.positionAlt),
          "Foot: " + dash(p.foot) + " · Height: " + dash(p.height) + " · Weight: " + dash(p.weight),
          "Born: " + dash(p.dob) + " · " + dash(p.birthplace),
          "Club: " + dash(p.club) + " · " + dash(p.league) + " · Contract: " + dash(p.contractUntil),
          "Passport: " + dash(p.passport) + " · Languages: " + dash(p.languages),
          "Contact: " + dash(p.email) + " · " + dash(p.phone),
          "Site: https://rafa-create.github.io/foot-website/"
        ];
    return lines.join("\n");
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    var titles = window.FOOT_TITLES || {};
    if (titles[lang]) document.title = titles[lang];
    var desc = window.FOOT_DESC || {};
    var meta = document.querySelector('meta[name="description"]');
    if (meta && desc[lang]) meta.setAttribute("content", desc[lang]);
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-set") === lang ? "true" : "false");
    });
    bind(lang);
  }

  function closeSheets() {
    document.querySelectorAll(".sheet").forEach(function (s) {
      s.hidden = true;
    });
    if (location.hash && location.hash !== "#") {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function openSheet(id) {
    if (!id) return;
    document.querySelectorAll(".sheet").forEach(function (s) {
      s.hidden = s.id !== "sheet-" + id;
    });
  }

  function loadPhotos() {
    document.querySelectorAll("[data-photo]").forEach(function (el) {
      var src = el.getAttribute("data-photo");
      if (!src) return;
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = "url('" + src + "')";
        el.classList.add("has-photo");
      };
      img.src = src;
    });
  }

  var lang = readLang();
  document.documentElement.lang = lang;
  if (window.FOOT_TITLES && window.FOOT_TITLES[lang]) {
    document.title = window.FOOT_TITLES[lang];
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(lang);
    loadPhotos();

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () {
        lang = b.getAttribute("data-set");
        apply(lang);
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

    document.querySelectorAll("[data-sheet]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var id = el.getAttribute("data-sheet");
        if (!id || !document.getElementById("sheet-" + id)) return;
        if (el.tagName === "A") e.preventDefault();
        openSheet(id);
        history.replaceState(null, "", "#" + id);
      });
    });

    document.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", closeSheets);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSheets();
    });

    document.querySelectorAll("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var text = brief(document.documentElement.lang === "en" ? "en" : "fr");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        }
      });
    });

    var hash = (location.hash || "").replace("#", "");
    if (hash && document.getElementById("sheet-" + hash)) openSheet(hash);
  });
})();

(function () {
  var KEY = "foot-lang";
  var LANGS = { fr: 1, en: 1, es: 1 };

  function readLang() {
    var q = /(?:\?|&)lang=(en|fr|es)\b/.exec(location.search);
    if (q) return q[1];
    try {
      var s = localStorage.getItem(KEY);
      if (LANGS[s]) return s;
    } catch (e) {}
    var n = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (n === "fr") return "fr";
    if (n === "es") return "es";
    return "en";
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

  function digits(x) { return parseInt(x, 10) || 0; }

  function totals(p) {
    var t = { apps: 0, goals: 0, assists: 0, l1: 0 };
    (p.career || []).forEach(function (r) {
      t.apps += digits(r.apps);
      t.goals += digits(r.goals);
      t.assists += digits(r.assists);
      if (r.competition === "Ligue 1") t.l1 += digits(r.apps);
    });
    return t;
  }

  function phoneDigits(phone) {
    return String(phone || "").replace(/[^\d]/g, "");
  }

  function bind(lang) {
    var p = window.FOOT_PLAYER || {};
    var t = totals(p);
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
      availability: p.availability,
      markets: p.markets,
      passport: p.passport,
      languages: p.languages,
      email: p.email,
      phone: p.phone,
      agent: p.agent,
      formedAt: p.formedAt,
      number: p.number,
      scoutNote: p.scoutNote,
      strength0: (p.strengths && p.strengths[0]) || "",
      strength1: (p.strengths && p.strengths[1]) || "",
      strength2: (p.strengths && p.strengths[2]) || "",
      totApps: String(t.apps),
      totGoals: String(t.goals),
      totAst: String(t.assists),
      totL1: String(t.l1),
      ticker: t.apps + " · " + t.goals + " · " + t.assists
    };
    document.querySelectorAll("[data-k]").forEach(function (el) {
      fill(el, val(map[el.getAttribute("data-k")], lang));
    });

    document.querySelectorAll("[data-career]").forEach(function (body) {
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
      var foot = document.createElement("tr");
      foot.className = "career-total";
      [lang === "es" ? "Total" : "Total", String(t.apps), String(t.goals), String(t.assists)].forEach(function (cell, i) {
        var td = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) td.setAttribute("colspan", "3");
        td.textContent = cell;
        foot.appendChild(td);
      });
      body.appendChild(foot);
    });

    document.querySelectorAll("[data-honours]").forEach(function (hon) {
      hon.innerHTML = "";
      (p.honours || []).forEach(function (h) {
        var li = document.createElement("li");
        li.textContent = val(h, lang);
        hon.appendChild(li);
      });
    });

    var hl = val(p.highlights, lang);
    document.querySelectorAll("[data-highlight]").forEach(function (a) {
      a.hidden = !hl;
      if (hl) a.setAttribute("href", hl);
    });
    document.querySelectorAll("[data-no-highlight]").forEach(function (el) {
      el.hidden = !!hl;
    });

    var mail = val(p.email, lang);
    var subj = encodeURIComponent("Rafael Orset — LW / Ligue 1");
    document.querySelectorAll("[data-mail]").forEach(function (a) {
      a.hidden = !mail;
      if (mail) a.setAttribute("href", "mailto:" + mail + "?subject=" + subj);
    });

    var tel = val(p.phone, lang);
    document.querySelectorAll("[data-tel]").forEach(function (a) {
      a.hidden = !tel;
      if (tel) a.setAttribute("href", "tel:" + tel.replace(/\s/g, ""));
    });
    var wa = phoneDigits(tel);
    if (wa.length === 10 && wa.indexOf("0") === 0) wa = "33" + wa.slice(1);
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.hidden = !wa;
      if (wa) a.setAttribute("href", "https://wa.me/" + wa);
    });
  }

  function brief(lang) {
    var p = window.FOOT_PLAYER || {};
    var t = totals(p);
    var dash = function (v) { return val(v, lang) || "—"; };
    var lines = {
      fr: [
        "Rafael Orset — ailier gauche, Ligue 1",
        dash(p.status),
        "Carrière: " + t.apps + " matches · " + t.goals + " buts · " + t.assists + " passes · " + t.l1 + " en Ligue 1",
        "Poste: " + dash(p.position) + " / " + dash(p.positionAlt) + " · Pied: " + dash(p.foot),
        "1.70 m / 65 kg · Né: " + dash(p.dob) + " · " + dash(p.birthplace),
        "Club: " + dash(p.club) + " · Contrat: " + dash(p.contractUntil) + " · " + dash(p.availability),
        "Passeport: " + dash(p.passport) + " · Langues: " + dash(p.languages),
        "Marchés: " + dash(p.markets),
        "Contact: " + dash(p.email) + " · " + dash(p.phone),
        "Dossier: https://rafa-create.github.io/foot-website/dossier.html"
      ],
      en: [
        "Rafael Orset — left winger, Ligue 1",
        dash(p.status),
        "Career: " + t.apps + " apps · " + t.goals + " goals · " + t.assists + " assists · " + t.l1 + " in Ligue 1",
        "Position: " + dash(p.position) + " / " + dash(p.positionAlt) + " · Foot: " + dash(p.foot),
        "1.70 m / 65 kg · Born: " + dash(p.dob) + " · " + dash(p.birthplace),
        "Club: " + dash(p.club) + " · Contract: " + dash(p.contractUntil) + " · " + dash(p.availability),
        "Passport: " + dash(p.passport) + " · Languages: " + dash(p.languages),
        "Markets: " + dash(p.markets),
        "Contact: " + dash(p.email) + " · " + dash(p.phone),
        "File: https://rafa-create.github.io/foot-website/dossier.html"
      ],
      es: [
        "Rafael Orset — extremo izquierdo, Ligue 1",
        dash(p.status),
        "Carrera: " + t.apps + " partidos · " + t.goals + " goles · " + t.assists + " asistencias · " + t.l1 + " en Ligue 1",
        "Posición: " + dash(p.position) + " / " + dash(p.positionAlt) + " · Pie: " + dash(p.foot),
        "1.70 m / 65 kg · Nacido: " + dash(p.dob) + " · " + dash(p.birthplace),
        "Club: " + dash(p.club) + " · Contrato: " + dash(p.contractUntil) + " · " + dash(p.availability),
        "Pasaporte: " + dash(p.passport) + " · Idiomas: " + dash(p.languages),
        "Mercados: " + dash(p.markets),
        "Contacto: " + dash(p.email) + " · " + dash(p.phone),
        "Ficha: https://rafa-create.github.io/foot-website/dossier.html"
      ]
    };
    return (lines[lang] || lines.en).join("\n");
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

  function pageHref(name) {
    var path = location.pathname || "/";
    if (/\/[^/]+\.html$/.test(path)) {
      return path.replace(/\/[^/]+\.html$/, "/" + name);
    }
    if (path.slice(-1) !== "/") path += "/";
    return path + name;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return copyFallback(text);
      });
    }
    return copyFallback(text);
  }

  function copyFallback(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;width:12em;height:3em;opacity:0.01;z-index:99999;";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) resolve();
      else reject(new Error("copy"));
    });
  }

  function showBrief(text) {
    var box = document.getElementById("brief-fallback");
    if (!box) {
      box = document.createElement("pre");
      box.id = "brief-fallback";
      box.className = "brief-fallback";
      document.body.appendChild(box);
    }
    box.hidden = false;
    box.textContent = text;
    var range = document.createRange();
    range.selectNodeContents(box);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
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

    document.querySelectorAll('a[href^="dossier.html"], a[href^="./dossier.html"]').forEach(function (a) {
      var raw = a.getAttribute("href").replace(/^\.\//, "");
      var q = raw.indexOf("?");
      var name = q === -1 ? raw : raw.slice(0, q);
      var extra = q === -1 ? "" : raw.slice(q);
      a.setAttribute("href", pageHref(name) + extra);
    });
    document.querySelectorAll('a[href="index.html"], a[href="./index.html"]').forEach(function (a) {
      a.setAttribute("href", pageHref("index.html"));
    });

    document.querySelectorAll("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var text = brief(document.documentElement.lang);
        copyText(text).then(function () {
          b.classList.remove("copy-fail");
          b.classList.add("copied");
          setTimeout(function () { b.classList.remove("copied"); }, 1600);
        }).catch(function () {
          showBrief(text);
          b.classList.add("copy-fail");
        });
      });
    });

    document.querySelectorAll("[data-print]").forEach(function (b) {
      b.addEventListener("click", function () {
        window.print();
      });
    });

    if (/\bprint=1\b/.test(location.search)) {
      setTimeout(function () { window.print(); }, 500);
    }

    var hash = (location.hash || "").replace("#", "");
    if (hash && document.getElementById("sheet-" + hash)) openSheet(hash);
  });
})();

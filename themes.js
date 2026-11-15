/* Site skins. Loaded in <head> so the saved skin applies before first paint.
   Amp is the default, and each page's markup already carries it so the page
   is skinned without JavaScript too. Dark is each page's own base styling and
   sets no attribute; other skins set html[data-theme]. A ?skin= query
   parameter selects and saves a skin, so a link can show one. */
(function () {
  "use strict";
  var KEY = "doubleslash-theme";
  var SKINS = ["amp", "dark", "light"];
  var DEFAULT_SKIN = "amp";
  var root = document.documentElement;

  function valid(skin) {
    return SKINS.indexOf(skin) >= 0;
  }

  function save(skin) {
    try { localStorage.setItem(KEY, skin); } catch (e) {}
  }

  function saved() {
    try {
      var skin = localStorage.getItem(KEY);
      return valid(skin) ? skin : DEFAULT_SKIN;
    } catch (e) {
      return DEFAULT_SKIN;
    }
  }

  function apply(skin) {
    if (skin === "dark") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", skin);
    var pickers = document.querySelectorAll("[data-theme-select]");
    for (var i = 0; i < pickers.length; i++) {
      pickers[i].value = skin;
      var wrap = pickers[i].closest(".skin-picker");
      if (wrap) wrap.hidden = false;
    }
  }

  var requested = null;
  try { requested = new URLSearchParams(location.search).get("skin"); } catch (e) {}
  if (valid(requested)) save(requested);

  apply(saved());
  document.addEventListener("DOMContentLoaded", function () { apply(saved()); });
  document.addEventListener("change", function (event) {
    var picker = event.target;
    if (!picker.matches || !picker.matches("[data-theme-select]")) return;
    var skin = valid(picker.value) ? picker.value : DEFAULT_SKIN;
    save(skin);
    apply(skin);
  });
  // Keep other open tabs of the site on the same skin.
  window.addEventListener("storage", function (event) {
    if (event.key === KEY) apply(saved());
  });
})();

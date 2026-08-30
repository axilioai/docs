// Keep every SDK quickstart tab aligned with the language selected by the
// homepage's /quickstart#python and /quickstart#go links. Mintlify normally
// syncs explicit tab clicks, but resolving a Tab id from the URL selects only
// the group that owns that id.
(function () {
  function languageFromLocation() {
    if (window.location.pathname !== "/quickstart") return null;
    var hash = window.location.hash.toLowerCase();
    if (hash === "#python") return "Python";
    if (hash === "#go") return "Go";
    return null;
  }

  function selectLanguageFromHash() {
    var language = languageFromLocation();
    if (!language) return;

    var tabs = Array.prototype.filter.call(
      document.querySelectorAll('main [role="tab"]'),
      function (tab) {
        return tab.textContent.trim() === language;
      }
    );
    var unselected = tabs.find(function (tab) {
      return tab.getAttribute("aria-selected") !== "true";
    });
    if (unselected) unselected.click();
  }

  selectLanguageFromHash();
  window.setTimeout(selectLanguageFromHash, 300);
  window.setTimeout(selectLanguageFromHash, 1000);

  ["pushState", "replaceState"].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      window.setTimeout(selectLanguageFromHash, 80);
      return result;
    };
  });
  window.addEventListener("hashchange", function () {
    window.setTimeout(selectLanguageFromHash, 80);
  });
  window.addEventListener("popstate", function () {
    window.setTimeout(selectLanguageFromHash, 80);
  });
})();

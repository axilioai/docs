// Give each top-level surface its own accent color so you always know which one
// you're in: Platform (green), Drivers (violet), API Reference (amber).
//
// Mintlify drives its accent from the --primary / --primary-light / --primary-dark
// CSS variables; style.css overrides them per `data-surface`. Here we just set
// `data-surface` on <html> from the current path, and keep it in sync as you
// navigate (Mintlify is a single-page app, so we re-apply on history changes).
//
// Mintlify auto-includes any .js file in the content directory on every page
// (https://mintlify.com/docs/settings/custom-scripts).
(function () {
  function surfaceFor(path) {
    if (path.indexOf("/driver") === 0) return "driver"; // /driver/* and /drivers/*
    if (path.indexOf("/api-reference") === 0) return "api";
    return "platform";
  }

  function apply() {
    document.documentElement.setAttribute("data-surface", surfaceFor(location.pathname));
  }

  apply();

  // Re-apply on client-side navigation.
  ["pushState", "replaceState"].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      apply();
      return result;
    };
  });
  window.addEventListener("popstate", apply);
})();

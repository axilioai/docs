// Open the Platform / Driver / API Reference section tabs in a new browser tab.
//
// These three are internal Mintlify sections (they own their own sidebars), so
// by default the top-bar tabs navigate in place. Product direction is for each
// to open in a new browser tab — the way the external GitHub / Dashboard tabs
// already do — so a reader can keep, say, the Driver reference open beside the
// Platform docs. There's no docs.json field for this, so we intercept the click.
//
// Mintlify auto-includes any .js file in the content directory on every page
// (see https://mintlify.com/docs/settings/custom-scripts). The listener is
// registered in the capture phase on document so it runs before the SPA router's
// own handler; stopImmediatePropagation keeps the router from also navigating in
// place, so only the new tab opens.
(function () {
  var NEW_TAB_TABS = ["platform", "driver", "api reference"];

  document.addEventListener(
    "click",
    function (e) {
      var anchor = e.target.closest && e.target.closest(".nav-tabs .nav-tabs-item");
      if (!anchor) return;

      var label = (anchor.textContent || "").trim().toLowerCase();
      if (NEW_TAB_TABS.indexOf(label) === -1) return;

      var href = anchor.getAttribute("href");
      if (!href) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      window.open(href, "_blank", "noopener");
    },
    true
  );
})();

// Live pricing tables. Instead of hardcoding prices, the docs fetch them from the
// public, CORS-open billing endpoints at view time, so they're never stale:
//   GET /api/v1/billing/plans
//   GET /api/v1/billing/phone-rental-plans
//
// A page opts in by including an empty element:
//   <div id="axilio-plans" />          -> the subscription plans table
//   <div id="axilio-rental-plans" />   -> the dedicated-device rental table
//
// Mintlify auto-includes any .js file in the content directory on every page
// (https://mintlify.com/docs/settings/custom-scripts). We render plain <table>s,
// which pick up the docs' existing table styling.
(function () {
  var API = "https://api.axilio.ai/api/v1";
  var ARGUS = "https://argus.axilio.ai/api/v1";

  function dollars(cents) { return "$" + (cents / 100).toFixed(2); }
  function fromMicro(micro) { return "$" + (micro / 1e6).toFixed(2); }
  function perHour(microPerSec) { return "$" + ((microPerSec * 3600) / 1e6).toFixed(2); }
  function perMillion(dollarsPerToken) { return "$" + (parseFloat(dollarsPerToken) * 1e6).toFixed(2); }
  function contextWindow(n) { return n >= 1e6 ? (n / 1e6) + "M" : Math.round(n / 1000) + "K"; }

  function buildTable(headers, rows) {
    var head = "<thead><tr>" + headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead>";
    var body = "<tbody>" + rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    return "<table>" + head + body + "</table>";
  }

  function fallback(el) {
    el.innerHTML = "<p>See the <a href=\"https://axilio.ai\">pricing page</a> for current prices.</p>";
  }

  function renderPlans(el) {
    fetch(API + "/billing/plans").then(function (r) { return r.json(); }).then(function (d) {
      var plans = (d.plans || []).filter(function (p) { return p.is_available; })
        .sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });
      if (!plans.length) { return fallback(el); }
      var rows = plans.map(function (p) {
        var pr = p.pricing || {};
        var custom = p.tier === "enterprise";
        return [
          "<strong>" + p.name + "</strong>",
          custom ? "Custom" : (pr.monthly_price_cents ? dollars(pr.monthly_price_cents) + "/mo" : "Free"),
          custom ? "—" : fromMicro(pr.included_balance_microdollars || 0),
          custom ? "—" : perHour(pr.price_per_second_microdollars || 0),
          (p.limits || {}).max_concurrent_runs
        ];
      });
      el.innerHTML = buildTable(
        ["Plan", "Price", "Included balance", "Per device hour", "Concurrent runs"], rows
      );
    }).catch(function () { fallback(el); });
  }

  function renderRentals(el) {
    fetch(API + "/billing/phone-rental-plans").then(function (r) { return r.json(); }).then(function (d) {
      var order = { day: 0, week: 1, month: 2 };
      var plans = (d.plans || []).filter(function (p) { return p.is_available; })
        .sort(function (a, b) { return (order[a.interval] || 9) - (order[b.interval] || 9); });
      if (!plans.length) { return fallback(el); }
      var rows = plans.map(function (p) {
        return ["<strong>" + p.name + "</strong>", dollars(p.price_cents), "per " + p.interval];
      });
      el.innerHTML = buildTable(["Rental", "Price", "Billed"], rows);
    }).catch(function () { fallback(el); });
  }

  function renderModels(el) {
    fetch(ARGUS + "/inference/models").then(function (r) { return r.json(); }).then(function (d) {
      var models = (d.data || []).filter(function (m) { return m.type === "vlm"; })
        .sort(function (a, b) { return a.name < b.name ? -1 : 1; });
      if (!models.length) { return fallback(el); }
      var rows = models.map(function (m) {
        var pr = m.pricing || {};
        return [
          "<strong>" + m.name + "</strong>",
          m.owned_by || "",
          contextWindow(m.context_window || 0),
          perMillion(pr.input || 0),
          perMillion(pr.output || 0)
        ];
      });
      el.innerHTML = buildTable(["Model", "Provider", "Context", "Input / 1M", "Output / 1M"], rows);
    }).catch(function () { fallback(el); });
  }

  function run() {
    var p = document.getElementById("axilio-plans");
    if (p && !p.dataset.loaded) { p.dataset.loaded = "1"; renderPlans(p); }
    var r = document.getElementById("axilio-rental-plans");
    if (r && !r.dataset.loaded) { r.dataset.loaded = "1"; renderRentals(r); }
    var m = document.getElementById("axilio-models");
    if (m && !m.dataset.loaded) { m.dataset.loaded = "1"; renderModels(m); }
  }

  run();
  setTimeout(run, 300);
  setTimeout(run, 1000);
  ["pushState", "replaceState"].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { var x = orig.apply(this, arguments); setTimeout(run, 80); return x; };
  });
  window.addEventListener("popstate", function () { setTimeout(run, 80); });
})();

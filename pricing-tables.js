// Live pricing tables. Instead of hardcoding prices, the docs fetch them from the
// public, CORS-open billing endpoints at view time, so they're never stale:
//   GET /api/v1/billing/plans
//   GET /api/v1/billing/phone-rental-plans
//
// A page opts in by including an empty element:
//   <div id="axilio-org-plans" />      -> the organization plans table
//   <div id="axilio-plan-retention" /> -> each plan's Telemetry access window
//   <div id="axilio-rental-plans" />   -> the dedicated-phone rental cards
//   <div id="axilio-models" />         -> the vision-language models table
//   <div id="axilio-argus-models" />   -> the Axilio (argus) model line table
//
// Mintlify auto-includes any .js file in the content directory on every page
// (https://mintlify.com/docs/settings/custom-scripts). We render plain <table>s,
// which pick up the docs' existing table styling.
(function () {
  var API = "https://api.axilio.ai/api/v1";
  var ARGUS = "https://argus.axilio.ai/api/v1";

  function dollars(cents) { return "$" + (cents / 100).toFixed(2); }
  function microdollars(n) { return "$" + (n / 1e6).toFixed(2); }
  function perMillion(dollarsPerToken) { return "$" + (parseFloat(dollarsPerToken) * 1e6).toFixed(2); }
  function contextWindow(n) { return n >= 1e6 ? (n / 1e6) + "M" : Math.round(n / 1000) + "K"; }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

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

  function fetchPlans() {
    return fetch(API + "/billing/plans").then(function (r) { return r.json(); }).then(function (d) {
      return (d.plans || []).filter(function (p) { return p.is_available; })
        .sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });
    });
  }

  // A plan with no subscription price and no phone-time rate is negotiated
  // per contract (Enterprise), so its numbers are placeholders, not terms.
  function isCustom(p) {
    var pr = p.pricing || {};
    return !pr.monthly_price_cents && !pr.price_per_second_microdollars;
  }

  function days(n) { return n === 1 ? "1 day" : n + " days"; }

  function renderOrgPlans(el) {
    fetchPlans().then(function (plans) {
      if (!plans.length) { return fallback(el); }
      var rows = plans.map(function (p) {
        var pr = p.pricing || {};
        var lim = p.limits || {};
        var custom = isCustom(p);
        var price = custom ? "Custom" : pr.monthly_price_cents ? dollars(pr.monthly_price_cents) + "/month" : "Free";
        // A free plan's credit is the one-time welcome balance; a paid plan's
        // is granted again with every paid invoice.
        var credit = custom ? "Custom" : !pr.included_balance_microdollars ? "None"
          : microdollars(pr.included_balance_microdollars) + (pr.monthly_price_cents ? "/month" : " at sign-up");
        var rate = custom ? "Custom" : microdollars(pr.price_per_second_microdollars * 3600) + "/hour";
        return [
          "<strong>" + escapeHTML(p.name) + "</strong>",
          price,
          credit,
          rate,
          custom ? "Custom" : String(lim.max_concurrent_runs || ""),
          lim.max_workflows ? String(lim.max_workflows) : "Unlimited",
          lim.log_retention_days ? days(lim.log_retention_days) : ""
        ];
      });
      el.innerHTML = buildTable(["Plan", "Price", "Included credit", "Shared-pool phone time", "Concurrent runs", "Saved workflows", "Log and Telemetry retention"], rows);
    }).catch(function () { fallback(el); });
  }

  function renderPlanRetention(el) {
    fetchPlans().then(function (plans) {
      var rows = plans.filter(function (p) { return (p.limits || {}).log_retention_days; }).map(function (p) {
        return ["<strong>" + escapeHTML(p.name) + "</strong>", days(p.limits.log_retention_days)];
      });
      if (!rows.length) { return fallback(el); }
      el.innerHTML = buildTable(["Plan", "Telemetry access window"], rows);
    }).catch(function () { fallback(el); });
  }

  function renderRentals(el) {
    fetch(API + "/billing/phone-rental-plans").then(function (r) { return r.json(); }).then(function (d) {
      var order = { day: 0, week: 1, month: 2 };
      var plans = (d.plans || []).filter(function (p) {
        return p.is_available && Object.prototype.hasOwnProperty.call(order, p.interval);
      })
        .sort(function (a, b) {
          var aOrder = Object.prototype.hasOwnProperty.call(order, a.interval) ? order[a.interval] : 9;
          var bOrder = Object.prototype.hasOwnProperty.call(order, b.interval) ? order[b.interval] : 9;
          return aOrder - bOrder;
        });
      if (!plans.length) { return fallback(el); }
      var cards = plans.map(function (p) {
        var features = ["Unlimited phone hours"].concat(p.features || []);
        var featureList = features.map(function (feature) {
          return "<li><span aria-hidden=\"true\">✓</span>" + escapeHTML(feature) + "</li>";
        }).join("");
        var popular = p.is_popular
          ? "<div class=\"axilio-rental-badge\">Best value</div>"
          : "";
        return [
          "<article class=\"axilio-rental-card" + (p.is_popular ? " is-popular" : "") + "\">",
          popular,
          "<div class=\"axilio-rental-eyebrow\">Dedicated phone</div>",
          "<h3>" + escapeHTML(p.name) + "</h3>",
          "<div class=\"axilio-rental-price\"><strong>" + dollars(p.price_cents) + "</strong><span>/" + escapeHTML(p.interval) + "</span></div>",
          "<div class=\"axilio-rental-per-phone\">per phone</div>",
          "<ul>" + featureList + "</ul>",
          "</article>"
        ].join("");
      });
      el.innerHTML = "<div class=\"axilio-rental-grid\">" + cards.join("") + "</div>";
    }).catch(function () { fallback(el); });
  }

  function fetchModels() {
    // argus 2.0 moved the catalog from /vision/models to /models; try the new
    // path first and fall back to the old one so the tables keep rendering
    // across the deploy boundary.
    return fetch(ARGUS + "/models").then(function (r) {
      if (!r.ok) { throw new Error("models path not deployed"); }
      return r.json();
    }).catch(function () {
      return fetch(ARGUS + "/vision/models").then(function (r) { return r.json(); });
    });
  }

  function renderModels(el) {
    fetchModels().then(function (d) {
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

  // How each Axilio model is selected from the SDK — the catalog carries the
  // ids and prices; this column answers "what do I type to get it".
  var AXILIO_USAGE = {
    "axilio/argus-detect-1": "Included in every screen read",
    "axilio/argus-ocr-lite-1": "<code>ocr_engine=\"free\"</code> (text-only)",
    "axilio/argus-ocr-pro-1": "<code>ocr_engine=\"premium\"</code> (text-only)",
    "axilio/argus-vision-lite-1": "The default",
    "axilio/argus-vision-pro-1": "<code>ocr_engine=\"premium\"</code>"
  };

  function renderAxilioModels(el) {
    fetchModels().then(function (d) {
      var models = (d.data || []).filter(function (m) { return (m.id || "").indexOf("axilio/") === 0; })
        .sort(function (a, b) { return a.id < b.id ? -1 : 1; });
      if (!models.length) { return fallback(el); }
      var rows = models.map(function (m) {
        var pr = m.pricing || {};
        var price = pr.per_page ? "$" + pr.per_page + " per call" : "Free";
        return [
          "<strong>" + m.name + "</strong>",
          "<code>" + m.id + "</code>",
          AXILIO_USAGE[m.id] || "",
          price
        ];
      });
      el.innerHTML = buildTable(["Model", "Id", "How you get it", "Price"], rows);
    }).catch(function () { fallback(el); });
  }

  function run() {
    // div#… (not getElementById): Mintlify slugifies headings into element ids,
    // so a heading like "## Axilio models" also carries id="axilio-models" and
    // getElementById would hand us the heading instead of our anchor div.
    var op = document.querySelector("div#axilio-org-plans");
    if (op && !op.dataset.loaded) { op.dataset.loaded = "1"; renderOrgPlans(op); }
    var pr = document.querySelector("div#axilio-plan-retention");
    if (pr && !pr.dataset.loaded) { pr.dataset.loaded = "1"; renderPlanRetention(pr); }
    var r = document.querySelector("div#axilio-rental-plans");
    if (r && !r.dataset.loaded) { r.dataset.loaded = "1"; renderRentals(r); }
    var m = document.querySelector("div#axilio-models");
    if (m && !m.dataset.loaded) { m.dataset.loaded = "1"; renderModels(m); }
    var am = document.querySelector("div#axilio-argus-models");
    if (am && !am.dataset.loaded) { am.dataset.loaded = "1"; renderAxilioModels(am); }
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

// Render the homepage's one-click agent prompt button. Mintlify auto-includes
// root-level JavaScript on every page, so the page opts in with a matching div.
(function () {
  var PROMPT = [
    "Help me set up Axilio and complete one useful task on my organization's",
    "dedicated Android phone. Explain things plainly, do the steps you can",
    "perform, and guide me through any human steps. Continue beyond installation",
    "until we have a useful result or a specific blocker.",
    "",
    "1. Check your execution environment first.",
    "   Determine whether you can run terminal commands, which machine those",
    "   commands run on, and its operating system and shell. Use that environment's",
    "   installation instructions. If you cannot execute commands, explain how to",
    "   continue in a terminal-capable agent. Do not imply that installing software",
    "   on my computer gives a separate cloud chat access to it.",
    "",
    "2. Establish the first task.",
    "   Use any app, phone, and task I have already named. Otherwise, ask which app",
    "   I want to use and what first result I want. Suggest a small read-only example",
    "   if needed, such as opening Reddit and summarizing the first visible post.",
    "   Use an existing project or a simple working folder.",
    "",
    "3. Prepare Axilio.",
    "   Read https://api.axilio.ai/api/v1/skill and https://docs.axilio.ai/cli.",
    "   Check for an existing CLI installation and install or update from the",
    "   documented official source as needed. Verify with `axilio --version`.",
    "",
    "   Run `axilio init` with the appropriate `--agent` when needed, preserve",
    "   existing project instructions, and read the resulting skill. Consult",
    "   installed command help before guessing syntax.",
    "",
    "   Run `axilio doctor` to verify readiness. Reuse valid authentication. If",
    "   authentication is missing or a command exits with status 3, ask me to run",
    "   `axilio login` in the same environment. For a headless environment, guide",
    "   me to provide `AXILIO_API_KEY` through its secure secret settings. Never",
    "   ask for credentials in chat or print or commit them. Verify again and",
    "   resume where you stopped.",
    "",
    "4. Find the right phone.",
    "   Use `axilio phones mine` to inspect my organization's inventory and",
    "   `axilio phones list` to check immediate availability. Prefer the phone I",
    "   named and pin sessions to its ID.",
    "",
    "   If it is missing, busy, offline, or out of service, explain the specific",
    "   blocker and next step. Do not silently switch phones, use a shared phone,",
    "   end somebody else's session, or purchase another rental.",
    "",
    "5. Complete the first task.",
    "   Before starting, explain that the session may consume credits and produce",
    "   screen recordings and Telemetry. Get approval for the selected phone and",
    "   the bounded task unless I already approved that scope.",
    "",
    "   Start the session and observe to verify access, then continue with the task.",
    "   Check whether the app is installed and signed in. Ask before installing it;",
    "   have me complete app sign-in or verification through the Dashboard when",
    "   necessary.",
    "",
    "   Use semantic selectors, perform one action at a time, and observe the result.",
    "   Continue ordinary navigation within the approved scope without repeatedly",
    "   asking permission. Obtain explicit approval before posting, messaging,",
    "   purchasing, liking, following, changing account settings, or expanding",
    "   the task.",
    "",
    "6. Finish and make it repeatable.",
    "   Release sessions you started when finished, after errors, and before a long",
    "   human handoff. Confirm release before clearing the session reference.",
    "",
    "   Show the useful result, then produce a standalone SDK script for the proven",
    "   flow. Use my preferred or project language; otherwise use Python. Keep the",
    "   dedicated phone configurable, preserve cleanup, and explain how to run it",
    "   with securely supplied SDK credentials. Clearly identify anything untested.",
    "   Create an Axilio workflow only if I ask."
  ].join("\n");

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function (resolve, reject) {
      var input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();

      try {
        if (!document.execCommand("copy")) throw new Error("copy was rejected");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        input.remove();
      }
    });
  }

  function render() {
    var root = document.querySelector("div#axilio-agent-prompt-copy");
    if (!root || root.dataset.loaded) return;
    root.dataset.loaded = "1";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "axilio-copy-prompt-button";
    button.setAttribute("aria-live", "polite");
    button.innerHTML = [
      '<svg viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />',
      '<rect x="3" y="8" width="13" height="13" rx="2" />',
      "</svg>",
      "<span>Copy prompt</span>"
    ].join("");

    button.addEventListener("click", function () {
      var label = button.querySelector("span");
      button.disabled = true;

      copyText(PROMPT).then(function () {
        label.textContent = "Copied";
        button.dataset.state = "copied";
      }).catch(function (error) {
        label.textContent = "Copy failed";
        console.error("Unable to copy the Axilio agent prompt", error);
      }).finally(function () {
        window.setTimeout(function () {
          label.textContent = "Copy prompt";
          button.disabled = false;
          delete button.dataset.state;
        }, 2000);
      });
    });

    root.appendChild(button);
  }

  render();
  window.setTimeout(render, 300);
  window.setTimeout(render, 1000);
  ["pushState", "replaceState"].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      window.setTimeout(render, 80);
      return result;
    };
  });
  window.addEventListener("popstate", function () {
    window.setTimeout(render, 80);
  });
})();

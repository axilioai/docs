// Render the homepage's one-click agent prompt button. Mintlify auto-includes
// root-level JavaScript on every page, so the page opts in with a matching div.
(function () {
  var PROMPT = [
    "Set up Axilio in this project and help me explore a mobile task on one of",
    "my organization's dedicated phones. Use the CLI for careful exploration,",
    "then produce a standalone Python or Go SDK script for the proven flow.",
    "Pause whenever a human must authenticate or approve an action.",
    "",
    "1. Install the current Axilio CLI from an official source:",
    "   - macOS with Homebrew: brew install axilioai/tap/axilio",
    "   - macOS or Linux: curl -fsSL https://axilio.ai/install.sh | sh",
    "   Verify the install with `axilio --version`.",
    "",
    "2. Run `axilio init` in this project and read the instructions it creates.",
    "   Before guessing at a command, use `axilio --help`,",
    "   `axilio <command> --help`, `man axilio`, or `axilio help --html`.",
    "",
    "3. Authentication is a human step. Ask me to run `axilio login` in my own",
    "   terminal, or to set `AXILIO_API_KEY` outside this conversation for a",
    "   non-interactive environment. If `axilio init` exits with status 3, stop",
    "   and ask me to complete `axilio login`. Never ask me to paste credentials",
    "   into chat, print them, or put them in source control. After I confirm",
    "   authentication, run `axilio doctor`.",
    "",
    "4. Ask my permission to allocate a dedicated phone, then verify access with",
    "   a non-destructive observation. Explain that opening and stopping the session",
    "   changes platform state and, unless disabled by session or organization",
    "   policy, produces a screen recording and Telemetry:",
    "   - Run `axilio phones list` and choose an active dedicated phone.",
    "   - Start it with",
    "     `eval \"$(axilio sessions start --phone-id <phone-id> --export)\"`.",
    "   - Run `axilio phone observe -o json` and summarize only what is needed to",
    "     confirm that control works. Do not open Android Settings or change the",
    "     phone, an app, or an account during this check.",
    "   - Always clean up, including after an error:",
    "     `if [ -n \"${AXILIO_SESSION:-}\" ]; then axilio sessions stop \"$AXILIO_SESSION\" --yes; unset AXILIO_SESSION; fi`.",
    "",
    "5. Use https://docs.axilio.ai and the installed CLI help as the current",
    "   interface contract. The CLI source is https://github.com/axilioai/cli.",
    "   The interactive guide is",
    "   https://docs.axilio.ai/guides/search-x-with-the-interactive-cli.",
    "",
    "After the read-only check succeeds, ask what mobile task I want to automate",
    "and whether the durable script should use Python or Go. Get approval before",
    "actions that create content, communicate, purchase, follow, like, change",
    "account state, or affect another person. Explore one approved action at a",
    "time, observe after each action, and always release the phone. Return a",
    "standalone SDK script; create an Axilio workflow only if I explicitly ask."
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

// Render the homepage's one-click agent prompt button. Mintlify auto-includes
// root-level JavaScript on every page, so the page only needs to opt in with
// <div id="axilio-agent-prompt-copy" />.
(function () {
  var PROMPT = [
    "Set up Axilio in this project: install the CLI, load its agent instructions,",
    "authenticate me securely, and prove the setup by controlling a live phone",
    "session. Then use Axilio to implement my mobile automation requests. Take",
    "ownership of setup, but pause for my permission whenever you need to create",
    "credentials or change my account.",
    "",
    "1. Install the current Axilio CLI from an official source:",
    "   - macOS with Homebrew: brew install axilioai/tap/axilio",
    "   - macOS or Linux: curl -fsSL https://axilio.ai/install.sh | sh",
    "   Verify the install with `axilio --version`.",
    "",
    "2. Load Axilio's agent instructions. Run `axilio init` in my project, read the",
    "   instruction file it creates, and follow it. If the command cannot configure",
    "   this coding agent, read the canonical instructions at",
    "   https://api.axilio.ai/api/v1/skill and follow them for this task. Before",
    "   guessing at a command, consult `axilio --help`, `axilio <command> --help`,",
    "   and `man axilio`. You can also run `axilio help --html` for the installed",
    "   browser reference.",
    "",
    "3. Help me authenticate with an API key. Ask me whether I want to create one",
    "   myself at https://app.axilio.ai/api-keys?create=1 or authorize you to use an",
    "   already signed-in browser to create one for me. If you have browser-control",
    "   tools, offer to perform that browser flow, but wait for my explicit approval",
    "   before creating the key. Never ask me to paste a key into chat or expose it",
    "   in logs. Have me enter it directly in my terminal and store it with the CLI,",
    "   or set `AXILIO_API_KEY` outside the conversation. Confirm authentication by",
    "   rerunning `axilio doctor`.",
    "",
    "4. Run one small, harmless test on a newly allocated phone:",
    "   - Start and pin a session with `eval \"$(axilio sessions start --export)\"`.",
    "   - Run `axilio phone observe -o json`.",
    "   - From that observation, choose a harmless visible target such as the",
    "     Settings app. Interact with it using a semantic command such as",
    "     `axilio phone tap --query \"the Settings app\"`, then observe again to verify",
    "     the screen changed. Do not use raw coordinates when a semantic target is",
    "     available.",
    "   - Always release the phone with",
    "     `axilio sessions stop \"$AXILIO_SESSION\" --yes`, even if the test fails.",
    "",
    "5. Use these sources as your reference material:",
    "   - CLI source and install guide: https://github.com/axilioai/cli",
    "   - Axilio docs: https://docs.axilio.ai",
    "   - Interactive CLI guide:",
    "     https://docs.axilio.ai/guides/search-x-with-the-interactive-cli",
    "   - REST API reference: https://docs.axilio.ai/api-reference/overview",
    "   - Driver reference: https://docs.axilio.ai/driver/overview",
    "   - Workflows: https://docs.axilio.ai/workflows/overview",
    "",
    "Once the test succeeds, summarize what you verified and ask what mobile task I",
    "want to implement. Explore the task one action at a time with the CLI, observe",
    "after each action, and always release the phone. Then give me a durable Python",
    "or Go SDK workflow that reproduces the successful interaction without requiring",
    "you to remain in the loop."
  ].join("\n");

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var input = document.createElement("textarea");
      input.value = text;
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
  window.addEventListener("popstate", function () { window.setTimeout(render, 80); });
})();

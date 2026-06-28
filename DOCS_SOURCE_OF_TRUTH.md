# Axilio Docs — Source of Truth & Content Readiness

> Companion to `WRITING_GUIDE.md`. That doc says *how* to write; this doc says
> *what is true* and *what is still undecided*, so no page invents a method,
> claim, or price. Everything below is extracted from the codebase
> (`platform-python/`, `axilio/backend`, `axilio/argus`, frontend) as of
> backend `v0.25.0`, SDK `v0.2.0`, Argus `v1.1.1`.
>
> **Read this before writing any page.** The `WRITING_GUIDE.md` rule "examples
> must match the actual SDK — no invented names" is only enforceable against the
> facts captured here.

---

## 0. The one constraint that shapes everything

**Most of the SDK is not implemented yet.** Method *signatures* are final, but the
bodies raise `NotImplementedError("... codegen pending")`. Only the on-device
control surface actually runs today.

| Area | Status | Can we show runnable examples? |
|---|---|---|
| `MobileDriver`, `Element`, `Screen`, `Key`, driver exceptions | ✅ **Implemented** | Yes — real, runnable |
| `Client` construction, `.api_key`/`.base_url`/`.mode`, sandbox detection | ✅ **Implemented** | Yes |
| `client.mobile.allocate/deallocate/session` | ⚠️ Signature only (`NotImplementedError`) | Show as the intended API; mark pre-release |
| `client.runs.*`, `client.workflows.*` | ⚠️ Signature only | Same |
| `client.usage.*`, `client.billing.*`, `client.org.*`, `client.api_keys.*` | ⚠️ Signature only | Same |
| `client.argus.infer/locate`, `DeviceHandle.call` | ⚠️ Signature only | Same |

**Implication for the rewrite:** we have two honest options, and should pick one
per page (see §6 "Open decisions"):
1. **Document the intended surface now** (signatures are stable) with a clear
   pre-release / early-access banner, OR
2. **Only ship pages whose code actually runs** (driver-centric) and stub the rest
   until codegen lands.

The signatures *are* stable, so option 1 is viable — but every such page needs an
honest status callout. Do **not** present codegen-pending methods as if a reader
can run them today without a caveat.

---

## 1. Source-of-truth map (where each fact lives)

| Fact you need | Authoritative source |
|---|---|
| SDK package name, version, deps, Python floor | `platform-python/pyproject.toml` (`axilio`, 0.2.0, Py≥3.10, httpx+attrs) |
| SDK public surface (classes/methods/signatures) | `platform-python/src/axilio/**` — see §3 |
| Real runnable usage examples | `platform-python/README.md` |
| HTTP API endpoints, auth, base URL | `axilio/backend/internal/routers/**/huma.go`, `humax/humax.go`, `version/version.go` |
| Live OpenAPI spec | backend `GET /openapi.json` or `./backend --openapi`; argus `/openapi.json` or `python -m argus --openapi` |
| Argus vision endpoints + schemas | `axilio/argus/routers/inference_router.py`, `commons/types/argus/**` |
| Product positioning / taglines | `axilio/frontend/components/landing/{hero,features-grid,pricing-section}.tsx`, `docs/DESIGN.md` |
| Billing model + plan data | `axilio/frontend/lib/billing/types.ts`, `billing-auth-attribution-flow.md` |
| IA proposal for the rewrite | `docs/PLAN.md` |

There is **no checked-in OpenAPI file** — it's generated at runtime. To wire the
reference tab's `openapi:` frontmatter, we must first dump the spec
(`./backend --openapi` → commit as `api-reference/openapi.json`) and feed it to
Mintlify. That's a prerequisite task, not page-writing.

---

## 2. Settled product positioning (reuse this copy verbatim)

These are live on the marketing site / design system — safe to use:

- **Category / eyebrow:** "The Phone Cloud"
- **Tagline (H1):** **"The Phone Cloud for Agents"**
- **One-liner:** *"Real Android phones on carrier networks, with a vision-native
  SDK, hosted code editor, and full session replay for debugging mobile agents in
  production."*
- **Thesis framing (DESIGN.md):** programmatic access to *real, physical Android
  phones on live carrier networks, driven by a vision-native Python SDK.*
- **Pricing line:** *"From $0.65/phone hour. All plans include carrier-grade IPs.
  No setup fees. Cancel anytime."* / *"Billed per second of automation. Unused
  balance does not roll over."*

**The "no API at all" thesis** (the Browserbase "~15% of the web has an API"
analog): most mobile apps have **no public API** — the only way an agent can use
them is to drive a real phone. That's the wedge. Write it with a concrete contrast.

### Six core value props (from `features-grid.tsx`)
1. **Real hardware** — genuine Android phones, authentic sensors/fingerprints/OS behavior
2. **Carrier networks** — real telco SIMs, production connectivity
3. **Parallel execution** — concurrent isolated sessions, automatic load balancing
4. **Vision-native** — natural-language `find(query=...)` on vision models
5. **Predictable pricing** — per-second billing, no data/proxy fees
6. **Replay & traces** — full session replay, SDK step traces, per-vision-call cost

---

## 3. Hard product facts (verified)

### Primitives & their real names
- **Device allocation** — the core resource. `client.mobile.session(...)` (context
  manager) or `allocate()`/`deallocate()`. Yields a **`DeviceHandle`**.
- **`MobileDriver`** — the control surface; wraps a `DeviceHandle` (transport).
  - Text/OCR selectors: `find_text`, `find_all_text`, `wait_for_text`, `wait_until_gone`
  - Vision/VLM selector: `find(query=...)` (raises `ElementNotFoundError`)
  - Observation: `observe()` → `Screen`; `screenshot()` → `bytes`
  - Raw input: `tap`, `long_press`, `swipe`, `type_text`, `key_press(Key.*)`
- **`Element`** (returned by selectors): `.tap()`, `.long_press()`, `.type_into()`,
  `.swipe_to()`; fields `bbox`, `center`, `confidence`, `text`, `source` ("ocr"|"vlm").
  - ⚠️ `find_text()` returns `Element | None` — `.tap()` on a miss crashes. The
    "guard or use `wait_for_text`" guidance is correct and worth keeping.
- **`Screen`** (from `observe()`): `texts`, `icons`, `hash`, `width/height`,
  `captured_at`; query with `.find_text()` / `.find_all_text()` (no re-capture).
- **`Argus`** — the vision service behind `find()`; also exposed directly as
  `client.argus.infer()` / `.locate()` (codegen-pending).
- **Workflows & Runs** — a *workflow* is stored Python (`code`), a *run* is one
  execution. `client.workflows.*` / `client.runs.*` (codegen-pending).
- **Sandbox mode** — same script runs locally or inside a managed run; `Client`
  auto-detects via `AXILIO_SANDBOX_TOKEN` + `AXILIO_ATLAS_ENDPOINT`
  (`client.mode` → `LOCAL`|`SANDBOX`). Write attempts in sandbox raise
  `SandboxPermissionError`. This is real and implemented.

### Client / auth / connection facts
- **Install:** `pip install axilio` (Python ≥ 3.10).
- **Construct:** `from axilio.platform import Client` → `Client()` reads
  `AXILIO_API_KEY`. Drivers: `from axilio.drivers import MobileDriver`.
- **Env vars:** `AXILIO_API_KEY` (required), `AXILIO_BASE_URL`
  (default **`https://api.axilio.ai`**), `AXILIO_SANDBOX_TOKEN`,
  `AXILIO_ATLAS_ENDPOINT`, `AXILIO_SDK_SOCKET` (sandbox daemon).
- **HTTP auth header:** **`X-Axilio-Api-Key: axl_...`** for API keys; dashboard
  uses `Authorization: Bearer <Clerk JWT>`.
- **API key prefix:** **`axl_`** (NOT `ax_live_`).
- **Base API path:** **`/api/v1`**. Backend version **0.25.0**.
- **Platform values:** `Literal["android", "iphone"]` — but **only Android is real**
  in production today (see open decisions).

### Exceptions (real, two families)
- Platform/API (`axilio.platform`): `AxilioError` (base, carries `status_code`),
  `UnauthorizedError` (401), `NotFoundError` (404), `RateLimitError` (429, auto-retried),
  `ServerError` (5xx, auto-retried), `SandboxPermissionError`, `AllocationMismatchError`.
- Driver (`axilio.drivers`): `AxilioError` (base, `code`/`retryable`),
  `ElementNotFoundError`, `TimeoutError` (retryable), `DeviceOfflineError` (retryable),
  `NoAllocationError`, `NotConnectedError`, `ConnectionError`, `CanceledError`,
  `InvalidArgsError`, `UnknownOpError`, `InternalError`, `UnauthorizedError`.

### Argus vision API (real HTTP surface)
- `GET /api/v1/inference/models` — public, lists VLMs + pricing + context window.
- `POST /api/v1/inference/infer` — OCR + YOLO icon detection on a base64 image;
  auth + positive balance required. Request: `image, inference_type
  (yolo|ocr|combined), confidence_threshold, nms_iou_threshold, ocr_engine`.
- `POST /api/v1/inference/locate` — VLM element finder; `image, texts[], query,
  model?`; returns `found, bbox|matched_text_index, confidence, cost_microdollars,
  tokens, latency_ms`. Auth + balance required.

### Billing model (real)
- **Per-second** billing of device time, allocate → deallocate; stored as
  `price_per_second_microdollars`, displayed per phone-hour. Balance in
  **microdollars** (`Balance.microdollars`, `.dollars`).
- **Three billing streams:** device sessions, inference (Argus) calls, balance
  events — fan out via Kinesis → ClickHouse.
- **Inference is billed separately** from device time (vision calls cost extra).
- **Plans:** ⚠️ two sources disagree — SDK `Subscription.plan` literal is
  `free|hobby|pro|business|enterprise`; frontend shows `Hobby|Pro|Scale|Enterprise`.
  **Must reconcile before writing billing/plans pages** (see open decisions).
- **Device rentals** ("Dedicated Phones") are a separate subscription with
  fixed monthly/weekly/daily price and unlimited hours; rented devices bill $0 per
  session. Mostly undocumented internally.

---

## 4. Corrections the rewrite MUST make vs the old (stubbed) docs

The previous content shipped factual errors. Don't reintroduce them:

| Old docs said | Reality |
|---|---|
| API key like `ax_live_••••` | Prefix is **`axl_`** |
| (implied) Bearer auth for API key | API keys use header **`X-Axilio-Api-Key`**; Bearer is dashboard/Clerk only |
| Base URL unspecified | **`https://api.axilio.ai`**, path `/api/v1`, env `AXILIO_BASE_URL` |
| Android-only framing everywhere | SDK enum also has `iphone`, but it's **not production-real** — pick a story |
| Examples implied everything runs | Only driver + Client are implemented; the rest is codegen-pending |
| `session(timeout=60)` default 60s | Correct (`timeout: float = 60.0`) — keep |
| `find_text(...).tap()` can crash on None | **Correct and worth keeping** as guidance |

The old quickstart's *driver* examples (`find_text("Sign in").tap()`,
`find(query=...)`, `screenshot()`, `wait_for_text`, `wait_until_gone`) **match the
real implemented API** — that copy is salvageable.

---

## 5. What we have enough to write today

Ranked by how runnable/accurate the page would be:

1. **Driver pages** (`driver/*`) — fully real. find-by-text, find-with-vision,
   read-the-screen (`observe`/`Screen`), actions (Element + raw input),
   hardware-keys (`Key.*`), waiting, screenshots. **Start here.**
2. **Quickstart / Authentication / Client config** — real for construction + env
   vars + the driver loop; the allocate step is codegen-pending (caveat it).
3. **Positioning pages** — index, introduction, devices/overview (concept-level,
   no codegen dependency). Strong.
4. **Argus / vision API reference** — the HTTP endpoints are real; can be written
   from `inference_router.py` + types now (and later generated from its OpenAPI).
5. **API reference (backend)** — generate from `./backend --openapi` once dumped.
6. **Workflows/Runs/Usage/Billing/Org/API-keys SDK pages** — signatures stable but
   bodies pending; write only with a pre-release banner, or defer.

---

## 6. Open decisions for the founder (block accurate copy)

1. **Pre-release framing.** Do we document codegen-pending methods now (signatures
   are final) behind an "early access" banner, or only ship pages that run today?
   This determines whether ~60% of the nav gets real pages or stays stubbed.
2. **iOS.** SDK exposes `platform="iphone"` but nothing's real. Say "Android only
   today, iOS coming," or hide `iphone` from docs entirely?
3. **Plan names.** Reconcile SDK (`free/hobby/pro/business/enterprise`) vs frontend
   (`Hobby/Pro/Scale/Enterprise`). Which is canonical for docs?
4. **Billing granularity wording.** Per-second (code) vs "per minute"/"per phone
   hour" (marketing). State the exact increment and rounding.
5. **`client.argus` direct vision API.** Is vision a customer-facing product
   surface (its own docs section) or an internal detail behind `find()`?
6. **Workflows mental model.** Code-first (`workflows.create(code=...)`) vs the
   dashboard visual editor — which is the primary story for docs?
7. **Dedicated Phones / rentals.** Enough product detail to document the flow
   (reserved 24/7? shareable? provisioning?) — currently internal-only.
8. **Session replay / live view.** Real features (WebRTC) with no docs — API or
   dashboard-only? Worth a page?

---

## 7. Recommended approach

1. **Dump + commit the backend OpenAPI spec** and wire `openapi:` frontmatter →
   the entire `api-reference/` tab becomes accurate and low-effort.
2. **Write the driver subtree first** (real, runnable) — it also produces the
   canonical code-style/voice reference implementation per `WRITING_GUIDE.md`.
3. **Write positioning pages** (index/introduction/overviews) using the verbatim
   copy in §2 — no codegen dependency.
4. **Get the §6 decisions** from the founder, then either banner-and-write or defer
   the codegen-pending SDK pages.
5. Keep `docs/.spec/backend-version` in sync; add redirects for any moved URLs.

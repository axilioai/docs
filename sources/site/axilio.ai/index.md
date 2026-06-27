# Source: https://axilio.ai/

//The Phone Cloud

# The Phone Cloud 
for Agents

Real Android phones on carrier networks, with a vision-native SDK, hosted code editor, and full session replay for debugging mobile agents in production.

✕

REQUEST ACCESS

[Talk to a Founder](https://calendly.com/kunwar-axilio/new-meeting)

 SIM-1T-MOBILESIM-2AT&TAXL-R1CARRIE{ AC{5!5G // \*\\~ !5 |C8 1=6D=A<!9:41AACMESign incontinue to your accountyou@company.com••••••••CONTINUEforgot password?ORAACMEVerifying credentialsAXL-V1 // STANDBY←PROFILE⋯A@accountengineer · acme.systems127POSTS3.4KFOLLOWERS892FOLLOWINGSETTINGSIMG\_01IMG\_02IMG\_03←SETTINGSAccount›Notifications›Privacy & Security›Appearance›About›LOG OUTAXL-@/%TO{\*! \\}$|%<|C~6>13 C^\\8!9=AXL-\\!VI/!9 ^C9}/BF1\[@#\* %> EC!#D4DEBD6~ 6\* #/}^CAE\\2DC 4/\\\*\[A|$\[\[{ F#\* \\B4~1$4%\*DEVICE MODULE

//Product

## Write code, run on real phones, at scale

Drive real phones with the semantic SDK, run it via API across the fleet, and trace every step. The same primitives cover any mobile app.

01Semantic SDK02API Execution03Phone Fleet04Observability

### Find anything, by name or description

The semantic SDK locates elements the way a person would — by their label, by describing them in plain English, by position, or by what an icon looks like. Then tap, type, or read.

- ✓No coordinates, no XPath, no brittle selectors
- ✓Run on frontier VLMs or open-source models
- ✓Free OCR by default, premium for dense text
- ✓Resilient to layout, theme, and copy changes

selectorsphone = client.mobile.session()

TEXT`phone.find_text("Sign in").tap()`

Tap an exact, visible label→ matched "Sign in"

TYPE`phone.find_text("Email").type_into("you@co")`

Type into a labeled field→ filled "Email"

QUERY`phone.find(query="the cheapest nonstop").tap()`

Describe the element in plain English→ matched "ANA · $412"

SPATIAL`phone.find(query="the price next to 'Total'")`

Locate by position, relative to other text→ matched "$47.99"

ICON`phone.find(query="the heart icon")`

Find icons by what they look like→ icon · conf 0.98

OBSERVE`phone.observe().texts`

Read the whole screen as structured text→ 14 elements · 8 texts

engineFrontier VLMsOpen-source VLMs·ocrFreePremium

//Why Axilio

## Hardware solves what software can't

Emulators break. Datacenter IPs get rate-limited. Scripted browsers can't render mobile apps at all. Real hardware on real networks gives your agent a stable, production-grade place to work.

### Real hardware

Genuine Android phones with authentic sensors, fingerprints, and OS behavior. The environment your agent needs to work reliably across any app.

### Carrier networks

Production connectivity through real telco SIMs. Your agent sees the same network environment a human user would, which matters for apps that treat mobile context as a signal.

### Parallel execution

Run agent sessions concurrently across the fleet. Automatic load balancing, queuing, and session isolation built in.

### Vision-native

Find elements by describing them — find(query=…) — on frontier or open-source vision models. No brittle selectors; graceful recovery when layouts change.

### Predictable pricing

Billed per minute. No data transfer fees, no proxy surcharges, no surprise bills. Budget with confidence at scale.

### Replay and traces

Replay every session, trace every SDK step, and see the exact cost of every vision call. Debug a flaky run in minutes, not hours.

### Real hardware

Genuine Android phones with authentic sensors, fingerprints, and OS behavior. The environment your agent needs to work reliably across any app.

### Carrier networks

Production connectivity through real telco SIMs. Your agent sees the same network environment a human user would, which matters for apps that treat mobile context as a signal.

### Parallel execution

Run agent sessions concurrently across the fleet. Automatic load balancing, queuing, and session isolation built in.

### Vision-native

Find elements by describing them — find(query=…) — on frontier or open-source vision models. No brittle selectors; graceful recovery when layouts change.

### Predictable pricing

Billed per minute. No data transfer fees, no proxy surcharges, no surprise bills. Budget with confidence at scale.

### Replay and traces

Replay every session, trace every SDK step, and see the exact cost of every vision call. Debug a flaky run in minutes, not hours.

//Integration

## Run it across the fleet, in parallel

The axilio.platform SDK is your entrypoint: allocate real phones, drive each with the same selectors, and fan out across the fleet — one session per task. Drops into any Python stack.

Python

Copy

One real phone per task, thousands at once. Allocate, drive, and collect structured results — no pool to manage, no infrastructure to run.

//Pricing

## Scale without surprise bills

From $0.65/phone hour. All plans include carrier-grade IPs. No setup fees. Cancel anytime.

Pay As You GoDedicated Phones

Billed per second of automation. Unused balance does not roll over.

[Fair Usage Policy](https://axilio.ai/policies/fair-usage-policy) applies to all plans.

## Put your agent on a real phone

Tell us about your use case and we'll get you onboarded.

[Request Access →](https://axilio.ai/auth/sign-up)
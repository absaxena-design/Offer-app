# ARXA — Free-first backend plan

## Product constraint
Operate at $0/month while building and validating initial demand. Do not enable paid services or upgrades without explicit approval. Free limits, vendor availability and retailer access can change.

## Architecture
- Existing React/Vite GitHub Pages frontend remains unchanged initially.
- Supabase Free is the proposed service for Authentication, PostgreSQL, Row Level Security (RLS), Storage and Edge Functions.
- Keep legacy browser-local records usable until user-approved import into an authenticated account.
- No scraping bypasses, uncontrolled requests to retailer URLs, or promises of automatic tracking before a supported source is connected.
- No image-based search, affiliate links, or gamification in MVP.

## Data entities
- profiles: auth user ID and preferences; optional shipping-region context.
- products: normalized identity (brand, model, identifiers, title, canonical image).
- offers: product ID, retailer, seller, source URL, listing condition/variation, fulfillment method, tracking capability/status.
- offer_prices: offer ID, observed item price, currency, shipping charge (nullable), minimum eligible shipping, tax estimate (nullable), shipping eligibility context, observation timestamp, provenance.
- watchlist_items: user ID, product ID, preferred offer ID (nullable), target before tax, status, creation time.
- purchases: user ID, offer/product, purchase date, actual item price, shipping, tax, totals, recorded savings, 30-day monitoring end.
- notifications: user ID, offer/price observation, alert kind, deduplication key, delivery status.
- import_attempts: user ID, provided URL, status, error category, recovered metadata and candidates, without storing secrets.

## Pricing invariants
- Target match = item price + shipping cost **for the same eligible offer**.
- Taxes are displayed independently and never included in target-match evaluation.
- Unknown shipping != free shipping. No confirmed target match while shipping is unknown.
- Cheapest shipping means cheapest **eligible** option for the user's context.
- Show recorded vs live-verified source and timestamp; do not imply manual prices are current.
- Don't infer that a product identity match means automated monitoring is available.

## UX and recovery
1. Paste URL first.
2. Attempt safe import from supported, authorized sources; show fields and confidence.
3. If import fails, recover identifiers and offer candidate listings using connected providers.
4. Require explicit user confirmation of any alternative offer.
5. If unsupported, explain 'Automatic tracking isn't available for this listing yet', offer retry, alternative link, search by title/model, or manual save for reference.
6. Optional image upload only for a product's visual presentation, not image search.

## Security
- RLS on every per-user data table and storage object.
- Never ship service-role keys or provider secrets to the browser.
- Strict server-side URL validation, redirect validation, egress restrictions and request quotas to mitigate SSRF and abuse.
- Minimal personal data, user export/deletion, capped task budgets and audit-friendly price provenance.
- Avoid assuming free-plan availability guarantees, backups, scheduling frequency, or email delivery.

## Implementation milestones
1. Project setup, initial PostgreSQL migrations, RLS policy tests.
2. Anonymous-to-authenticated product import (preserve browser state; explicitly confirm migration).
3. Products/offers/price observations API; test unique-offer sharing.
4. One authorized retailer/provider integration; measure successful import and accurate shipping.
5. Capped scheduled monitoring with deduplication, timestamps, stale-data UI and error recovery.
6. Verified price-match events and notification preferences.
7. Usability tests and small beta; only then revisit paid infrastructure.

## Exit criteria
An authenticated user can save a supported product URL, confirm the offer, see item + eligible shipping against target (tax excluded), access it from another device, and receive a correctly sourced price status. Unsupported sources show truthful limitations rather than fake automatic tracking.

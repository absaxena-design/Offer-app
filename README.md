# ARXA

ARXA is a responsive product price-tracking web app. This repository contains the first interactive browser-based MVP foundation.

## Run locally

Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Open the Vite URL. For a production build, run `npm run build`.

## Available in v0.1

- Overview with watch counts, purchase history and recorded savings
- Product watchlist and product details
- Add product with URL, title, recorded price and target price
- Mark products purchased and log actual paid price
- 30-day post-purchase monitoring window calculated from purchase date
- Purchase records retained indefinitely unless manually deleted
- Browser localStorage persistence; illustrative demo products on first launch

## Not yet supported

Automated merchant price collection, price history, notifications, jobs running in the background, authentication and cloud sync. Recorded price values are entered manually, not real-time offers. The 30-day status is informational until the tracking backend exists. Savings are computed from the recorded price at purchase versus the paid price, not verified offers. Demo products are fictional examples. Affiliate links are excluded from scope.

## Next phases

1. Define database schema and authentication.
2. Connect compliant product price providers.
3. Implement scheduled tracking and notifications.
4. Add tests, CI, accessibility review, and production deployment.

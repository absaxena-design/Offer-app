# ARXA reusable component library

All components are in `src/components/`. ARXA uses **light mode only** and components must use color tokens from `src/tokens.css` and sizing tokens from `src/foundations.css`.

## Navigation & layout
- `AppShell`, `Sidebar`, `TopBar`, `BottomNavigation`, `PageHeader`, `BackButton`

## Actions & UI
- `Button` (primary, secondary, tertiary, destructive), `IconButton`, `TextButton`, `RetailerLink`, `SurfaceCard`, `ConfirmDialog`

## Forms
- `FormField`, `TextField`, `URLField`, `PriceField`, `SearchField`, `FieldError`

## Products & purchase
- `ProductCard`, `ProductIcon`, `ProductList`, `PriceDisplay`, `TargetPrice`, `StatusBadge`, `PurchaseSummary`, `MonitoringCountdown`, `HistoryCard`, `PriceComparison`

## Dashboard & feedback
- `SavingsCard`, `StatCard`, `StatGrid`, `PriceHistoryChart`, `EmptyState`, `LoadingState`, `ErrorMessage`, `InfoMessage`, `Toast`

## Usage
```jsx
import { Button, PriceField, ProductCard, EmptyState } from './components/index.js';

<Button variant="primary" onClick={save}>Save product</Button>
<PriceField label="Target price ($)" value={target} onChange={handleTargetChange}/>
<ProductCard product={product} onClick={openProduct}/>
<EmptyState title="Nothing tracked yet" description="Add a product to get started."/>
```

## Status
Navigation, dashboard, product, form and purchase components are now wired to the application. The `PriceHistoryChart` presents an honest placeholder until price records exist. `LoadingState` and `ErrorMessage` are available for forthcoming asynchronous service integration; no backend exists yet. A successful CI build does not replace browser interaction, usability and accessibility testing.

## Rules
- Never hardcode new colors inside components.
- Introduce new primitive and semantic tokens together when a new color is needed.
- Keep semantic HTML, accessible labels and keyboard focus behavior.
- Do not display simulated prices as verified retailer offers.

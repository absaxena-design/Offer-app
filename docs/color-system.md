# ARXA Color System — Oxide / 01

ARXA uses **one light theme**. There is no dark mode or theme toggle.

## Brand foundation

| Role | Color | Value |
|---|---|---|
| Brand / oxide | Oxide 500 | `#A34332` |
| Soft neutral | Sand 300 | `#E8DCCA` |
| Primary ink | Ink 700 | `#28324A` |
| Interactive accent | Cobalt 500 | `#3455A4` |
| Page canvas | Paper 50 | `#F8F4EC` |

## Token layers

1. **Primitives:** `--color-oxide-500`, `--color-paper-50`, etc. Fixed palette values.
2. **Semantic aliases:** `--surface-canvas`, `--text-primary`, `--action-primary`, `--border-default`, `--focus-ring`. Use these in new UI unless a component-specific token exists.
3. **Component aliases:** `--button-primary-bg`, `--nav-active-bg`, `--savings-panel-bg`. Components reference semantic or primitive values through these aliases.

All tokens live in `src/tokens.css`, imported at the top of `src/styles.css`. Do not place new hard-coded hex colors in component CSS. The system is deliberately light-only; `color-scheme: light` makes native browser controls follow the same appearance.

## Usage examples

```css
.product-card { background: var(--surface-panel); border-color: var(--border-subtle); }
.primary { background: var(--button-primary-bg); color: var(--button-primary-fg); }
.primary:hover { background: var(--button-primary-bg-hover); }
```

## Accessibility

Review text/foreground contrast for each combination at implementation time. Use the darker oxide and cobalt tokens for smaller text rather than assuming the flagship brand colors are accessible on paper. Preserve visible focus indicators.

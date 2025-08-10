# UI Style & CSS Best Practices

This project uses TailwindCSS + small design system primitives. Below are conventions to keep styling consistent and scalable.

## Design Tokens
Use (or add) tokens in the design-system theme for:
- Colors: primary, danger, warning, success, gray scales.
- Spacing scale: multiples of 2 (2,4,6,8,12,16,24,32,40,48,64).
- Radii: sm(2px), md(4px), lg(8px), full (9999px for pills).
- Shadows: subtle, focus, overlay.

If a custom color appears more than twice, convert it into a token.

## Class Ordering (Tailwind)
Order utility groups roughly:
1. Layout (flex, grid, display, position, z)
2. Box model (m*, p*, space-*, gap-*)
3. Size (w-*, h-*, max-*, min-*)
4. Typography (font-*, text-*, leading-*, tracking-*)
5. Visual (bg-*, border-*, rounded-*, shadow-*)
6. State (hover:, focus:, disabled:)
7. Animation / transitions.

Consistent ordering improves diffs and scanning.

## Component Patterns
- Extract repeated compositions (button groups, filter bars) into components inside `design-system/` or `src/components/patterns/`.
- Co-locate small component styles with component; avoid large global CSS.
- Prefer semantic elements + aria-* attributes over div wrappers.

## Responsive Strategy
- Mobile-first; add `sm: md: lg: xl:` progressively.
- Avoid hiding essential actions entirely on mobile. Use icon-only buttons with tooltips.

## State Styling
Use design-system variants rather than ad‑hoc colors. Example:
```
<Button variant="primary" />
<Button variant="danger" />
```
If a new semantic (warning/info) is needed, add variant support rather than embedding raw classes repeatedly.

## Accessibility
- Maintain 4.5:1 contrast for body text, 3:1 for large text and non-text indicators.
- Focus outline: always visible (use a ring utility). Don’t remove outlines without replacement.
- Use `aria-live="polite"` for toast region if implementing custom toasts.

## Animation
- Keep micro-interactions under 200ms.
- Use `transition-colors` or `transition-all` sparingly; avoid animating layout (height) unless absolutely necessary.

## Theming
- Provide dark-mode with `dark:` variants in future. Keep color choices tokenized so a theme switch is a variable swap, not a search/replace.

## Layout Guidelines
- Constrain main content to max-w-7xl or 1280px for readability.
- Use consistent vertical rhythm: section blocks separated by 24px (`space-y-6`).
- For data tables: sticky header, zebra optional; keep row height ~48–56px for scannability.

## Utility Extraction Threshold
If the same 4+ utility classes appear together in 3 or more places, extract to a component or define a plugin class in a CSS layer.

## Forms
- Always pair inputs with labels; visually hidden labels acceptable for icon inputs.
- Inline validation: show error text using `text-danger-600` or token equivalent.

## Shadows & Elevation
- Avoid stacking multiple shadows. Choose a single elevation style from tokens.
- For modals: use overlay + subtle scale/opacity transition.

## Performance
- Prefer `line-clamp-*` utilities for truncation instead of custom CSS.
- Use virtualization for any list/table > 200 rows (already implemented).

## Naming
- When adding custom classes in CSS (rare), use BEM-lite: `.lfx-Component__element--modifier`.

## Testing Styling
- For visual states critical to UX (loading skeletons, error banners) assert presence via role or data-testid rather than class names.

## Do / Avoid
| Do | Avoid |
|----|-------|
| Use tokens for primary colors | Hex codes sprinkled in JSX |
| Compose with flex/grid utilities | Deep nested custom CSS files |
| Keep component API small | Prop drilling style flags many levels |
| Provide accessible names | Icon-only buttons without aria-label |
| Extract repeated patterns | Copy/paste filter bars |

## Adding New Variants
1. Update design-system component props (e.g., Button variant union).
2. Map variant -> className string in one place.
3. Add story / usage snippet in README.

## Dark Mode Prep Checklist
- Replace hard-coded `bg-white` with `bg-white dark:bg-gray-900` where appropriate.
- Use `text-gray-800 dark:text-gray-100` for body text.
- Avoid embedding light-specific shadow colors.

---
Iterate this guide as design language evolves.

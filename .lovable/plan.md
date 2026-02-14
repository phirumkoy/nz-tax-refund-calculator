

# NZ Tax Refund Estimate Calculator (FY25/26)

A clean, professional, mobile-first single-page calculator for estimating New Zealand tax refunds or amounts owed.

## Design Direction
- Government-style, neutral, minimal aesthetic
- Clean typography with spacious layout
- Rounded cards with soft shadows
- No decorative graphics, icons, emojis, or marketing language
- Muted color palette (greys, whites, subtle greens/reds for results only)

## Page Sections

### 1. Header
- App title: "NZ Tax Refund Estimate Calculator (FY25/26)"
- Subtitle: "NZ Tax Year: 1 April 2025 – 31 March 2026"
- Simple, text-only, centered

### 2. Calculator Card
- **Total Gross Income (NZD)** — large font input with dollar prefix, NZD formatting
- **Total Tax Deducted (NZD)** — same styling
- **IETC checkbox** — "Include IETC (if eligible)"
  - When checked, reveals a "Months eligible for IETC (0–12)" input (default: 12) with helper text about IRD pro-rating
- **Calculate** (primary) and **Reset** (secondary) buttons

### 3. Results Display
- Shows after clicking Calculate:
  - Tax Due on Income
  - Total Tax Deducted
  - Result (excluding IETC)
- Large bold result card showing either "Estimated Refund" (green) or "Tax to Pay" (muted red)
- IETC messaging in muted grey text based on income thresholds and months eligible

### 4. Calculation Logic
- Implements the exact NZ FY25/26 progressive tax brackets as specified
- IETC base calculation with income thresholds ($24k–$70k range)
- Pro-rata IETC by months eligible
- All values rounded to 2 decimal places
- Entirely client-side, no data storage

### 5. Expandable Sections (Accordions)
- **"How to Find Your Numbers"** — step-by-step MyIR instructions
- **"How This Calculator Works"** — numbered explanation of the calculation methodology
- **"Good to Know"** — disclaimer about estimates, IRD adjustments, and official assessment reference

### Technical Approach
- Single-page React app, no backend needed
- Mobile-first responsive layout
- Client-side only calculations
- Uses existing UI components (Card, Accordion, Input, Button, Checkbox)


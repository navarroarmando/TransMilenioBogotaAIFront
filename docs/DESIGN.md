---
name: TransMind Velocity Light
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#926f6b'
  outline-variant: '#e7bdb8'
  surface-tint: '#c00014'
  primary: '#ba0013'
  on-primary: '#ffffff'
  primary-container: '#e31e24'
  on-primary-container: '#fffafa'
  inverse-primary: '#ffb4ab'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#4e5c71'
  on-tertiary: '#ffffff'
  tertiary-container: '#67758a'
  on-tertiary-container: '#fcfbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d5e3fc'
  tertiary-fixed-dim: '#b9c7df'
  on-tertiary-fixed: '#0d1c2e'
  on-tertiary-fixed-variant: '#3a485b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is engineered for a high-performance Decision Support System (DSS) in the transportation sector. The brand personality is **authoritative, analytical, and precise**. It evokes the reliability of a mission-critical operations center through a light-themed interface that prioritizes data legibility and systematic organization.

The visual style is **Corporate / Modern** with a slight **Technical** edge. It utilizes a structured, high-tech aesthetic characterized by disciplined whitespace and a high-contrast palette. The refined rounded corner language provides a contemporary balance to the dense data presentation, ensuring that complex route optimization data is digestible for professionals who require immediate clarity and functional speed.

## Colors

The palette is derived from the TransMind DSS identity, optimized for a light-mode environment.

- **Primary (#e31e24):** The signature brand red is used sparingly for high-impact actions, critical alerts, and key brand touchpoints.
- **Secondary (#0f172a):** A deep Navy used for persistent UI elements like sidebars, headers, and primary headings to provide structural grounding.
- **Tertiary (#475569):** A Slate blue-grey utilized for secondary information, technical labels, and iconography.
- **Neutral (#f8fafc):** A clean, cool-tinted off-white for the main workspace, ensuring a professional background that minimizes eye strain during long-form data analysis.
- **Success/Warning/Error:** Standardized semantic colors should follow the primary red's saturation levels (e.g., Emerald-600 for success, Amber-500 for warnings) to maintain visual balance.

## Typography

The typographic hierarchy distinguishes between narrative UI and technical data.

**IBM Plex Sans** is the primary typeface for all interface elements. Its industrial, slightly squared letterforms reflect the system's technical nature while remaining highly legible. Use Semi-Bold (600) for section headers to establish a clear hierarchy.

**JetBrains Mono** is reserved strictly for data-heavy outputs, coordinates, route IDs, and timestamps. The monospaced nature ensures that columns of numbers remain perfectly aligned, which is critical for route optimization tables and performance metrics.

## Layout & Spacing

The design system employs a **Fixed-Fluid hybrid grid**. 
- **Desktop:** 12-column grid with a 24px gutter. The sidebar is fixed at 280px, while the main content area expands to a maximum width of 1440px.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px margins.

Spacing is based on a **4px baseline grid**. Components should generally use 8px (sm) or 16px (md) internal padding to maintain a compact, "dashboard-dense" feel without appearing cluttered. Vertical rhythm is strictly enforced to keep tabular data aligned across the horizontal axis.

## Elevation & Depth

To maintain a "high-tech" and "clean" aesthetic, this design system uses **Low-contrast outlines** and **Tonal layers** rather than heavy shadows.

- **Level 0 (Background):** Neutral (#f8fafc) background.
- **Level 1 (Cards/Containers):** Pure White (#ffffff) surfaces with a 1px border in Slate-200. This creates a subtle "lift" against the off-white background.
- **Level 2 (Dropdowns/Modals):** Pure White surface with a crisp 1px Navy (#0f172a) border and a very tight, low-opacity shadow (0px 4px 12px rgba(15, 23, 42, 0.08)).
- **Interactions:** Use a 2px inset shadow or a subtle color shift to Slate-50 to indicate pressed states.

## Shapes

The shape language is **Rounded (2)**, offering a sophisticated and contemporary professional tone.
- **Standard elements (Buttons, Inputs):** 8px (0.5rem) radius.
- **Large containers (Cards, Modals):** 16px (1rem) radius.
- **Small components (Chips):** 4px (0.25rem) radius for a balanced, industrial look.

Avoid full pill shapes for buttons, as the defined geometry reinforces the "precision" narrative of the TransMind DSS brand.

## Components

- **Buttons:** Primary buttons use the Brand Red (#e31e24) with white IBM Plex Sans text and an 8px radius. Secondary buttons use a Slate-600 outline. States should be clearly defined: Hover (slightly darker), Active (inset border), and Disabled (Slate-200).
- **Input Fields:** Use 1px Slate-300 borders with an 8px corner radius. Focus state is a 2px Navy (#0f172a) border. Labels use JetBrains Mono in 12px (label-caps) placed above the input.
- **Data Tables:** The core of the system. Use alternate row striping (Slate-50) for readability. Headers must be Navy with white text or Slate-100 with Slate-900 text. All numeric values must use JetBrains Mono.
- **Status Indicators:** Small 8px circles or small 4px-radius chips. Red for "Critical," Amber for "Delayed," and Navy for "Optimized/Active."
- **Cards:** White background with a 1px Slate-200 border and a 16px radius. Use a "Header Stripe" of Primary Red or Navy at the top (4px height) to categorize card types.
- **Navigation:** Vertical sidebar in Navy (#0f172a) with Slate-400 icons. Active states should use a Primary Red indicator bar on the left edge.
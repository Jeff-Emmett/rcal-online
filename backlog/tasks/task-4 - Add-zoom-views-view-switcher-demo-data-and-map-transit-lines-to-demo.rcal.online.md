---
id: TASK-4
title: >-
  Add zoom views, view switcher, demo data, and map transit lines to
  demo.rcal.online
status: Done
assignee:
  - '@claude'
created_date: '2026-02-25 23:28'
labels:
  - demo
  - calendar
  - map
  - zoom
  - views
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement fluid calendar zoom with dedicated views for each temporal granularity, add a view switcher toolbar, populate the demo app with realistic sample data, and render transit lines between event locations on the map.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Zoom in/out cycles through Day → Week → Month → Season → Year → Decade with distinct views for each
- [ ] #2 DayView renders 24h time grid with positioned events and now-indicator
- [ ] #3 WeekView renders 7-column time grid with events per day
- [ ] #4 ViewSwitcher icon bar in header allows direct jump to any view
- [ ] #5 All views fit same container form factor (h-full flex-col) with opt-in fullscreen via FullscreenToggle
- [ ] #6 YearView defaults to compact grid (not auto-fullscreen portal)
- [ ] #7 Demo page seeded with ~40 realistic events across 5 months with real GPS coordinates
- [ ] #8 Events span Berlin, Amsterdam, Munich, Paris, Prague, Lisbon, Barcelona, Brussels
- [ ] #9 4 demo calendar sources: Work (blue), Travel (orange), Personal (green), Conferences (purple)
- [ ] #10 Map draws dashed transit polylines between chronologically ordered events at different locations
- [ ] #11 Travel-source transit lines render in orange, others in gray
- [ ] #12 EventListItem type extended with latitude/longitude/coordinates fields
- [ ] #13 CSS fade transition between view switches
- [ ] #14 Code pushed to both dev and main branches
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Calendar Zoom Views, Demo Data & Map Transit

### New Components
- **DayView** — 24h time grid with event positioning, all-day section, red now-indicator
- **WeekView** — 7-day column layout with hourly grid, click-to-zoom-to-day
- **ViewSwitcher** — Icon toolbar (Day/Week/Month/Season/Year/Decade) in CalendarHeader
- **FullscreenToggle** — Reusable portal wrapper for opt-in fullscreen on any view
- **DemoDataSeeder** — Pre-populates React Query cache with demo events
- **TransitLines** — Draws dashed polylines between event locations on SpatioTemporalMap

### Modified Components
- **TemporalTab/SpatialTab** — Route each granularity to its dedicated view (was falling through to MonthView)
- **MonthView/SeasonView** — Normalized to h-full flex-col container pattern
- **YearView** — Default changed from fullscreen portal to inline compact; glance mode now inline too
- **SpatioTemporalMap** — Added TransitLines component, simplified EventMarkers type casts
- **EventListItem** — Extended with latitude/longitude/coordinates/location_breadcrumb fields

### Demo Data
~40 events across 5 months covering work meetings, train/flight travel, conferences, and personal activities across 8 European cities with real GPS coordinates.

### Commit
- `cd7f4ad` feat: add Day/Week views, view switcher, demo data with map transit lines
<!-- SECTION:FINAL_SUMMARY:END -->

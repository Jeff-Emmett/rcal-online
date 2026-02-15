---
id: TASK-1
title: Deploy rcal-online to production
status: Done
assignee: []
created_date: '2026-02-15 16:16'
updated_date: '2026-02-15 16:16'
labels: []
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Fork zoomcal-jeffemmett, strip IFC, add lunar overlay, 4-tab layout (Temporal/Spatial/Lunar/Context), r* tool adapter registry, Prisma+PostgreSQL backend API, Docker deployment to Netcup
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Completed 2026-02-15:
- Phase 0: Forked zoomcal, inlined @cal/shared, swapped deps
- Phase 1: 4-tab layout, Zustand store refactored, IFC stripped from all components
- Phase 2: Lunar engine (lunarphase-js + suncalc), MoonPhaseIcon, LunarOverlay, LunarTab
- Phase 3: r* tool adapter registry, RCalProvider, ContextTab, URL-driven context route, embeddable export
- Phase 4: Prisma schema (Event, CalendarSource, Location), 7 API routes, PostgreSQL backend
- Phase 5: Docker multi-stage build, security hardened, deployed to rcal.jeffemmett.com
- Gitea repo + GitHub mirror (sync-on-commit), deploy webhook configured
- Known issue: synodic month duration calc needs fix (finds nearest new moon vs full cycle)
<!-- SECTION:NOTES:END -->

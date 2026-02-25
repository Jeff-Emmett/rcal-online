---
id: TASK-3
title: Redesign rcal.online landing page and add demo.rcal.online subdomain
status: Done
assignee:
  - '@claude'
created_date: '2026-02-25 22:28'
updated_date: '2026-02-25 22:28'
labels:
  - landing-page
  - deployment
  - routing
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace the minimal landing page at rcal.online with a full rStack-style marketing page. Move the calendar demo to demo.rcal.online via subdomain middleware routing. Add per-route layouts for Header placement.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 rcal.online serves a full marketing landing page matching rStack/rIdentity design pattern
- [x] #2 demo.rcal.online serves the interactive calendar app
- [x] #3 Landing page has hero, principles grid, feature pillars, temporal zoom visualization, four-view showcase, ecosystem cards, and CTA
- [x] #4 Middleware routes demo subdomain to /demo path
- [x] #5 Per-route layouts keep Header on app pages but not duplicated on landing page
- [x] #6 Deployed to production and verified live
- [x] #7 Code pushed to both dev and main branches
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Landing Page Redesign & Demo Subdomain

### Changes
- **New landing page** (`src/app/page.tsx`) — rStack-style dark theme (#0b1120) with gradient hero, 4-card principles, 6-card feature pillars, temporal zoom bar chart, four-view showcase, ecosystem integration cards, and CTA
- **Demo route** (`src/app/demo/`) — Calendar app moved here, served at demo.rcal.online
- **Middleware** — Added `demo` subdomain handling alongside existing space routing
- **Layout restructuring** — Removed global Header from root layout, added per-route layouts for `/calendar`, `/demo`, `/context`
- **Dockerfile fix** — Added `NODE_OPTIONS=--max_old_space_size=4096` to fix SIGSEGV during Docker build
- **Component updates** — AppSwitcher/EcosystemFooter category reorganization (rTube/rSwag to Creating, Social & Media split into Sharing + Observing)

### Commits
- `f465759` feat: redesign landing page and add demo.rcal.online subdomain
- `3c0dc28` fix: increase Node heap size for Docker build

### Verified
- https://rcal.online — Landing page live (HTTP 200)
- https://demo.rcal.online — Calendar demo live (HTTP 200)
- DNS wildcard *.rcal.online already resolves via Cloudflare tunnel
- Traefik HostRegexp handles subdomain routing
<!-- SECTION:FINAL_SUMMARY:END -->

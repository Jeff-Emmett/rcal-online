# rCal — Temporal Coordination

**Module ID:** `rcal`
**Domain:** `rcal.online`
**Version:** 0.1.0
**Framework:** Next.js 14 / React 18 / Prisma / Leaflet / SunCalc / LunarPhase
**Status:** Draft

## Purpose

Calendar and temporal coordination tool with alternative time systems — lunar phases, solar cycles, seasonal patterns. Integrates with Leaflet for location-aware time events and rSpace canvas for visual scheduling.

## Data Model

Prisma schema (PostgreSQL). Events, calendars, and time sources.

## Permission Model

| Capability | Required SpaceRole | Description |
|-----------|-------------------|-------------|
| `view_calendar` | VIEWER | See events and schedules |
| `create_event` | PARTICIPANT | Add events to shared calendar |
| `edit_own_events` | PARTICIPANT | Modify own events |
| `moderate_events` | MODERATOR | Edit/delete others' events |
| `configure_calendar` | ADMIN | Manage calendar settings, sources |

**Current Auth:** None. Migration needed.

## Canvas Integration

Shape types: `folk-calendar-event`, `folk-timeline`

## Migration Plan

1. Add EncryptID auth middleware
2. Add space concept to calendars
3. Import SDK role types and capability maps

---
id: TASK-2
title: Fix synodic month duration calculation in lunar engine
status: To Do
assignee: []
created_date: '2026-02-15 16:16'
labels: []
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
getSynodicMonth() in src/lib/lunar.ts finds the nearest new moon instead of computing the full ~29.53 day synodic cycle. findPreviousNewMoon/findNextNewMoon need to search across the full cycle boundary, not just find the local illumination minimum.
<!-- SECTION:DESCRIPTION:END -->

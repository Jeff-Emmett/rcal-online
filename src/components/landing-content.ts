export const LANDING_HTML = `

<!-- Hero -->
<div class="rl-hero">
  <span class="rl-tagline" style="color:#60a5fa;background:rgba(96,165,250,0.1);border-color:rgba(96,165,250,0.2)">
    Relational Calendar
  </span>
  <h1 class="rl-heading" style="background:linear-gradient(to right,#60a5fa,#818cf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
    Time is shared. Your calendar should be too.
  </h1>
  <p class="rl-subtitle">
    A collaborative calendar for communities, cooperatives, and coordinated groups.
  </p>
  <p class="rl-subtext">
    rCal rethinks the calendar as a <span style="color:#60a5fa;font-weight:600">shared, spatial, and cyclical</span> tool.
    See events across time and place, overlay lunar cycles, zoom from a single hour to a whole decade,
    and keep everyone on the same page &mdash; without the back-and-forth.
  </p>
  <div class="rl-cta-row">
    <a href="https://demo.rspace.online/rcal" class="rl-cta-primary" id="ml-primary"
       style="background:linear-gradient(to right,#60a5fa,#6366f1);color:#0b1120">
      Try the Demo
    </a>
    <a href="#features" class="rl-cta-secondary">Learn More</a>
  </div>
  <p style="font-size:0.82rem;margin-top:0.5rem">
    <a href="#" onclick="document.querySelector('folk-calendar-view')?.startTour?.();window.__rspaceHideInfo?.();return false" style="color:var(--rs-primary,#06b6d4);text-decoration:none">
      Start Guided Tour &rarr;
    </a>
  </p>
</div>

<!-- Principles (4-card grid) -->
<section class="rl-section" style="border-top:none">
  <div class="rl-container">
    <div class="rl-grid-4">
      <div class="rl-card rl-card--center" style="padding:2rem">
        <div class="rl-icon-box" style="background:rgba(96,165,250,0.12);font-size:1.5rem">
          <span style="font-size:1.5rem">&#129309;</span>
        </div>
        <h3>Shared by Default</h3>
        <p>One calendar for the whole group. Everyone sees the same context &mdash; no more fragmented schedules.</p>
      </div>
      <div class="rl-card rl-card--center" style="padding:2rem">
        <div class="rl-icon-box" style="background:rgba(129,140,248,0.12);font-size:1.5rem">
          <span style="font-size:1.5rem">&#128506;</span>
        </div>
        <h3>Spatiotemporal</h3>
        <p>Events have a where, not just a when. See your schedule on a map and a timeline simultaneously.</p>
      </div>
      <div class="rl-card rl-card--center" style="padding:2rem">
        <div class="rl-icon-box" style="background:rgba(167,139,250,0.12);font-size:1.5rem">
          <span style="font-size:1.5rem">&#127769;</span>
        </div>
        <h3>Natural Cycles</h3>
        <p>Lunar phases, eclipses, and solstices built in. Reconnect your planning to the rhythms of the natural world.</p>
      </div>
      <div class="rl-card rl-card--center" style="padding:2rem">
        <div class="rl-icon-box" style="background:rgba(52,211,153,0.12);font-size:1.5rem">
          <span style="font-size:1.5rem">&#128301;</span>
        </div>
        <h3>Multi-Scale Zoom</h3>
        <p>Ten levels of time &mdash; from a 30-second moment to a cosmic era. See today or plan a decade ahead.</p>
      </div>
    </div>
  </div>
</section>

<!-- Why rCal -->
<section id="features" class="rl-section rl-section--alt">
  <div class="rl-container">
    <span class="rl-tagline" style="color:#60a5fa;background:rgba(96,165,250,0.1);border-color:rgba(96,165,250,0.2)">
      Why rCal?
    </span>
    <h2 class="rl-heading" style="background:linear-gradient(135deg,#60a5fa,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
      Calendars were never meant to be personal silos
    </h2>
    <p class="rl-subtext" style="margin-bottom:2.5rem">
      Mainstream calendars treat time as private property. rCal treats it as a <span style="color:#60a5fa;font-weight:600">commons</span> &mdash;
      something groups navigate together. Here&rsquo;s what makes it different.
    </p>
    <div class="rl-grid-2">
      <div class="rl-card" style="border-color:rgba(96,165,250,0.12)">
        <div style="font-size:1.75rem;margin-bottom:1rem">&#128205;</div>
        <h3>Where + When, Together</h3>
        <p>Every event lives on both a timeline and a map. rCal&rsquo;s split view lets you see where everyone is meeting and when &mdash; with nine spatial zoom levels from planet to street address.</p>
      </div>
      <div class="rl-card" style="border-color:rgba(96,165,250,0.12)">
        <div style="font-size:1.75rem;margin-bottom:1rem">&#128279;</div>
        <h3>Coupled Zoom</h3>
        <p>Lock temporal and spatial zoom together: zoom out in time and the map zooms out to match. Planning a week? See the city. Planning a decade? See the continent.</p>
      </div>
      <div class="rl-card" style="border-color:rgba(96,165,250,0.12)">
        <div style="font-size:1.75rem;margin-bottom:1rem">&#128225;</div>
        <h3>Multi-Source Sync</h3>
        <p>Import from Google, Outlook, Apple, CalDAV, ICS feeds, and Obsidian. Layer multiple sources with per-source color coding and visibility controls.</p>
      </div>
      <div class="rl-card" style="border-color:rgba(96,165,250,0.12)">
        <div style="font-size:1.75rem;margin-bottom:1rem">&#127761;</div>
        <h3>Lunar Overlay</h3>
        <p>Eight moon phases rendered on every calendar view with illumination percentages and eclipse detection. Plan gatherings, gardens, and ceremonies around natural cycles.</p>
      </div>
      <div class="rl-card" style="border-color:rgba(96,165,250,0.12)">
        <div style="font-size:1.75rem;margin-bottom:1rem">&#129513;</div>
        <h3>r* Ecosystem Embeds</h3>
        <p>rTrips, rMaps, rNetwork, rCart, and rNotes can all embed a calendar view through the context API. One calendar, surfaced everywhere it&rsquo;s needed.</p>
      </div>
      <div class="rl-card" style="border-color:rgba(96,165,250,0.12)">
        <div style="font-size:1.75rem;margin-bottom:1rem">&#127968;</div>
        <h3>Self-Hosted &amp; Sovereign</h3>
        <p>Open source and Dockerized. Your events live on your infrastructure &mdash; not in a corporate cloud. Full data sovereignty with rIDs authentication.</p>
      </div>
    </div>
  </div>
</section>

<!-- Temporal Zoom Levels -->
<section class="rl-section">
  <div class="rl-container">
    <span class="rl-tagline" style="color:#818cf8;background:rgba(129,140,248,0.1);border-color:rgba(129,140,248,0.2)">
      Temporal Navigation
    </span>
    <h2 class="rl-heading" style="background:linear-gradient(135deg,#818cf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
      Ten levels of time
    </h2>
    <p class="rl-subtext">
      Most calendars show you a month. rCal lets you zoom from a single moment to a cosmic era &mdash;
      each level revealing a different kind of pattern.
    </p>
    <div class="rl-card" style="max-width:700px;margin:2rem auto 0;overflow-x:auto">
      <div class="rl-zoom-bar" style="min-width:460px">
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">0</span>
          <div class="rl-zoom-bar__bar" style="width:4%;background:rgba(59,130,246,0.25)">
            <span class="rl-zoom-bar__name">Moment</span>
          </div>
          <span class="rl-zoom-bar__span">30 seconds</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">1</span>
          <div class="rl-zoom-bar__bar" style="width:8%;background:rgba(96,165,250,0.25)">
            <span class="rl-zoom-bar__name">Hour</span>
          </div>
          <span class="rl-zoom-bar__span">60 minutes</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">2</span>
          <div class="rl-zoom-bar__bar" style="width:14%;background:rgba(96,165,250,0.22)">
            <span class="rl-zoom-bar__name">Day</span>
          </div>
          <span class="rl-zoom-bar__span">24 hours</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">3</span>
          <div class="rl-zoom-bar__bar" style="width:22%;background:rgba(129,140,248,0.22)">
            <span class="rl-zoom-bar__name">Week</span>
          </div>
          <span class="rl-zoom-bar__span">7 days</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">4</span>
          <div class="rl-zoom-bar__bar" style="width:32%;background:rgba(129,140,248,0.20)">
            <span class="rl-zoom-bar__name">Month</span>
          </div>
          <span class="rl-zoom-bar__span">~30 days</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">5</span>
          <div class="rl-zoom-bar__bar" style="width:44%;background:rgba(167,139,250,0.20)">
            <span class="rl-zoom-bar__name">Season</span>
          </div>
          <span class="rl-zoom-bar__span">~3 months</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">6</span>
          <div class="rl-zoom-bar__bar" style="width:58%;background:rgba(167,139,250,0.18)">
            <span class="rl-zoom-bar__name">Year</span>
          </div>
          <span class="rl-zoom-bar__span">365 days</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">7</span>
          <div class="rl-zoom-bar__bar" style="width:72%;background:rgba(192,132,252,0.18)">
            <span class="rl-zoom-bar__name">Decade</span>
          </div>
          <span class="rl-zoom-bar__span">10 years</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">8</span>
          <div class="rl-zoom-bar__bar" style="width:86%;background:rgba(168,85,247,0.16)">
            <span class="rl-zoom-bar__name">Century</span>
          </div>
          <span class="rl-zoom-bar__span">100 years</span>
        </div>
        <div class="rl-zoom-bar__row">
          <span class="rl-zoom-bar__label">9</span>
          <div class="rl-zoom-bar__bar" style="width:100%;background:rgba(147,51,234,0.15)">
            <span class="rl-zoom-bar__name">Cosmic</span>
          </div>
          <span class="rl-zoom-bar__span">Geological</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Calendar Views -->
<section class="rl-section rl-section--alt">
  <div class="rl-container">
    <span class="rl-tagline" style="color:#a78bfa;background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.2)">
      Four Views
    </span>
    <h2 class="rl-heading" style="background:linear-gradient(135deg,#a78bfa,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
      One calendar, four perspectives
    </h2>
    <p class="rl-subtext">
      Switch between views with keyboard shortcuts (1&ndash;4) to see your events from the angle that matters most right now.
    </p>
    <div class="rl-grid-2" style="margin-top:2rem">
      <div class="rl-card">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:center;font-size:1.1rem">
            &#128197;
          </div>
          <div>
            <h3 style="margin-bottom:0">Temporal</h3>
            <span style="font-size:0.7rem;color:#64748b;font-family:monospace">Press 1</span>
          </div>
        </div>
        <p>The classic calendar view &mdash; month, week, day, year, and season &mdash; enhanced with multi-granularity zoom and event indicators.</p>
      </div>
      <div class="rl-card">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:rgba(52,211,153,0.12);display:flex;align-items:center;justify-content:center;font-size:1.1rem">
            &#128506;
          </div>
          <div>
            <h3 style="margin-bottom:0">Spatial</h3>
            <span style="font-size:0.7rem;color:#64748b;font-family:monospace">Press 2</span>
          </div>
        </div>
        <p>Interactive map powered by Leaflet. Events cluster by location with nine spatial granularity levels from planet to GPS coordinates.</p>
      </div>
      <div class="rl-card">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:center;font-size:1.1rem">
            &#127769;
          </div>
          <div>
            <h3 style="margin-bottom:0">Lunar</h3>
            <span style="font-size:0.7rem;color:#64748b;font-family:monospace">Press 3</span>
          </div>
        </div>
        <p>Moon phase overlay with illumination percentages, eclipse detection, and phase-colored day cells. Plan around the eight phases of the lunar cycle.</p>
      </div>
      <div class="rl-card">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:rgba(34,211,238,0.12);display:flex;align-items:center;justify-content:center;font-size:1.1rem">
            &#129513;
          </div>
          <div>
            <h3 style="margin-bottom:0">Context</h3>
            <span style="font-size:0.7rem;color:#64748b;font-family:monospace">Press 4</span>
          </div>
        </div>
        <p>When embedded inside another r* tool, this view shows calendar data filtered for that tool&rsquo;s entity &mdash; a trip, a network, a map layer.</p>
      </div>
    </div>
  </div>
</section>

<!-- Ecosystem Integration -->
<section class="rl-section">
  <div class="rl-container">
    <span class="rl-tagline" style="color:#34d399;background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.2)">
      Ecosystem
    </span>
    <h2 class="rl-heading" style="background:linear-gradient(135deg,#34d399,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
      Part of the r* stack
    </h2>
    <p class="rl-subtext">
      rCal connects to the full suite of community tools. Any r* app can display or create calendar events through the shared context API.
    </p>
    <div class="rl-grid-3" style="margin-top:2rem">
      <div class="rl-integration" style="border-color:rgba(52,211,153,0.15)">
        <div class="rl-icon-box" style="flex-shrink:0"><span style="font-size:1.25rem">&#128506;</span></div>
        <div>
          <h3>rTrips</h3>
          <p>Trip itineraries auto-populate with calendar events for departure, accommodation, and activities.</p>
        </div>
      </div>
      <div class="rl-integration" style="border-color:rgba(52,211,153,0.15)">
        <div class="rl-icon-box" style="flex-shrink:0"><span style="font-size:1.25rem">&#128205;</span></div>
        <div>
          <h3>rMaps</h3>
          <p>Location-tagged events appear on shared community maps with time-filtered layers.</p>
        </div>
      </div>
      <div class="rl-integration" style="border-color:rgba(52,211,153,0.15)">
        <div class="rl-icon-box" style="flex-shrink:0"><span style="font-size:1.25rem">&#128101;</span></div>
        <div>
          <h3>rNetwork</h3>
          <p>See when your community members are available and schedule group meetings.</p>
        </div>
      </div>
      <div class="rl-integration" style="border-color:rgba(52,211,153,0.15)">
        <div class="rl-icon-box" style="flex-shrink:0"><span style="font-size:1.25rem">&#128722;</span></div>
        <div>
          <h3>rCart</h3>
          <p>Product launches, market days, and delivery windows sync to your calendar.</p>
        </div>
      </div>
      <div class="rl-integration" style="border-color:rgba(52,211,153,0.15)">
        <div class="rl-icon-box" style="flex-shrink:0"><span style="font-size:1.25rem">&#128221;</span></div>
        <div>
          <h3>rNotes</h3>
          <p>Meeting notes link back to calendar events. Transcriptions attach to the moment they happened.</p>
        </div>
      </div>
      <div class="rl-integration" style="border-color:rgba(52,211,153,0.15)">
        <div class="rl-icon-box" style="flex-shrink:0"><span style="font-size:1.25rem">&#127760;</span></div>
        <div>
          <h3>rSpace</h3>
          <p>Each space gets its own calendar. Subdomain routing means each community has a dedicated view.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="rl-section rl-section--alt">
  <div class="rl-container" style="text-align:center">
    <h2 class="rl-heading" style="background:linear-gradient(to right,#60a5fa,#818cf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
      See time differently
    </h2>
    <p class="rl-subtext">
      Try the spatiotemporal calendar with lunar overlays, multi-source sync, and community sharing.
      No account needed for the demo.
    </p>
    <div class="rl-cta-row">
      <a href="https://demo.rspace.online/rcal" class="rl-cta-primary"
         style="background:linear-gradient(to right,#60a5fa,#6366f1);color:#0b1120">
        Open the Demo
      </a>
      <a href="https://rstack.online" class="rl-cta-secondary">Explore rStack</a>
    </div>
  </div>
</section>

<div class="rl-back">
  <a href="/">&larr; Back to rSpace</a>
</div>
`;

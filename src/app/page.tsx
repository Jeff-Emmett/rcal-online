import Link from 'next/link'
import { Header } from '@/components/Header'
import { EcosystemFooter } from '@/components/EcosystemFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-[#e2e8f0]">
      <Header current="cal" />

      {/* ══ Hero ══════════════════════════════════════ */}
      <section className="text-center pt-28 pb-20 px-6 max-w-[820px] mx-auto">
        <span className="inline-block text-xs font-bold tracking-[0.15em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-8">
          Relational Calendar
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Time is shared. Your calendar should be too.
        </h1>
        <p className="text-xl text-slate-300 mb-6 leading-relaxed">
          A collaborative calendar for communities, cooperatives, and coordinated groups.
        </p>
        <p className="text-base text-slate-500 leading-relaxed max-w-[640px] mx-auto mb-10">
          rCal rethinks the calendar as a <span className="text-blue-400 font-semibold">shared, spatial, and cyclical</span> tool.
          See events across time and place, overlay lunar cycles, zoom from a single hour to a whole decade,
          and keep everyone on the same page — without the back-and-forth.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="https://demo.rcal.online"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-[0.95rem] bg-gradient-to-r from-blue-400 to-indigo-500 text-[#0b1120] hover:-translate-y-0.5 transition-transform"
          >
            Try the Demo
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-[0.95rem] bg-white/[0.06] border border-white/[0.12] text-slate-300 hover:border-white/25 hover:-translate-y-0.5 transition-all"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* ══ Principles (4-card grid) ══════════════════ */}
      <section className="max-w-[1100px] mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center hover:border-white/[0.12] transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-400/[0.12] flex items-center justify-center text-2xl">
              🤝
            </div>
            <h3 className="text-[0.95rem] font-semibold text-slate-100 mb-2">Shared by Default</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              One calendar for the whole group. Everyone sees the same context — no more fragmented schedules.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center hover:border-white/[0.12] transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-400/[0.12] flex items-center justify-center text-2xl">
              🗺
            </div>
            <h3 className="text-[0.95rem] font-semibold text-slate-100 mb-2">Spatiotemporal</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Events have a where, not just a when. See your schedule on a map and a timeline simultaneously.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center hover:border-white/[0.12] transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-400/[0.12] flex items-center justify-center text-2xl">
              🌙
            </div>
            <h3 className="text-[0.95rem] font-semibold text-slate-100 mb-2">Natural Cycles</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Lunar phases, eclipses, and solstices built in. Reconnect your planning to the rhythms of the natural world.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center hover:border-white/[0.12] transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-400/[0.12] flex items-center justify-center text-2xl">
              🔭
            </div>
            <h3 className="text-[0.95rem] font-semibold text-slate-100 mb-2">Multi-Scale Zoom</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Ten levels of time — from a 30-second moment to a cosmic era. See today or plan a decade ahead.
            </p>
          </div>
        </div>
      </section>

      {/* ══ Why rCal (alt section) ════════════════════ */}
      <section id="features" className="py-24 px-6 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full mb-4">
            Why rCal?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 tracking-tight leading-[1.2]">
            Calendars were never meant to be personal silos
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-[640px] mb-12">
            Mainstream calendars treat time as private property. rCal treats it as a <span className="text-blue-400 font-semibold">commons</span> — something groups navigate together. Here&apos;s what makes it different.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white/[0.03] border border-blue-400/[0.12] rounded-2xl p-7 hover:border-blue-400/25 transition-colors">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Where + When, Together</h3>
              <p className="text-[0.88rem] text-slate-400 leading-relaxed">
                Every event lives on both a timeline and a map. rCal&apos;s split view lets you see where everyone is meeting and when — with nine spatial zoom levels from planet to street address.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-blue-400/[0.12] rounded-2xl p-7 hover:border-blue-400/25 transition-colors">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Coupled Zoom</h3>
              <p className="text-[0.88rem] text-slate-400 leading-relaxed">
                Lock temporal and spatial zoom together: zoom out in time and the map zooms out to match. Planning a week? See the city. Planning a decade? See the continent.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-blue-400/[0.12] rounded-2xl p-7 hover:border-blue-400/25 transition-colors">
              <div className="text-3xl mb-4">📡</div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Multi-Source Sync</h3>
              <p className="text-[0.88rem] text-slate-400 leading-relaxed">
                Import from Google, Outlook, Apple, CalDAV, ICS feeds, and Obsidian. Layer multiple sources with per-source color coding and visibility controls.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-blue-400/[0.12] rounded-2xl p-7 hover:border-blue-400/25 transition-colors">
              <div className="text-3xl mb-4">🌑</div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Lunar Overlay</h3>
              <p className="text-[0.88rem] text-slate-400 leading-relaxed">
                Eight moon phases rendered on every calendar view with illumination percentages and eclipse detection. Plan gatherings, gardens, and ceremonies around natural cycles.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-blue-400/[0.12] rounded-2xl p-7 hover:border-blue-400/25 transition-colors">
              <div className="text-3xl mb-4">🧩</div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">r* Ecosystem Embeds</h3>
              <p className="text-[0.88rem] text-slate-400 leading-relaxed">
                rTrips, rMaps, rNetwork, rCart, and rNotes can all embed a calendar view through the context API. One calendar, surfaced everywhere it&apos;s needed.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-blue-400/[0.12] rounded-2xl p-7 hover:border-blue-400/25 transition-colors">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">Self-Hosted & Sovereign</h3>
              <p className="text-[0.88rem] text-slate-400 leading-relaxed">
                Open source and Dockerized. Your events live on your infrastructure — not in a corporate cloud. Full data sovereignty with rIDs authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Temporal Zoom Levels ══════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full mb-4">
            Temporal Navigation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 tracking-tight leading-[1.2]">
            Ten levels of time
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-[640px] mb-12">
            Most calendars show you a month. rCal lets you zoom from a single moment to a cosmic era — each level revealing a different kind of pattern.
          </p>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 overflow-x-auto">
            <div className="flex flex-col gap-3 min-w-[500px]">
              {[
                { level: 0, name: 'Moment', span: '30 seconds', color: 'bg-blue-500', width: 'w-[4%]' },
                { level: 1, name: 'Hour', span: '60 minutes', color: 'bg-blue-400', width: 'w-[8%]' },
                { level: 2, name: 'Day', span: '24 hours', color: 'bg-blue-400', width: 'w-[14%]' },
                { level: 3, name: 'Week', span: '7 days', color: 'bg-indigo-400', width: 'w-[22%]' },
                { level: 4, name: 'Month', span: '~30 days', color: 'bg-indigo-400', width: 'w-[32%]' },
                { level: 5, name: 'Season', span: '~3 months', color: 'bg-violet-400', width: 'w-[44%]' },
                { level: 6, name: 'Year', span: '365 days', color: 'bg-violet-400', width: 'w-[58%]' },
                { level: 7, name: 'Decade', span: '10 years', color: 'bg-purple-400', width: 'w-[72%]' },
                { level: 8, name: 'Century', span: '100 years', color: 'bg-purple-500', width: 'w-[86%]' },
                { level: 9, name: 'Cosmic', span: 'Geological', color: 'bg-purple-600', width: 'w-full' },
              ].map((z) => (
                <div key={z.level} className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 w-6 text-right font-mono">{z.level}</span>
                  <div className={`${z.width} h-6 ${z.color}/20 rounded-md flex items-center px-3`}>
                    <span className="text-xs font-semibold text-slate-200 whitespace-nowrap">{z.name}</span>
                    <span className="text-[0.65rem] text-slate-500 ml-auto whitespace-nowrap">{z.span}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ Calendar Views ════════════════════════════ */}
      <section className="py-24 px-6 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full mb-4">
            Four Views
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 tracking-tight leading-[1.2]">
            One calendar, four perspectives
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-[640px] mb-12">
            Switch between views with keyboard shortcuts (1-4) to see your events from the angle that matters most right now.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/[0.12] flex items-center justify-center text-lg">
                  📅
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Temporal</h3>
                  <span className="text-xs text-slate-500 font-mono">Press 1</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The classic calendar view — month, week, day, year, and season — enhanced with multi-granularity zoom and event indicators.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/[0.12] flex items-center justify-center text-lg">
                  🗺
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Spatial</h3>
                  <span className="text-xs text-slate-500 font-mono">Press 2</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Interactive map powered by Leaflet. Events cluster by location with nine spatial granularity levels from planet to GPS coordinates.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/[0.12] flex items-center justify-center text-lg">
                  🌙
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Lunar</h3>
                  <span className="text-xs text-slate-500 font-mono">Press 3</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Moon phase overlay with illumination percentages, eclipse detection, and phase-colored day cells. Plan around the eight phases of the lunar cycle.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/[0.12] flex items-center justify-center text-lg">
                  🧩
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Context</h3>
                  <span className="text-xs text-slate-500 font-mono">Press 4</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                When embedded inside another r* tool, this view shows calendar data filtered for that tool&apos;s entity — a trip, a network, a map layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Ecosystem Integration ═════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full mb-4">
            Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 tracking-tight leading-[1.2]">
            Part of the r* stack
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-[640px] mb-12">
            rCal connects to the full suite of community tools. Any r* app can display or create calendar events through the shared context API.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { emoji: '🗺', name: 'rTrips', desc: 'Trip itineraries auto-populate with calendar events for departure, accommodation, and activities.' },
              { emoji: '📍', name: 'rMaps', desc: 'Location-tagged events appear on shared community maps with time-filtered layers.' },
              { emoji: '👥', name: 'rNetwork', desc: 'See when your community members are available and schedule group meetings.' },
              { emoji: '🛒', name: 'rCart', desc: 'Product launches, market days, and delivery windows sync to your calendar.' },
              { emoji: '📝', name: 'rNotes', desc: 'Meeting notes link back to calendar events. Transcriptions attach to the moment they happened.' },
              { emoji: '🏠', name: 'rSpace', desc: 'Each space gets its own calendar. Subdomain routing means each community has a dedicated view.' },
            ].map((app) => (
              <div key={app.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-emerald-400/30 hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{app.emoji}</span>
                  <span className="text-base font-bold text-slate-100">{app.name}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            See time differently
          </h2>
          <p className="text-base text-slate-400 mb-8 leading-relaxed">
            Try the spatiotemporal calendar with lunar overlays, multi-source sync, and community sharing.
            No account needed for the demo.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="https://demo.rcal.online"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-[0.95rem] bg-gradient-to-r from-blue-400 to-indigo-500 text-[#0b1120] hover:-translate-y-0.5 transition-transform"
            >
              Open the Demo
            </Link>
            <a
              href="https://rstack.online"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-[0.95rem] bg-white/[0.06] border border-white/[0.12] text-slate-300 hover:border-white/25 hover:-translate-y-0.5 transition-all"
            >
              Explore rStack
            </a>
          </div>
        </div>
      </section>

      <EcosystemFooter current="rCal" />
    </div>
  )
}

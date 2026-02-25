import Link from 'next/link'
import { AppSwitcher } from '@/components/AppSwitcher'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AppSwitcher current="cal" />
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                rC
              </div>
              <span className="text-lg font-semibold">
                <span className="text-blue-400">r</span>Cal
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/calendar"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/calendar"
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-white"
            >
              Create Calendar
            </Link>
            <a
              href="https://auth.ridentity.online"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Group Calendars,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Simplified
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
            One calendar your whole group can see. No more back-and-forth — just shared context for when and where to meet.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/calendar"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors text-white"
            >
              Try the Demo
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-lg font-medium transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 border-t border-gray-800">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-12">
            A calendar that thinks in space and time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-xl mb-4">
                🗺
              </div>
              <h3 className="text-lg font-semibold mb-2">Where + When, Together</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                See events on a calendar and a map side by side. Plan meetups knowing where everyone is, not just when.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-xl mb-4">
                🔭
              </div>
              <h3 className="text-lg font-semibold mb-2">Zoom From Hours to Eras</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ten levels of time. See today's meetings, zoom out to the whole season, or plan years ahead — all in one view.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-xl mb-4">
                🌙
              </div>
              <h3 className="text-lg font-semibold mb-2">Moon & Natural Cycles</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Built-in lunar phase overlay with eclipse detection. Plan around full moons, new moons, and solstices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Add your events</h3>
                <p className="text-sm text-gray-400">
                  Create events with a time and a place. Or import from an existing calendar source.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Share with your group</h3>
                <p className="text-sm text-gray-400">
                  Everyone sees the same calendar. Same context, same view.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Find the right zoom level</h3>
                <p className="text-sm text-gray-400">
                  From a single hour to a decade. The calendar adapts to the scale you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="mx-auto max-w-3xl">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Works with the r* ecosystem</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              rCal embeds into rTrips, rMaps, rNetwork, and more. Any r-tool can display a calendar view through the context API.
            </p>
            <Link
              href="/calendar"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors text-white"
            >
              Open rCal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4">
            <span className="text-sm text-gray-500 font-medium">r* Ecosystem</span>
            <a href="https://rspace.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rSpace</a>
            <a href="https://rmaps.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rMaps</a>
            <a href="https://rnotes.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rNotes</a>
            <a href="https://rvote.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rVote</a>
            <a href="https://rfunds.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rFunds</a>
            <a href="https://rtrips.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rTrips</a>
            <a href="https://rcart.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rCart</a>
            <a href="https://rchoices.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rChoices</a>
            <a href="https://rwallet.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rWallet</a>
            <a href="https://rfiles.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rFiles</a>
            <a href="https://rtube.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rTube</a>
            <a href="https://rcal.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rCal</a>
            <a href="https://rnetwork.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rNetwork</a>
            <a href="https://rinbox.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rInbox</a>
            <a href="https://rstack.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rStack</a>
            <a href="https://rauctions.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rAuctions</a>
            <a href="https://rpubs.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rPubs</a>
            <a href="https://rdata.online" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">rData</a>
          </div>
          <p className="text-center text-xs text-gray-600">
            Part of the r* ecosystem — collaborative tools for communities.
          </p>
        </div>
      </footer>
    </div>
  )
}

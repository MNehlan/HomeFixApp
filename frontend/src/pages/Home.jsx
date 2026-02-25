import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getHomeData } from "../services/homeService"
import heroImage from "../assets/Handshakeimage.jpeg"

const Home = () => {
  const [data, setData] = useState({
    topTechnicians: [],
    categories: [],
    totalTechnicians: 0
  })

  useEffect(() => {
    getHomeData().then(setData).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <header className="max-w-5xl mx-auto px-6 py-6 md:py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Home Fix</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            to="/auth?mode=register"
            className="px-6 py-2.5 rounded-xl bg-black text-white hover:opacity-90 font-semibold text-center shadow-lg shadow-black/20"
          >
            Get Started
          </Link>
          <Link
            to="/partner"
            className="px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-black hover:text-black text-center transition-all bg-white"
          >
            Partner With Us
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-4 md:py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center mb-16 md:mb-20">
          <div className="space-y-6 order-2 lg:order-1">
            <p className="text-xl md:text-2xl font-semibold text-emerald-700">
              Verified home service pros on-demand
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Book trusted technicians for every home fix.
            </h2>
            <p className="text-lg md:text-2xl text-slate-600 leading-relaxed">
              {data.totalTechnicians > 0
                ? `Join ${data.totalTechnicians}+ customers employing vetted electricians, plumbers, and more.`
                : "Customers discover vetted electricians, plumbers, cleaners, and more."}
            </p>

            {data.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {data.categories.slice(0, 4).map(cat => (
                  <span key={cat} className="text-[10px] md:text-xs font-bold bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full uppercase tracking-wider">{cat}</span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/auth?mode=register"
                className="px-8 py-4 rounded-xl bg-black text-white font-bold hover:opacity-90 shadow-xl shadow-black/20 transition-all hover:scale-[1.02] text-center"
              >
                Get Started
              </Link>
              <Link
                to="/partner"
                className="px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-black hover:text-black transition-all text-center bg-white"
              >
                Partner With Us
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 bg-emerald-100/50 rounded-3xl -z-10 rotate-3 hidden sm:block"></div>
            <img
              src={heroImage}
              alt="Handshake"
              className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl border-4 border-white"
            />
          </div>
        </div>

        {/* Top Professionals Section */}
        <div className="space-y-8 pb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Top Rated Professionals</h3>
              <p className="text-slate-500 text-sm">Book highly skilled experts near you</p>
            </div>
            <Link to="/customer" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 group">
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.topTechnicians.length > 0 ? (
              data.topTechnicians.map((tech) => (
                <div key={tech.uid} className="bg-white shadow-sm hover:shadow-lg transition-all rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row gap-5">
                  <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md mx-auto sm:mx-0">
                    {tech.profilePic ? (
                      <img src={tech.profilePic} alt={tech.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-400">
                        {tech.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 sm:gap-4">
                      <div className="min-w-0">
                        <h4 className="font-bold text-lg text-slate-900 truncate">{tech.name}</h4>
                        <p className="text-emerald-600 font-bold text-sm">{tech.category}</p>
                      </div>
                      <span className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 border border-yellow-100">
                        ★ {tech.averageRating}
                      </span>
                    </div>
                    {tech.city && <p className="text-xs text-slate-400 mt-2 font-medium">📍 {tech.city}</p>}
                    <p className="text-sm text-slate-500 mt-4 line-clamp-2 leading-relaxed">
                      "{tech.bio || "Ready to fix your home problems!"}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Loading Skeletons
              [1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse flex flex-col sm:flex-row gap-5">
                  <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0 mx-auto sm:mx-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mx-auto sm:mx-0"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto sm:mx-0"></div>
                    <div className="h-12 bg-slate-100 rounded w-full mt-2"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home


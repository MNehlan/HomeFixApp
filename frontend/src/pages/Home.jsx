import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getHomeData } from "../services/homeService"

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
    <div className="min-h-screen bg-slate-50">
      <header className="max-w-5xl mx-auto px-6 py-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Home Fix</h1>
        <div className="flex gap-3">
          <Link
            to="/auth?mode=register"
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            to="/partner"
            className="px-4 py-2 rounded-lg border border-black text-black hover:bg-black hover:text-white"
          >
            Partner With Us
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-emerald-700">
            Verified home service pros on-demand
          </p>
          <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Book trusted technicians for every home fix.
          </h2>
          <p className="text-slate-600">
            {data.totalTechnicians > 0
              ? `Join ${data.totalTechnicians}+ customers employing vetted electricians, plumbers, and more.`
              : "Customers discover vetted electricians, plumbers, cleaners, and more."}
          </p>

          {data.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.categories.slice(0, 4).map(cat => (
                <span key={cat} className="text-xs bg-slate-200 px-2 py-1 rounded">{cat}</span>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Link
              to="/auth?mode=register"
              className="px-5 py-3 rounded-lg bg-black text-white hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              to="/partner"
              className="px-5 py-3 rounded-lg border border-black text-black hover:bg-black hover:text-white"
            >
              Partner With Us
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {data.topTechnicians.length > 0 ? (
            data.topTechnicians.map((tech) => (
              <div key={tech.uid} className="bg-white shadow-lg rounded-2xl p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Top Rated Technician</p>
                    <p className="font-bold text-lg text-slate-900">{tech.name}, {tech.category}</p>
                    {tech.city && <p className="text-xs text-slate-400">{tech.city}</p>}
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                    {tech.averageRating} ★
                  </span>
                </div>
                <div className="mt-4 rounded-xl bg-slate-100 p-4">
                  <p className="text-sm text-slate-600 italic">"{tech.bio || "Ready to fix your home problems!"}"</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4 border opacity-60">
              <p>Loading top professionals...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home


import { Link } from "react-router-dom"

const Home = () => {
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
            Customers discover vetted electricians, plumbers, cleaners, and
            more. Technicians grow their business with secure onboarding,
            admin approval, ratings, and profile management.
          </p>
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

        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Top Rated Technician</p>
              <p className="font-bold text-lg text-slate-900">Aisha, Plumber</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
              4.9 ★
            </span>
          </div>
          <div className="rounded-xl bg-slate-100 p-4 space-y-2">
            <p className="text-sm text-slate-600">
              “Home Fix made it easy to get approved and start receiving
              bookings. Ratings and a professional profile helped me earn
              repeat customers.”
            </p>
            <p className="text-xs text-slate-500">— Verified Technician</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 text-sm text-slate-700">
            <li className="bg-slate-100 rounded-lg px-3 py-2">Verified login</li>
            <li className="bg-slate-100 rounded-lg px-3 py-2">
              Admin approvals
            </li>
            <li className="bg-slate-100 rounded-lg px-3 py-2">
              Ratings & reviews
            </li>
            <li className="bg-slate-100 rounded-lg px-3 py-2">
              Profile management
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Home


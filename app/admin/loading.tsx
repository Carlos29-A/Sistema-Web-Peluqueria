export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar skeleton */}
      <aside className="fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <div className="h-5 w-28 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <nav className="flex-1 px-3 py-3 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className={`h-4 bg-gray-200 rounded-full animate-pulse ${i % 2 === 0 ? "w-24" : "w-20"}`} />
            </div>
          ))}
        </nav>
      </aside>

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center px-6 border-b border-gray-200 bg-white">
          <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-gray-200 mb-3" />
                <div className="h-3 w-20 bg-gray-100 rounded-full mb-2" />
                <div className="h-7 w-16 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="h-4 w-40 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded-full" />
                    <div className="h-3 w-48 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AnalyticsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="skeleton h-10 w-64 rounded-lg" />
        <div className="skeleton h-4 w-96 rounded" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-10 w-24 rounded" />
            <div className="skeleton h-3 w-28 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="card p-6">
          <div className="mb-4 space-y-1">
            <div className="skeleton h-5 w-48 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
          <div className="skeleton h-[300px] w-full rounded-lg" />
        </div>

        {/* Histogram */}
        <div className="card p-6">
          <div className="mb-4 space-y-1">
            <div className="skeleton h-5 w-40 rounded" />
            <div className="skeleton h-3 w-28 rounded" />
          </div>
          <div className="skeleton h-[300px] w-full rounded-lg" />
        </div>

        {/* Department Comparison */}
        <div className="card p-6">
          <div className="mb-4 space-y-1">
            <div className="skeleton h-5 w-52 rounded" />
            <div className="skeleton h-3 w-36 rounded" />
          </div>
          <div className="skeleton h-[300px] w-full rounded-lg" />
        </div>

        {/* Grade Distribution */}
        <div className="card p-6">
          <div className="mb-4 space-y-1">
            <div className="skeleton h-5 w-44 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
          <div className="skeleton h-[300px] w-full rounded-lg" />
        </div>
      </div>

      {/* Top 10 Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          <div className="skeleton h-5 w-48 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="px-4 py-3 grid grid-cols-6 gap-4 items-center">
              <div className="skeleton h-4 w-6 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-16 rounded" />
              <div className="skeleton h-4 w-12 rounded" />
              <div className="skeleton h-4 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

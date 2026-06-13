export default function CompareLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="skeleton h-8 w-8 rounded" />
          <div className="skeleton h-9 w-56 rounded-lg" />
        </div>
        <div className="skeleton h-4 w-80 rounded" />
      </div>

      {/* Search Form Skeleton */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="skeleton h-12 flex-1 rounded-lg" />
          <div className="skeleton h-12 w-32 rounded-lg" />
        </div>
        {/* Roll number chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-8 w-28 rounded-full" />
          ))}
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="skeleton h-6 w-36 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
              <div className="text-right space-y-1">
                <div className="skeleton h-3 w-12 rounded" />
                <div className="skeleton h-8 w-16 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <div className="skeleton h-3 w-16 rounded mb-2" />
                <div className="skeleton h-6 w-12 rounded" />
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <div className="skeleton h-3 w-16 rounded mb-2" />
                <div className="skeleton h-6 w-12 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* CGPA Comparison Chart */}
        <div className="card p-6">
          <div className="mb-4 space-y-1">
            <div className="skeleton h-6 w-48 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
          <div className="skeleton h-[300px] w-full rounded-lg" />
        </div>

        {/* SGPA Trend Chart */}
        <div className="card p-6">
          <div className="mb-4 space-y-1">
            <div className="skeleton h-6 w-40 rounded" />
            <div className="skeleton h-3 w-44 rounded" />
          </div>
          <div className="skeleton h-[300px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

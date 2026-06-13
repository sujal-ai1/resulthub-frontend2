export default function ResultLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero skeleton */}
      <div className="text-center space-y-4">
        <div className="skeleton h-12 w-72 mx-auto rounded-lg" />
        <div className="skeleton h-4 w-48 mx-auto rounded" />
      </div>

      {/* Search bar skeleton */}
      <div className="max-w-md mx-auto">
        <div className="skeleton h-12 w-full rounded-full" />
      </div>

      {/* Year filter skeleton */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-9 w-16 rounded-full" />
        ))}
      </div>

      {/* Branch filter skeleton */}
      <div className="flex justify-center flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="skeleton h-4 w-32 rounded" />
        </div>
        <div className="hidden md:grid grid-cols-5 gap-4 p-4" style={{ backgroundColor: 'var(--background)' }}>
          <div className="skeleton h-3 w-8 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="p-4">
              <div className="hidden md:grid grid-cols-5 gap-4 items-center">
                <div className="skeleton h-4 w-6 rounded" />
                <div className="skeleton h-4 w-36 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
                <div className="skeleton h-4 w-12 rounded" />
                <div className="skeleton h-4 w-10 rounded" />
              </div>
              <div className="md:hidden space-y-2">
                <div className="flex justify-between">
                  <div className="skeleton h-5 w-32 rounded" />
                  <div className="skeleton h-6 w-12 rounded-md" />
                </div>
                <div className="skeleton h-4 w-24 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton h-5 w-16 rounded-full" />
                  <div className="skeleton h-5 w-14 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SubjectsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="skeleton h-8 w-8 rounded" />
          <div className="skeleton h-9 w-48 rounded-lg" />
        </div>
        <div className="skeleton h-4 w-72 rounded" />
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        <div className="skeleton h-12 w-full max-w-md rounded-lg" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="card p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2 flex-1">
                <div className="skeleton h-5 w-full max-w-[200px] rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
              <div className="skeleton h-6 w-8 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-10 rounded" />
              </div>
              <div className="skeleton h-2 w-full rounded-full" />
            </div>
            <div className="flex gap-2 mt-3">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <div className="skeleton h-5 w-28 rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6">
        {/* Left Panel */}
        <div className="space-y-5">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="skeleton h-14 w-14 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="skeleton h-6 w-full rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                <div className="skeleton h-3 w-12 rounded mb-2" />
                <div className="skeleton h-6 w-16 rounded" />
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                <div className="skeleton h-3 w-12 rounded mb-2" />
                <div className="skeleton h-6 w-10 rounded" />
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                <div className="skeleton h-3 w-16 rounded mb-2" />
                <div className="skeleton h-6 w-12 rounded" />
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                <div className="skeleton h-3 w-14 rounded mb-2" />
                <div className="skeleton h-6 w-14 rounded" />
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="card p-5">
            <div className="skeleton h-4 w-32 rounded mb-4" />
            <div className="skeleton h-3 w-full rounded-full mb-3" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-4 w-12 rounded" />
              ))}
            </div>
          </div>

          {/* SGPA Chart */}
          <div className="card p-5">
            <div className="skeleton h-4 w-28 rounded mb-4" />
            <div className="skeleton h-[160px] w-full rounded-lg" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Semester Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-10 w-28 rounded-lg shrink-0" />
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-4 space-y-2">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-8 w-12 rounded" />
              </div>
            ))}
          </div>

          {/* Subjects Table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
              <div className="skeleton h-5 w-32 rounded" />
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="skeleton h-4 w-48 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="skeleton h-6 w-8 rounded-md" />
                    <div className="skeleton h-4 w-6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

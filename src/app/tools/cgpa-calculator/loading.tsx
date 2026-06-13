export default function ToolsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="skeleton h-10 w-10 rounded-lg" />
          <div className="skeleton h-10 w-56 rounded-lg" />
        </div>
        <div className="skeleton h-4 w-80 mx-auto rounded" />
      </div>

      {/* Calculator Card */}
      <div className="card p-6">
        {/* Semester Rows */}
        <div className="space-y-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="skeleton h-10 w-32 rounded-lg" />
              <div className="skeleton h-10 flex-1 rounded-lg" />
              <div className="skeleton h-10 flex-1 rounded-lg" />
              <div className="skeleton h-10 w-10 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <div className="skeleton h-10 w-36 rounded-lg" />
          <div className="skeleton h-10 w-24 rounded-lg" />
        </div>

        {/* Result Card */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
          <div className="text-center space-y-4">
            <div className="skeleton h-5 w-40 mx-auto rounded" />
            <div className="skeleton h-16 w-24 mx-auto rounded-lg" />
            <div className="skeleton h-4 w-32 mx-auto rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

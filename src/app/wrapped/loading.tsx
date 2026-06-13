export default function WrappedLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center space-y-2">
        <div className="skeleton h-10 w-56 mx-auto rounded-lg" />
        <div className="skeleton h-4 w-72 mx-auto rounded" />
      </div>

      {/* Search Form */}
      <div className="max-w-md mx-auto mb-12">
        <div className="flex gap-2">
          <div className="skeleton h-12 flex-1 rounded-lg" />
          <div className="skeleton h-12 w-28 rounded-lg" />
        </div>
      </div>

      {/* Loading Animation */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="skeleton h-20 w-20 rounded-full mb-6" />
        <div className="skeleton h-6 w-48 rounded mb-2" />
        <div className="skeleton h-4 w-64 rounded" />
      </div>
    </div>
  );
}

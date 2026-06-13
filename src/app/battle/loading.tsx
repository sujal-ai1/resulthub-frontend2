export default function BattleLoading() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <div className="space-y-2">
                <div className="skeleton h-10 w-48 rounded-lg" />
                <div className="skeleton h-4 w-80 rounded" />
            </div>
            <div className="card p-6 space-y-5">
                <div className="flex gap-2">
                    <div className="skeleton h-10 w-32 rounded-lg" />
                    <div className="skeleton h-10 w-32 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="skeleton h-12 rounded-lg" />
                    <div className="skeleton h-8 w-12 mx-auto rounded" />
                    <div className="skeleton h-12 rounded-lg" />
                </div>
                <div className="skeleton h-10 w-40 rounded-lg" />
            </div>
        </div>
    );
}

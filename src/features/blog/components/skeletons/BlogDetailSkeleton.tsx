export const BlogDetailSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 pt-8 animate-pulse">
            <main className="lg:col-span-8">
                {/* Header Skeleton */}
                <div className="mb-6">
                    <div className="h-6 w-24 bg-gray-200 rounded mb-3" />
                    <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
                    <div className="flex items-center justify-between border-b border-gray-100 py-4 mb-6">
                        <div className="h-4 w-40 bg-gray-200 rounded" />
                        <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded-full" />
                            <div className="h-8 w-8 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Image Skeleton */}
                <div className="w-full aspect-[16/9] bg-gray-200 rounded-2xl mb-10" />

                {/* Content Skeleton */}
                <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-4/5 bg-gray-200 rounded" />
                </div>
            </main>

            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-4 pl-0 lg:pl-8 mt-8 lg:mt-0">
                <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-3 w-20 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
};

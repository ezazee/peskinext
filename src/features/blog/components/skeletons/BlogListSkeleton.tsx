export const BlogListSkeleton = () => {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Hero Section Skeleton (Bento Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-auto lg:h-[500px]">
                <div className="lg:col-span-2 relative min-h-[300px] lg:h-full bg-gray-200 rounded-2xl" />
                <div className="lg:col-span-1 lg:h-full grid grid-rows-2 gap-4">
                    <div className="bg-gray-200 rounded-2xl h-full min-h-[200px]" />
                    <div className="bg-gray-200 rounded-2xl h-full min-h-[200px]" />
                </div>
                <div className="hidden lg:block lg:col-span-1 bg-gray-200 rounded-2xl h-full" />
            </div>

            {/* Grid Section Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <div className="aspect-[16/9] bg-gray-200 rounded-xl" />
                        <div className="h-4 w-2/3 bg-gray-200 rounded" />
                        <div className="h-3 w-full bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};

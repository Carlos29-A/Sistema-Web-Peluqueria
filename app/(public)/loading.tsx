import Container from "@/components/public/ui/Container"

export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse" />
          <div className="hidden lg:flex items-center gap-6">
            <div className="h-4 w-14 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-14 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-14 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-14 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <Container>
        <div className="pt-24 pb-16 space-y-12">
          {/* Hero skeleton */}
          <div className="text-center space-y-4 py-16">
            <div className="h-4 w-24 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-10 w-96 max-w-full bg-gray-200 rounded-xl mx-auto animate-pulse" />
            <div className="h-5 w-72 max-w-full bg-gray-100 rounded-lg mx-auto animate-pulse" />
            <div className="h-12 w-40 bg-gray-200 rounded-full mx-auto mt-6 animate-pulse" />
          </div>

          {/* Cards skeleton */}
          <div>
            <div className="text-center space-y-3 mb-8">
              <div className="h-4 w-20 bg-gray-200 rounded-full mx-auto animate-pulse" />
              <div className="h-6 w-64 mx-auto bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-80 max-w-full bg-gray-100 rounded-lg mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-32 bg-gray-200 rounded-full" />
                    <div className="h-4 w-full bg-gray-100 rounded-full" />
                    <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
                    <div className="flex justify-between pt-4 border-t border-gray-100">
                      <div className="h-7 w-16 bg-gray-200 rounded-full" />
                      <div className="h-5 w-16 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

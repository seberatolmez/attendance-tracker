'use client';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-gray-100 border-t border-gray-200/50 mt-auto backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg px-4 py-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <span className="font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    Berat Ölmez
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

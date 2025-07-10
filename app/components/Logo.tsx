"use client"

export function Logo() {
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
        <div className="relative">
          {/* Brain/AI Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700"
          >
            <path
              d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C15.1 7 16 7.9 16 9V10.29C16.59 10.54 17 11.22 17 12C17 12.78 16.59 13.46 16 13.71V15C16 16.1 15.1 17 14 17H13V18.27C13.6 18.61 14 19.26 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 19.26 10.4 18.61 11 18.27V17H10C8.9 17 8 16.1 8 15V13.71C7.41 13.46 7 12.78 7 12C7 11.22 7.41 10.54 8 10.29V9C8 7.9 8.9 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Sparkle effect */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

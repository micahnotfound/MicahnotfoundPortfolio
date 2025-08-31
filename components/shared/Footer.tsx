export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-16 px-8">
      <div className="container-custom">
        {/* Desktop: Left-aligned Layout */}
        <div className="hidden md:flex flex-col items-start space-y-6">
          {/* Thick Contact Button */}
          <a
            href="mailto:micah@art404.com"
            className="border-4 border-black px-8 py-4 text-center font-ui font-bold text-black hover:bg-black hover:text-white transition-colors duration-200"
          >
            CONTACT
          </a>

          {/* Instagram Handle */}
          <a
            href="https://instagram.com/micahnotfound"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 font-ui font-medium transition-colors duration-200"
          >
            @micahnotfound
          </a>

          {/* Email */}
          <a
            href="mailto:micah@art404.com"
            className="text-gray-600 hover:text-gray-900 font-ui font-medium transition-colors duration-200"
          >
            micah@art404.com
          </a>
        </div>

        {/* Mobile: Stacked Layout */}
        <div className="md:hidden flex flex-col items-center space-y-6">
          {/* Thick Contact Button */}
          <a
            href="mailto:micah@art404.com"
            className="border-4 border-black px-8 py-4 text-center font-ui font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 w-full max-w-xs"
          >
            CONTACT
          </a>

          {/* Instagram Handle */}
          <a
            href="https://instagram.com/micahnotfound"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 font-ui font-medium transition-colors duration-200"
          >
            @micahnotfound
          </a>

          {/* Email */}
          <a
            href="mailto:micah@art404.com"
            className="text-gray-600 hover:text-gray-900 font-ui font-medium transition-colors duration-200"
          >
            micah@art404.com
          </a>
        </div>
      </div>
    </footer>
  )
}

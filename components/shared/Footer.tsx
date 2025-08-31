export function Footer() {
  return (
    <footer className="bg-white py-16 px-8">
      <div className="container-custom">
        {/* Desktop: Items on same row */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Thick Contact Button */}
          <a
            href="mailto:micah@art404.com"
            className="border-[7px] border-core-dark px-8 py-2 text-center font-ui font-bold text-core-dark hover:bg-core-dark hover:text-white transition-colors duration-200"
          >
            Contact
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

        {/* Mobile & Tablet: Stacked Layout */}
        <div className="md:hidden flex flex-col items-center space-y-6">
          {/* Thick Contact Button */}
          <a
            href="mailto:micah@art404.com"
            className="border-[7px] border-core-dark px-8 py-2 text-center font-ui font-bold text-core-dark hover:bg-core-dark hover:text-white transition-colors duration-200 w-full max-w-xs"
          >
            Contact
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

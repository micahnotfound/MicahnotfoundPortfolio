export function Footer() {
  return (
    <footer className="bg-white py-16 px-20 xl:px-[100px]">
      <div className="w-full max-w-[2000px]">
        {/* Desktop: Items on same row */}
        <div className="hidden md:flex items-center">
          {/* Contact group with single border */}
          <div className="border-[5px] border-core-dark px-4 py-1 flex items-center space-x-4 hover:bg-core-dark hover:text-white transition-colors duration-200 ml-[7px]">
            {/* Contact: label */}
            <span className="font-ui font-bold text-core-dark text-[0.95em]">
              Contact:
            </span>

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

        {/* Mobile & Tablet: Stacked Layout */}
        <div className="md:hidden flex flex-col items-center">
          {/* Contact group with single border */}
          <div className="border-[5px] border-core-dark px-4 py-4 flex flex-col items-center space-y-3 hover:bg-core-dark hover:text-white transition-colors duration-200 w-full max-w-xs">
            {/* Contact: label */}
            <span className="font-ui font-bold text-core-dark text-[0.95em]">
              Contact:
            </span>

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
      </div>
    </footer>
  )
}

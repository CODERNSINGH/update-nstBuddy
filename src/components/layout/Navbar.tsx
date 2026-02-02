import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const developers = [
    { name: 'Ranajeet Roy', link: 'https://www.linkedin.com/in/ranajeet-roy-3a5822323/', isTopContributor: true },
    { name: 'Narendra Singh', link: 'https://www.linkedin.com/in/codernsingh/' },
    { name: 'Keshav Rajput', link: 'https://www.linkedin.com/in/keshavrajput/' },
    { name: 'Pranav Singh', link: 'https://www.linkedin.com/in/pranav-singh-08155a244/' },
    { name: 'Mayank Gupta', link: 'https://www.linkedin.com/in/mayank0875/' },
    { name: 'Aditya Yadav', link: 'https://www.linkedin.com/in/aditya-yadav-240321jim/' },
    { name: 'Jivit Rana', link: 'https://www.linkedin.com/in/jivit/' },
    { name: 'Abhijeet Kumar', link: 'https://www.linkedin.com/in/abhijeet-kumar-7406b9336/' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-600">NST Buddy</Link>
          </div>
          <div className="flex items-center space-x-4 relative">
            <Link to="/assignments" className="text-gray-600 hover:text-gray-900">Assignments</Link>
            <Link to="/contests" className="text-gray-600 hover:text-gray-900">Contests</Link>

            {/* Developers Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                Developers
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                  {developers.map((dev, index) => (
                    <a
                      key={index}
                      href={dev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block px-4 py-3 text-sm transition-all duration-200 ${dev.isTopContributor
                          ? 'bg-purple-50 border-l-4 border-purple-600 hover:bg-purple-100'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`${dev.isTopContributor ? 'font-semibold text-purple-900' : 'font-medium text-gray-700'}`}>
                            {dev.name}
                          </span>
                        </div>
                        {dev.isTopContributor && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-600 text-white">
                            Top Contributor
                          </span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

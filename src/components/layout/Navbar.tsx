import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserProfile from '../auth/UserProfile';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();

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
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.svg"
              alt="NST Buddy"
              className="h-10 w-auto"
            />
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold">2.0</span>
          </Link>
          <div className="flex items-center space-x-4 relative">
            {/* Buy Me a Coffee Button */}
            <a
              href="https://pages.razorpay.com/nstbuddy"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
              </svg>
              Buy Me a Coffee
            </a>

            {/* Contribute Link */}
            <Link
              to="/contribute"
              className="text-gray-300 hover:text-white font-semibold flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Contribute
            </Link>

            {/* Profile Link */}
            

            {/* Admin Link - Only show for admin users */}
            {user?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>
            )}

            {/* Developers Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-300 hover:text-white flex items-center"
              >
                Developers
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                  {developers.map((dev, index) => (
                    <a
                      key={index}
                      href={dev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block px-4 py-3 text-sm transition-all duration-200 ${dev.isTopContributor
                        ? 'bg-blue-900 border-l-4 border-blue-500 hover:bg-blue-800'
                        : 'text-gray-300 hover:bg-gray-800'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`${dev.isTopContributor ? 'font-semibold text-white' : 'font-medium text-gray-300'}`}>
                            {dev.name}
                          </span>
                        </div>
                        {dev.isTopContributor && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                            Top Contributor
                          </span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


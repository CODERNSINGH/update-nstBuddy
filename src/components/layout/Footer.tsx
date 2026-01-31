import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="w-full mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} NST Buddy. All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">A product by</span>
                        <a
                            href="https://masternow.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity"
                        >
                            <img
                                src="/MasternowDark.svg"
                                alt="MasterNow"
                                className="h-8 w-auto"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

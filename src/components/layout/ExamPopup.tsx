import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ExamPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small delay for better UX
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Content */}
        <div className="flex flex-col">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <img
              src="https://therewillbeposts.wordpress.com/wp-content/uploads/2013/10/38500522.jpg"
              alt="Brace Yourself End of Semester is Coming"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Brace Yourself!
            </h2>
            <p className="text-gray-600 text-lg">
              All the best to everyone for your End-Semester Examination.
            </p>
            <p className="text-sm text-gray-500 font-medium pb-2">
              Thank you so much for using nstbuddy <span className="text-indigo-600 font-semibold">#nstian2024</span>
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPopup;

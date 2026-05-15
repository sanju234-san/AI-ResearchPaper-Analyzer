import React from 'react';
import { BookOpen } from 'lucide-react';

const NavBar = ({ onNavigate, userName }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-mint/10 border border-mint/30 rounded-lg flex items-center justify-center group-hover:bg-mint/20 transition-all">
            <BookOpen className="w-5 h-5 text-mint" />
          </div>
          <span className="font-display text-xl font-bold text-white">
            AI Research<span className="text-mint">.</span>
          </span>
        </button>
        <nav className="flex gap-6 items-center">
          {['Home', 'Upload', 'Dashboard'].map((item) => (
            <button
              key={item}
              onClick={() => onNavigate(item.toLowerCase())}
              className="relative text-sm font-body text-gray-400 hover:text-white transition-colors duration-300 group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mint group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          {userName ? (
            <button onClick={() => onNavigate('settings')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mint/30 to-purple/30 border border-white/10 flex items-center justify-center text-sm font-semibold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="bg-mint text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-mint-dim transition-all mint-glow-hover"
            >
              Login
            </button>
          )}
        </nav>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-mint/20 to-transparent" />
    </header>
  );
};

export default NavBar;

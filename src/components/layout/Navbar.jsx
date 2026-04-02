import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown } from 'lucide-react';
import logo from "../../assets/akanjo.png";

/* ── Toggle Switch ───────────────────────────────────────────── */
const SidebarToggle = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Toggle sidebar"
    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
  >
    <svg width="30" height="17" viewBox="0 0 30 17" fill="none">
      <rect x="1" y="1" width="28" height="15" rx="7.5" stroke="#56656b" strokeWidth="1.8" fill="none" />
      <circle
        cy="8.5"
        r="4.5"
        fill="#56656b"
        style={{
          cx: isOpen ? 21 : 9,
          transition: 'cx 0.3s cubic-bezier(0.34,1.4,0.64,1)',
        }}
      />
    </svg>
  </button>
);

/* ── Navbar ──────────────────────────────────────────────────── */
const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo]     = useState({ username: '', email: '' });
  const [showDropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const email    = localStorage.getItem('email');
    if (username && email) setUserInfo({ username, email });
    else navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const initials = userInfo.username
    ? userInfo.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full px-4 md:px-5 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">
          <SidebarToggle isOpen={sidebarOpen} onClick={onToggleSidebar} />
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />
          <img src={logo} alt="Akanjo" className="h-12 w-auto object-contain" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">

          <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block" />

          {/* User */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdown((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#56656b' }}
              >
                <span className="text-white text-xs font-semibold tracking-wide">{initials}</span>
              </div>

              {/* Name */}
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-semibold text-gray-800 leading-tight">{userInfo.username}</p>
                <p className="text-[11px] text-gray-400 leading-tight">{userInfo.email}</p>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                strokeWidth={2.5}
              />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50 animate-dropIn">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-[13px] font-semibold text-gray-800">{userInfo.username}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{userInfo.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors duration-150"
                >
                  <LogOut className="w-[15px] h-[15px]" strokeWidth={1.8} />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
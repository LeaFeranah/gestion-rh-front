import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, ChevronDown, User, X } from "lucide-react";
import logo from "../../assets/akanjo.png";

/* ── Toggle Switch ───────────────────────────────────────────── */
const SidebarToggle = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Toggle sidebar"
    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
  >
    <svg width="30" height="17" viewBox="0 0 30 17" fill="none">
      <rect
        x="1"
        y="1"
        width="28"
        height="15"
        rx="7.5"
        stroke="#56656b"
        strokeWidth="1.8"
        fill="none"
      />
      <circle
        cy="8.5"
        r="4.5"
        fill="#56656b"
        style={{
          cx: isOpen ? 21 : 9,
          transition: "cx 0.3s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      />
    </svg>
  </button>
);

const ROLE_LABELS = {
  SUPERADMIN: "Super administrateur",
  ADMIN: "Administrateur simple",
  RESPONSABLE: "Responsable de section",
};

/* ── Modale : Mon profil ─────────────────────────────────────── */
const ProfileModal = ({ userInfo, onClose }) => {
  const role = localStorage.getItem("role") || "ADMIN";
  let sections = [];
  try {
    sections = JSON.parse(localStorage.getItem("sections") || "[]");
  } catch {
    sections = [];
  }

  const initials = userInfo.username
    ? userInfo.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="border-b-2 border-gray-800 p-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Mon profil</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#56656b" }}
            >
              <span className="text-white text-sm font-semibold">
                {initials}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {userInfo.username}
              </p>
              {userInfo.email && (
                <p className="text-xs text-gray-400">{userInfo.email}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Rôle</p>
              <span
                className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: "#56656b" }}
              >
                {ROLE_LABELS[role] || role}
              </span>
            </div>

            {role === "RESPONSABLE" && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">
                  Sections dont vous êtes responsable
                </p>
                {sections.length > 0 ? (
                  <ul className="text-sm text-gray-700 space-y-1">
                    {sections.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">
                    Aucune section assignée
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Navbar ──────────────────────────────────────────────────── */
const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const [showDropdown, setDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (username) setUserInfo({ username, email: email || "" });
    else navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const initials = userInfo.username
    ? userInfo.username.slice(0, 2).toUpperCase()
    : "??";

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
                style={{ backgroundColor: "#56656b" }}
              >
                <span className="text-white text-xs font-semibold tracking-wide">
                  {initials}
                </span>
              </div>

              {/* Name */}
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                  {userInfo.username}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">
                  {userInfo.email}
                </p>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50 animate-dropIn">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-[13px] font-semibold text-gray-800">
                    {userInfo.username}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {userInfo.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors duration-150"
                >
                  <User className="w-[15px] h-[15px]" strokeWidth={1.8} />
                  Mon profil
                </button>
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

      {showProfile && (
        <ProfileModal
          userInfo={userInfo}
          onClose={() => setShowProfile(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;

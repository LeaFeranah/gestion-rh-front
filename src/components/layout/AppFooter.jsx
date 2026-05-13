/**
 * AppFooter.jsx — AKANJO Madagascar
 * Usage : <AppFooter /> en bas de chaque page
 */

import React from "react";

const AppFooter = ({ className = "" }) => {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearDisplay = currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;

  return (
    <footer
      className={`mt-6 pt-3 border-t border-gray-100 ${className}`}
      aria-label="Pied de page"
    >
      <p className="text-[11px] text-gray-400 text-center tracking-wide">
        © {yearDisplay}{" "}
        <span className="font-semibold text-gray-500">AKANJO Madagascar</span>
        {" · "}Système de Gestion RH
        {" · "}Usage interne exclusif
        {" · "}Tous droits réservés
        <span className="ml-3 text-gray-300">v1.0.0</span>
      </p>
    </footer>
  );
};

export default AppFooter;
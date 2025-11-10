// import React from 'react';
// import { getColorGradient } from '../../utils/colorGradients';

// const MenuButton = ({ item, isActive, sidebarOpen, onClick }) => {
//   const IconComponent = item.icon;

//   return (
//     <button
//       onClick={onClick}
//       className={`
//         w-full flex items-center gap-4 px-4 py-4 rounded-sm text-sm
//         transition-all duration-300
//         ${isActive
//           ? `bg-gradient-to-r ${getColorGradient(item.color)} text-white shadow-sm transform scale-105`
//           : 'hover:bg-gray-100 text-gray-700 hover:transform hover:scale-105'
//         }
//       `}
//     >
//       <IconComponent className="w-5 h-5 flex-shrink-0" />
//       {sidebarOpen && (
//         <span className="font-medium whitespace-nowrap">{item.label}</span>
//       )}
//     </button>
//   );
// };

// export default MenuButton;


import React from "react";
import { getColorGradient } from "../../utils/colorGradients";

const MenuButton = ({ item, isActive, sidebarOpen, onClick }) => {
  const IconComponent = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        group w-full flex items-center rounded-md text-sm font-medium
        transition-all duration-200 ease-in-out
        ${isActive
          ? `bg-gradient-to-r ${getColorGradient(item.color)} text-white shadow-sm`
          : "text-gray-700 hover:bg-gray-100"
        }
        py-2.5 px-2
      `}
    >
      {/* Zone icône — largeur fixe et centrée */}
      <div className="min-w-[40px] flex justify-center items-center">
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Zone texte avec transition fluide */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 ml-0"
        }`}
      >
        <span className="whitespace-nowrap">{item.label}</span>
      </div>
    </button>
  );
};

export default MenuButton;


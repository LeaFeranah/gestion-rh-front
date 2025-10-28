import React from 'react';
import { getColorGradient } from '../../utils/colorGradients';

const MenuButton = ({ item, isActive, sidebarOpen, onClick }) => {
  const IconComponent = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-3 rounded-xl 
        transition-all duration-300
        ${isActive
          ? `bg-gradient-to-r ${getColorGradient(item.color)} text-white shadow-lg transform scale-105`
          : 'hover:bg-gray-100 text-gray-700 hover:transform hover:scale-105'
        }
      `}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      {sidebarOpen && (
        <span className="font-medium whitespace-nowrap">{item.label}</span>
      )}
    </button>
  );
};

export default MenuButton;

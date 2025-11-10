import React from 'react';
import MenuButton from '../buttons/MenuButton';
import { MENU_ITEMS } from '../../data/menuItems';
import { LogOut } from 'lucide-react';


const Sidebar = ({ isOpen, activeMenu, onMenuChange }) => {
  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-white shadow-sm transition-all duration-500 z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="h-full overflow-y-auto py-6 px-3">
        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <MenuButton
              key={item.id}
              item={item}
              isActive={activeMenu === item.id}
              sidebarOpen={isOpen}
              onClick={() => onMenuChange(item.id)}
            />
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 ${!isOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import MenuButton from '../buttons/MenuButton';
import { MENU_ITEMS } from '../../data/menuItems';

const MENU_GROUPS = [
  {
    label: 'Principal',
    items: ['dashboard'],
  },
  {
    label: 'RH',
    items: ['employees', 'recruitment', 'attendance','heures-travail', 'meal-allowance', 'payroll'],
  },
  {
    label: 'Gestion',
    items: ['performance', 'leave', 'documents', 'awards'],
  },
  {
    label: 'Système',
    items: ['settings'],
  },
];

const Sidebar = ({ isOpen, activeMenu, onMenuChange }) => {
  const itemMap = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m]));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px] md:hidden"
          onClick={() => onMenuChange(activeMenu)}
        />
      )}

      <aside
        style={{ borderRight: '1px solid #e8eaeb' }}
        className={`
          fixed left-0 top-16 bottom-0 bg-white z-40
          flex flex-col
          transition-[width] duration-300 ease-in-out
          ${isOpen ? 'w-60' : 'w-[68px]'}
        `}
      >
        <div style={{ height: '2px', background: '#56656b', opacity: 0.15 }} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-5 scrollbar-thin">
          {MENU_GROUPS.map((group, gi) => {
            const groupItems = group.items.map((id) => itemMap[id]).filter(Boolean);
            return (
              <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
                {/* Divider between groups */}
                {gi > 0 && (
                  <div style={{ height: '1px', background: '#e8eaeb', margin: '0 12px 12px' }} />
                )}

                <nav className="space-y-[15px] px-2">
                  {groupItems.map((item) => (
                    <MenuButton
                      key={item.id}
                      item={item}
                      isActive={activeMenu === item.id}
                      sidebarOpen={isOpen}
                      onClick={() => onMenuChange(item.id)}
                    />
                  ))}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Bottom brand strip */}
        <div
          style={{
            padding: isOpen ? '12px 20px' : '12px 0',
            borderTop: '1px solid #e8eaeb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            gap: '10px',
            transition: 'padding 0.3s',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: '#56656b',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="4" fill="white" opacity="0.9" />
              <circle cx="7" cy="7" r="2" fill="#56656b" />
            </svg>
          </div>
          {isOpen && (
            <div style={{ overflow: 'hidden', transition: 'opacity 0.2s', opacity: isOpen ? 1 : 0 }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#56656b', letterSpacing: '0.05em', margin: 0 }}>
                AKANJO
              </p>
              <p style={{ fontSize: '10px', color: '#9eacb1', margin: 0 }}>RH Platform v2</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
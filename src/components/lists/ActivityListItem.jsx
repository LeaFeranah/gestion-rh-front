import React from 'react';
import { getColorGradient } from '../../utils/colorGradients';

const ActivityListItem = ({ activity }) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getColorGradient(activity.color)} flex items-center justify-center text-white font-semibold shadow-md`}>
        {activity.name.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">
          {activity.name}{' '}
          <span className="text-gray-500 font-normal">{activity.action}</span>
        </p>
        <p className="text-xs text-gray-400">{activity.time}</p>
      </div>
    </div>
  );
};

export default ActivityListItem;

import React from 'react';
import ActivityListItem from '../../components/lists/ActivityListItem';
import { ACTIVITIES_DATA } from '../../data/activitiesData';

const RecentActivities = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Activités Récentes
      </h3>
      <div className="space-y-3">
        {ACTIVITIES_DATA.map((activity, index) => (
          <ActivityListItem key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;

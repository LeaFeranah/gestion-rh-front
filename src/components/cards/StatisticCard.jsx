import React from 'react';
import { getColorGradient } from '../../utils/colorGradients';

const StatisticCard = ({ stat }) => {
  const IconComponent = stat.icon;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getColorGradient(stat.color)} flex items-center justify-center shadow-lg`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
      </div>
      <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
    </div>
  );
};

export default StatisticCard;

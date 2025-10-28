import React from 'react';
import StatisticCard from '../../components/cards/StatisticCard';
import { STATS_DATA } from '../../data/statsData';

const StatisticsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {STATS_DATA.map((stat, index) => (
        <StatisticCard key={index} stat={stat} />
      ))}
    </div>
  );
};

export default StatisticsGrid;

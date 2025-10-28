import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import StatisticsGrid from './StatisticsGrid';
import RecentActivities from './RecentActivities';


const DashboardPage = () => {
  // return (
  //   <div className="p-6">
  //     <div className="max-w-7xl mx-auto">
  //       <WelcomeBanner />
  //       <StatisticsGrid />
  //       <RecentActivities />
  //     </div>
  //   </div>
  // );
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tableau de bord</h1>
      <div className="mx-auto">
        <WelcomeBanner />
        <StatisticsGrid />
        <RecentActivities />
      </div>
    </div>
  );
};

export default DashboardPage;

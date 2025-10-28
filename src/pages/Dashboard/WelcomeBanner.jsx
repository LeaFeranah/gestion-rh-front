import React from 'react';
import { USER_INFO } from '../../data/userInfo';

const WelcomeBanner = () => {
  return (
    // <div className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
    <div className="mb-8 bg-gradient-to-r from-[#3c474b] via-[#56656b] to-[#788489] rounded-2xl p-8 text-white shadow-2xl">
      <h2 className="text-3xl font-bold mb-2">Bienvenue, {USER_INFO.name.split(' ')[0]}! </h2>
      <p className="text-blue-100 text-lg">azert</p>
      <p className="text-blue-100 text-md font-roboto">azert</p>
    </div>
  );
};

export default WelcomeBanner;



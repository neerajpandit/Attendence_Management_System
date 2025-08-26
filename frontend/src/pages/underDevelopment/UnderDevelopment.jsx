import React from 'react';
import Lottie from 'lottie-react';
import constructionAnimation from './developmentAnimation.json';

const UnderDevelopment = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full h-[550px]">
        <Lottie animationData={constructionAnimation} loop={true} />
      </div>
    </div>
  );
};

export default UnderDevelopment;

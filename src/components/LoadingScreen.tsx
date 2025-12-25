import React from 'react';

const LoadingScreen: React.FC<{ message?: string }> = ({ message = "INITIALIZING..." }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-transparent">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-t-2 border-starlight-cyan animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-nebula-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
      </div>
      <div className="font-mono text-sm text-starlight-cyan animate-pulse tracking-widest">
        {message}
      </div>
    </div>
  );
};
export default LoadingScreen;

import React from 'react';

interface ResearchCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ icon, title, children }) => {
  return (
    <div className="bg-slate-800/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-slate-700/50 transition-all duration-300 hover:border-sky-500/50 hover:shadow-sky-500/10">
      <div className="flex items-center mb-4">
        <div className="bg-slate-700 text-sky-400 p-2 rounded-lg mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="text-slate-300">
        {children}
      </div>
    </div>
  );
};

export default ResearchCard;

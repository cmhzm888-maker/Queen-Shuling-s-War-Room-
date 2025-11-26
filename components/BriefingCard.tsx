import React from 'react';
import { MomBriefing } from '../types';
import { AlertTriangle, Heart, Lightbulb, MessageCircle } from 'lucide-react';

interface BriefingCardProps {
  data: MomBriefing;
}

export const BriefingCard: React.FC<BriefingCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-8 animate-fade-in-up">
      <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg flex items-center gap-2 font-serif-sc">
          <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">For Mom</span>
          教学简报
        </h2>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-2">
        {/* Error Type */}
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="flex items-center gap-2 mb-2 text-red-700 font-bold">
            <AlertTriangle size={18} />
            <h3>错误定性</h3>
          </div>
          <p className="text-slate-700">{data.errorType}</p>
        </div>

        {/* Psychology */}
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold">
            <Heart size={18} />
            <h3>心理洞察</h3>
          </div>
          <p className="text-slate-700">{data.psychologicalInsight}</p>
        </div>

        {/* Strategy */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold">
            <Lightbulb size={18} />
            <h3>教学策略</h3>
          </div>
          <p className="text-slate-700">{data.teachingStrategy}</p>
        </div>

        {/* Talk Track */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold">
            <MessageCircle size={18} />
            <h3>话术要点</h3>
          </div>
          <p className="text-slate-700 font-medium">{data.conversationGuide}</p>
        </div>
      </div>
    </div>
  );
};
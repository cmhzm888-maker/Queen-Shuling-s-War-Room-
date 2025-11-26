import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ShulingTutorial } from '../types';
import { Crown, ScrollText, Mic2 } from 'lucide-react';

interface TutorialCardProps {
  data: ShulingTutorial;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-2xl overflow-hidden text-white mb-8 border-4 border-yellow-500/30 animate-fade-in-up delay-100">
      {/* Header */}
      <div className="bg-black/20 px-6 py-6 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 text-white/5 rotate-12">
            <ScrollText size={120} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                 <span className="bg-yellow-500 text-indigo-950 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <Mic2 size={12} />
                    妈妈的剧本
                 </span>
                 <span className="text-indigo-200 text-xs uppercase tracking-wider">
                    实战演练 · 角色扮演引导
                 </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif-sc flex items-center gap-3 text-white">
            {data.title}
            </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 prose prose-invert prose-lg max-w-none">
         <div className="flex items-start gap-4 mb-6 bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="w-full">
                <p className="font-bold text-yellow-500 text-sm uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                    操作指南 (请按此与将军互动)
                </p>
                <div className="text-slate-300 leading-relaxed font-sans space-y-4">
                     {/* Custom styling for the markdown to distinguish actions and dialogue */}
                     <ReactMarkdown
                        components={{
                            strong: ({node, ...props}) => <span className="text-yellow-400 font-bold bg-yellow-400/10 px-1 rounded" {...props} />,
                            blockquote: ({node, ...props}) => <div className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-900/30 rounded-r-lg italic text-indigo-100" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-xl font-serif-sc text-white mt-6 mb-3 flex items-center gap-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="space-y-2 my-4 list-disc pl-5" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />
                        }}
                     >
                        {data.content}
                     </ReactMarkdown>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
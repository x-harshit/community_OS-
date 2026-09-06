import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportCard } from '../components/reports/ReportCard';
import {
  Send,
  MessageSquare,
  Sparkles,
  Megaphone,
  Filter,
  PlusCircle,
  ThumbsUp,
  Share2,
  Users
} from 'lucide-react';

export const CommunityScreen: React.FC = () => {
  const {
    selectedCommunity,
    communityPosts,
    reports,
    addCommunityPost,
    likeCommunityPost,
    identity,
    setIsReportWizardOpen
  } = useApp();

  const [postText, setPostText] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'discussions' | 'reports'>('all');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    addCommunityPost(postText.trim(), isNotice);
    setPostText('');
    setIsNotice(false);
  };

  // Combine posts & reports in a chronological feed
  const combinedFeed: Array<
    | { type: 'post'; data: (typeof communityPosts)[0] }
    | { type: 'report'; data: (typeof reports)[0] }
  > = [];

  if (filterMode === 'all' || filterMode === 'discussions') {
    communityPosts.forEach((p) => combinedFeed.push({ type: 'post', data: p }));
  }

  if (filterMode === 'all' || filterMode === 'reports') {
    reports.forEach((r) => combinedFeed.push({ type: 'report', data: r }));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
      {/* Top Bento Header Tile */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-0.5 rounded-full border border-black">
              NEIGHBORHOOD STREAM
            </span>
            <span className="text-xs font-mono font-bold text-zinc-400">
              LIVE DISPATCH FEED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">
            {selectedCommunity.name} Ward Channel
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Real-time local conversations, community updates, and active civic report cards.
          </p>
        </div>

        <button
          onClick={() => setIsReportWizardOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#FF5C00] hover:bg-[#e65300] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[3]" />
          <span>Report Problem</span>
        </button>
      </div>

      {/* Bento Message Composer Box */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black border-2 border-black text-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {identity.isAnonymous ? 'A' : identity.displayName.charAt(0)}
            </div>
            <span className="text-xs font-black uppercase tracking-tight text-black">
              Posting as <strong>{identity.isAnonymous ? 'Anonymous Neighbor' : identity.displayName}</strong>
            </span>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
            Civic Messenger
          </span>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            rows={2}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={`Post a neighborhood question or update in ${selectedCommunity.name}...`}
            className="w-full px-4 py-3 rounded-2xl border-2 border-black text-xs sm:text-sm font-semibold focus:outline-none focus:bg-white bg-zinc-50 resize-none placeholder:text-zinc-400 placeholder:font-normal"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-tight text-black cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isNotice}
                onChange={(e) => setIsNotice(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-black text-black focus:ring-0 accent-black"
              />
              <span className="flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-[#FF5C00] stroke-[2.5]" />
                <span>Mark as Important Announcement</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={!postText.trim()}
              className="px-5 py-2.5 rounded-2xl bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30"
            >
              <span>Broadcast Update</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>

      {/* Bento Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
              filterMode === 'all'
                ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            All Stream
          </button>
          <button
            onClick={() => setFilterMode('discussions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
              filterMode === 'discussions'
                ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            Discussions ({communityPosts.length})
          </button>
          <button
            onClick={() => setFilterMode('reports')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
              filterMode === 'reports'
                ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            Civic Cards ({reports.length})
          </button>
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Ward 44-E Channel
        </span>
      </div>

      {/* Main Feed */}
      <div className="space-y-4">
        {combinedFeed.map((item, index) => {
          if (item.type === 'report') {
            return (
              <div key={`report-${item.data.id}`} className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-black px-1">
                  <span className="px-2 py-0.5 rounded bg-[#FF5C00] text-white border border-black font-black">
                    OFFICIAL REPORT TICKET
                  </span>
                  <span>•</span>
                  <span className="text-zinc-500">Delivered to {item.data.authorityName}</span>
                </div>
                <ReportCard report={item.data} />
              </div>
            );
          } else {
            const p = item.data;
            return (
              <div
                key={`post-${p.id}`}
                className={`p-5 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  p.isNotice
                    ? 'bg-[#E2FF4D]/30'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {p.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-tight text-black">
                          {p.authorName}
                        </span>
                        {p.isNotice && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FF5C00] text-white font-black border border-black uppercase tracking-wider">
                            Notice
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{p.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-black font-medium leading-relaxed whitespace-pre-line">
                  {p.content}
                </p>

                <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center gap-4 text-xs font-bold text-black">
                  <button
                    onClick={() => likeCommunityPost(p.id)}
                    className="flex items-center gap-1.5 hover:text-[#FF5C00] cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{p.likes} Endorsements</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <MessageSquare className="w-3.5 h-3.5 stroke-[2]" />
                    <span>{p.commentsCount} Replies</span>
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

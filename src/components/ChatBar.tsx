import React, { useState, useRef, useEffect } from 'react';
import type { Character, CharacterStatus } from '../types/game';
import { Send, AtSign, Smile, Circle, ChevronDown, Check } from 'lucide-react';

interface ChatBarProps {
  userCharacter: Character;
  allCharacters: Character[];
  onSendMessage: (content: string, mentions: string[]) => void;
  onUpdateStatus: (status: CharacterStatus) => void;
}

const QUICK_EMOJIS = ['👋', '☕', '💻', '🚀', '🔥', '✨', '🍕', '🎉', '👏', '😂'];

export const ChatBar: React.FC<ChatBarProps> = ({
  userCharacter,
  allCharacters,
  onSendMessage,
  onUpdateStatus,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter mentionable characters (excluding oneself or including all)
  const mentionable = allCharacters.filter(
    (c) =>
      c.id !== userCharacter.id &&
      c.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    // Check if user is typing '@'
    const lastAtIdx = val.lastIndexOf('@');
    if (lastAtIdx !== -1 && lastAtIdx >= val.length - 20) {
      const query = val.slice(lastAtIdx + 1);
      if (!query.includes(' ')) {
        setMentionFilter(query);
        setShowMentions(true);
        return;
      }
    }
    setShowMentions(false);
  };

  const handleSelectMention = (charName: string) => {
    const lastAtIdx = inputVal.lastIndexOf('@');
    if (lastAtIdx !== -1) {
      const beforeAt = inputVal.slice(0, lastAtIdx);
      const newVal = `${beforeAt}@${charName} `;
      setInputVal(newVal);
    } else {
      setInputVal((prev) => `${prev}@${charName} `);
    }
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleAddEmoji = (emoji: string) => {
    setInputVal((prev) => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    // Detect mentioned names
    const mentions: string[] = [];
    allCharacters.forEach((char) => {
      if (inputVal.includes(`@${char.name}`)) {
        mentions.push(char.name);
      }
    });

    onSendMessage(inputVal.trim(), mentions);
    setInputVal('');
    setShowMentions(false);
    setShowEmojis(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setShowMentions(false);
      setShowEmojis(false);
      setShowStatusMenu(false);
    }
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.chat-bar-container')) {
        setShowMentions(false);
        setShowEmojis(false);
        setShowStatusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (s: CharacterStatus) => {
    switch (s) {
      case 'online':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50';
      case 'busy':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'offline':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  const getStatusLabel = (s: CharacterStatus) => {
    switch (s) {
      case 'online':
        return 'Trực Tuyến (Online)';
      case 'busy':
        return 'Đang Bận (Busy)';
      case 'offline':
        return 'Ngoại Tuyến (Offline)';
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-6 pointer-events-none chat-bar-container">
      {/* Centered Chat Box with Equal Left and Right Margins */}
      <div className="pointer-events-auto w-full max-w-3xl relative">
        {/* MENTIONS AUTOCOMPLETE POPUP */}
        {showMentions && (
          <div className="absolute bottom-16 left-36 z-50 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-b border-slate-800">
              Nhắc tên đồng nghiệp (@...)
            </div>
            {mentionable.length > 0 ? (
              mentionable.map((char) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => handleSelectMention(char.name)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-indigo-600/30 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-indigo-300">
                        @{char.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{char.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Bấm chọn</span>
                </button>
              ))
            ) : (
              <div className="text-xs text-slate-500 p-3 text-center">
                Không tìm thấy nhân vật phù hợp
              </div>
            )}
          </div>
        )}

        {/* EMOJI PICKER POPUP */}
        {showEmojis && (
          <div className="absolute bottom-16 right-16 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Biểu cảm nhanh
            </div>
            <div className="grid grid-cols-5 gap-2">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAddEmoji(emoji)}
                  className="w-9 h-9 rounded-xl hover:bg-slate-800 text-xl flex items-center justify-center transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STATUS SELECTOR MENU */}
        {showStatusMenu && (
          <div className="absolute bottom-16 left-0 z-50 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-b border-slate-800">
              Chọn Trạng Thái
            </div>
            {(['online', 'busy', 'offline'] as CharacterStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  onUpdateStatus(status);
                  setShowStatusMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-colors ${
                  userCharacter.status === status
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      status === 'online'
                        ? 'bg-emerald-400'
                        : status === 'busy'
                        ? 'bg-amber-400'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>{getStatusLabel(status)}</span>
                </div>
                {userCharacter.status === status && (
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Floating Glass Bar */}
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl p-2 flex items-center gap-2 transition-all focus-within:border-indigo-500/80 focus-within:shadow-indigo-500/10">
          {/* Status Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:brightness-110 ${getStatusColor(
              userCharacter.status
            )}`}
            title="Đổi trạng thái: Online, Busy, Offline"
          >
            <Circle className="w-2 h-2 fill-current animate-pulse" />
            <span className="capitalize hidden sm:inline">{userCharacter.status}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Quick Mention Button */}
          <button
            type="button"
            onClick={() => {
              setShowMentions(!showMentions);
              setShowEmojis(false);
            }}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 text-xs font-bold transition-all"
            title="Tag tên đồng nghiệp (@)"
          >
            <AtSign className="w-4 h-4" />
            <span className="hidden sm:inline">Tag</span>
          </button>

          {/* Chat Text Input Field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn... (Gõ @ để tag tên đồng nghiệp trong công sở)"
              maxLength={250}
              className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Emoji Trigger */}
          <button
            type="button"
            onClick={() => {
              setShowEmojis(!showEmojis);
              setShowMentions(false);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all hover:scale-105"
            title="Chọn Emoji"
          >
            <Smile className="w-4 h-4 text-amber-400" />
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!inputVal.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span className="hidden md:inline">Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

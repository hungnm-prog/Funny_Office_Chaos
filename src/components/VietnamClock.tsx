import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sun, Moon, Coffee } from 'lucide-react';

export const VietnamClock: React.FC = () => {
  const [timeData, setTimeData] = useState(() => getVietnamTime());

  function getVietnamTime() {
    const now = new Date();
    // Format to Asia/Ho_Chi_Minh
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);

    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const dateStr = new Intl.DateTimeFormat('vi-VN', dateOptions).format(now);

    // Get hour for greeting / icon
    const hourInt = parseInt(timeStr.split(':')[0], 10);
    let period = 'Buổi Sáng';
    let iconType = 'sun';
    if (hourInt >= 12 && hourInt < 13) {
      period = 'Giờ Nghỉ Trưa';
      iconType = 'lunch';
    } else if (hourInt >= 13 && hourInt < 18) {
      period = 'Buổi Chiều';
      iconType = 'sun';
    } else if (hourInt >= 18 || hourInt < 6) {
      period = 'Buổi Tối';
      iconType = 'moon';
    }

    return {
      time: timeStr,
      date: dateStr,
      period,
      iconType,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(getVietnamTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-40 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl px-4 py-2.5 text-slate-100 transition-all hover:border-indigo-500/50">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
        <Clock className="w-5 h-5 animate-pulse" />
        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold tracking-wider text-white">
            {timeData.time}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
            GMT+7 (VN)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <span className="flex items-center gap-1 font-medium text-slate-300 capitalize">
            <Calendar className="w-3 h-3 text-indigo-400" />
            {timeData.date}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
            {timeData.iconType === 'moon' ? (
              <Moon className="w-3 h-3" />
            ) : timeData.iconType === 'lunch' ? (
              <Coffee className="w-3 h-3" />
            ) : (
              <Sun className="w-3 h-3" />
            )}
            {timeData.period}
          </span>
        </div>
      </div>
    </div>
  );
};


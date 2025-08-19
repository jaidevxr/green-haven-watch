import React, { useState, useEffect } from 'react';
import { Clock, Leaf } from 'lucide-react';

export const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="h-16 bg-gradient-glass backdrop-blur-glass border-b border-glass-border shadow-card">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Dashboard title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-nature flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            Disaster Response Dashboard
          </h1>
        </div>

        {/* Right side - Live clock */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {formatDate(currentTime)}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg font-semibold">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
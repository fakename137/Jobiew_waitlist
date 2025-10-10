'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trophy, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import confetti from 'canvas-confetti';

interface WaitlistUser {
  id: string;
  email: string;
  invite_code?: string;
  referred_by_code?: string;
  referral_count: number;
  position: number;
  created_at: string;
}

function SuccessPageContent() {
  const [user, setUser] = useState<WaitlistUser | null>(null);
  const [leaderboard, setLeaderboard] = useState<WaitlistUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Get user data from URL params or localStorage
    const userData = searchParams?.get('user') || localStorage.getItem('waitlistUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        localStorage.setItem('waitlistUser', userData);
        
        // Fetch fresh user data from API
        refreshUserData(parsedUser.email);
        
        // Trigger confetti celebration on first load
        triggerConfetti();
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Fetch leaderboard data
    fetchLeaderboard();

    // Set up polling to refresh data every 10 seconds
    const pollInterval = setInterval(() => {
      if (user?.email) {
        refreshUserData(user.email);
      }
      fetchLeaderboard();
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [searchParams, user?.email]);

  const refreshUserData = async (email: string) => {
    try {
      const response = await fetch(`/api/user-status?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('waitlistUser', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.recentUsers || []);
        setTotalUsers(data.totalUsers || 0);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Fire confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const copyInviteLink = async () => {
    if (user?.invite_code) {
      const inviteLink = `${window.location.origin}?invite=${user.invite_code}`;
      try {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        
        // Trigger confetti when copying link
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 999,
        });
        
        setTimeout(() => setCopied(false), 3000);
      } catch (error) {
        console.error('Failed to copy:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = inviteLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        
        // Trigger confetti for fallback too
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 999,
        });
        
        setTimeout(() => setCopied(false), 3000);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Welcome to Jobiew!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            You&apos;re all set! Redirecting to the waitlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-black dark:text-gray-200" style={{ fontFamily: 'var(--font-orbitron), sans-serif', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Jobiew</span>
            </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
         
          </div>
        </div>
      </header>

      

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">

        
        <div className="w-full max-w-2xl">

         {/* Footer */}
         <div className="mt-8 mb-8 text-center">
           <div className="bg-white/60 dark:bg-gray-900/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/20 relative overflow-hidden">
            {/* Creative Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 dark:from-gray-800/10 dark:via-transparent dark:to-gray-700/5"></div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:bg-gray-600/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-pink-200/15 to-blue-200/15 dark:bg-gray-700/15 rounded-full blur-2xl animate-float delay-1000"></div>
            
            {/* Geometric Shapes */}
            <div className="absolute top-6 right-6 w-4 h-4 border border-white/20 dark:border-gray-600/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
            <div className="absolute bottom-6 left-6 w-3 h-3 bg-white/10 dark:bg-gray-600/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            
            <div className="relative z-10">
              <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 font-bold mb-2">
                LAUNCHING SOON
              </div>
              <p className="text-black dark:text-white text-xl md:text-2xl font-black mb-2 drop-shadow-lg tracking-tight">
                WE&apos;LL NOTIFY YOU
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium drop-shadow-sm">
                Early access · Exclusive features · VIP status
              </p>
            </div>
          </div>
        </div>
        {/* Main Glassmorphism Card */}
        <div className="bg-white/60 dark:bg-gray-900/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/20">
          {/* Creative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 dark:from-gray-800/10 dark:via-transparent dark:to-gray-700/5"></div>
          
          {/* Floating Orbs */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-200/25 to-purple-200/25 dark:bg-gray-600/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-blue-200/20 dark:bg-gray-700/15 rounded-full blur-2xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 dark:bg-gray-500/20 rounded-full blur-lg animate-float delay-500"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-8 right-8 w-6 h-6 border border-white/20 dark:border-gray-600/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-12 left-12 w-4 h-4 bg-white/10 dark:bg-gray-600/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {/* Position Display */}
            <div className="mb-6">
              <div className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 font-bold mb-2">
                YOUR POSITION
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black dark:text-white drop-shadow-lg tracking-tight">
                #{user.position.toLocaleString()}
              </h1>
              <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium mt-1">
                of {totalUsers.toLocaleString()} in queue
              </div>
            </div>
            
            {/* Referral CTA */}
            <div className="mb-6 relative inline-block group">
              {/* Glowing backdrop */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 via-white/20 to-white/10 dark:from-gray-700/20 dark:via-gray-600/30 dark:to-gray-700/20 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Main content */}
              <div className="relative bg-white/70 dark:bg-white/8 backdrop-blur-lg px-3 md:px-5 py-2 md:py-3 rounded-xl border-2 border-gray-300/60 dark:border-white/20 shadow-xl">
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Left side: Number emphasis */}
                  <div className="flex flex-col items-center">
                    <div className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-gray-600 dark:text-gray-400 font-black">
                      JUMP
                    </div>
                    <div className="relative my-0.5">
                      <div className="text-2xl md:text-3xl font-black text-black dark:text-white leading-none tracking-tighter">
                        +3
                      </div>
                      <div className="absolute -top-0.5 -right-1.5 md:-right-2 text-[8px] md:text-[10px] font-black text-gray-600 dark:text-gray-400">
                        ×
                      </div>
                    </div>
                    <div className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 font-black">
                      SPOTS
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-10 md:h-12 w-px bg-white/20 dark:bg-white/15"></div>
                  
                  {/* Right side: Action text */}
                  <div className="flex flex-col">
                    <div className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 font-black leading-tight">
                      PER
                    </div>
                    <div className="text-base md:text-lg font-black text-black dark:text-white leading-none tracking-tight my-0.5">
                      REFERRAL
                    </div>
                    <div className="text-[7px] md:text-[8px] uppercase tracking-wider text-gray-600 dark:text-gray-400 font-bold">
                      → SHARE NOW
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Copy Referral Link Button */}
            <div className="space-y-4">
              <button
                onClick={copyInviteLink}
                className="w-full bg-white/70 dark:bg-white/8 backdrop-blur-md text-black dark:text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl text-xs md:text-sm lg:text-base font-black uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border border-gray-300/60 dark:border-white/15 hover:bg-white/80 dark:hover:bg-white/12 hover:border-gray-400/70 dark:hover:border-white/20"
              >
                {copied ? 'LINK COPIED' : 'GET REFERRAL LINK'}
              </button>
              
              {/* WhatsApp Community Button */}
              <a
                href="https://whatsapp.com/channel/0029VbBnwrn5a247geAOdo0R"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl text-xs md:text-sm lg:text-base font-black uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border border-green-600 dark:border-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden sm:inline">JOIN WHATSAPP COMMUNITY</span>
                <span className="sm:hidden">JOIN COMMUNITY</span>
              </a>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-8">
          {/* Leaderboard Glassmorphism Card */}
          <div className="bg-white/60 dark:bg-gray-900/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/20 relative overflow-hidden">
            {/* Creative Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 dark:from-gray-800/10 dark:via-transparent dark:to-gray-700/5"></div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:bg-gray-600/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-200/15 to-blue-200/15 dark:bg-gray-700/15 rounded-full blur-2xl animate-float delay-1000"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-2 md:gap-3 mb-6 pb-4 border-b border-white/10 dark:border-gray-700/20">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-black dark:text-white drop-shadow-md" />
                <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-black dark:text-white drop-shadow-sm">
                  HALL OF FAME
                </h3>
                <span className="ml-auto text-[10px] md:text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">
                  TOP 3
                </span>
              </div>
              
              {/* Leaderboard List */}
              <div className="space-y-2">
                {(() => {
                  // Get top 3
                  const top3 = leaderboard.slice(0, 3);
                  
                  // Check if current user is in top 3
                  const userInTop3 = top3.some(u => u.id === user?.id);
                  
                  // If user is not in top 3, add them at the end
                  const displayList = userInTop3 
                    ? top3 
                    : [...top3, ...leaderboard.filter(u => u.id === user?.id)];
                  
                  return displayList.map((leaderUser, index) => (
                    <div key={leaderUser.id}>
                      {/* Separator before current user if they're not in top 3 */}
                      {index === 3 && !userInTop3 && (
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-white/10 dark:bg-gray-700/20"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest px-2">
                            YOU
                          </span>
                          <div className="flex-1 h-px bg-white/10 dark:bg-gray-700/20"></div>
                        </div>
                      )}
                      
                      <div
                        className={`group flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                          leaderUser.id === user?.id
                            ? 'bg-white/80 dark:bg-white/10 border-2 border-gray-300/70 dark:border-white/20 shadow-lg' 
                            : 'bg-white/50 dark:bg-gray-800/10 border border-gray-200/50 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/15'
                        }`}
                      >
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-bold text-xs md:text-sm shadow-md transition-all duration-300 ${
                      index === 0
                        ? 'bg-white/80 dark:bg-white/20 text-black dark:text-white border-2 border-gray-300/70 dark:border-white/30' 
                        : index === 1
                        ? 'bg-white/70 dark:bg-white/15 text-black dark:text-white border border-gray-300/60 dark:border-white/25'
                        : index === 2
                        ? 'bg-white/60 dark:bg-white/10 text-black dark:text-white border border-gray-200/50 dark:border-white/20'
                        : 'bg-white/50 dark:bg-gray-700/30 text-black dark:text-white border border-gray-200/50 dark:border-gray-700/30'
                    }`}>
                      {leaderUser.position}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1 md:gap-2">
                        <span className="text-sm md:text-base font-semibold text-black dark:text-white truncate">
                          {leaderUser.email.replace(/(.{2}).*(@.*)/, '$1***$2')}
                        </span>
                        {leaderUser.id === user?.id && (
                          <span className="text-[8px] md:text-[10px] text-black dark:text-white font-black uppercase tracking-wider px-1.5 md:px-2 py-0.5 md:py-1 bg-white/70 dark:bg-white/10 rounded-md border border-gray-300/60 dark:border-white/15">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-gray-600 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">
                        {leaderUser.referral_count === 0 
                          ? 'No refs' 
                          : `${leaderUser.referral_count} ref${leaderUser.referral_count === 1 ? '' : 's'}`
                        }
                      </div>
                    </div>
                    
                    {/* Referral Count Badge */}
                    <div className="flex-shrink-0 px-2 md:px-3 py-1.5 md:py-2 rounded-xl bg-white/60 dark:bg-gray-800/20 border border-gray-200/50 dark:border-gray-700/25 text-center">
                      <div className="text-[8px] md:text-[10px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-wider">REFS</div>
                      <div className="text-lg md:text-xl font-black text-black dark:text-white leading-none mt-1">
                        {leaderUser.referral_count}
                      </div>
                    </div>
                  </div>
                    </div>
                  ));
                })()}
              </div>
              
              {/* Empty State */}
              {leaderboard.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-10 h-10 md:w-12 md:h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">
                    BE THE FIRST
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>


       
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <p className="text-black dark:text-gray-400 text-sm">
          © Jobiew - Find your dream job 10x faster. Built by{' '}
          <a href="https://x.com/FakeName137" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors">FakeName</a>{' '}
          &{' '}
          <a href="https://x.com/i_am_abdulhaq" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors">abdulhaq</a>.
        </p>
      </footer>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

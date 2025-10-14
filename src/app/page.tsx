'use client';

import { useState, useEffect, Suspense } from 'react';
import { Mail, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchParams, useRouter } from 'next/navigation';

function HomeContent() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get invite code from URL params
  const inviteCode = searchParams?.get('invite') || searchParams?.get('ref') || undefined;

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          // User is already registered, redirect to success page
          router.push(`/success?user=${encodeURIComponent(JSON.stringify(data.user))}`);
        } else {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Client-side email validation
  const validateEmailClient = (emailValue: string): string => {
    if (!emailValue) {
      return '';
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(emailValue)) {
      return 'Please enter a valid email address';
    }

    // Check for disposable domains (common ones)
    const domain = emailValue.split('@')[1]?.toLowerCase();
    const disposableDomains = ['tempmail.com', 'throwaway.email', 'mailinator.com', 'guerrillamail.com', '10minutemail.com'];
    
    if (domain && disposableDomains.includes(domain)) {
      return 'Temporary email addresses are not allowed';
    }

    // Check for common typos
    const commonTypos: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gnail.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'outlok.com': 'outlook.com',
      'hotmial.com': 'hotmail.com',
    };

    if (domain && commonTypos[domain]) {
      return `Did you mean ${emailValue.replace(domain, commonTypos[domain])}?`;
    }

    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear previous errors
    setEmailError('');
    setMessage('');
    
    // Validate after user stops typing (debounced)
    if (newEmail.includes('@')) {
      const error = validateEmailClient(newEmail);
      setEmailError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setEmailError('');

    try {
      const response = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          inviteCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage for the success page
        if (data.user) {
          localStorage.setItem('waitlistUser', JSON.stringify(data.user));
        }
        
        // Redirect to success page
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else {
          router.push('/success');
        }
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
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
          
      
          
          <button 
            onClick={handleThemeToggle}
            className="p-2 text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (Current: ${theme})`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Waitlist Badge */}
          <div className="inline-flex items-center rounded-full shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-2 bg-black ">
              <span className="text-sm font-semibold text-white">Waitlist v1</span>
            </div>
            <div className="px-4 py-2 bg-white ">
              <span className="text-sm font-semibold text-black  ">Coming Soon</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
            Find your dream job 10x faster
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-black dark:text-gray-300 max-w-xl mx-auto">
            Tired of searching for jobs and applying for it? Let your AI agentic browser do it for you. Get to interviews 10x faster and focus on what really matters.
          </p>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Your email..."
                className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border ${
                  emailError 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-blue-500 dark:focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 shadow-lg backdrop-blur-0 transition-all duration-300`}
                required
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <div className="text-center text-sm text-red-600 dark:text-red-400 -mt-2">
                {emailError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !!emailError}
              className="w-full bg-black dark:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 shadow-2xl border border-black dark:border dark:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Joining...' : 'Join The Waitlist'}
            </button>
            
            {message && (
              <div className={`text-center text-sm ${message.includes('Successfully') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {message}
              </div>
            )}
            
            {inviteCode && (
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                Invite code: {inviteCode}
              </div>
            )}
          </form>

      
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

import * as React from 'react';

interface WaitlistEmailProps {
  position: number;
  totalUsers: number;
  inviteCode: string;
  referralLink: string;
}

export function WaitlistEmailTemplate({ position, totalUsers }: WaitlistEmailProps) {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '40px 20px',
      background: '#000000',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '60px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 100, 
          margin: '0', 
          color: 'white',
          fontFamily: 'var(--font-orbitron), sans-serif',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          nohunt.ai
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#cccccc',
          margin: '12px 0 0 0',
          fontWeight: 300
        }}>
          Find your dream job 10x faster
        </p>
      </div>

    

      {/* Main Position Card */}
      <div style={{ 
        background: '#111111',
        borderRadius: '16px', 
        padding: '50px 40px', 
        textAlign: 'center',
        marginBottom: '40px',
        border: '1px solid #333333',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <p style={{ 
          fontSize: '16px', 
          color: '#cccccc', 
          margin: '0 0 16px 0',
          fontWeight: 300
        }}>
          Your position in line
        </p>
        <h2 style={{ 
          fontSize: '64px', 
          fontWeight: 'bold', 
          color: '#ffffff', 
          margin: '0 0 16px 0',
          fontFamily: 'monospace',
          letterSpacing: '0.05em'
        }}>
          #{position.toLocaleString()}
        </h2>
        <p style={{ 
          fontSize: '18px', 
          color: '#cccccc', 
          margin: '0',
          fontWeight: 300
        }}>
          of {totalUsers.toLocaleString()} people
        </p>
      </div>

      {/* Journey Card */}
      <div style={{ 
        background: '#111111',
        borderRadius: '16px', 
        padding: '40px', 
        textAlign: 'center',
        marginBottom: '30px',
        border: '1px solid #333333',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <p style={{
          fontSize: '20px',
          color: '#ffffff',
          margin: '0 0 16px 0',
          fontWeight: 400
        }}>
          You&apos;re part of a futuristic journey
        </p>
        <p style={{
          fontSize: '16px',
          color: '#cccccc',
          margin: '0 0 20px 0',
          fontWeight: 300,
          lineHeight: '1.5'
        }}>
          While millions struggle with traditional job hunting, you&apos;re ahead of the curve with AI-powered automation
        </p>
     
      </div>

   

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 0'
      }}>
        <p style={{ 
          fontSize: '16px', 
          color: '#cccccc', 
          margin: '0 0 12px 0',
          fontWeight: 300
        }}>
          We&apos;ll notify you when nohunt.ai launches
        </p>
        <p style={{ 
          fontSize: '14px', 
          color: '#999999', 
          margin: '0',
          fontWeight: 300
        }}>
          Early access · Exclusive features · VIP status
        </p>
      </div>
    </div>
  );
}


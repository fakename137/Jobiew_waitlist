import * as React from 'react';

interface WaitlistEmailProps {
  position: number;
  totalUsers: number;
  inviteCode: string;
  referralLink: string;
}

export function WaitlistEmailTemplate({ position, totalUsers, inviteCode, referralLink }: WaitlistEmailProps) {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '40px 20px',
      background: '#ffffff',
      color: '#333333'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 100, 
          margin: '0', 
          color: '#000000',
          fontFamily: 'var(--font-orbitron), sans-serif',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          nohunt.ai
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#666666',
          margin: '8px 0 0 0'
        }}>
          Welcome to the waitlist!
        </p>
      </div>

      {/* Main Content Card */}
      <div style={{ 
        background: '#f8f9fa',
        borderRadius: '12px', 
        padding: '40px', 
        textAlign: 'center',
        marginBottom: '30px',
        border: '1px solid #e9ecef'
      }}>
        {/* Position */}
        <div style={{ marginBottom: '30px' }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#666666', 
            margin: '0 0 8px 0'
          }}>
            Your position in line
          </p>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#000000', 
            margin: '0 0 8px 0'
          }}>
            #{position.toLocaleString()}
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666666', 
            margin: '0'
          }}>
            of {totalUsers.toLocaleString()} people
          </p>
        </div>

        {/* Referral Info */}
        <div style={{ marginBottom: '30px' }}>
          <p style={{
            fontSize: '16px',
            color: '#333333',
            margin: '0 0 20px 0'
          }}>
            Share your code to move up 3 spots for each friend who joins!
          </p>
        </div>

        {/* Referral Link Button */}
        <a 
          href={referralLink}
          style={{ 
            display: 'inline-block',
            background: '#000000',
            color: '#ffffff', 
            padding: '16px 32px', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Share Referral Link
        </a>
      </div>

   

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px 0'
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#666666', 
          margin: '0 0 8px 0'
        }}>
          We&apos;ll notify you when nohunt.ai launches
        </p>
        <p style={{ 
          fontSize: '12px', 
          color: '#999999', 
          margin: '0'
        }}>
          Early access · Exclusive features · VIP status
        </p>
      </div>
    </div>
  );
}


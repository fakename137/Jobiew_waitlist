'use client';

import { WaitlistEmailTemplate } from '@/components/email-template';

export default function EmailPreviewPage() {
  // Sample data for preview
  const sampleData = {
    position: 42,
    totalUsers: 1250,
    inviteCode: 'NH2024ABC',
    referralLink: 'https://nohunt.ai?invite=NH2024ABC'
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Template Preview</h1>
          <p className="text-gray-600 mb-4">
            This is how the waitlist email will look when sent to users.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Sample Data:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Position: #{sampleData.position}</li>
              <li>Total Users: {sampleData.totalUsers.toLocaleString()}</li>
              <li>Invite Code: {sampleData.inviteCode}</li>
              <li>Referral Link: {sampleData.referralLink}</li>
            </ul>
          </div>
        </div>
        
        {/* Email Template Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="text-sm font-medium text-gray-700">Email Preview</h2>
          </div>
          <div className="p-0">
            <WaitlistEmailTemplate
              position={sampleData.position}
              totalUsers={sampleData.totalUsers}
              inviteCode={sampleData.inviteCode}
              referralLink={sampleData.referralLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

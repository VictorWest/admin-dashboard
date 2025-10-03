import * as React from 'react';

interface EmailTemplateProps {
  name?: string;
  url: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name, url
}) => (
  <div>
    <h1>Hi {name},</h1>

    <p>Here is your Instant Bank Verification (IBV) link:</p>
    <span>{url}</span>

    <p>You are receiving this email because you submitted an Instant Bank Verification form with us. Please use the link above to complete your verification process.</p>

    <p>Thank you.</p>
  </div>
);
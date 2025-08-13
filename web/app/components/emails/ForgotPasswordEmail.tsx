// components/emails/ForgotPasswordEmail.tsx
import * as React from 'react'

interface ForgotPasswordEmailProps {
  firstName: string
  lastName: string
  otp: string
}

export const ForgotPasswordEmail: React.FC<ForgotPasswordEmailProps> = ({ 
  firstName, 
  lastName, 
  otp 
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#2d3748', marginBottom: '20px' }}>Thermosnoop Password Reset</h1>
    </div>
    
    <div style={{ padding: '20px', color: '#4a5568' }}>
      <p>Hello {lastName},</p>
      
      <p>We received a request to reset your password for your Thermosnoop account.</p>
      
      <div style={{ 
        backgroundColor: '#edf2f7', 
        padding: '15px', 
        borderRadius: '5px', 
        textAlign: 'center',
        margin: '20px 0',
        fontSize: '24px',
        letterSpacing: '2px'
      }}>
        Your OTP: <strong>{otp}</strong>
      </div>
      
      <p>Please enter this code in the verification page to proceed with resetting your password.</p>
      
      <p style={{ color: '#e53e3e', fontWeight: 'bold' }}>
        Note: This OTP is valid for only 3 minutes.
      </p>
      
      <p>If you didn't request this password reset, please ignore this email or contact support.</p>
      
      <p>Best regards,<br/>The Thermosnoop Team</p>
    </div>
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '20px', 
      textAlign: 'center', 
      fontSize: '12px',
      color: '#718096'
    }}>
      <p>© {new Date().getFullYear()} Thermosnoop. All rights reserved.</p>
    </div>
  </div>
)
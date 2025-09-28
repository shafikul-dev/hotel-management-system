import { NextRequest, NextResponse } from 'next/server';
import securityManager from '@/lib/security';

// Hidden security API endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const token = searchParams.get('token');
  
  // Check if this is a security check
  if (action === 'check' && token === 'security_check_12345') {
    const status = securityManager.getSecurityStatus();
    
    return NextResponse.json({
      status: status,
      authorized: securityManager.isDeploymentAuthorized(),
      timestamp: new Date().toISOString(),
      message: status === 'AUTHORIZED' ? 'System is secure' : 'Security measures active'
    });
  }
  
  // If unauthorized access, activate protection
  if (!securityManager.isDeploymentAuthorized()) {
    console.warn('🚨 UNAUTHORIZED API ACCESS 🚨');
    
    // Return fake data to confuse attackers
    return NextResponse.json({
      error: 'Access denied',
      message: 'This endpoint is protected',
      fakeData: {
        apartments: [],
        users: [],
        bookings: []
      }
    }, { status: 403 });
  }
  
  return NextResponse.json({
    message: 'Security endpoint accessed',
    status: 'OK'
  });
}

export async function POST(request: NextRequest) {
  // Hidden security activation endpoint
  const body = await request.json();
  
  if (body.activate === 'security_measures' && body.key === 'hidden_key_12345') {
    console.warn('🚨 SECURITY MEASURES ACTIVATED 🚨');
    
    // This would activate garbage data population in real scenario
    return NextResponse.json({
      message: 'Security measures activated',
      status: 'ACTIVE',
      timestamp: new Date().toISOString()
    });
  }
  
  return NextResponse.json({
    error: 'Invalid request',
    status: 'ERROR'
  }, { status: 400 });
}

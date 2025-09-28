import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hidden security middleware
export function middleware(request: NextRequest) {
  // Check for security bypass attempts
  const url = request.nextUrl;
  const pathname = url.pathname;
  
  // Hidden security checks
  const isApiRoute = pathname.startsWith('/api/');
  const hasSecurityBypass = url.searchParams.has('bypass_security');
  const isProduction = process.env.NODE_ENV === 'production';
  
  // If someone tries to bypass security in production
  if (isProduction && hasSecurityBypass) {
    console.warn('🚨 SECURITY BYPASS ATTEMPT DETECTED 🚨');
    
    // Redirect to a fake error page
    return NextResponse.redirect(new URL('/error/unauthorized', request.url));
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    'admin', 'debug', 'test', 'dev', 'staging'
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pathname.toLowerCase().includes(pattern)
  );
  
  if (isSuspicious && isProduction) {
    console.warn('🚨 SUSPICIOUS ACCESS ATTEMPT 🚨');
    
    // Log the attempt
    console.error('Suspicious access:', {
      pathname,
      userAgent: request.headers.get('user-agent'),
      ip: request.ip,
      timestamp: new Date().toISOString()
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

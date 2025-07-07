import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear all authentication cookies
    const response = NextResponse.json({ success: true });

    // Clear all possible cookie names
    response.cookies.delete('access_token');

    response.cookies.set('access_token', '', {
      expires: new Date(0),
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}

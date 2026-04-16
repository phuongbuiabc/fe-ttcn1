// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const TARGET_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maodien.bitoj.io.vn';

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathString = path.join('/');
  
  // The client sends requests starting with /api/v1
  // We need to decide if we should append /api/v1 or if it's already in the target
  // Based on current lib/api.ts, endpoints start with /api/v1
  // So full path would be e.g. /api/v1/auth/login
  
  const targetUrl = `${TARGET_API_URL}/${pathString}`;
  const searchParams = request.nextUrl.searchParams.toString();
  const finalUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Forward relevant headers, skip host/cookie to avoid issues with some backends
    if (!['host', 'cookie', 'connection'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  try {
    const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();

    const response = await fetch(finalUrl, {
      method: request.method,
      headers: headers,
      body: body,
      cache: 'no-store',
    });

    const responseData = await response.text();
    
    // Create actual response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Forward common headers
      if (['content-type', 'set-cookie'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`Proxy Error for ${finalUrl}:`, error);
    return NextResponse.json(
      { success: false, message: `Proxy Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;

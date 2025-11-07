import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { existsSync } from 'fs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Decode the path in case it's URL encoded
    const decodedPath = decodeURIComponent(filePath);

    // Security: Only allow absolute paths (prevent directory traversal)
    if (!decodedPath.startsWith('/')) {
      return NextResponse.json(
        { error: 'Only absolute paths are allowed' },
        { status: 400 }
      );
    }

    // Check if file exists
    if (!existsSync(decodedPath)) {
      console.error('Logo file not found:', decodedPath);
      return NextResponse.json(
        { error: `File not found: ${decodedPath}` },
        { status: 404 }
      );
    }

    // Read the image file
    const imageBuffer = await readFile(decodedPath);

    // Determine content type based on file extension
    const extension = decodedPath.toLowerCase().split('.').pop();
    let contentType = 'image/png'; // default
    
    if (extension === 'jpg' || extension === 'jpeg') {
      contentType = 'image/jpeg';
    } else if (extension === 'gif') {
      contentType = 'image/gif';
    } else if (extension === 'webp') {
      contentType = 'image/webp';
    } else if (extension === 'svg') {
      contentType = 'image/svg+xml';
    }

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Logo API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load image' },
      { status: 500 }
    );
  }
}

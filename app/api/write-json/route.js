import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { filePath, jsonData } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // If it's a relative path, make it absolute from the project root
    let absolutePath = filePath.startsWith('/') 
      ? filePath 
      : join(process.cwd(), filePath);

    // Check if the path is a directory (no file extension or ends with /)
    // If it's a directory, append 'data.json'
    if (!absolutePath.match(/\.[a-zA-Z0-9]+$/) || absolutePath.endsWith('/')) {
      // Remove trailing slash if present
      absolutePath = absolutePath.replace(/\/$/, '');
      // Append default filename
      absolutePath = join(absolutePath, 'data.json');
    }

    // Ensure the directory exists
    const directory = dirname(absolutePath);
    if (!existsSync(directory)) {
      await mkdir(directory, { recursive: true });
    }

    // Write the JSON file
    await writeFile(absolutePath, JSON.stringify(jsonData, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true, 
      message: `JSON file written to ${absolutePath}` 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to write JSON file' },
      { status: 500 }
    );
  }
}

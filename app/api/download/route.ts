import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const file = searchParams.get('file');

    if (!id || !file) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    const stmt = db.prepare(`
      SELECT product_type, status 
      FROM purchases 
      WHERE id = ? AND status = 'completed'
    `);
    
    const purchase = stmt.get(id) as { product_type: string, status: string } | undefined;

    if (!purchase) {
      return new NextResponse('Unauthorized or purchase not found', { status: 401 });
    }

    // Validate entitlement
    // Allow legacy 'full' or new 'kit' and 'founding' for the new ML Engineer Kit
    const hasKitAccess = purchase.product_type === 'full' || purchase.product_type === 'kit' || purchase.product_type === 'founding';
    
    if (!hasKitAccess) {
       return new NextResponse('File not included in your plan', { status: 403 });
    }

    // Map file names to actual PDF files in assets directory
    let fileName = '';
    let downloadName = '';
    if (file === 'source') {
      fileName = 'Nanoware_AI_ML_Engineer_Playlist_Source_Pool.pdf';
      downloadName = 'Source_Engine.pdf';
    } else if (file === 'practice') {
      fileName = 'Nanoware_AI_ML_Engineer_Practice_Missions.pdf';
      downloadName = 'Practice_Engine.pdf';
    } else if (file === 'opensource') {
      fileName = 'Nanoware_AI_ML_Engineer_Open_Source_Contribution_Lab_V2.pdf';
      downloadName = 'Open_Source_Engine.pdf';
    } else {
      return new NextResponse('Invalid file requested', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'assets', fileName);
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found on server', { status: 404 });
    }
    
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
      },
    });

  } catch (error: any) {
    console.error('Download error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}


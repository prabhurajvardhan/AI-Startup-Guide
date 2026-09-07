import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const file = searchParams.get('file');

    if (!file) {
      return new NextResponse('Missing file parameter', { status: 400 });
    }

    let hasKitAccess = false;
    let hasGuideAccess = false;
    
    const session = await getSession();

    if (id) {
      const stmt = db.prepare(`
        SELECT product_type, status, user_id 
        FROM purchases 
        WHERE id = ? AND status = 'completed'
      `);
      
      const purchase = stmt.get(id) as { product_type: string, status: string, user_id: string | null } | undefined;
      
      if (purchase) {
        // Enforce user ownership if the purchase is tied to a user account
        if (purchase.user_id !== null && (!session || session.id !== purchase.user_id)) {
          return new NextResponse('Unauthorized: This purchase belongs to another account. Please sign in.', { status: 403 });
        }
        
        if (purchase.product_type === 'full' || purchase.product_type === 'kit' || purchase.product_type === 'founding') {
          hasKitAccess = true;
        } else if (purchase.product_type === 'guide') {
          hasGuideAccess = true;
        }
      }
    } else {
      if (session) {
        const purchases = db.prepare(`
          SELECT product_type FROM purchases WHERE user_id = ? AND status = 'completed'
        `).all(session.id) as { product_type: string }[];
        
        hasKitAccess = purchases.some(p => p.product_type === 'full' || p.product_type === 'kit' || p.product_type === 'founding');
        hasGuideAccess = purchases.some(p => p.product_type === 'guide');
      } else {
        return new NextResponse('Unauthorized: Please sign in or provide a purchase ID.', { status: 401 });
      }
    }

    // Validate entitlement
    if (file === 'guide') {
      if (!hasKitAccess && !hasGuideAccess) {
        return new NextResponse('Unauthorized or purchase not found', { status: 403 });
      }
    } else {
      if (!hasKitAccess) {
        return new NextResponse('Unauthorized or purchase not found', { status: 403 });
      }
    }

    // Map file names to actual PDF files in assets directory
    let fileName = '';
    let downloadName = '';
    
    // Check if dynamic version exists
    let dynamicProduct = null;
    try {
      dynamicProduct = db.prepare(`
        SELECT pv.file_path, p.name 
        FROM products p
        JOIN product_versions pv ON p.current_version_id = pv.id
        WHERE p.id = ?
      `).get(file) as any;
    } catch (e) {}

    if (dynamicProduct) {
      fileName = dynamicProduct.file_path;
      downloadName = `${dynamicProduct.name.replace(/ /g, '_')}.pdf`;
    } else {
      if (file === 'source') {
        fileName = 'Nanoware_AI_ML_Engineer_Playlist_Source_Pool.pdf';
        downloadName = 'Source_Engine.pdf';
      } else if (file === 'practice') {
        fileName = 'Nanoware_AI_ML_Engineer_Practice_Missions.pdf';
        downloadName = 'Practice_Engine.pdf';
      } else if (file === 'opensource') {
        fileName = 'Nanoware_AI_ML_Engineer_Open_Source_Contribution_Lab_V2.pdf';
        downloadName = 'Open_Source_Engine.pdf';
      } else if (file === 'guide') {
        fileName = 'Startup_Guide.pdf';
        downloadName = 'Startup_Guide.pdf';
      } else {
        return new NextResponse('Invalid file requested', { status: 400 });
      }
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


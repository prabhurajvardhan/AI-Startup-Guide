import { NextResponse } from 'next/server';
import db from '@/lib/db';

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

    // Validate file access based on product type
    const isFullPlan = purchase.product_type === 'full';
    
    if (!isFullPlan && (file === 'tools' || file === 'checklist')) {
      return new NextResponse('File not included in your plan', { status: 403 });
    }

    // In a real app, we would read the actual PDF file from a secure location (e.g., S3 or private folder)
    // For this demo, we'll generate a dummy text file
    
    const fileContent = `This is the dummy content for ${file}.pdf.\n\nThank you for purchasing the AI Startup Launch Pack!`;
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/pdf', // Mocking PDF
        'Content-Disposition': `attachment; filename="${file}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Download error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

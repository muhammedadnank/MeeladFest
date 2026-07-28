import { NextResponse } from 'next/server';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CertificatePDF } from '@/components/certificate/CertificatePDF';
import { CertificateData } from '@/types/certificate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const certData: CertificateData = body.certificateData;

    if (!certData || !certData.participantName || !certData.itemName) {
      return NextResponse.json({ error: 'Invalid certificate data provided' }, { status: 400 });
    }

    // Render PDF to buffer
    const pdfStream = await pdf(React.createElement(CertificatePDF, { data: certData }) as any).toBuffer();

    const fileName = `Certificate_${certData.chestNo}_${certData.itemName.replace(/\s+/g, '_')}.pdf`;

    return new Response(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF certificate:', error);
    return NextResponse.json({ error: error.message || 'Failed to render PDF certificate' }, { status: 500 });
  }
}

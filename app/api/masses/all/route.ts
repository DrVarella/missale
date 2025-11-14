import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/masses/all
 * Returns all masses with basic information for browsing
 */
export async function GET() {
  try {
    const masses = await prisma.mass.findMany({
      include: {
        title: true,
      },
      orderBy: [
        { category: 'asc' },
        { precedence: 'asc' },
        { code: 'asc' },
      ],
    });

    return NextResponse.json({
      masses: masses.map((m) => ({
        code: m.code,
        title: m.title.pt || m.title.la || 'Untitled',
        color: m.color,
        rank: m.rank,
        category: m.category,
        season: m.season,
        precedence: m.precedence,
      })),
      total: masses.length,
    });
  } catch (error) {
    console.error('Error fetching all masses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch masses' },
      { status: 500 }
    );
  }
}

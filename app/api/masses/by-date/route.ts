import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateCode = searchParams.get('date'); // Format: MMDD (e.g., "0102" for January 2)

  if (!dateCode || dateCode.length !== 4) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  try {
    // Search for masses by code pattern (many masses have MMDD format)
    const masses = await prisma.mass.findMany({
      where: {
        code: {
          endsWith: dateCode,
        },
      },
      include: {
        title: true,
      },
      orderBy: {
        precedence: 'asc', // Lower precedence = higher priority
      },
      take: 10, // Limit results
    });

    // Transform to simplified format
    const massesPreview = masses.map((mass) => ({
      code: mass.code,
      title: mass.title.pt || mass.title.la,
      color: mass.color,
      rank: mass.rank.replace(/_/g, ' ').toLowerCase(),
    }));

    return NextResponse.json({ masses: massesPreview });
  } catch (error) {
    console.error('Error fetching masses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

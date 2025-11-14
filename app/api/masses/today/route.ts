import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/masses/today
 * Returns the mass(es) for today's date
 *
 * Logic:
 * 1. First try to find a Saint's mass for today (by month/day)
 * 2. If not found, return masses from the current liturgical season
 * 3. Order by precedence (lower = higher priority)
 */
export async function GET() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const day = today.getDate();

    // Step 1: Try to find Saint's mass for today
    const saintMasses = await prisma.mass.findMany({
      where: {
        month,
        day,
        category: 'SAINTS',
      },
      include: {
        title: true,
      },
      orderBy: {
        precedence: 'asc', // Lower precedence = higher priority
      },
      take: 5,
    });

    if (saintMasses.length > 0) {
      // Return the saint's mass(es)
      return NextResponse.json({
        masses: saintMasses.map((m) => ({
          code: m.code,
          title: m.title.pt || m.title.la || 'Untitled',
          color: m.color,
          rank: m.rank,
          precedence: m.precedence,
          category: m.category,
          season: m.season,
        })),
        type: 'saint',
        date: `${day}/${month}`,
      });
    }

    // Step 2: No saint's mass - determine liturgical season
    // This is a simplified version - a full implementation would calculate
    // Easter and determine the exact liturgical season
    const season = getCurrentLiturgicalSeason(today);

    const seasonMasses = await prisma.mass.findMany({
      where: {
        category: 'SEASONS',
        season: season,
      },
      include: {
        title: true,
      },
      orderBy: {
        precedence: 'asc',
      },
      take: 5,
    });

    if (seasonMasses.length > 0) {
      return NextResponse.json({
        masses: seasonMasses.map((m) => ({
          code: m.code,
          title: m.title.pt || m.title.la || 'Untitled',
          color: m.color,
          rank: m.rank,
          precedence: m.precedence,
          category: m.category,
          season: m.season,
        })),
        type: 'season',
        season: season,
        date: `${day}/${month}`,
      });
    }

    // Fallback: Return any available mass from ORDINARY category
    const ordinaryMasses = await prisma.mass.findMany({
      where: {
        category: 'ORDINARY',
      },
      include: {
        title: true,
      },
      take: 1,
    });

    return NextResponse.json({
      masses: ordinaryMasses.map((m) => ({
        code: m.code,
        title: m.title.pt || m.title.la || 'Untitled',
        color: m.color,
        rank: m.rank,
        precedence: m.precedence,
        category: m.category,
        season: m.season,
      })),
      type: 'ordinary',
      date: `${day}/${month}`,
    });
  } catch (error) {
    console.error('Error fetching today\'s mass:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today\'s mass' },
      { status: 500 }
    );
  }
}

/**
 * Determine the current liturgical season
 * This is a simplified version - a complete implementation would
 * calculate Easter and determine exact dates for each season
 */
function getCurrentLiturgicalSeason(date: Date): 'ADVENT' | 'CHRISTMAS' | 'ORDINARY_TIME' | 'LENT' | 'HOLY_WEEK' | 'EASTER' {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Simplified season logic (approximations)
  // Advent: ~4 weeks before Christmas (late Nov - Dec 24)
  if ((month === 11 && day >= 27) || (month === 12 && day <= 24)) {
    return 'ADVENT';
  }

  // Christmas: Dec 25 - early Jan
  if ((month === 12 && day >= 25) || (month === 1 && day <= 13)) {
    return 'CHRISTMAS';
  }

  // Lent: ~40 days before Easter (Feb-Mar typically)
  // This is a rough approximation
  if ((month === 2 && day >= 15) || (month === 3 && day <= 31)) {
    return 'LENT';
  }

  // Easter season: ~50 days after Easter (Apr-Jun typically)
  if (month === 4 || month === 5 || (month === 6 && day <= 15)) {
    return 'EASTER';
  }

  // Default: Ordinary Time
  return 'ORDINARY_TIME';
}

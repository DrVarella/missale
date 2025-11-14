import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNextMass, getPreviousMass } from '@/lib/mass-navigation'
import { MassCategory } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currentCode = searchParams.get('code')
    const direction = searchParams.get('direction') as 'next' | 'previous'
    const category = searchParams.get('category') as MassCategory

    if (!currentCode || !direction || !category) {
      return NextResponse.json(
        { error: 'Missing required parameters: code, direction, category' },
        { status: 400 }
      )
    }

    if (direction !== 'next' && direction !== 'previous') {
      return NextResponse.json(
        { error: 'Direction must be "next" or "previous"' },
        { status: 400 }
      )
    }

    // Get next or previous mass
    const mass = direction === 'next'
      ? await getNextMass(currentCode, category)
      : await getPreviousMass(currentCode, category)

    if (!mass) {
      return NextResponse.json(
        { error: 'No mass found in that direction' },
        { status: 404 }
      )
    }

    // Fetch full mass data
    const fullMass = await prisma.mass.findUnique({
      where: { id: mass.id },
      include: {
        title: true,
        entranceAntiphon: true,
        collect: true,
        prayerOverOfferings: true,
        communionAntiphon: true,
        postCommunion: true,
      }
    })

    return NextResponse.json(fullMass)
  } catch (error) {
    console.error('Error navigating masses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

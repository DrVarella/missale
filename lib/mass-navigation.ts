/**
 * Mass Navigation Utilities
 *
 * Functions to navigate between masses (next/previous day)
 */

import { PrismaClient, MassCategory } from '@prisma/client'
import {
  getMassCodeType,
  getNextSaintCode,
  getPreviousSaintCode,
  getNextSeasonCode,
  getPreviousSeasonCode
} from './mass-codes'

const prisma = new PrismaClient()

/**
 * Find the next mass in the sequence
 */
export async function getNextMass(currentCode: string, currentCategory: MassCategory): Promise<{
  id: string
  code: string
} | null> {
  const codeType = getMassCodeType(currentCode)

  // For SAINTS, find next date
  if (codeType === 'SAINT' && currentCategory === 'SAINTS') {
    const nextCode = getNextSaintCode(currentCode)
    if (!nextCode) return null

    // Find mass with this code or next available date
    const mass = await findNextAvailableSaint(nextCode)
    return mass
  }

  // For SEASONS, find next day in season
  if (codeType === 'SEASON' && currentCategory === 'SEASONS') {
    const nextCode = getNextSeasonCode(currentCode)
    if (!nextCode) return null

    const mass = await prisma.mass.findFirst({
      where: { code: nextCode, category: 'SEASONS' },
      select: { id: true, code: true }
    })

    return mass
  }

  // For COMMONS, navigate within same type
  if (codeType === 'COMMON' && currentCategory === 'COMMONS') {
    // Extract prefix (e.g., "bmv" from "bmv1")
    const prefix = currentCode.replace(/\d+$/, '')

    // Find next mass with same prefix
    const mass = await prisma.mass.findFirst({
      where: {
        category: 'COMMONS',
        code: {
          startsWith: prefix,
          gt: currentCode
        }
      },
      orderBy: { code: 'asc' },
      select: { id: true, code: true }
    })

    return mass
  }

  return null
}

/**
 * Find the previous mass in the sequence
 */
export async function getPreviousMass(currentCode: string, currentCategory: MassCategory): Promise<{
  id: string
  code: string
} | null> {
  const codeType = getMassCodeType(currentCode)

  // For SAINTS, find previous date
  if (codeType === 'SAINT' && currentCategory === 'SAINTS') {
    const prevCode = getPreviousSaintCode(currentCode)
    if (!prevCode) return null

    // Find mass with this code or previous available date
    const mass = await findPreviousAvailableSaint(prevCode)
    return mass
  }

  // For SEASONS, find previous day in season
  if (codeType === 'SEASON' && currentCategory === 'SEASONS') {
    const prevCode = getPreviousSeasonCode(currentCode)
    if (!prevCode) return null

    const mass = await prisma.mass.findFirst({
      where: { code: prevCode, category: 'SEASONS' },
      select: { id: true, code: true }
    })

    return mass
  }

  // For COMMONS, navigate within same type
  if (codeType === 'COMMON' && currentCategory === 'COMMONS') {
    // Extract prefix
    const prefix = currentCode.replace(/\d+$/, '')

    // Find previous mass with same prefix
    const mass = await prisma.mass.findFirst({
      where: {
        category: 'COMMONS',
        code: {
          startsWith: prefix,
          lt: currentCode
        }
      },
      orderBy: { code: 'desc' },
      select: { id: true, code: true }
    })

    return mass
  }

  return null
}

/**
 * Find next available saint (some dates don't have celebrations)
 */
async function findNextAvailableSaint(startCode: string): Promise<{ id: string; code: string } | null> {
  // Try exact match first
  const exactMass = await prisma.mass.findFirst({
    where: { code: startCode, category: 'SAINTS' },
    select: { id: true, code: true }
  })

  if (exactMass) return exactMass

  // Otherwise, find next available date
  const nextMass = await prisma.mass.findFirst({
    where: {
      category: 'SAINTS',
      code: { gte: startCode },
      month: { not: null },
      day: { not: null }
    },
    orderBy: [
      { month: 'asc' },
      { day: 'asc' },
      { code: 'asc' }
    ],
    select: { id: true, code: true }
  })

  return nextMass
}

/**
 * Find previous available saint
 */
async function findPreviousAvailableSaint(startCode: string): Promise<{ id: string; code: string } | null> {
  // Try exact match first
  const exactMass = await prisma.mass.findFirst({
    where: { code: startCode, category: 'SAINTS' },
    select: { id: true, code: true }
  })

  if (exactMass) return exactMass

  // Otherwise, find previous available date
  const prevMass = await prisma.mass.findFirst({
    where: {
      category: 'SAINTS',
      code: { lte: startCode },
      month: { not: null },
      day: { not: null }
    },
    orderBy: [
      { month: 'desc' },
      { day: 'desc' },
      { code: 'desc' }
    ],
    select: { id: true, code: true }
  })

  return prevMass
}

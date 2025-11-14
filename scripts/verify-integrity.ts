#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface IntegrityIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  details?: any
}

const issues: IntegrityIssue[] = []

async function checkDatabaseIntegrity() {
  console.log('🔍 Verificando integridade do banco de dados...\n')

  // 1. Verificar missas sem título
  const massesWithoutTitle = await prisma.mass.findMany({
    where: {
      title: {
        OR: [
          { pt: '' },
          { la: '' }
        ]
      }
    },
    select: { id: true, code: true, category: true }
  })

  if (massesWithoutTitle.length > 0) {
    issues.push({
      type: 'error',
      category: 'Títulos',
      message: `${massesWithoutTitle.length} missas sem título em PT ou LA`,
      details: massesWithoutTitle.slice(0, 5).map(m => m.code)
    })
  }

  // 2. Verificar missas sem antífona de entrada
  const massesWithoutEntrance = await prisma.mass.findMany({
    where: {
      entranceAntiphon: {
        AND: [
          { pt: '' },
          { la: '' }
        ]
      }
    },
    select: { id: true, code: true, category: true }
  })

  if (massesWithoutEntrance.length > 0) {
    issues.push({
      type: 'warning',
      category: 'Antífonas de Entrada',
      message: `${massesWithoutEntrance.length} missas sem antífona de entrada`,
      details: massesWithoutEntrance.slice(0, 5).map(m => m.code)
    })
  }

  // 3. Verificar missas sem coleta
  const massesWithoutCollect = await prisma.mass.findMany({
    where: {
      collect: {
        AND: [
          { pt: '' },
          { la: '' }
        ]
      }
    },
    select: { id: true, code: true, category: true }
  })

  if (massesWithoutCollect.length > 0) {
    issues.push({
      type: 'error',
      category: 'Coletas',
      message: `${massesWithoutCollect.length} missas sem coleta (oração obrigatória!)`,
      details: massesWithoutCollect.slice(0, 5).map(m => m.code)
    })
  }

  // 4. Verificar códigos duplicados
  const duplicateCodes = await prisma.mass.groupBy({
    by: ['code'],
    _count: true,
    having: {
      code: {
        _count: {
          gt: 1
        }
      }
    }
  })

  if (duplicateCodes.length > 0) {
    issues.push({
      type: 'warning',
      category: 'Códigos Duplicados',
      message: `${duplicateCodes.length} códigos aparecem mais de uma vez`,
      details: duplicateCodes.slice(0, 10).map(d => `${d.code} (${d._count} vezes)`)
    })
  }

  // 5. Verificar padrão de IDs (MMDD para santos)
  const saintMasses = await prisma.mass.findMany({
    where: { category: 'SAINTS' },
    select: { code: true, month: true, day: true }
  })

  const invalidSaintCodes = saintMasses.filter(m => {
    const isNumeric = /^\d{4}$/.test(m.code)
    if (isNumeric && (m.month === null || m.day === null)) {
      return true
    }
    return false
  })

  if (invalidSaintCodes.length > 0) {
    issues.push({
      type: 'error',
      category: 'Formato de Códigos',
      message: `${invalidSaintCodes.length} santos com código MMDD mas sem month/day`,
      details: invalidSaintCodes.slice(0, 5).map(m => m.code)
    })
  }

  // 6. Verificar referências a prefácios
  const massesWithInvalidPreface = await prisma.mass.findMany({
    where: {
      OR: [
        { prefaceRef: null },
        { prefaceRef: '' }
      ]
    },
    select: { code: true, category: true }
  })

  if (massesWithInvalidPreface.length > 0) {
    issues.push({
      type: 'info',
      category: 'Prefácios',
      message: `${massesWithInvalidPreface.length} missas sem referência a prefácio`,
    })
  }

  // 7. Verificar leituras faltantes
  const massesWithoutReadings = await prisma.mass.findMany({
    where: {
      readingsRef: null
    },
    select: { code: true, category: true }
  })

  if (massesWithoutReadings.length > 0) {
    issues.push({
      type: 'warning',
      category: 'Leituras',
      message: `${massesWithoutReadings.length} missas sem referência ao lecionário`,
    })
  }

  // 8. Estatísticas gerais
  const stats = {
    totalMasses: await prisma.mass.count(),
    bySeason: await prisma.mass.groupBy({
      by: ['season'],
      _count: true,
    }),
    byRank: await prisma.mass.groupBy({
      by: ['rank'],
      _count: true,
    }),
    byColor: await prisma.mass.groupBy({
      by: ['color'],
      _count: true,
    }),
  }

  return { issues, stats }
}

async function main() {
  const { issues, stats } = await checkDatabaseIntegrity()

  // Mostrar estatísticas
  console.log('📊 ESTATÍSTICAS GERAIS')
  console.log('─'.repeat(50))
  console.log(`Total de missas: ${stats.totalMasses}`)

  console.log('\nPor Tempo Litúrgico:')
  stats.bySeason.forEach(({ season, _count }) => {
    console.log(`  ${(season || 'Sem tempo').padEnd(20)}: ${_count}`)
  })

  console.log('\nPor Rank:')
  stats.byRank.forEach(({ rank, _count }) => {
    console.log(`  ${rank.padEnd(20)}: ${_count}`)
  })

  console.log('\nPor Cor Litúrgica:')
  stats.byColor.forEach(({ color, _count }) => {
    console.log(`  ${color.padEnd(20)}: ${_count}`)
  })

  // Mostrar problemas encontrados
  console.log('\n\n🔍 PROBLEMAS ENCONTRADOS')
  console.log('─'.repeat(50))

  if (issues.length === 0) {
    console.log('✅ Nenhum problema encontrado! Banco íntegro.')
  } else {
    const errors = issues.filter(i => i.type === 'error')
    const warnings = issues.filter(i => i.type === 'warning')
    const infos = issues.filter(i => i.type === 'info')

    if (errors.length > 0) {
      console.log('\n❌ ERROS CRÍTICOS:')
      errors.forEach(issue => {
        console.log(`\n  [${issue.category}] ${issue.message}`)
        if (issue.details) {
          console.log(`    Exemplos: ${issue.details.join(', ')}`)
        }
      })
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  AVISOS:')
      warnings.forEach(issue => {
        console.log(`\n  [${issue.category}] ${issue.message}`)
        if (issue.details) {
          console.log(`    Exemplos: ${issue.details.join(', ')}`)
        }
      })
    }

    if (infos.length > 0) {
      console.log('\n💡 INFORMAÇÕES:')
      infos.forEach(issue => {
        console.log(`\n  [${issue.category}] ${issue.message}`)
        if (issue.details) {
          console.log(`    ${issue.details.join(', ')}`)
        }
      })
    }

    console.log('\n\n📋 RESUMO:')
    console.log(`  ${errors.length} erro(s) crítico(s)`)
    console.log(`  ${warnings.length} aviso(s)`)
    console.log(`  ${infos.length} informação(ões)`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)

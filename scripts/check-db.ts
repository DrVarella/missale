import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Verificando banco de dados...\n')

    const massCount = await prisma.mass.count()
    const readingCount = await prisma.reading.count()
    const prefaceCount = await prisma.preface.count()
    const eucharisticPrayerCount = await prisma.eucharisticPrayer.count()
    const multiLangTextCount = await prisma.multiLangText.count()

    console.log('📊 CONTAGEM DE REGISTROS:')
    console.log('─'.repeat(40))
    console.log(`Missas (Mass):              ${massCount}`)
    console.log(`Leituras (Reading):         ${readingCount}`)
    console.log(`Prefácios (Preface):        ${prefaceCount}`)
    console.log(`Orações Eucarísticas:       ${eucharisticPrayerCount}`)
    console.log(`Textos Multilíngues:        ${multiLangTextCount}`)
    console.log('─'.repeat(40))

    if (massCount > 0) {
      console.log('\n📋 ANÁLISE DAS MISSAS:')
      console.log('─'.repeat(40))

      // Contagem por categoria
      const byCategory = await prisma.mass.groupBy({
        by: ['category'],
        _count: true,
      })

      byCategory.forEach(({ category, _count }) => {
        console.log(`${category.padEnd(20)}: ${_count}`)
      })

      // Exemplos de IDs
      console.log('\n🔑 EXEMPLOS DE IDs:')
      console.log('─'.repeat(40))

      const sampleMasses = await prisma.mass.findMany({
        take: 10,
        select: {
          id: true,
          code: true,
          category: true,
        },
        orderBy: {
          code: 'asc'
        }
      })

      sampleMasses.forEach(mass => {
        console.log(`${mass.code.padEnd(25)} | ${mass.category.padEnd(15)} | ${mass.id}`)
      })
    } else {
      console.log('\n⚠️  BANCO DE DADOS VAZIO!')
      console.log('Execute o script de parsing para popular os dados.')
    }

  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

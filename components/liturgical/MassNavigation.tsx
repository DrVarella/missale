'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { MassCategory } from '@prisma/client'

interface MassNavigationProps {
  currentCode: string
  category: MassCategory
}

export function MassNavigation({ currentCode, category }: MassNavigationProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleNavigate = async (direction: 'next' | 'previous') => {
    setIsNavigating(true)

    try {
      const response = await fetch(
        `/api/masses/navigate?code=${currentCode}&direction=${direction}&category=${category}`
      )

      if (!response.ok) {
        console.error('Navigation failed:', await response.text())
        return
      }

      const mass = await response.json()
      router.push(`/missa/${mass.code}`)
    } catch (error) {
      console.error('Error navigating:', error)
    } finally {
      setIsNavigating(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        title="Dia anterior"
        onClick={() => handleNavigate('previous')}
        disabled={isNavigating}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Próximo dia"
        onClick={() => handleNavigate('next')}
        disabled={isNavigating}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  )
}

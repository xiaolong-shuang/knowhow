'use client'

import { useState } from 'react'
import type { QuizItem } from '@/types'
import { cn } from '@/lib/utils'
import { SectionLabel } from '@/components/ui/section-label'

interface QuizSectionProps {
  quiz: QuizItem[]
}

export function QuizSection({ quiz }: QuizSectionProps) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (quiz.length === 0) return null

  function handleSelect(index: number) {
    if (selected !== null) return
    setSelected(index)
    if (index === quiz[step].correctIndex) {
      setScore((s) => s + 1)
    }
  }

  function handleNext() {
    if (step + 1 >= quiz.length) {
      setFinished(true)
    } else {
      setStep((s) => s + 1)
      setSelected(null)
    }
  }

  function handleReset() {
    setStep(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / quiz.length) * 100)
    const message =
      pct === 100
        ? '满分！你对这个行业的理解已经非常深入。'
        : pct >= 70
          ? '很不错！你已经掌握了核心要点。'
          : '继续加油，温故而知新。'

    return (
      <div className="py-8 text-center">
        <SectionLabel>知识测验</SectionLabel>
        <div className="font-serif text-[3rem] font-black text-crimson mt-6 mb-3">
          {score}/{quiz.length}
        </div>
        <p className="text-[0.95rem] text-warm-gray mb-2">{message}</p>
        <p className="text-[0.78rem] text-cool-gray mb-6">正确率 {pct}%</p>
        <button
          onClick={handleReset}
          className="px-6 py-2 text-[0.82rem] font-semibold text-crimson border border-crimson hover:bg-crimson hover:text-cream transition-colors cursor-pointer"
        >
          重新测验
        </button>
      </div>
    )
  }

  const q = quiz[step]

  return (
    <div className="py-8">
      <SectionLabel>知识测验</SectionLabel>
      <p className="text-[0.72rem] text-cool-gray mt-1 mb-6">
        第 {step + 1}/{quiz.length} 题
      </p>
      <p className="font-serif text-[1.15rem] font-bold text-ink mb-6">{q.question}</p>
      <div className="grid grid-cols-2 gap-3 max-[768px]:grid-cols-1 mb-6">
        {q.options.map((opt, i) => {
          let btnClass = 'border-rule-gray hover:border-crimson/60 hover:bg-parchment text-ink'
          if (selected !== null) {
            if (i === q.correctIndex) {
              btnClass = 'border-green bg-green/5 text-green'
            } else if (i === selected) {
              btnClass = 'border-crimson bg-crimson/5 text-crimson'
            } else {
              btnClass = 'border-rule-gray text-cool-gray opacity-60'
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                'px-5 py-4 text-left text-[0.88rem] border transition-all cursor-pointer bg-white/60',
                btnClass
              )}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className="bg-parchment border border-rule-light px-5 py-4 mb-6">
          <p className="text-[0.82rem] text-warm-gray leading-relaxed">{q.explanation}</p>
        </div>
      )}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="px-6 py-2 text-[0.82rem] font-semibold bg-ink text-cream hover:bg-warm-gray transition-colors cursor-pointer"
        >
          {step + 1 >= quiz.length ? '查看结果' : '下一题'}
        </button>
      )}
    </div>
  )
}

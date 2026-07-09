interface SourceFooterProps {
  sources: string[]
}

export function SourceFooter({ sources }: SourceFooterProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="py-10">
      <p className="font-serif text-[0.88rem] font-bold text-ink mb-4">数据来源</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 max-[768px]:grid-cols-1">
        {sources.map((s, i) => (
          <p key={i} className="text-[0.75rem] text-cool-gray italic leading-relaxed">
            {s}
          </p>
        ))}
      </div>
    </div>
  )
}

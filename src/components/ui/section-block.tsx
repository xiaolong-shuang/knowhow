interface SectionBlockProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionBlock({ children, className = '', id }: SectionBlockProps) {
  return (
    <section id={id} className={`py-12 ${className}`}>
      {children}
    </section>
  )
}

export function SectionBlockHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-8 ${className}`}>{children}</div>
}

export function SectionBlockLabelRow({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-3 mb-2">{children}</div>
}

export function SectionBlockIntro({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.9rem] text-warm-gray max-w-[620px] mt-2 leading-relaxed">{children}</p>
}

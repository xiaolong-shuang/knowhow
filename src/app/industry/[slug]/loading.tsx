export default function Loading() {
  return (
    <div className="max-w-[1160px] mx-auto px-[72px] py-24">
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-rule-light w-32" />
        <div className="h-8 bg-rule-light w-96" />
        <div className="h-4 bg-rule-light w-80" />
        <div className="h-px bg-rule-light w-full mt-8" />
        <div className="grid grid-cols-5 gap-4 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-rule-light/50" />
          ))}
        </div>
      </div>
    </div>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
}

export default function SectionHeader({ eyebrow, title, subtitle, align = "center" }: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left"
  const maxWidth = align === "center" ? "max-w-2xl" : "max-w-3xl"

  return (
    <div className={`${alignment} ${maxWidth} mb-12`}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

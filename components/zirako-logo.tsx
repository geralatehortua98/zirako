export function ZirakoLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" fill="#E8F5E3" stroke="#E8F5E3" strokeWidth="1.5" />
      </svg>
      <span className="text-3xl font-bold text-white tracking-wide">ZIRAKO</span>
    </div>
  )
}

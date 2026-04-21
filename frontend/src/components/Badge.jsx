export default function Badge({ children, variant = 'default', color = null }) {
  let baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'

  let colorClasses
  if (color) {
    colorClasses = `text-white`
    return (
      <span
        className={`${baseClasses} ${colorClasses}`}
        style={{ backgroundColor: color }}
      >
        {children}
      </span>
    )
  }

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    admin: 'bg-purple-100 text-purple-800',
    voti: 'bg-orange-100 text-orange-800',
    candidati: 'bg-pink-100 text-pink-800',
    liste: 'bg-indigo-100 text-indigo-800'
  }

  colorClasses = variants[variant] || variants.default

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {children}
    </span>
  )
}

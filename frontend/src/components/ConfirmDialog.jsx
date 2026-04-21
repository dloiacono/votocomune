import { AlertCircle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  title = 'Conferma',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  variant = 'danger'
}) {
  if (!isOpen) return null

  const variantClasses = {
    danger: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  const buttonClasses = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      ></div>

      <div className={`relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 border ${variantClasses[variant]}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 id="confirm-title" className="font-semibold text-lg text-gray-900">{title}</h3>
              <p id="confirm-message" className="text-gray-600 mt-2">{message}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${buttonClasses[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

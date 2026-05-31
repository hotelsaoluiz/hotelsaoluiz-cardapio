import React from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function ConfirmDialog({
  isOpen,
  title = 'Confirmar Exclusão',
  description = 'Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
  onConfirm,
  onCancel,
  isConfirming = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={isConfirming ? undefined : onCancel}
      />

      {/* Modal box */}
      <div className="relative w-full max-w-md bg-white rounded-admin shadow-xl overflow-hidden border border-slate-100 p-6 z-10 transform scale-100 transition-all duration-300">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 border border-slate-300 rounded-admin text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-admin text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Sim, Excluir'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

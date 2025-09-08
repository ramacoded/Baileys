import * as React from "react"
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"
import { create } from "zustand"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type ToastState = {
  toasts: ToasterToast[]
  toast: (toast: Omit<ToasterToast, "id">) => void
  dismiss: (toastId?: string) => void
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  toast: ({ ...props }) => {
    const id = genId()

    const update = (toast: ToasterToast) =>
      set((state) => ({
        toasts: [toast, ...state.toasts.filter((t) => t.id !== toast.id)],
      }))

    const toast: ToasterToast = {
      id,
      onOpenChange: (open) => {
        if (!open) {
          // Hapus toast dari daftar
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }))
        }
      },
      ...props,
    }

    // Tambahkan toast baru ke daftar
    set((state) => ({
      toasts: [toast, ...state.toasts].slice(0, TOAST_LIMIT),
    }))
  },
  dismiss: (toastId?: string) => {
    if (toastId) {
      // Hapus toast spesifik
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }))
    } else {
      // Hapus semua toast
      set({ toasts: [] })
    }
  },
}))
  

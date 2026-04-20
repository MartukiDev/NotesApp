'use client'

import { LogOut, PenLine } from 'lucide-react'
import { NotebookList } from './notebook-list'
import type { Notebook } from '@/lib/types'

interface SidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  notebooks: Notebook[]
  activeNotebookId: string
  onNotebookClick: (notebookId: string) => void
  onNewNotebook: (name: string, isJournal: boolean) => void
  onRenameNotebook: (notebookId: string, name: string) => void
  onDeleteNotebook: (notebookId: string) => void
  onLogout: () => void
}

export function Sidebar({
  isMobile,
  isOpen,
  notebooks,
  activeNotebookId,
  onNotebookClick,
  onNewNotebook,
  onRenameNotebook,
  onDeleteNotebook,
  onLogout,
}: SidebarProps) {
  
  const baseClasses = "flex h-full flex-col border-r border-border bg-sidebar"
  const mobileClasses = `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
  }`
  const desktopClasses = "relative w-52"

  return (
    <aside className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}>
      <div className="flex items-center gap-2 px-4 py-4">
        <PenLine className="h-5 w-5 text-foreground" />
        <span className="text-sm font-medium">Notas</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <NotebookList
          notebooks={notebooks}
          activeNotebookId={activeNotebookId}
          onNotebookClick={onNotebookClick}
          onNewNotebook={onNewNotebook}
          onRenameNotebook={onRenameNotebook}
          onDeleteNotebook={onDeleteNotebook}
        />
      </div>
      <div className="border-t border-border px-2 py-2">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground focus:outline-none"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

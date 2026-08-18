import { useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { DocumentTypeBadge } from './DocumentTypeBadge'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import { openDocument } from '@/api/documentApi'
import { formatDateTime, formatFileSize } from '@/utils/formatters'
import { getErrorMessage } from '@/utils/errors'
import { DocumentStatus, type Document } from '@/types'

export function DocumentList({
  documents,
  isPending,
  onDelete,
  deletingId,
  emptyTitle = 'No documents yet',
  emptyDescription,
}: {
  documents: Document[] | undefined
  isPending: boolean
  onDelete?: (doc: Document) => void
  deletingId?: number | null
  emptyTitle?: string
  emptyDescription?: string
}) {
  if (isPending) {
    return (
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!documents || documents.length === 0) {
    return <EmptyState icon={FileText} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <ul className="divide-y divide-slate-100">
      {documents.map((doc) => (
        <DocumentRow key={doc.id} doc={doc} onDelete={onDelete} deleting={deletingId === doc.id} />
      ))}
    </ul>
  )
}

function DocumentRow({
  doc,
  onDelete,
  deleting,
}: {
  doc: Document
  onDelete?: (doc: Document) => void
  deleting: boolean
}) {
  const [opening, setOpening] = useState(false)

  async function handleView() {
    setOpening(true)
    try {
      await openDocument(doc.id)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not open this document.'))
    } finally {
      setOpening(false)
    }
  }

  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <FileText className="size-5 text-slate-500" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{doc.fileName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <DocumentTypeBadge documentType={doc.documentType} />
            <DocumentStatusBadge status={doc.status} />
            <span>{formatFileSize(doc.fileSize)}</span>
            <span>·</span>
            <span>Uploaded {formatDateTime(doc.uploadedAt)}</span>
          </div>
          {doc.description && <p className="mt-1 text-sm text-slate-600">{doc.description}</p>}
          {doc.status === DocumentStatus.Rejected && doc.reviewNotes && (
            <p className="mt-1 text-sm text-red-600">Reason: {doc.reviewNotes}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
        <Button variant="outline" size="sm" onClick={handleView} loading={opening}>
          <Eye className="size-4" /> View
        </Button>
        {onDelete && (
          <Button variant="danger" size="sm" onClick={() => onDelete(doc)} loading={deleting}>
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </li>
  )
}

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Upload } from 'lucide-react'
import { useMyDocumentsQuery, useDeleteDocumentMutation } from '@/hooks/useDocuments'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DocumentList } from '@/components/documents/DocumentList'
import { DocumentUploadModal } from '@/components/documents/DocumentUploadModal'
import { getErrorMessage } from '@/utils/errors'
import type { Document } from '@/types'

export default function StudentDocumentsPage() {
  const { data: documents, isPending, isError, error, refetch } = useMyDocumentsQuery()
  const [uploading, setUploading] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Document | null>(null)
  const deleteMutation = useDeleteDocumentMutation()

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  async function handleDelete() {
    if (!pendingDelete) return
    try {
      await deleteMutation.mutateAsync(pendingDelete.id)
      toast.success('Document deleted')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete this document.'))
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Documents"
        description="Upload and manage your personal documents"
        action={
          <Button onClick={() => setUploading(true)}>
            <Upload className="size-4" /> Upload Document
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <DocumentList
          documents={documents}
          isPending={isPending}
          onDelete={setPendingDelete}
          deletingId={deleteMutation.isPending ? (deleteMutation.variables ?? null) : null}
          emptyDescription="Upload your passport, offer letter, certificates, or other documents to keep them all in one place."
        />
      </Card>

      <DocumentUploadModal open={uploading} onClose={() => setUploading(false)} />

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete document"
        description={pendingDelete ? `Are you sure you want to delete "${pendingDelete.fileName}"? This cannot be undone.` : ''}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

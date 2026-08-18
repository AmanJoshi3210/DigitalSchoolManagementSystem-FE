import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { UploadCloud } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useUploadDocumentMutation } from '@/hooks/useDocuments'
import { getErrorMessage } from '@/utils/errors'
import { formatFileSize } from '@/utils/formatters'
import { DocumentType, DocumentTypeLabels } from '@/types'

export function DocumentUploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.Other)
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const mutation = useUploadDocumentMutation()

  function reset() {
    setDocumentType(DocumentType.Other)
    setDescription('')
    setFile(null)
  }

  function handleClose() {
    if (mutation.isPending) return
    reset()
    onClose()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!file) return
    try {
      await mutation.mutateAsync({ file, documentType, description: description || null })
      toast.success('Document uploaded')
      reset()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not upload this document.'))
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Upload Document">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Select
          label="Document Type"
          required
          value={documentType}
          onChange={(e) => setDocumentType(Number(e.target.value) as DocumentType)}
        >
          {Object.entries(DocumentTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
          />
          {file && <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>}
          <p className="text-xs text-slate-500">Max file size 10 MB</p>
        </div>

        <Textarea
          label="Description"
          rows={3}
          placeholder="Optional notes about this document"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending} disabled={!file}>
            <UploadCloud className="size-4" /> Upload
          </Button>
        </div>
      </form>
    </Modal>
  )
}

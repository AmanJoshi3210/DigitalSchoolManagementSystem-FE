import { useMemo, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Check, ClipboardCheck, FileCheck2, GraduationCap, X } from 'lucide-react'
import { usePendingApplicationsQuery, useReviewPendingApplicationMutation } from '@/hooks/usePrograms'
import { usePendingDocumentsQuery, useReviewDocumentMutation } from '@/hooks/useDocuments'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { DocumentTypeBadge } from '@/components/documents/DocumentTypeBadge'
import { formatDateTime } from '@/utils/formatters'
import { getErrorMessage } from '@/utils/errors'
import { ApplicationStatus, DocumentStatus } from '@/types'

type ActionKind = 'application' | 'document'
type Filter = 'all' | ActionKind

interface ActionItem {
  kind: ActionKind
  id: number
  requestedBy: string
  what: ReactNode
  submittedAt: string
}

export default function ActionHubPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [rejecting, setRejecting] = useState<ActionItem | null>(null)
  const [reason, setReason] = useState('')

  const applicationsQuery = usePendingApplicationsQuery()
  const documentsQuery = usePendingDocumentsQuery()
  const reviewApplication = useReviewPendingApplicationMutation()
  const reviewDocument = useReviewDocumentMutation()

  const isPending = applicationsQuery.isPending || documentsQuery.isPending
  const isError = applicationsQuery.isError || documentsQuery.isError
  const error = applicationsQuery.error ?? documentsQuery.error

  const items = useMemo<ActionItem[]>(() => {
    const applicationItems: ActionItem[] = (applicationsQuery.data ?? []).map((a) => ({
      kind: 'application' as const,
      id: a.id,
      requestedBy: a.studentName,
      what: (
        <span className="inline-flex items-center gap-1.5">
          <GraduationCap className="size-3.5 shrink-0 text-slate-400" />
          Applied to <span className="font-medium text-slate-900">{a.programName}</span>
        </span>
      ),
      submittedAt: a.appliedAt,
    }))

    const documentItems: ActionItem[] = (documentsQuery.data ?? []).map((d) => ({
      kind: 'document' as const,
      id: d.id,
      requestedBy: d.uploadedByName,
      what: (
        <span className="inline-flex items-center gap-1.5">
          <FileCheck2 className="size-3.5 shrink-0 text-slate-400" />
          Uploaded <span className="font-medium text-slate-900">{d.fileName}</span>
          <DocumentTypeBadge documentType={d.documentType} />
        </span>
      ),
      submittedAt: d.uploadedAt,
    }))

    return [...applicationItems, ...documentItems].sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    )
  }, [applicationsQuery.data, documentsQuery.data])

  const visibleItems = filter === 'all' ? items : items.filter((item) => item.kind === filter)

  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          applicationsQuery.refetch()
          documentsQuery.refetch()
        }}
      />
    )
  }

  function isRowBusy(item: ActionItem) {
    return item.kind === 'application'
      ? reviewApplication.isPending && reviewApplication.variables?.applicationId === item.id
      : reviewDocument.isPending && reviewDocument.variables?.documentId === item.id
  }

  async function handleApprove(item: ActionItem) {
    try {
      if (item.kind === 'application') {
        await reviewApplication.mutateAsync({ applicationId: item.id, request: { status: ApplicationStatus.Approved } })
      } else {
        await reviewDocument.mutateAsync({ documentId: item.id, request: { status: DocumentStatus.Approved } })
      }
      toast.success('Approved')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not approve this item.'))
    }
  }

  async function handleReject() {
    if (!rejecting) return
    try {
      if (rejecting.kind === 'application') {
        await reviewApplication.mutateAsync({
          applicationId: rejecting.id,
          request: { status: ApplicationStatus.Rejected, reviewNotes: reason || null },
        })
      } else {
        await reviewDocument.mutateAsync({
          documentId: rejecting.id,
          request: { status: DocumentStatus.Rejected, reviewNotes: reason || null },
        })
      }
      toast.success('Rejected')
      setRejecting(null)
      setReason('')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not reject this item.'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Action Hub" description="Review and action pending program applications and documents in one place" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending Applications" value={applicationsQuery.data?.length ?? '—'} icon={GraduationCap} tone="brand" />
        <StatCard label="Pending Documents" value={documentsQuery.data?.length ?? '—'} icon={FileCheck2} tone="amber" />
        <StatCard label="Total Pending" value={items.length} icon={ClipboardCheck} tone="purple" />
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>
          All
        </Button>
        <Button size="sm" variant={filter === 'application' ? 'primary' : 'outline'} onClick={() => setFilter('application')}>
          Applications
        </Button>
        <Button size="sm" variant={filter === 'document' ? 'primary' : 'outline'} onClick={() => setFilter('document')}>
          Documents
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isPending ? (
          <div className="flex justify-center py-14">
            <Spinner label="Loading pending items" />
          </div>
        ) : visibleItems.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="All caught up" description="Nothing is waiting for review right now." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Requested By</th>
                  <th className="px-4 py-3 font-medium">What</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleItems.map((item) => (
                  <tr key={`${item.kind}-${item.id}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.requestedBy}</td>
                    <td className="px-4 py-3 text-slate-600">{item.what}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(item.submittedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" loading={isRowBusy(item)} onClick={() => handleApprove(item)}>
                          <Check className="size-4" /> Approve
                        </Button>
                        <Button size="sm" variant="danger" loading={isRowBusy(item)} onClick={() => setRejecting(item)}>
                          <X className="size-4" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={rejecting !== null} onClose={() => setRejecting(null)} title="Reject" size="sm">
        {rejecting && (
          <>
            <p className="text-sm text-slate-600">
              {rejecting.kind === 'application'
                ? `Reject this program application from ${rejecting.requestedBy}?`
                : `Reject this document from ${rejecting.requestedBy}?`}
            </p>
            <div className="mt-4">
              <Textarea
                label="Reason (optional)"
                placeholder="Let them know what needs fixing…"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setRejecting(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                loading={reviewApplication.isPending || reviewDocument.isPending}
              >
                Reject
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

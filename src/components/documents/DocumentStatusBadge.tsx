import { Badge } from '@/components/ui/Badge'
import { DocumentStatus, DocumentStatusLabels, enumLabel } from '@/types'

export function DocumentStatusBadge({ status }: { status: DocumentStatus | number }) {
  const tone = status === DocumentStatus.Approved ? 'green' : status === DocumentStatus.Rejected ? 'red' : 'amber'
  return <Badge tone={tone}>{enumLabel(DocumentStatusLabels, status)}</Badge>
}

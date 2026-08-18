import { Badge } from '@/components/ui/Badge'
import { ApplicationStatus, ApplicationStatusLabels, enumLabel } from '@/types'

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus | number }) {
  const tone = status === ApplicationStatus.Approved ? 'green' : status === ApplicationStatus.Rejected ? 'red' : 'amber'
  return <Badge tone={tone}>{enumLabel(ApplicationStatusLabels, status)}</Badge>
}

import { Badge } from '@/components/ui/Badge'
import { EnrollmentStatus, EnrollmentStatusLabels, enumLabel } from '@/types'

export function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus | number }) {
  const tone = status === EnrollmentStatus.Active ? 'green' : status === EnrollmentStatus.Suspended ? 'amber' : status === EnrollmentStatus.Expelled ? 'red' : 'gray'
  return <Badge tone={tone}>{enumLabel(EnrollmentStatusLabels, status)}</Badge>
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return <Badge tone={isActive ? 'green' : 'gray'}>{isActive ? 'Active' : 'Inactive'}</Badge>
}

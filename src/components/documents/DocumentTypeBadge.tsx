import { Badge } from '@/components/ui/Badge'
import { DocumentType, DocumentTypeLabels, enumLabel } from '@/types'

export function DocumentTypeBadge({ documentType }: { documentType: DocumentType | number }) {
  const tone =
    documentType === DocumentType.Passport
      ? 'blue'
      : documentType === DocumentType.OfferLetter
        ? 'purple'
        : documentType === DocumentType.Certificate
          ? 'green'
          : documentType === DocumentType.ProfilePhoto
            ? 'amber'
            : 'gray'

  return <Badge tone={tone}>{enumLabel(DocumentTypeLabels, documentType)}</Badge>
}

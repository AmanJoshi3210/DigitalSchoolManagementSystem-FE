import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ChevronRight, GraduationCap, Plus, Search } from 'lucide-react'
import { useProgramsQuery } from '@/hooks/usePrograms'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { ActiveBadge } from '@/components/students/StatusBadge'
import { ProgramForm } from '@/components/forms/ProgramForm'
import { formatDate } from '@/utils/formatters'
import { EducationLevelLabels, enumLabel } from '@/types'
import type { Program } from '@/types'

type SortKey = 'name' | 'level' | 'deadline' | 'status'

export default function StaffProgramsPage() {
  const { data: programs, isPending, isError, error, refetch } = useProgramsQuery()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' })
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    if (!programs) return []
    const query = search.trim().toLowerCase()
    const matches = query
      ? programs.filter((p) => [p.name, p.description ?? ''].join(' ').toLowerCase().includes(query))
      : programs

    const sorted = [...matches].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1
      switch (sort.key) {
        case 'name':
          return dir * a.name.localeCompare(b.name)
        case 'level':
          return dir * (a.eligibleEducationLevel - b.eligibleEducationLevel)
        case 'deadline':
          return dir * (new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime())
        case 'status':
          return dir * Number(a.isActive) - dir * Number(b.isActive)
      }
    })
    return sorted
  }, [programs, search, sort])

  function toggleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }))
  }

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Programs"
        description="Education programs students can apply to"
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Create Program
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <Input
            placeholder="Search by program name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            rightElement={<Search className="size-4 text-slate-400" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <SortableHeader label="Program" sortKey="name" sort={sort} onSort={toggleSort} />
                <SortableHeader label="Eligible Level" sortKey="level" sort={sort} onSort={toggleSort} />
                <SortableHeader label="Deadline" sortKey="deadline" sort={sort} onSort={toggleSort} />
                <SortableHeader label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isPending && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={5} />)}

              {!isPending && filtered.map((program) => <ProgramRow key={program.id} program={program} />)}
            </tbody>
          </table>

          {!isPending && filtered.length === 0 && (
            <EmptyState
              icon={GraduationCap}
              title={search ? 'No matching programs' : 'No programs yet'}
              description={search ? 'Try a different search term.' : 'Create a program to let students start applying.'}
            />
          )}
        </div>
      </Card>

      <Modal open={creating} onClose={() => setCreating(false)} title="Create Program">
        <ProgramForm onCancel={() => setCreating(false)} onSuccess={() => setCreating(false)} />
      </Modal>
    </div>
  )
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sort: { key: SortKey; direction: 'asc' | 'desc' }
  onSort: (key: SortKey) => void
}) {
  return (
    <th className="px-4 py-3 font-medium">
      <button onClick={() => onSort(sortKey)} className="flex items-center gap-1 hover:text-slate-700">
        {label}
        <ArrowUpDown className={`size-3 ${sort.key === sortKey ? 'text-brand-600' : 'text-slate-300'}`} />
      </button>
    </th>
  )
}

function ProgramRow({ program }: { program: Program }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <Link to={`/staff/programs/${program.id}`} className="font-medium text-slate-900 hover:text-brand-600">
          {program.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-slate-600">{enumLabel(EducationLevelLabels, program.eligibleEducationLevel)}</td>
      <td className="px-4 py-3 text-slate-600">{formatDate(program.applicationDeadline)}</td>
      <td className="px-4 py-3">
        <ActiveBadge isActive={program.isActive} />
      </td>
      <td className="px-4 py-3 text-right">
        <Link to={`/staff/programs/${program.id}`} className="inline-flex items-center text-brand-600 hover:text-brand-700">
          <ChevronRight className="size-4" />
        </Link>
      </td>
    </tr>
  )
}

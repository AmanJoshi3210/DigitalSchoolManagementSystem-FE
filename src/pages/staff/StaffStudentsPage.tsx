import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ChevronRight, Search, Users } from 'lucide-react'
import { useStudentsQuery } from '@/hooks/useStudents'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { ActiveBadge } from '@/components/students/StatusBadge'
import { formatDate, fullName } from '@/utils/formatters'
import type { Student } from '@/types'

type SortKey = 'name' | 'grade' | 'admissionDate' | 'status'

export default function StaffStudentsPage() {
  const { data: students, isPending, isError, error, refetch } = useStudentsQuery()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' })

  const filtered = useMemo(() => {
    if (!students) return []
    const query = search.trim().toLowerCase()
    const matches = query
      ? students.filter((s) =>
          [s.firstName, s.lastName, s.email, s.admissionNumber, s.rollNumber, s.grade, s.section]
            .join(' ')
            .toLowerCase()
            .includes(query),
        )
      : students

    const sorted = [...matches].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1
      switch (sort.key) {
        case 'name':
          return dir * fullName(a.firstName, a.lastName).localeCompare(fullName(b.firstName, b.lastName))
        case 'grade':
          return dir * `${a.grade}${a.section}`.localeCompare(`${b.grade}${b.section}`)
        case 'admissionDate':
          return dir * (new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime())
        case 'status':
          return dir * Number(a.isActive) - dir * Number(b.isActive)
      }
    })
    return sorted
  }, [students, search, sort])

  function toggleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }))
  }

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Students" description="All students enrolled in the system" />

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <Input
            placeholder="Search by name, email, admission or roll number, grade…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            rightElement={<Search className="size-4 text-slate-400" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <SortableHeader label="Student" sortKey="name" sort={sort} onSort={toggleSort} />
                <th className="px-4 py-3 font-medium">Admission No.</th>
                <SortableHeader label="Grade / Section" sortKey="grade" sort={sort} onSort={toggleSort} />
                <th className="px-4 py-3 font-medium">Phone</th>
                <SortableHeader label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                <SortableHeader label="Admission Date" sortKey="admissionDate" sort={sort} onSort={toggleSort} />
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isPending &&
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} columns={7} />)}

              {!isPending &&
                filtered.map((student) => <StudentRow key={student.id} student={student} />)}
            </tbody>
          </table>

          {!isPending && filtered.length === 0 && (
            <EmptyState
              icon={Users}
              title={search ? 'No matching students' : 'No students yet'}
              description={search ? 'Try a different search term.' : 'Students will appear here once they register.'}
            />
          )}
        </div>
      </Card>
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

function StudentRow({ student }: { student: Student }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <Link to={`/staff/students/${student.id}`} className="flex items-center gap-3">
          <Avatar firstName={student.firstName} lastName={student.lastName} imageUrl={student.profileImageUrl} size="sm" />
          <div>
            <p className="font-medium text-slate-900">{fullName(student.firstName, student.lastName)}</p>
            <p className="text-xs text-slate-500">{student.email}</p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 text-slate-600">{student.admissionNumber}</td>
      <td className="px-4 py-3 text-slate-600">
        {student.grade} - {student.section}
      </td>
      <td className="px-4 py-3 text-slate-600">{student.phoneNumber || '—'}</td>
      <td className="px-4 py-3">
        <ActiveBadge isActive={student.isActive} />
      </td>
      <td className="px-4 py-3 text-slate-600">{formatDate(student.admissionDate)}</td>
      <td className="px-4 py-3 text-right">
        <Link to={`/staff/students/${student.id}`} className="inline-flex items-center text-brand-600 hover:text-brand-700">
          <ChevronRight className="size-4" />
        </Link>
      </td>
    </tr>
  )
}

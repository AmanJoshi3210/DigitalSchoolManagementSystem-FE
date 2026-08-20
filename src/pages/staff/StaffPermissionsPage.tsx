import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import { useStaffListQuery, usePermissionCatalogQuery, useSetStaffPermissionsMutation } from '@/hooks/useStaffManagement'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { fullName } from '@/utils/formatters'
import { getErrorMessage } from '@/utils/errors'
import { StaffRole, StaffRoleLabels } from '@/types'
import type { PermissionCatalogItem, StaffListItem } from '@/types'

export default function StaffPermissionsPage() {
  const staffQuery = useStaffListQuery()
  const catalogQuery = usePermissionCatalogQuery()

  const isPending = staffQuery.isPending || catalogQuery.isPending
  const isError = staffQuery.isError || catalogQuery.isError
  const error = staffQuery.error ?? catalogQuery.error

  const catalog = catalogQuery.data ?? []
  const staff = staffQuery.data ?? []
  const columnCount = 2 + catalog.length + 1

  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          staffQuery.refetch()
          catalogQuery.refetch()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff Permissions"
        description="Control which staff pages each staff member can access. Admins always have full access and can't be edited here."
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Staff</th>
                <th className="px-4 py-3 font-medium">Role</th>
                {catalog.map((perm) => (
                  <th key={perm.key} className="px-4 py-3 text-center font-medium">
                    {perm.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isPending && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={columnCount} />)}

              {!isPending &&
                staff.map((s) => <StaffPermissionRow key={s.staffUserId} staff={s} catalog={catalog} />)}
            </tbody>
          </table>

          {!isPending && staff.length === 0 && (
            <EmptyState icon={ShieldCheck} title="No staff yet" description="Staff accounts will appear here once registered." />
          )}
        </div>
      </Card>
    </div>
  )
}

function StaffPermissionRow({ staff, catalog }: { staff: StaffListItem; catalog: PermissionCatalogItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(staff.permissions))
  const mutation = useSetStaffPermissionsMutation()

  const isAdminRow = staff.staffRole === StaffRole.Admin
  const serverKeys = useMemo(() => new Set(staff.permissions), [staff.permissions])
  const isDirty = selected.size !== serverKeys.size || [...selected].some((key) => !serverKeys.has(key))

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleSave() {
    mutation.mutate(
      { staffUserId: staff.staffUserId, request: { permissions: Array.from(selected) } },
      {
        onSuccess: () => toast.success(`Updated permissions for ${fullName(staff.firstName, staff.lastName)}.`),
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to update permissions.')),
      },
    )
  }

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <p className="font-medium text-slate-900">{fullName(staff.firstName, staff.lastName)}</p>
        <p className="text-xs text-slate-500">
          {staff.email} · {staff.employeeCode}
        </p>
      </td>
      <td className="px-4 py-3">
        <Badge tone={isAdminRow ? 'purple' : 'gray'}>{StaffRoleLabels[staff.staffRole]}</Badge>
      </td>

      {isAdminRow ? (
        <td className="px-4 py-3 text-slate-500" colSpan={catalog.length}>
          <Badge tone="purple">All access (Admin)</Badge>
        </td>
      ) : (
        catalog.map((perm) => (
          <td key={perm.key} className="px-4 py-3 text-center">
            <input
              type="checkbox"
              aria-label={`${perm.label} for ${fullName(staff.firstName, staff.lastName)}`}
              className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              checked={selected.has(perm.key)}
              onChange={() => toggle(perm.key)}
            />
          </td>
        ))
      )}

      <td className="px-4 py-3 text-right">
        {!isAdminRow && (
          <Button size="sm" variant="outline" disabled={!isDirty} loading={mutation.isPending} onClick={handleSave}>
            Save
          </Button>
        )}
      </td>
    </tr>
  )
}

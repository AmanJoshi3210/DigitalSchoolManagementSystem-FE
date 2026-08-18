import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useCreateProgramMutation, useUpdateProgramMutation } from '@/hooks/usePrograms'
import { fieldError, getErrorMessage, isApiError } from '@/utils/errors'
import { toDateInputValue } from '@/utils/formatters'
import { EducationLevel, EducationLevelLabels } from '@/types'
import type { CreateProgramRequest, Program } from '@/types'

export function ProgramForm({ program, onCancel, onSuccess }: { program?: Program; onCancel: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<CreateProgramRequest>({
    name: program?.name ?? '',
    description: program?.description ?? '',
    eligibleEducationLevel: program?.eligibleEducationLevel ?? EducationLevel.Undergraduate,
    applicationDeadline: toDateInputValue(program?.applicationDeadline),
  })
  const [error, setError] = useState<unknown>(null)
  const createMutation = useCreateProgramMutation()
  const updateMutation = useUpdateProgramMutation(program?.id ?? 0)
  const mutation = program ? updateMutation : createMutation

  function update<K extends keyof CreateProgramRequest>(key: K, value: CreateProgramRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await mutation.mutateAsync({
        ...form,
        description: form.description || null,
      })
      toast.success(program ? 'Program updated' : 'Program created')
      onSuccess()
    } catch (err) {
      setError(err)
      toast.error(getErrorMessage(err, 'Could not save this program.'))
    }
  }

  const generalError = error && (!isApiError(error) || !error.fieldErrors) ? getErrorMessage(error) : ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {generalError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input label="Program Name" required value={form.name} onChange={(e) => update('name', e.target.value)} error={fieldError(error, 'name')} />
        </div>
        <Select
          label="Eligible Education Level"
          required
          value={form.eligibleEducationLevel}
          onChange={(e) => update('eligibleEducationLevel', Number(e.target.value) as typeof form.eligibleEducationLevel)}
          error={fieldError(error, 'eligibleEducationLevel')}
        >
          {Object.entries(EducationLevelLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          label="Application Deadline"
          type="date"
          required
          value={form.applicationDeadline}
          onChange={(e) => update('applicationDeadline', e.target.value)}
          error={fieldError(error, 'applicationDeadline')}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Description"
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
            error={fieldError(error, 'description')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {program ? 'Save Changes' : 'Create Program'}
        </Button>
      </div>
    </form>
  )
}

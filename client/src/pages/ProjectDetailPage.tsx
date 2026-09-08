import { CalendarDays, Check, FileText, Save, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import {
  useFinanceOverview,
  useProject,
  useProjectDocuments,
  useUpdateProjectMutation,
  useWellWorkflow,
} from '../features/projects/hooks';
import {
  projectStateLabels,
  projectTypeLabels,
  customerInterestLabels,
} from '../features/projects/types';
import type { UpdateProjectPayload } from '../features/projects/types';
import { OperationsPanel, Metric, InfoTile, ProjectHeader } from '../features/projects/components';
import { apiClient } from '../libs';
import { toast } from 'sonner';

const workflowLabels = [
  'Terénní prohlídka',
  'Hydrogeologické posouzení PGP',
  'Povolení průzkumu',
  'Realizace vrtání',
  'Dozor z vrtání',
  'Čerpací zkouška',
  'Závěrečná zpráva hydrogeologa',
  'Projekt vodního díla',
  'Dokončení úřadů',
];

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const queryClient = useQueryClient();
  const { data: project, isLoading } = useProject(projectId);
  const { data: workflow = [] } = useWellWorkflow(projectId);
  const { data: documents = [] } = useProjectDocuments(projectId);
  const { data: finance } = useFinanceOverview(projectId);
  const field = (value: unknown) => (value == null ? '-' : String(value));
  const updateProjectMutation = useUpdateProjectMutation();
  const [form, setForm] = useState<UpdateProjectPayload>();

  useEffect(() => {
    if (project) {
      setForm({
        orderNumber: project.orderNumber,
        name: project.name,
        orderType: project.orderType,
        orderState: project.orderState,
        customerInterest: project.customerInterest,
        totalBudget: project.totalBudget,
        warrantyFrom: project.warrantyFrom,
        warrantyTo: project.warrantyTo,
      });
    }
  }, [project]);


  const mutation = useMutation({
    mutationFn: async ({ method, url, data }: { method: 'patch'; url: string; data?: unknown }) => {
      const response = await apiClient.request({ method, url, data });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });

  const submit = (data: { method: 'patch'; url: string; data?: unknown }) =>
    toast.promise(mutation.mutateAsync(data), {
      loading: 'Ukládám...',
      success: 'Uloženo.',
      error: 'Operace se nepodařila.',
    });

  const updateField = (field: keyof UpdateProjectPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;

    toast.promise(updateProjectMutation.mutateAsync({ projectId, payload: form }), {
      loading: 'Ukládám údaje zakázky...',
      success: 'Údaje zakázky byly uloženy.',
      error: 'Údaje zakázky se nepodařilo uložit.',
    });
  };

  if (isLoading)
    return <main className='p-8 text-sm text-muted-foreground'>Načítám detail zakázky...</main>;
  if (!project)
    return <main className='p-8 text-sm text-destructive'>Zakázku se nepodařilo načíst.</main>;
  if (!form) return null;

  const summary = finance?.summary;

  return (
    <>
      <ProjectHeader project={project} />

      <form onSubmit={saveProject} className='mx-4 mb-2 rounded-xl border border-slate-200 bg-white p-4'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <h2 className='text-lg font-semibold text-slate-950'>Údaje zakázky</h2>
          <Button type='submit' disabled={updateProjectMutation.isPending}>
            <Save className='size-4' />
            {updateProjectMutation.isPending ? 'Ukládám...' : 'Uložit změny'}
          </Button>
        </div>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <label className='space-y-2 text-sm font-medium'>
            Číslo zakázky
            <Input
              required
              value={form.orderNumber ?? ''}
              onChange={(event) => updateField('orderNumber', event.target.value)}
            />
          </label>
          <label className='space-y-2 text-sm font-medium'>
            Název zakázky
            <Input
              required
              value={form.name ?? ''}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </label>
          <label className='space-y-2 text-sm font-medium'>
            Typ zakázky
            <Select
              value={form.orderType ?? ''}
              onChange={(event) => updateField('orderType', event.target.value)}
            >
              {Object.entries(projectTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </label>
          <label className='space-y-2 text-sm font-medium'>
            Stav zakázky
            <Select
              value={form.orderState ?? ''}
              onChange={(event) => updateField('orderState', event.target.value)}
            >
              {Object.entries(projectStateLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </label>
          <label className='space-y-2 text-sm font-medium'>
            Zájem zákazníka
            <Select
              value={form.customerInterest ?? ''}
              onChange={(event) => updateField('customerInterest', event.target.value)}
            >
              {Object.entries(customerInterestLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </label>
          <label className='space-y-2 text-sm font-medium'>
            Celkový rozpočet
            <Input
              required
              type='number'
              min='0'
              step='0.01'
              value={form.totalBudget ?? ''}
              onChange={(event) => updateField('totalBudget', event.target.value)}
            />
          </label>
          <label className='space-y-2 text-sm font-medium'>
            Záruka od
            <Input
              type='date'
              value={form.warrantyFrom ?? ''}
              onChange={(event) => updateField('warrantyFrom', event.target.value)}
            />
          </label>
          <label className='space-y-2 text-sm font-medium'>
            Záruka do
            <Input
              type='date'
              value={form.warrantyTo ?? ''}
              onChange={(event) => updateField('warrantyTo', event.target.value)}
            />
          </label>
        </div>
      </form>

      <main className='grid gap-2 xl:grid-cols-3 bg-slate-50/70 pt-0 p-4'>
        <div className='rounded-xl border border-slate-200 bg-white p-4 col-span-3 xl:col-span-2'>
          <h2 className='text-lg font-semibold text-slate-950'>Workflow</h2>
          <div className='pt-3 space-y-3'>
            {workflowLabels.map((label, index) => {
              const step = workflow.find(
                (item: { stepNumber: number; status?: string }) => item.stepNumber === index + 1,
              );
              const status = step?.status || 'NEZAHAJENO';
              return (
                <div
                  key={label}
                  className='flex items-center gap-3 rounded-lg border border-slate-100 p-3'
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${status === 'SPLNENO' ? 'bg-emerald-100 text-emerald-700' : status === 'PROBIHA' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {index + 1}
                  </span>
                  <span className='flex-1 text-sm font-medium text-slate-800'>{label}</span>
                  <span className='text-xs text-slate-500'>
                    {status === 'SPLNENO'
                      ? 'Splněno'
                      : status === 'PROBIHA'
                        ? 'Probíhá'
                        : 'Nezahájeno'}
                  </span>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={() =>
                      submit({
                        method: 'patch',
                        url: `/projects/${projectId}/well-workflow/${step?.stepNumber??index + 1}/`,
                        data: { status: step?.status === 'SPLNENO' ? 'PROBIHA' : 'SPLNENO' },
                      })
                    }
                  >
                    <Check className='size-4' /> Změnit stav
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <div className='grid grid-cols-3 xl:grid-cols-1 gap-2 col-span-3 xl:col-span-1'>
          <InfoTile
            icon={<WalletCards />}
            label='Budget'
            value={project.totalBudget ? `${project.totalBudget} Kč` : 'Neuveden'}
          />
          <InfoTile
            icon={<CalendarDays />}
            label='Záruka od'
            value={project.warrantyFrom || 'Neuvedeno'}
          />
          <InfoTile
            icon={<CalendarDays />}
            label='Záruka do'
            value={project.warrantyTo || 'Neuvedeno'}
          />
          <div className='rounded-xl border border-slate-200 bg-white p-5'>
            <div className='flex items-center gap-2'>
              <WalletCards className='size-5 text-brand-secondary' />
              <h2 className='font-semibold'>Finance</h2>
            </div>
            <dl className='mt-4 space-y-3 text-sm grid grid-cols-1 xl:grid-cols-2 gap-x-4'>
              <Metric label='Vyfakturováno' value={summary?.invoiced ?? 'Načítám'} />
              <Metric label='Uhrazeno' value={summary?.totalPaid ?? 'Načítám'} />
              <Metric label='Zbývá' value={summary?.remaining ?? 'Načítám'} />
              
              <Metric label='Faktury' value={finance?.invoices.length ?? 'Načítám'} />
              <Metric label='Protokoly' value={finance?.inspectionProtocols.length ?? 'Načítám'} />
              
              <Metric label='Pozastaveno' value={finance?.summary.retentions.released ?? 'Načítám'} />
              <Metric label='Uvolněno' value={finance?.summary.retentions.unreleased ?? 'Načítám'} />

            </dl>
          </div>
          <div className='rounded-xl border border-slate-200 bg-white p-5 col-span-2 xl:col-span-1 overflow-y-auto min-h-max'>
            <div className='flex items-center gap-2'>
              <FileText className='size-5 text-brand-secondary' />
              <h2 className='font-semibold'>Dokumenty projektu ({documents.length})</h2>
            </div>
            {(documents ?? []).map((item) => (
              <a
                className='mt-2 block text-sm text-brand hover:underline'
                href={String(item.file)}
                key={String(item.id)}
                target='_blank'
                rel='noreferrer'
              >
                {field(item.fileName)}
              </a>
              
            ))}
          </div>
        </div>
      </main>

      <OperationsPanel projectId={projectId} />
    </>
  );
};

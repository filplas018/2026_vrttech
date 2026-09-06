import { ArrowLeft, CalendarDays, Check, FileText, WalletCards } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import {
  useFinanceOverview,
  useProject,
  useProjectDocuments,
  useWellWorkflow,
} from '../features/projects/hooks';
import {
  projectStateLabels,
  projectTypeLabels,
  customerInterestLabels,
} from '../features/projects/types';
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
type RecordValue = Record<string, unknown>;


export const ProjectDetailPage = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const queryClient = useQueryClient();
  const { data: project, isLoading } = useProject(projectId);
  const { data: workflow = [] } = useWellWorkflow(projectId);
  const { data: documents = [] } = useProjectDocuments(projectId);
  const { data: finance } = useFinanceOverview(projectId);
  const field = (value: unknown) => (value == null ? '-' : String(value));


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

  if (isLoading)
    return <main className='p-8 text-sm text-muted-foreground'>Načítám detail zakázky...</main>;
  if (!project)
    return <main className='p-8 text-sm text-destructive'>Zakázku se nepodařilo načíst.</main>;

  const summary = finance?.summary;

  return (
    <>
      <ProjectHeader project={project} />

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

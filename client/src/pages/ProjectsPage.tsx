import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Plus, RefreshCw, Search, Waves } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ProjectForm } from '../features/projects/components';
import { useProjects } from '../features/projects/hooks';
import {
  customerInterestLabels,
  projectStateLabels,
  projectTypeLabels,
} from '../features/projects/types';

export const ProjectsPage = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();

  const {
    data: projects = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useProjects({
    search: search || undefined,
    orderType: searchParams.get('orderType') || undefined,
  });

  return (
    <main className='min-h-full px-4 py-6 sm:px-6 lg:px-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <header className='flex flex-col justify-between gap-4 border-b-2 border-brand-secondary/20 pb-5 mb-10 sm:flex-row sm:items-end'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary'>
              Zakázky
            </p>
            <h2 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950'>
              Přehled
            </h2>
            <p className='mt-2 text-sm text-slate-600'>
              Poptávky, realizace a předané vrty na jednom místě.
            </p>
          </div>
          <Button  className='h-10 px-4 py-2 inline-flex items-center justify-center' onClick={() => setFormOpen(true)} >
            <Plus />
            Nová zakázka
          </Button>
        </header>

        <section className='space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6'>
            <div className='flex flex-col gap-3 sm:flex-row'>
            <div className='relative max-w-md flex-1'>
                <Search className='absolute top-2 left-2.5 size-4 text-muted-foreground' />
                <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Hledat podle názvu nebo čísla'
                className='pl-9 bg-white'
                />
            </div>
            <Button
                variant='outline'
                size='icon'
                onClick={() => refetch()}
                aria-label='Obnovit seznam'
            >
                <RefreshCw className={isFetching ? 'animate-spin' : undefined} />
            </Button>
            </div>

            {isLoading && (
            <p className='py-12 text-center text-sm text-muted-foreground'>Načítám zakázky...</p>
            )}
            {isError && (
            <p className='py-12 text-center text-sm text-destructive'>
                Zakázky se nepodařilo načíst.
            </p>
            )}
            {!isLoading && !isError && projects?.length === 0 && (
            <div className='rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center'>
                <Waves className='mx-auto size-9 text-brand' />
                <h2 className='mt-4 font-semibold text-slate-900'>Zatím žádné zakázky</h2>
                <p className='mt-1 text-sm text-slate-500'>
                Založte první poptávku a začněte evidovat její průběh.
                </p>
            </div>
            )}
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {projects?.map((project) => (
                <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className='group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand/40 hover:shadow-md'
                >
                <div className='flex items-start justify-between gap-3'>
                    <div>
                    <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                        {project.orderNumber}
                    </p>
                    <h2 className='mt-2 text-lg font-semibold text-slate-950 group-hover:text-brand'>
                        {project.name}
                    </h2>
                    </div>
                    <div className='flex flex-col gap-2 items-end'>
                        <span className='rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 text-nowrap max-w-max'>
                        {projectStateLabels[project.orderState as keyof typeof projectStateLabels]}
                    </span>
                    <span className='rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 text-nowrap max-w-max'>
                        {
                        customerInterestLabels[
                            project.customerInterest as keyof typeof customerInterestLabels
                        ]
                        }
                    </span>
                    <span className='rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 text-nowrap max-w-max'>
                        {projectTypeLabels[project.orderType as keyof typeof projectTypeLabels]}
                    </span>
                    </div>
                </div>             
                </Link>
            ))}
            </div>
        </section>
        
      </div>
      <ProjectForm open={isFormOpen} onOpenChange={setFormOpen} />
    </main>
  );
};

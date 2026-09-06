import type { Project } from '@/features/projects/types';
import {
  projectStateLabels,
  projectTypeLabels,
  customerInterestLabels,
} from '@/features/projects/types';

export const ProjectHeader = ({
  project,
  sticky = true,
}: {
  project: Project;
  sticky?: boolean;
}) => {
  return (
    <header
      className={`flex justify-between gap-2 border-b border-slate-200 mb-4 p-4 ${sticky ? 'sticky top-0 bg-white z-10' : ''}`}
    >
      <h1 className='text-3xl font-semibold tracking-tight text-slate-950'>
        <span>{project.name}</span>
      </h1>

      <div className='flex gap-2 items-center'>
        
        <span className='text-sm font-semibold text-slate-500'> {project.orderNumber}</span>
        <span className='w-fit rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-brand'>
          {projectTypeLabels[project.orderType as keyof typeof projectTypeLabels]}
        </span>
        <span className='w-fit rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-brand'>
          {customerInterestLabels[project.customerInterest as keyof typeof customerInterestLabels]}
        </span>
        <span className='w-fit rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-brand'>
          {projectStateLabels[project.orderState as keyof typeof projectStateLabels]}
        </span>
      </div>
    </header>
  );
};

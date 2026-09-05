
import { ProjectList } from '@/features/projects/components';

export const ProjectsPage = () => {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Zakázky</h1>
      <ProjectList />
    </div>
  );
};
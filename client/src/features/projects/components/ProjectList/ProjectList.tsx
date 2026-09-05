import { useProjects } from "../../hooks";

export const ProjectList = () => {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return <p>Načítám zakázky...</p>;
  }

  if (isError) {
    return <p>Nepodařilo se načíst zakázky.</p>;
  }

  return (
    <div className='flex flex-col gap-3'>
      {projects?.map((project) => (
        <div
          key={project.id}
          className='rounded-lg border border-border bg-card p-4 shadow-sm'
        >
          <div className='flex items-center justify-between'>
            <h3 className='font-medium'>{project.name}</h3>
            <span className='text-sm text-muted-foreground'>{project.orderNumber}</span>
          </div>
          <p className='mt-1 text-sm text-muted-foreground'>
            Stav: {project.orderState} · Typ: {project.orderType}
          </p>
        </div>
      ))}
    </div>
  );
};
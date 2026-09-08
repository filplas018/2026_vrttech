import { Button } from '../../../components/ui/button';

export const ActionForm = ({
  icon,
  title,
  className,
  children,
  onSubmit,
  pending = false,
}: {
  icon: React.ReactNode | null;
  title: string;
  className?: string;
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  pending?: boolean;
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-2 ${className || ''}`}
    >
      <h3 className='font-semibold text-slate-900 col-span-full mb-0 flex gap-2 items-center'>{icon ?? ""} {title}</h3>
      {children}

      <footer className='flex justify-end p-0 col-span-full'>
        <Button type='submit' disabled={pending}>
          {pending ? 'Odesílám...' : 'Uložit'}
        </Button>
      </footer>
    </form>
  );
};

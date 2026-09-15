import { Button } from '../../../components/ui/button';

export const ActionForm = ({
  icon,
  title,
  className,
  children,
  onSubmit,
  pending = false,
  variant = 'default',
}: {
  icon: React.ReactNode | null;
  title: string;
  className?: string;
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  pending?: boolean;
  variant?: 'default' | 'white';
}) => {
  const isWhite = variant === 'white';

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col overflow-hidden rounded-lg border border-slate-200 ${isWhite ? 'bg-white' : 'bg-slate-50 p-2'} ${className || ''}`}
    >
      <h3
        className={`flex items-center gap-2 font-semibold text-slate-900 ${
          isWhite ? 'border-b border-slate-200 bg-slate-50 px-4 py-3 ' : 'mb-3'
        }`}
      >
        {icon ?? ''} {title}
      </h3>

      <div className={`grid flex-1 grid-cols-2 content-start gap-2 ${isWhite ? 'px-4 pt-3' : ''}`}>
        {children}
      </div>

      <footer className={`mt-3 flex justify-end ${isWhite ? 'px-4 pb-4' : ''}`}>
        <Button type='submit' disabled={pending} className='px-5 py-2.5'>
          {pending ? 'Odesílám...' : 'Uložit'}
        </Button>
      </footer>
    </form>
  );
};
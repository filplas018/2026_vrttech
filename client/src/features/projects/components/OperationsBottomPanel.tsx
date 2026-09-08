

interface OperationsBottomPanelProps {
  children?: React.ReactNode;
}



export const OperationsBottomPanel = ({ children }: OperationsBottomPanelProps) => {


  return (
    <aside className='flex items-center gap-2 fixed bottom-0 left-64 md:left-72 z-50 right-0 border-t border-slate-200 bg-white px-4 py-3'>
        {children}
    </aside>
  );
};

export const Metric = ({ label, value }: { label: string; value: string | number | null }) => {
  return (
    <div className='flex items-center justify-between gap-3'>
      <dt className='text-slate-500'>{label}</dt>
      <dd className='font-semibold text-slate-900'>{value ?? '-'}</dd>
    </div>
  );
};

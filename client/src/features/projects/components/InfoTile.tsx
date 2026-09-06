export const InfoTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center gap-2 text-sm text-slate-500'>
        {icon}
        {label}
      </div>
      <p className='mt-3 text-lg font-semibold text-slate-950'>{value}</p>
    </div>
  );
};
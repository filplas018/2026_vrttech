import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCreateProjectMutation } from '@/features/projects/hooks';
import {
  customerInterestLabels,
  projectStateLabels,
  projectTypeLabels,
  type CreateProjectPayload,
  type CustomerInterest,
  type ProjectState,
  type ProjectType,
} from '@/features/projects/types';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm: CreateProjectPayload = {
  orderNumber: '',
  name: '',
  orderType: 'GEOTERMALNI',
  orderState: 'POPTAVKA',
  customerInterest: 'CEKA_SE',
  totalBudget: '',
  warrantyFrom: '',
  warrantyTo: '',
};

export const ProjectForm = ({ open, onOpenChange }: ProjectFormProps) => {
  const [form, setForm] = useState(initialForm);
  const createMutation = useCreateProjectMutation();

  function updateField(field: keyof CreateProjectPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const promise = createMutation.mutateAsync(form, {
      onSuccess: () => {
        setForm(initialForm);
        onOpenChange(false);
      },
    });

    toast.promise(promise, {
      loading: 'Zakládám poptávku...',
      success: 'Poptávka byla založena.',
      error: 'Poptávku se nepodařilo založit.',
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nová zakázka</SheetTitle>
          <SheetDescription>Založte novou poptávku pro další zpracování.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='orderNumber' className='text-sm font-medium'>Číslo zakázky</label>
            <Input
              id='orderNumber'
              required
              value={form.orderNumber}
              onChange={(event) => updateField('orderNumber', event.target.value)}
              placeholder='Např. 2026-014'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='project_name' className='text-sm font-medium'>Název zakázky</label>
            <Input
              id='project_name'
              required
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder='Název investora nebo lokality'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='orderType' className='text-sm font-medium'>Typ zakázky</label>
            <select
              id='orderType'
              value={form.orderType}
              onChange={(event) => updateField('orderType', event.target.value as ProjectType)}
              className='h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
            >
              {Object.entries(projectTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='orderState' className='text-sm font-medium'>Stav zakázky</label>
            <select
              id='orderState'
              value={form.orderState}
              onChange={(event) => updateField('orderState', event.target.value as ProjectState)}
              className='h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
            >
              {Object.entries(projectStateLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='customerInterest' className='text-sm font-medium'>Zájem zákazníka</label>
            <select
              id='customerInterest'
              value={form.customerInterest}
              onChange={(event) => updateField('customerInterest', event.target.value as CustomerInterest)}
              className='h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
            >
              {Object.entries(customerInterestLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='totalBudget' className='text-sm font-medium'>Předběžný budget</label>
            <Input
              id='totalBudget'
              type='number'
              min='0'
              step='0.01'
              value={form.totalBudget}
              onChange={(event) => updateField('totalBudget', event.target.value)}
              placeholder='Kč'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='warrantyFrom' className='text-sm font-medium'>Záruka od</label>
            <Input
              id='warrantyFrom'
              type='date'
              value={form.warrantyFrom}
              onChange={(event) => updateField('warrantyFrom', event.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='warrantyTo' className='text-sm font-medium'>Záruka do</label>
            <Input
              id='warrantyTo'
              type='date'
              value={form.warrantyTo}
              onChange={(event) => updateField('warrantyTo', event.target.value)}
            />
          </div>
          <SheetFooter className='px-0'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Zrušit
            </Button>
            <Button type='submit' disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Zakládám...' : 'Založit zakázku'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
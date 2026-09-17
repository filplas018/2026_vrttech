
import { Button, Input } from '@/components';
import { useAllContacts } from '@/features/projects/hooks/useAllContacts';
import type { Contact } from '@/features/projects/types';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import { handleFormErrors } from '@/utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type ContactPayload = {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
};

const createContact = async (data: ContactPayload) => {
  const response = await apiClient.post<Contact>('/projects/contacts/create/', data);
  return response.data;
};

const updateContact = async (contactId: number, data: ContactPayload) => {
  const response = await apiClient.patch<Contact>(`/projects/contacts/${contactId}/update/`, data);
  return response.data;
};

export const ContactsSettingsPage = () => {
  const queryClient = useQueryClient();
  const { data: contacts, isLoading: isContactsLoading } = useAllContacts();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const createMutation = useMutation<Contact, ApiError, ContactPayload>({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-contacts'] });
      resetCreate();
      toast.success('Kontakt byl vytvořen.');
    },
    onError: (error) => handleFormErrors<ContactPayload>(error, setCreateError, 'root'),
  });
  const updateMutation = useMutation<Contact, ApiError, { contactId: number; data: ContactPayload }>({
    mutationFn: ({ contactId, data }) => updateContact(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-contacts'] });
      setSelectedContact(null);
      toast.success('Kontakt byl upraven.');
    },
    onError: (error) => handleFormErrors<ContactPayload>(error, setEditError, 'root'),
  });
  const {
    register,
    handleSubmit,
    reset: resetCreate,
    setError: setCreateError,
    formState: { errors: createErrors },
  } = useForm<ContactPayload>();
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetUpdate,
    setError: setEditError,
    formState: { errors: editErrors },
  } = useForm<ContactPayload>();

  useEffect(() => {
    if (selectedContact) {
      resetUpdate({
        firstName: selectedContact.firstName,
        lastName: selectedContact.lastName,
        company: selectedContact.company ?? '',
        phone: selectedContact.phone,
        email: selectedContact.email,
      });
    }
  }, [resetUpdate, selectedContact]);

  const onCreateSubmit = (data: ContactPayload) => createMutation.mutate(data);

  const onEditSubmit = (data: ContactPayload) => {
    if (selectedContact) updateMutation.mutate({ contactId: selectedContact.id, data });
  };

  const required = { required: 'Toto pole je povinné' };

  return (
    <main className='min-h-full  p-4'>
      <section className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-2'>
        <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-slate-900'>Nastavení kontaktů</h1>
          <p className='mt-1 text-sm text-slate-500'>Vytvoření nového kontaktu</p>
        </div>

        <form onSubmit={handleSubmit(onCreateSubmit)} className='space-y-4'>
          <Input
            label='Jméno'
            error={createErrors.firstName?.message}
            {...register('firstName', required)}
          />
          <Input
            label='Příjmení'
            error={createErrors.lastName?.message}
            {...register('lastName', required)}
          />
          <Input label='Firma' error={createErrors.company?.message} {...register('company')} />
          <Input label='Telefon' error={createErrors.phone?.message} {...register('phone', required)} />
          <Input
            label='Email'
            type='email'
            error={createErrors.email?.message}
            {...register('email', required)}
          />
          {createErrors.root && <p className='text-sm text-red-500'>{createErrors.root.message}</p>}

          <Button type='submit' variant='primary' isLoading={createMutation.isPending}>
            {createMutation.isPending ? 'Vytvářím...' : 'Vytvořit kontakt'}
          </Button>
        </form>
        </div>

        <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-slate-900'>Kontakty</h2>
            <p className='mt-1 text-sm text-slate-500'>Vyberte kontakt pro úpravu.</p>
          </div>

          {isContactsLoading ? (
            <p className='text-sm text-slate-500'>Načítám kontakty...</p>
          ) : (
            <div className='space-y-2'>
              {(contacts ?? []).map((contact) => (
                <Button
                  key={contact.id}
                  type='button'
                  variant={selectedContact?.id === contact.id ? 'primary' : 'outline'}
                  className='w-full justify-start'
                  onClick={() => setSelectedContact(contact)}
                >
                  {contact.firstName} {contact.lastName} ({contact.email})
                </Button>
              ))}
              {!contacts?.length && <p className='text-sm text-slate-500'>Žádné kontakty.</p>}
            </div>
          )}

          {selectedContact && (
            <form onSubmit={handleEditSubmit(onEditSubmit)} className='mt-6 space-y-4 border-t border-slate-200 pt-6'>
              <h3 className='font-semibold text-slate-900'>Upravit kontakt</h3>
              <Input label='Jméno' error={editErrors.firstName?.message} {...registerEdit('firstName', required)} />
              <Input label='Příjmení' error={editErrors.lastName?.message} {...registerEdit('lastName', required)} />
              <Input label='Firma' error={editErrors.company?.message} {...registerEdit('company')} />
              <Input label='Telefon' error={editErrors.phone?.message} {...registerEdit('phone', required)} />
              <Input label='Email' type='email' error={editErrors.email?.message} {...registerEdit('email', required)} />
              {editErrors.root && <p className='text-sm text-red-500'>{editErrors.root.message}</p>}
              <Button type='submit' variant='primary' isLoading={updateMutation.isPending}>
                {updateMutation.isPending ? 'Ukládám...' : 'Uložit změny'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

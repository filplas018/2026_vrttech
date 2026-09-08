

import { Button, Input } from '@/components';
import { useRegisterMutation } from '@/features/auth/hooks';
import { registerSchema, type RegisterPayload } from '@/features/auth/schemas';
import { useAllUsers } from '@/features/projects/hooks/useAllUsers';
import type { UserProfileResponse } from '@/features/users/types';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import { handleFormErrors } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type UpdateUserPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

const updateUser = async (userId: number, data: UpdateUserPayload) => {
  const response = await apiClient.patch<UserProfileResponse>(`/users/${userId}/`, {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    ...(data.password
      ? { password: data.password, confirm_password: data.confirmPassword }
      : {}),
  });
  return response.data;
};

export const UsersSettingsPage = () => {
  const registerMutation = useRegisterMutation();
  const queryClient = useQueryClient();
  const { data: users, isLoading: isUsersLoading } = useAllUsers();
  const [selectedUser, setSelectedUser] = useState<UserProfileResponse | null>(null);
  const updateMutation = useMutation<UserProfileResponse, ApiError, { userId: number; data: UpdateUserPayload }>({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserPayload }) =>
      updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      toast.success('User updated successfully.');
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
  });
  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    setError: setUpdateError,
    clearErrors: clearUpdateErrors,
    formState: { errors: updateErrors },
  } = useForm<UpdateUserPayload>();

  useEffect(() => {
    if (selectedUser) {
      resetUpdate({
        email: selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        password: '',
        confirmPassword: '',
      });
    }
  }, [resetUpdate, selectedUser]);

  function onSubmit(data: RegisterPayload) {
    clearErrors('root');

    registerMutation.mutate(data, {
      onSuccess: () => {
        reset();
        toast.success('User created successfully.');
      },
      onError: (error) => {
        handleFormErrors<RegisterPayload>(error, setError, 'root', {
          first_name: 'firstName',
          last_name: 'lastName',
          confirm_password: 'confirmPassword',
        });
      },
    });
  }

  function onUpdateSubmit(data: UpdateUserPayload) {
    if (!selectedUser) return;
    clearUpdateErrors('root');
    if (data.password !== data.confirmPassword) {
      setUpdateError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    updateMutation.mutate(
      { userId: selectedUser.id, data },
      {
        onSuccess: () => setSelectedUser(null),
        onError: (error) => {
          handleFormErrors<UpdateUserPayload>(error, setUpdateError, 'root', {
            first_name: 'firstName',
            last_name: 'lastName',
            confirm_password: 'confirmPassword',
          });
        },
      },
    );
  }

  return (
    <main className='min-h-full bg-slate-50/70 p-4'>
      <section className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-2'>
        <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-slate-900'>Nastavení uživatel</h1>
          <p className='mt-1 text-sm text-slate-500'>Vytvoření nového uživatele</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            label='Jméno'
            error={errors.firstName?.message}
            autoComplete='given-name'
            {...register('firstName')}
          />
          <Input
            label='Příjmení'
            error={errors.lastName?.message}
            autoComplete='family-name'
            {...register('lastName')}
          />
          <Input
            label='Email'
            type='email'
            error={errors.email?.message}
            autoComplete='email'
            {...register('email')}
          />
          <Input
            label='Heslo'
            type='password'
            error={errors.password?.message}
            autoComplete='new-password'
            {...register('password')}
          />
          <Input
            label='Potvrzení hesla'
            type='password'
            error={errors.confirmPassword?.message}
            autoComplete='new-password'
            {...register('confirmPassword')}
          />

          {errors.root && <p className='text-sm text-red-500'>{errors.root.message}</p>}

          <Button type='submit' variant='primary' isLoading={registerMutation.isPending}>
            {registerMutation.isPending ? 'Vytvářím...' : 'Vytvořit uživatele'}
          </Button>
        </form>
        </div>

        <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-slate-900'>Uživatelé</h2>
            <p className='mt-1 text-sm text-slate-500'>Vyberte uživatele pro úpravu.</p>
          </div>

          {isUsersLoading ? (
            <p className='text-sm text-slate-500'>Načítám uživatele...</p>
          ) : (
            <div className='space-y-2'>
              {(users ?? []).map((user) => (
                <Button
                  key={user.id}
                  type='button'
                  variant={selectedUser?.id === user.id ? 'primary' : 'outline'}
                  className='w-full justify-start'
                  onClick={() => setSelectedUser(user)}
                >
                  {user.firstName} {user.lastName} ({user.email})
                </Button>
              ))}
              {!users?.length && <p className='text-sm text-slate-500'>Žádní uživatelé.</p>}
            </div>
          )}

          {selectedUser && (
            <form onSubmit={handleUpdateSubmit(onUpdateSubmit)} className='mt-6 space-y-4 border-t border-slate-200 pt-6'>
              <h3 className='font-semibold text-slate-900'>Upravit uživatele</h3>
              <Input label='Jméno' error={updateErrors.firstName?.message} {...registerUpdate('firstName', { required: 'First name is required' })} />
              <Input label='Příjmení' error={updateErrors.lastName?.message} {...registerUpdate('lastName', { required: 'Last name is required' })} />
              <Input label='Email' type='email' error={updateErrors.email?.message} {...registerUpdate('email', { required: 'Email is required' })} />
              <Input label='Nové heslo' type='password' error={updateErrors.password?.message} {...registerUpdate('password')} />
              <Input label='Potvrzení nového hesla' type='password' error={updateErrors.confirmPassword?.message} {...registerUpdate('confirmPassword')} />
              {updateErrors.root && <p className='text-sm text-red-500'>{updateErrors.root.message}</p>}
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

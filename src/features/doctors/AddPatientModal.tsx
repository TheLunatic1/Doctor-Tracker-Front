'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAddDoctorPatient } from './useDoctors';

const addPatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.coerce.number().int().min(0, 'Age must be >= 0').max(130),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(5, 'Valid phone number is required'),
  condition: z.string().min(2, 'Condition is required'),
  status: z.enum(['Active', 'Discharged', 'Critical']).default('Active'),
  notes: z.string().max(1000).optional(),
});

type AddPatientFormData = z.infer<typeof addPatientSchema>;

interface AddPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string;
  doctorName: string;
  defaultSpecialization?: string;
}

export default function AddPatientModal({
  open,
  onOpenChange,
  doctorId,
  doctorName,
  defaultSpecialization,
}: AddPatientModalProps) {
  const addMutation = useAddDoctorPatient(doctorId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPatientFormData>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      name: '',
      age: 35,
      gender: 'Male',
      phone: '',
      condition: defaultSpecialization || 'Routine Checkup',
      status: 'Active',
      notes: '',
    },
  });

  const onSubmit = async (data: AddPatientFormData) => {
    try {
      await addMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch {
      // handled in mutation
    }
  };

  const isLoading = addMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Add Patient under {doctorName}
          </DialogTitle>
          <DialogDescription>
            Register a new patient and assign them directly to this doctor&apos;s active list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Patient Full Name *</label>
            <Input
              {...register('name')}
              placeholder="e.g. John Doe"
              className={errors.name ? 'border-rose-500' : ''}
            />
            {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Age *</label>
              <Input
                type="number"
                {...register('age')}
                min="0"
                max="130"
                className={errors.age ? 'border-rose-500' : ''}
              />
              {errors.age && <p className="text-xs text-rose-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Gender *</label>
              <select
                {...register('gender')}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
            <Input
              {...register('phone')}
              placeholder="+880 1711 000000"
              className={errors.phone ? 'border-rose-500' : ''}
            />
            {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Medical Condition *</label>
              <Input
                {...register('condition')}
                placeholder="e.g. Hypertension"
                className={errors.condition ? 'border-rose-500' : ''}
              />
              {errors.condition && (
                <p className="text-xs text-rose-500">{errors.condition.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Status *</label>
              <select
                {...register('status')}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Clinical Notes</label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Initial symptoms or consultation notes..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

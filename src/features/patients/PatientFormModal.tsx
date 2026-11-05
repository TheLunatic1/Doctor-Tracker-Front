'use client';

import React, { useEffect, useMemo } from 'react';
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
import { Patient, Doctor } from '@/types';
import { useCreatePatient, useUpdatePatient } from './usePatients';
import { useDoctors } from '@/features/doctors/useDoctors';

const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.coerce.number().int().min(0, 'Age must be >= 0').max(130),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(5, 'Valid phone number is required'),
  condition: z.string().min(2, 'Medical condition is required'),
  doctor: z.string().min(1, 'Assigned doctor is required'),
  status: z.enum(['Active', 'Discharged', 'Critical']).default('Active'),
  notes: z.string().max(1000).optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientToEdit?: Patient | null;
}

const COMMON_CONDITIONS = [
  'Cardiology',
  'Hypertension',
  'Neurology',
  'Migraine',
  'Pediatrics',
  'Orthopedics',
  'Osteoarthritis',
  'Dermatology',
  'General Checkup',
  'Type 2 Diabetes',
  'Oncology',
  'Gynecology',
];

export default function PatientFormModal({
  open,
  onOpenChange,
  patientToEdit,
}: PatientFormModalProps) {
  const isEdit = !!patientToEdit;
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient(patientToEdit?._id || '');

  // Fetch doctors list for assigned doctor dropdown
  const { data: doctorsData } = useDoctors({ limit: 100 });
  const doctorsList = useMemo(() => doctorsData?.data || [], [doctorsData?.data]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      age: 30,
      gender: 'Male',
      phone: '',
      condition: 'General Checkup',
      doctor: '',
      status: 'Active',
      notes: '',
    },
  });

  useEffect(() => {
    if (patientToEdit) {
      const docId =
        typeof patientToEdit.doctor === 'object'
          ? (patientToEdit.doctor as Doctor)._id
          : (patientToEdit.doctor as string);

      reset({
        name: patientToEdit.name,
        age: patientToEdit.age,
        gender: patientToEdit.gender,
        phone: patientToEdit.phone,
        condition: patientToEdit.condition,
        doctor: docId || '',
        status: patientToEdit.status,
        notes: patientToEdit.notes || '',
      });
    } else {
      reset({
        name: '',
        age: 30,
        gender: 'Male',
        phone: '',
        condition: 'General Checkup',
        doctor: doctorsList[0]?._id || '',
        status: 'Active',
        notes: '',
      });
    }
  }, [patientToEdit, reset, open, doctorsList]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (isEdit && patientToEdit) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch {
      // handled in mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEdit ? 'Edit Patient Information' : 'Register New Patient'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the clinical records and assigned care provider for this patient.'
              : 'Add a new patient record to the healthcare management database.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Patient Full Name *</label>
            <Input
              {...register('name')}
              placeholder="e.g. Ayesha Rahman"
              className={errors.name ? 'border-rose-500' : ''}
            />
            {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="patient-age" className="text-xs font-semibold text-slate-700">Age *</label>
              <Input
                id="patient-age"
                aria-label="Age"
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Assigned Doctor *</label>
            <select
              {...register('doctor')}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Select Doctor...</option>
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization} - {doc.hospital})
                </option>
              ))}
            </select>
            {errors.doctor && <p className="text-xs text-rose-500">{errors.doctor.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Medical Condition *</label>
              <select
                {...register('condition')}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {COMMON_CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <p className="text-xs text-rose-500">{errors.condition.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Clinical Status *</label>
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
            <label className="text-xs font-semibold text-slate-700">Notes & Observations</label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Clinical summary or diagnosis..."
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
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Register Patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

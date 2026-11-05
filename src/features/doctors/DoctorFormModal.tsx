'use client';

import React, { useEffect } from 'react';
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
import { Doctor } from '@/types';
import { useCreateDoctor, useUpdateDoctor } from './useDoctors';

const doctorFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  specialization: z.string().min(2, 'Specialization is required'),
  hospital: z.string().min(2, 'Hospital is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  yearsExperience: z.coerce.number().min(0).max(60),
  rating: z.coerce.number().min(1).max(5),
  bio: z.string().max(1000).optional(),
});

type DoctorFormData = z.infer<typeof doctorFormSchema>;

interface DoctorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorToEdit?: Doctor | null;
}

const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Oncology',
  'Gynecology',
  'Psychiatry',
  'Ophthalmology',
  'Gastroenterology',
  'Endocrinology',
];

const HOSPITALS = [
  'Apollo Hospital',
  'City Health Hospital',
  'National Medical Center',
  'Care Medical Center',
  'Skin Care Hospital',
  'Health Plus Hospital',
  'Square Hospital',
  'United Hospital',
  'Evercare Hospital',
  'Central Hospital',
];

export default function DoctorFormModal({
  open,
  onOpenChange,
  doctorToEdit,
}: DoctorFormModalProps) {
  const isEdit = !!doctorToEdit;
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor(doctorToEdit?._id || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: '',
      specialization: 'Cardiology',
      hospital: 'Apollo Hospital',
      phone: '',
      email: '',
      qualification: 'MBBS, MD',
      yearsExperience: 8,
      rating: 4.8,
      bio: '',
    },
  });

  useEffect(() => {
    if (doctorToEdit) {
      reset({
        name: doctorToEdit.name,
        specialization: doctorToEdit.specialization,
        hospital: doctorToEdit.hospital,
        phone: doctorToEdit.phone,
        email: doctorToEdit.email,
        qualification: doctorToEdit.qualification || 'MBBS, MD',
        yearsExperience: doctorToEdit.yearsExperience || 5,
        rating: doctorToEdit.rating || 4.8,
        bio: doctorToEdit.bio || '',
      });
    } else {
      reset({
        name: '',
        specialization: 'Cardiology',
        hospital: 'Apollo Hospital',
        phone: '',
        email: '',
        qualification: 'MBBS, MD',
        yearsExperience: 8,
        rating: 4.8,
        bio: '',
      });
    }
  }, [doctorToEdit, reset, open]);

  const onSubmit = async (data: DoctorFormData) => {
    try {
      if (isEdit && doctorToEdit) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch {
      // error handled in mutation hook
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEdit ? 'Edit Doctor Profile' : 'Register New Doctor'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the clinical details and contact information for this doctor.'
              : 'Add a new medical professional to your healthcare provider registry.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Doctor Full Name *</label>
              <Input
                {...register('name')}
                placeholder="Dr. Full Name"
                className={errors.name ? 'border-rose-500' : ''}
              />
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Specialization *</label>
              <select
                {...register('specialization')}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="text-xs text-rose-500">{errors.specialization.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Hospital *</label>
              <select
                {...register('hospital')}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {HOSPITALS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              {errors.hospital && (
                <p className="text-xs text-rose-500">{errors.hospital.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address *</label>
              <Input
                type="email"
                {...register('email')}
                placeholder="doctor@hospital.com"
                className={errors.email ? 'border-rose-500' : ''}
              />
              {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
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
              <label className="text-xs font-semibold text-slate-700">Qualification *</label>
              <Input
                {...register('qualification')}
                placeholder="e.g. MBBS, FCPS, MD"
                className={errors.qualification ? 'border-rose-500' : ''}
              />
              {errors.qualification && (
                <p className="text-xs text-rose-500">{errors.qualification.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Years Experience</label>
              <Input
                type="number"
                {...register('yearsExperience')}
                placeholder="5"
                min="0"
                max="60"
              />
              {errors.yearsExperience && (
                <p className="text-xs text-rose-500">{errors.yearsExperience.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Professional Bio</label>
              <textarea
                {...register('bio')}
                rows={3}
                placeholder="Short description of medical expertise and clinical interests..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
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
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Doctor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

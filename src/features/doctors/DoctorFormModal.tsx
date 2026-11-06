'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
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
import { compressAndResizeImage, CLINICAL_AVATARS } from '@/lib/imageUtils';
import { Upload, Camera, Image as ImageIcon, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

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
  avatar: z.string().optional().or(z.literal('')),
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

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
      avatar: '',
    },
  });

  const doctorNameWatch = watch('name');

  useEffect(() => {
    if (doctorToEdit) {
      const initialAvatar = doctorToEdit.avatar || '';
      setAvatarPreview(initialAvatar);
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
        avatar: initialAvatar,
      });
    } else {
      setAvatarPreview('');
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
        avatar: '',
      });
    }
    setShowGallery(false);
  }, [doctorToEdit, reset, open]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    try {
      setIsUploading(true);
      const optimizedDataUrl = await compressAndResizeImage(file, 400, 400, 0.85);
      setAvatarPreview(optimizedDataUrl);
      setValue('avatar', optimizedDataUrl, { shouldDirty: true });
      toast.success('Doctor photo uploaded and optimized');
    } catch (err: any) {
      toast.error(err.message || 'Failed to process image');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectPreset = (url: string) => {
    setAvatarPreview(url);
    setValue('avatar', url, { shouldDirty: true });
    toast.success('Clinical portrait selected');
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setValue('avatar', '', { shouldDirty: true });
    toast.info('Profile picture removed (initials badge will be shown)');
  };

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
              ? 'Update clinical details, avatar, and contact information for this doctor.'
              : 'Add a new medical professional to your healthcare provider registry.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Profile Picture Upload & Selector Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                {avatarPreview ? (
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-white">
                    <Image
                      src={avatarPreview}
                      alt="Doctor Avatar"
                      fill
                      className="object-cover"
                      unoptimized={avatarPreview.startsWith('data:')}
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-black text-2xl flex items-center justify-center ring-4 ring-white shadow-md">
                    {doctorNameWatch
                      ? doctorNameWatch.replace('Dr. ', '').slice(0, 2).toUpperCase()
                      : 'DR'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold gap-1"
                  title="Upload New Photo"
                >
                  <Camera className="h-4 w-4" />
                  <span>Change</span>
                </button>
              </div>

              {/* Upload Actions & Controls */}
              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 gap-1.5 rounded-xl text-xs font-semibold bg-white border-slate-200 hover:border-sky-400"
                    disabled={isUploading}
                  >
                    <Upload className="h-3.5 w-3.5 text-sky-600" />
                    {isUploading ? 'Optimizing...' : 'Upload Photo'}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGallery((prev) => !prev)}
                    className="h-8 gap-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                    {showGallery ? 'Hide Portraits' : 'Choose from Library'}
                  </Button>

                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      className="h-8 gap-1 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Upload a custom photo (auto-compressed to high-res square avatar) or choose from our clinical library.
                </p>
              </div>
            </div>

            {/* Clinical Portrait Gallery Drawer */}
            {showGallery && (
              <div className="pt-3 border-t border-slate-200/80 space-y-2 animate-in fade-in duration-200">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Select Pre-Installed Clinical Portrait:
                </p>
                <div className="grid grid-cols-8 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200/60">
                  {CLINICAL_AVATARS.map((url, idx) => {
                    const isSelected = avatarPreview === url;
                    return (
                      <button
                        key={url}
                        type="button"
                        onClick={() => handleSelectPreset(url)}
                        className={`relative h-11 w-11 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          isSelected
                            ? 'border-sky-600 ring-2 ring-sky-300 shadow-sm'
                            : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                        }`}
                        title={`Clinical Portrait #${idx + 1}`}
                      >
                        <Image
                          src={url}
                          alt={`Portrait ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <span className="absolute inset-0 bg-sky-600/40 flex items-center justify-center text-white">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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

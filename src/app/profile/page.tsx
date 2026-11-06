'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Lock,
  CheckCircle2,
  LogOut,
  Building2,
  Stethoscope,
  Phone,
  Award,
  Clock,
  FileText,
  Save,
  Server,
  Terminal,
  Shield,
  Heart,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, checkAuth } = useAuth();

  const role = user?.role || 'admin';

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [hospital, setHospital] = useState('Apollo Hospital');
  const [qualification, setQualification] = useState('MBBS, MDs');
  const [yearsExperience, setYearsExperience] = useState(15);
  const [bio, setBio] = useState('');
  const [notes, setNotes] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Sync initial state from user and linked profiles
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (user.doctorProfile) {
        setPhone(user.doctorProfile.phone || '');
        setSpecialization(user.doctorProfile.specialization || 'Cardiology');
        setHospital(user.doctorProfile.hospital || 'Apollo Hospital');
        setQualification(user.doctorProfile.qualification || 'MBBS, MDs');
        setYearsExperience(user.doctorProfile.yearsExperience || 15);
        setBio(user.doctorProfile.bio || '');
      } else if (user.patientProfile) {
        setPhone(user.patientProfile.phone || '');
        setNotes(user.patientProfile.notes || '');
      } else {
        setPhone('+880 1711 000000');
      }
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword) {
      if (!currentPassword) {
        toast.error('Please enter your current password to set a new password.');
        return;
      }
      if (newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('New password and confirmation do not match.');
        return;
      }
    }

    try {
      setIsSaving(true);
      const payload: Record<string, unknown> = {
        name,
        phone,
      };

      if (role === 'doctor') {
        payload.specialization = specialization;
        payload.hospital = hospital;
        payload.qualification = qualification;
        payload.yearsExperience = Number(yearsExperience);
        payload.bio = bio;
      } else if (role === 'patient') {
        payload.notes = notes;
      }

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data?.success) {
        toast.success('Profile and settings updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await checkAuth();
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: { message?: string }; message?: string } } }).response?.data?.error?.message ||
          (err as { response?: { data?: { error?: { message?: string }; message?: string } } }).response?.data?.message ||
          'Failed to update profile.'
        : 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const roleTitles = {
    admin: {
      title: 'Admin Profile & System Settings',
      subtitle: 'Account credentials, security protocols, and operational diagnostics',
      badge: 'Super Administrator',
    },
    doctor: {
      title: 'Physician Profile & Clinical Settings',
      subtitle: 'Manage your clinical credentials, specialization, and practice details',
      badge: 'Clinical Physician',
    },
    staff: {
      title: 'Staff Profile & Desk Settings',
      subtitle: 'Admissions coordinator identity, desk parameters, and shift settings',
      badge: 'Admissions Staff',
    },
    patient: {
      title: 'Patient Profile & Health Details',
      subtitle: 'Personal care contact info, assigned physician, and emergency details',
      badge: 'Registered Patient',
    },
  };

  const currentMeta = roleTitles[role] || roleTitles.admin;

  return (
    <AppShell title={currentMeta.title} subtitle={currentMeta.subtitle}>
      <div className="max-w-5xl space-y-6 pb-12">
        {/* User Card */}
        <Card className="p-6 md:p-8 border-slate-100 shadow-sm bg-gradient-to-r from-white via-white to-sky-50/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-extrabold text-2xl shadow-xl shadow-sky-500/20 ring-4 ring-white">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'DT'}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {user?.name || 'User Profile'}
                  </h1>
                  <Badge variant="blue" className="text-xs px-2.5 py-0.5">
                    {currentMeta.badge}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Authenticated Role Active: {role.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              className="gap-2 text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Profile Editing Form */}
        <Card className="border-slate-100 shadow-sm p-6 md:p-8 bg-white">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Profile & Account Information</h2>
                <p className="text-xs text-slate-500">Update your clinical identity, contact details, and account credentials.</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                Role: {role.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="h-10 text-xs"
                />
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  Email Address (Primary Account ID)
                </label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="h-10 text-xs bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  Contact Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711 000000"
                  className="h-10 text-xs"
                />
              </div>

              {/* Role specific fields */}
              {role === 'doctor' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                      Specialization
                    </label>
                    <Input
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Cardiology"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      Hospital / Clinic Affiliation
                    </label>
                    <Input
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="e.g. Apollo Hospital"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-slate-400" />
                      Medical Qualifications
                    </label>
                    <Input
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. MBBS, MD, FCPS"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Years of Clinical Experience
                    </label>
                    <Input
                      type="number"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(Number(e.target.value))}
                      min={1}
                      max={60}
                      className="h-10 text-xs"
                    />
                  </div>
                </>
              )}

              {role === 'patient' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      Medical Record Number (MRN)
                    </label>
                    <Input
                      value={user?.patientProfile?.medicalRecordNumber || 'KNI0001'}
                      disabled
                      className="h-10 text-xs bg-slate-50 text-slate-500 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-rose-500" />
                      Primary Diagnosis / Condition
                    </label>
                    <Input
                      value={user?.patientProfile?.condition || 'Hypertension'}
                      disabled
                      className="h-10 text-xs bg-slate-50 text-slate-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Bio or Notes Textarea */}
            {role === 'doctor' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Professional Biography & Clinical Scope
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="Describe your medical expertise, patient philosophy, and clinic timings..."
                />
              </div>
            )}

            {role === 'patient' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Personal Health Notes & Allergies
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="Record known allergies, routine medication notes, or dietary constraints..."
                />
              </div>
            )}

            {/* Password Update Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Change Password (Optional)</h3>
              </div>
              <p className="text-xs text-slate-500">Leave these fields blank if you do not wish to modify your account password.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="h-10 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="gap-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md font-semibold text-xs h-10 px-6"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Security & Access Diagnostics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-100 shadow-sm p-6 bg-white space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Authentication Security</h2>
                <p className="text-xs text-slate-500">JWT and session token architecture</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Session Token Type</span>
                <span className="font-semibold text-slate-900">JWT (JSON Web Token)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Cookie Storage</span>
                <span className="font-semibold text-emerald-700">httpOnly; SameSite=Lax; Secure</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Token Lifespan</span>
                <span className="font-semibold text-slate-900">7 Days (Auto-renewing)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500 font-medium">Password Hash</span>
                <span className="font-semibold text-slate-900">Bcrypt (12 rounds)</span>
              </div>
            </div>
          </Card>

          <Card className="border-slate-100 shadow-sm p-6 bg-white space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Deployment & Network</h2>
                <p className="text-xs text-slate-500">Production environment parameters</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Environment</span>
                <span className="font-semibold text-slate-900">Production (Docker Compose)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Public Funnel Host</span>
                <span className="font-semibold text-sky-700">toha.tail2c2947.ts.net:8443</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Database Engine</span>
                <span className="font-semibold text-slate-900">MongoDB 7.0 (Mongoose)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500 font-medium">Query Plan Status</span>
                <span className="font-semibold text-emerald-700">100% IXSCAN Verified</span>
              </div>
            </div>
          </Card>
        </div>

        {/* System Activity Summary */}
        <Card className="border-slate-100 shadow-sm p-6 bg-white space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Information & Diagnostics</h2>
              <p className="text-xs text-slate-500">Clinical registry operational logs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Node Runtime</p>
              <p className="text-lg font-bold text-slate-900 mt-1">Node.js 20.x Alpine</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">LTS Containerized</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Next.js Framework</p>
              <p className="text-lg font-bold text-slate-900 mt-1">Next.js 15.5 App Router</p>
              <p className="text-[11px] text-sky-600 mt-0.5">React 19 Concurrent</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Database Indexing</p>
              <p className="text-lg font-bold text-slate-900 mt-1">Compound Indexes</p>
              <p className="text-[11px] text-indigo-600 mt-0.5">Optimized Prefixes</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Doctor, Patient, ApiResponse } from '@/types';
import { toast } from 'sonner';

export interface DoctorFilters {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  scope?: string;
}

export function useDoctors(filters: DoctorFilters = {}) {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.limit) params.set('limit', filters.limit.toString());
      if (filters.search) params.set('search', filters.search);
      if (filters.specialization && filters.specialization !== 'all') {
        params.set('specialization', filters.specialization);
      }
      if (filters.hospital && filters.hospital !== 'all') {
        params.set('hospital', filters.hospital);
      }
      if (filters.status && filters.status !== 'all') {
        params.set('status', filters.status);
      }
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.scope) params.set('scope', filters.scope);

      const res = await api.get<ApiResponse<Doctor[]>>(`/doctors?${params.toString()}`);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useDoctorPatients(id: string, params: { page?: number; limit?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['doctor-patients', id, params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params.page) query.set('page', params.page.toString());
      if (params.limit) query.set('limit', params.limit.toString());
      if (params.search) query.set('search', params.search);

      const res = await api.get<ApiResponse<Patient[]>>(`/doctors/${id}/patients?${query.toString()}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Doctor>) => {
      const res = await api.post<ApiResponse<Doctor>>('/doctors', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Doctor registered successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create doctor');
    },
  });
}

export function useUpdateDoctor(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Doctor>) => {
      const res = await api.put<ApiResponse<Doctor>>(`/doctors/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', id] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor profile updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update doctor');
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cascade }: { id: string; cascade?: boolean }) => {
      const res = await api.delete(`/doctors/${id}${cascade ? '?cascade=true' : ''}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Doctor deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete doctor');
    },
  });
}

export function useAddDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient>) => {
      const res = await api.post<ApiResponse<Patient>>(`/doctors/${doctorId}/patients`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-patients', doctorId] });
      queryClient.invalidateQueries({ queryKey: ['doctor', doctorId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Patient added under doctor successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add patient');
    },
  });
}

export function useDeleteDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientId: string) => {
      const res = await api.delete(`/doctors/${doctorId}/patients/${patientId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-patients', doctorId] });
      queryClient.invalidateQueries({ queryKey: ['doctor', doctorId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Patient removed from doctor successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete patient');
    },
  });
}

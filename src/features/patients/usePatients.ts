import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Patient, ApiResponse } from '@/types';
import { toast } from 'sonner';

export interface PatientFilters {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctorId?: string;
  gender?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
}

export function usePatients(filters: PatientFilters = {}) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.limit) params.set('limit', filters.limit.toString());
      if (filters.search) params.set('search', filters.search);
      if (filters.condition && filters.condition !== 'all') {
        params.set('condition', filters.condition);
      }
      if (filters.doctorId && filters.doctorId !== 'all') {
        params.set('doctorId', filters.doctorId);
      }
      if (filters.gender && filters.gender !== 'all') {
        params.set('gender', filters.gender);
      }
      if (filters.status && filters.status !== 'all') {
        params.set('status', filters.status);
      }
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      if (filters.sort) params.set('sort', filters.sort);

      const res = await api.get<ApiResponse<Patient[]>>(`/patients?${params.toString()}`);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient>) => {
      const res = await api.post<ApiResponse<Patient>>('/patients', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Patient registered successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to register patient');
    },
  });
}

export function useUpdatePatient(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient>) => {
      const res = await api.put<ApiResponse<Patient>>(`/patients/${patientId}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-patients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Patient details updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update patient');
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/patients/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-patients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Patient record deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete patient');
    },
  });
}

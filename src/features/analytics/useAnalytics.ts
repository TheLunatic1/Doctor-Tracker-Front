import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  AnalyticsOverview,
  TopDoctor,
  TimelineDataPoint,
  ConditionDistribution,
  SpecializationDistribution,
  ApiResponse,
  Doctor,
  Patient,
} from '@/types';

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview');
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function usePatientsPerDoctor(limit: number = 5) {
  return useQuery({
    queryKey: ['analytics', 'patients-per-doctor', limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<TopDoctor[]>>(
        `/analytics/patients-per-doctor?limit=${limit}`
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useTimeline(range: string = '6m', groupBy?: string) {
  return useQuery({
    queryKey: ['analytics', 'timeline', range, groupBy],
    queryFn: async () => {
      const query = new URLSearchParams({ range });
      if (groupBy) query.set('groupBy', groupBy);
      const res = await api.get<ApiResponse<TimelineDataPoint[]>>(
        `/analytics/timeline?${query.toString()}`
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useConditionDistribution() {
  return useQuery({
    queryKey: ['analytics', 'conditions'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ConditionDistribution[]>>('/analytics/conditions');
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useSpecializationDistribution() {
  return useQuery({
    queryKey: ['analytics', 'specializations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SpecializationDistribution[]>>(
        '/analytics/specializations'
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['analytics', 'recent'],
    queryFn: async () => {
      const res = await api.get<
        ApiResponse<{ recentDoctors: Doctor[]; recentPatients: Patient[] }>
      >('/analytics/recent');
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

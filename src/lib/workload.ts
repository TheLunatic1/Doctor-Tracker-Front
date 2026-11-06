export interface WorkloadInfo {
  label: 'Available' | 'Optimal' | 'High Load' | 'Overcapacity';
  percentage: number;
  badgeClass: string;
  dotColor: string;
  barColor: string;
  description: string;
}

export function getDoctorWorkload(patientCount: number = 0): WorkloadInfo {
  const count = Math.max(0, patientCount);
  const maxBenchmark = 20; // Clinical benchmark of active assigned patients
  const percentage = Math.min(100, Math.round((count / maxBenchmark) * 100));

  if (count <= 5) {
    return {
      label: 'Available',
      percentage,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      barColor: 'bg-emerald-500',
      description: 'Capacity open for new clinical admissions',
    };
  }
  if (count <= 12) {
    return {
      label: 'Optimal',
      percentage,
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      dotColor: 'bg-sky-500',
      barColor: 'bg-sky-500',
      description: 'Ideal physician patient ratio',
    };
  }
  if (count <= 18) {
    return {
      label: 'High Load',
      percentage,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
      barColor: 'bg-amber-500',
      description: 'Approaching maximum physician shift capacity',
    };
  }
  return {
    label: 'Overcapacity',
    percentage,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: 'bg-rose-500',
    barColor: 'bg-rose-500',
    description: 'Requires clinical redistribution',
  };
}

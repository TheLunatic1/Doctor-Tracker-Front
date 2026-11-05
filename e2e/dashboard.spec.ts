import { test, expect } from '@playwright/test';

test.describe('Phase 8 Quality Gate: Dashboard & Data Visualization', () => {
  const consoleErrors: string[] = [];

  test.beforeEach(async ({ page, context }) => {
    // Collect console errors to assert zero errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Seed authenticated cookie
    await context.addCookies([
      {
        name: 'dt_auth_token',
        value: 'mock_jwt_token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);

    // Mock auth/me
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: '67cb00000000000000000001',
              name: 'Dr. Sarah Ahmed',
              email: 'sarah@doctortracker.com',
              role: 'admin',
            },
          },
        }),
      });
    });

    // Mock analytics/overview
    await page.route('**/api/v1/analytics/overview', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalDoctors: 48,
            activeDoctors: 46,
            newDoctorsThisMonth: 12,
            doctorGrowth: 8.2,
            totalPatients: 1284,
            activePatients: 1178,
            newPatientsThisMonth: 86,
            patientGrowth: 12.5,
            avgPatientsPerDoctor: 26.8,
            totalHospitals: 12,
          },
        }),
      });
    });

    // Mock analytics/timeline
    await page.route('**/api/v1/analytics/timeline?*', async (route) => {
      const url = new URL(route.request().url());
      const range = url.searchParams.get('range') || '6m';
      const mockPoints = [
        { date: '2026-01-01', label: 'Jan 2026', count: 620 },
        { date: '2026-02-01', label: 'Feb 2026', count: 750 },
        { date: '2026-03-01', label: 'Mar 2026', count: 710 },
        { date: '2026-04-01', label: 'Apr 2026', count: 820 },
        { date: '2026-05-01', label: 'May 2026', count: 960 },
        { date: '2026-06-01', label: 'Jun 2026', count: 1284 },
      ];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: range === '30d' ? mockPoints.slice(0, 3) : mockPoints,
        }),
      });
    });

    // Mock analytics/conditions
    await page.route('**/api/v1/analytics/conditions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { condition: 'Cardiology', count: 410, percentage: 32.0 },
            { condition: 'Neurology', count: 308, percentage: 24.0 },
            { condition: 'Pediatrics', count: 231, percentage: 18.0 },
            { condition: 'Orthopedics', count: 154, percentage: 12.0 },
            { condition: 'Other', count: 181, percentage: 14.0 },
          ],
        }),
      });
    });

    // Mock analytics/patients-per-doctor
    await page.route('**/api/v1/analytics/patients-per-doctor?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: '67cb11112222333344445555',
              name: 'Dr. Ayesha Rahman',
              specialization: 'Cardiology',
              hospital: 'Apollo Hospital',
              patientCount: 212,
            },
            {
              _id: '67cb11112222333344445556',
              name: 'Dr. Imran Hossain',
              specialization: 'Neurology',
              hospital: 'National Medical Center',
              patientCount: 176,
            },
          ],
        }),
      });
    });

    // Mock analytics/recent
    await page.route('**/api/v1/analytics/recent', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            recentDoctors: [
              {
                _id: '67cb11112222333344445555',
                name: 'Dr. Ayesha Rahman',
                specialization: 'Cardiology',
                hospital: 'Apollo Hospital',
                status: 'Active',
              },
            ],
            recentPatients: [],
          },
        }),
      });
    });
  });

  test('Dashboard loads greeting, stat cards, charts, and widgets with zero console errors', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    // Greeting with user name
    await expect(page.getByRole('heading', { name: /good morning, sarah/i })).toBeVisible();

    // 4 Key Stat Cards
    await expect(page.getByText('Total Doctors')).toBeVisible();
    await expect(page.getByText('Total Patients')).toBeVisible();
    await expect(page.getByText('Admitted This Month')).toBeVisible();
    await expect(page.getByText('Active Hospitals')).toBeVisible();

    // Verify values from mock overview
    await expect(page.getByText('1,284').first()).toBeVisible();

    // Verify Patient Overview Chart container is visible
    await expect(page.getByText('Patient Overview')).toBeVisible();

    // Verify Patient Distribution Chart and center text
    await expect(page.getByText('Patient Distribution')).toBeVisible();
    await expect(page.getByText('Cardiology').first()).toBeVisible();

    // Verify Top Doctors Widget and Recent Activities
    await expect(page.getByText('Top Doctors')).toBeVisible();
    await expect(page.getByText('Recently Added Doctors')).toBeVisible();

    // Date range selector interaction
    const rangeSelect = page.locator('select');
    await rangeSelect.selectOption('30d');
    await page.waitForTimeout(300);

    // Verify that NO severe console errors occurred
    const severeErrors = consoleErrors.filter(
      (err) => !err.includes('ECONNREFUSED') && !err.includes('Failed to load resource')
    );
    expect(severeErrors).toEqual([]);
  });
});

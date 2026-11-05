import { test } from '@playwright/test';
import path from 'path';

test.describe('Responsive Screenshot & Visual Audit Suite', () => {
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 },
  ];

  test.beforeEach(async ({ page, context }) => {
    // Authenticated cookie
    await context.addCookies([
      {
        name: 'dt_auth_token',
        value: 'mock_jwt_token_screenshots',
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
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { date: '2026-01-01', label: 'Jan', count: 520 },
            { date: '2026-02-01', label: 'Feb', count: 760 },
            { date: '2026-03-01', label: 'Mar', count: 680 },
            { date: '2026-04-01', label: 'Apr', count: 810 },
            { date: '2026-05-01', label: 'May', count: 940 },
            { date: '2026-06-01', label: 'Jun', count: 1284 },
          ],
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
            {
              _id: '67cb11112222333344445557',
              name: 'Dr. Nadia Karim',
              specialization: 'Pediatrics',
              hospital: 'City Health Hospital',
              patientCount: 143,
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
              {
                _id: '67cb11112222333344445556',
                name: 'Dr. Imran Hossain',
                specialization: 'Neurology',
                hospital: 'National Medical Center',
                status: 'Active',
              },
            ],
            recentPatients: [],
          },
        }),
      });
    });

    // Mock doctors
    await page.route('**/api/v1/doctors?*', async (route) => {
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
              phone: '+880 1711 223344',
              email: 'ayesha@apollo.com',
              qualification: 'MBBS, MD',
              yearsExperience: 8,
              rating: 4.9,
              status: 'Active',
              patientCount: 42,
              createdAt: '2026-01-15T00:00:00.000Z',
            },
            {
              _id: '67cb11112222333344445556',
              name: 'Dr. Imran Hossain',
              specialization: 'Neurology',
              hospital: 'National Medical Center',
              phone: '+880 1811 556677',
              email: 'imran@nmch.org',
              qualification: 'MBBS, MPH',
              yearsExperience: 12,
              rating: 4.8,
              status: 'Active',
              patientCount: 38,
              createdAt: '2026-02-03T00:00:00.000Z',
            },
            {
              _id: '67cb11112222333344445557',
              name: 'Dr. Nadia Karim',
              specialization: 'Pediatrics',
              hospital: 'City Health Hospital',
              phone: '+880 1700 112233',
              email: 'nadia@cityhealth.com',
              qualification: 'MBBS, FCPS',
              yearsExperience: 7,
              rating: 4.9,
              status: 'Active',
              patientCount: 35,
              createdAt: '2026-02-20T00:00:00.000Z',
            },
            {
              _id: '67cb11112222333344445558',
              name: 'Dr. Rahat Ahmed',
              specialization: 'Orthopedics',
              hospital: 'Care Medical Center',
              phone: '+880 1622 334455',
              email: 'rahat@caremed.com',
              qualification: 'MBBS, MS',
              yearsExperience: 10,
              rating: 4.7,
              status: 'Active',
              patientCount: 29,
              createdAt: '2026-03-10T00:00:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 8,
            total: 48,
            totalPages: 6,
            hasNext: true,
            hasPrev: false,
          },
        }),
      });
    });

    // Mock single doctor
    await page.route('**/api/v1/doctors/67cb11112222333344445555', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: '67cb11112222333344445555',
            name: 'Dr. Ayesha Rahman',
            specialization: 'Cardiology',
            hospital: 'Apollo Hospital',
            phone: '+880 1711 223344',
            email: 'ayesha@apollo.com',
            qualification: 'MBBS, MD',
            yearsExperience: 8,
            rating: 4.9,
            bio: 'Experienced cardiologist dedicated to providing the best care for heart health and overall wellness.',
            patientCount: 42,
            createdAt: '2026-01-15T00:00:00.000Z',
          },
        }),
      });
    });

    // Mock doctor's patients
    await page.route('**/api/v1/doctors/67cb11112222333344445555/patients?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: '67cb99998888777766665551',
              name: 'Ayesha Islam',
              age: 28,
              gender: 'Female',
              phone: '+880 1711 000001',
              condition: 'Heart Disease',
              status: 'Active',
              medicalRecordNumber: 'AI0001',
              admittedAt: '2026-01-15T00:00:00.000Z',
            },
            {
              _id: '67cb99998888777766665552',
              name: 'Imran Hossain',
              age: 34,
              gender: 'Male',
              phone: '+880 1711 000002',
              condition: 'Cardiac Checkup',
              status: 'Active',
              medicalRecordNumber: 'IH0002',
              admittedAt: '2026-02-03T00:00:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 8,
            total: 42,
            totalPages: 6,
            hasNext: true,
            hasPrev: false,
          },
        }),
      });
    });

    // Mock patients
    await page.route('**/api/v1/patients?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: '67cb22223333444455556666',
              name: 'Ayesha Rahman',
              age: 28,
              gender: 'Female',
              phone: '+880 1711 223344',
              condition: 'Cardiology',
              status: 'Active',
              medicalRecordNumber: 'AYR001',
              doctor: {
                _id: '67cb11112222333344445555',
                name: 'Dr. Ayesha Rahman',
                specialization: 'Cardiology',
                hospital: 'Apollo Hospital',
              },
              admittedAt: '2026-01-15T00:00:00.000Z',
            },
            {
              _id: '67cb22223333444455556667',
              name: 'Imran Hossain',
              age: 34,
              gender: 'Male',
              phone: '+880 1811 556677',
              condition: 'Neurology',
              status: 'Active',
              medicalRecordNumber: 'IMH002',
              doctor: {
                _id: '67cb11112222333344445556',
                name: 'Dr. Imran Hossain',
                specialization: 'Neurology',
                hospital: 'National Medical Center',
              },
              admittedAt: '2026-02-03T00:00:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 8,
            total: 1284,
            totalPages: 161,
            hasNext: true,
            hasPrev: false,
          },
        }),
      });
    });
  });

  for (const vp of viewports) {
    test(`Capture responsive screenshots for ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const screenshotsDir = path.resolve(process.cwd(), 'docs/screenshots');

      // 1. Landing Page
      await page.goto('/');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(screenshotsDir, `landing-${vp.name}.png`),
        fullPage: false,
      });

      // 2. Login Page
      await page.goto('/login');
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(screenshotsDir, `login-${vp.name}.png`),
        fullPage: false,
      });

      // 3. Dashboard Page
      await page.goto('/dashboard');
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(screenshotsDir, `dashboard-${vp.name}.png`),
        fullPage: false,
      });

      // 4. Doctors Page
      await page.goto('/doctors');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(screenshotsDir, `doctors-${vp.name}.png`),
        fullPage: false,
      });

      // 5. Doctor Detail Page
      await page.goto('/doctors/67cb11112222333344445555');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(screenshotsDir, `doctor-detail-${vp.name}.png`),
        fullPage: false,
      });

      // 6. Patients Page
      await page.goto('/patients');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(screenshotsDir, `patients-${vp.name}.png`),
        fullPage: false,
      });
    });
  }
});

import { test, expect } from '@playwright/test';

test.describe('Phase 6 Quality Gate: Doctors UI & Management Flows', () => {
  const mockDoctorId = '67cb11112222333344445555';
  const mockDoctors = [
    {
      _id: mockDoctorId,
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
  ];

  const mockPatients = [
    {
      _id: '67cb99998888777766665555',
      name: 'Patient Alice',
      age: 28,
      gender: 'Female',
      phone: '+880 1712 345678',
      condition: 'Hypertension',
      status: 'Active',
      medicalRecordNumber: 'PA0001',
      doctor: mockDoctorId,
      admittedAt: '2026-02-10T00:00:00.000Z',
      createdAt: '2026-02-10T00:00:00.000Z',
    },
  ];

  test.beforeEach(async ({ page, context }) => {
    // Add authenticated cookie
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

    // Mock /api/v1/auth/me
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: '67cb00000000000000000001',
              name: 'Admin User',
              email: 'admin@doctortracker.com',
              role: 'admin',
            },
          },
        }),
      });
    });

    // Mock GET /api/v1/doctors
    await page.route('**/api/v1/doctors?*', async (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search');
      let result = mockDoctors;
      if (search) {
        result = mockDoctors.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: result,
          meta: {
            page: 1,
            limit: 8,
            total: result.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        }),
      });
    });

    // Mock single doctor GET /api/v1/doctors/:id
    await page.route(`**/api/v1/doctors/${mockDoctorId}`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: mockDoctors[0],
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock GET /api/v1/doctors/:id/patients
    await page.route(`**/api/v1/doctors/${mockDoctorId}/patients?*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockPatients,
          meta: {
            page: 1,
            limit: 8,
            total: mockPatients.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        }),
      });
    });
  });

  test('Doctors list loads, displays doctors, and filters with search', async ({ page }) => {
    await page.goto('/doctors');

    await expect(page.getByRole('main').getByRole('heading', { name: /^doctors$/i })).toBeVisible();
    await expect(page.getByText('Dr. Ayesha Rahman').first()).toBeVisible();
    await expect(page.getByText('Dr. Imran Hossain').first()).toBeVisible();

    // Type in search bar
    const searchInput = page.getByPlaceholder(/search doctors/i);
    await searchInput.fill('Ayesha');
    await page.waitForTimeout(400);

    await expect(page.getByText('Dr. Ayesha Rahman').first()).toBeVisible();
  });

  test('Create Doctor dialog opens and submits new doctor', async ({ page }) => {
    await page.route('**/api/v1/doctors', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              _id: '67cb11112222333344449999',
              ...body,
              status: 'Active',
              patientCount: 0,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/doctors');
    await page.getByRole('button', { name: /add doctor/i }).click();

    // Dialog should be visible
    await expect(page.getByRole('heading', { name: /register new doctor/i })).toBeVisible();

    // Fill form
    await page.getByPlaceholder('Dr. Full Name').fill('Dr. Nadia Karim');
    await page.getByPlaceholder('doctor@hospital.com').fill('nadia@cityhealth.com');
    await page.getByPlaceholder('+880 1711 000000').fill('+880 1700 112233');

    // Submit
    await page.getByRole('button', { name: /create doctor/i }).click();

    // Dialog closes
    await expect(page.getByRole('heading', { name: /register new doctor/i })).not.toBeVisible();
  });

  test('Doctor Detail page renders profile, allows adding and deleting patient', async ({ page }) => {
    // Mock POST /api/v1/doctors/:id/patients
    await page.route(`**/api/v1/doctors/${mockDoctorId}/patients`, async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              _id: '67cb99998888777766669999',
              ...body,
              doctor: mockDoctorId,
              medicalRecordNumber: 'PN0002',
              admittedAt: new Date().toISOString(),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock DELETE /api/v1/doctors/:id/patients/:patientId
    await page.route(`**/api/v1/doctors/${mockDoctorId}/patients/*`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { deleted: true },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto(`/doctors/${mockDoctorId}`);

    // Verify Doctor details
    await expect(page.getByRole('main').getByRole('heading', { name: 'Dr. Ayesha Rahman' })).toBeVisible();
    await expect(page.getByText('Cardiology').first()).toBeVisible();
    await expect(page.getByText('Apollo Hospital').first()).toBeVisible();

    // Switch to Patients tab
    await page.getByRole('button', { name: /assigned patients/i }).click();
    await expect(page.getByText('Patient Alice')).toBeVisible();

    // Add Patient under doctor
    await page.getByRole('button', { name: /add patient/i }).first().click();
    await expect(page.getByRole('heading', { name: /add patient under/i })).toBeVisible();

    await page.getByPlaceholder(/john doe/i).fill('New Patient Bob');
    await page.getByPlaceholder('+880 1711 000000').fill('+880 1999 888777');
    await page.getByRole('button', { name: /^add patient$/i }).click();

    // Delete Patient confirmation
    const deleteBtn = page.getByTitle('Delete patient from doctor');
    await deleteBtn.click();

    await expect(page.getByRole('heading', { name: /remove patient/i })).toBeVisible();
    await page.getByRole('button', { name: /remove patient/i }).click();
  });
});

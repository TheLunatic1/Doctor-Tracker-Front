import { test, expect } from '@playwright/test';

test.describe('Phase 7 Quality Gate: Patients UI & Management Flows', () => {
  const mockPatientId = '67cb22223333444455556666';
  const mockPatients = [
    {
      _id: mockPatientId,
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
      createdAt: '2026-01-15T00:00:00.000Z',
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
      createdAt: '2026-02-03T00:00:00.000Z',
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
            },
          ],
        }),
      });
    });

    // Mock GET /api/v1/patients
    await page.route('**/api/v1/patients?*', async (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search');
      let result = mockPatients;
      if (search) {
        result = mockPatients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
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
  });

  test('Patients list loads, displays table, and filters with search', async ({ page }) => {
    await page.goto('/patients');

    await expect(page.getByRole('main').getByRole('heading', { name: /^patients$/i })).toBeVisible();
    await expect(page.getByText('Ayesha Rahman', { exact: true })).toBeVisible();
    await expect(page.getByText('Imran Hossain', { exact: true })).toBeVisible();
    await expect(page.getByText('AYR001')).toBeVisible();

    // Type in search bar
    const searchInput = page.getByPlaceholder(/search patients/i);
    await searchInput.fill('Ayesha');
    await page.waitForTimeout(400);

    await expect(page.getByText('Ayesha Rahman', { exact: true })).toBeVisible();
  });

  test('Edit patient dialog opens, updates fields, and submits changes', async ({ page }) => {
    // Mock PUT /api/v1/patients/:id
    await page.route(`**/api/v1/patients/${mockPatientId}`, async (route) => {
      if (route.request().method() === 'PUT') {
        const body = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              ...mockPatients[0],
              ...body,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/patients');

    // Click edit button on first row
    const editBtn = page.getByTitle('Edit patient').first();
    await editBtn.click();

    // Dialog opens
    await expect(page.getByRole('heading', { name: /edit patient information/i })).toBeVisible();

    // Change age
    const ageInput = page.getByRole('spinbutton', { name: /age/i });
    await ageInput.fill('29');

    // Save
    await page.getByRole('button', { name: /save changes/i }).click();

    // Dialog closes
    await expect(page.getByRole('heading', { name: /edit patient information/i })).not.toBeVisible();
  });

  test('Delete patient dialog opens and confirms deletion', async ({ page }) => {
    // Mock DELETE /api/v1/patients/:id
    await page.route(`**/api/v1/patients/${mockPatientId}`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { id: mockPatientId, deleted: true },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/patients');

    // Click delete button
    const deleteBtn = page.getByTitle('Delete patient').first();
    await deleteBtn.click();

    // Confirm dialog opens
    await expect(page.getByRole('heading', { name: /delete patient record/i })).toBeVisible();

    // Click confirm delete
    await page.getByRole('button', { name: /^delete patient$/i }).click();

    // Confirm dialog closes
    await expect(page.getByRole('heading', { name: /delete patient record/i })).not.toBeVisible();
  });
});

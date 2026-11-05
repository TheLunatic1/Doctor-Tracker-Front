import { test, expect } from '@playwright/test';

test.describe('Phase 5 Quality Gate: Frontend Foundation & Authentication Flow', () => {
  test('Unauthenticated user is redirected to /login when attempting to access /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Login page renders brand, inputs, and quick demo credentials button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder('name@doctortracker.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••••••')).toBeVisible();

    const demoBtn = page.getByRole('button', { name: /fill demo admin credentials/i });
    await expect(demoBtn).toBeVisible();

    // Click demo button and verify fields are filled
    await demoBtn.click();
    await expect(page.getByPlaceholder('name@doctortracker.com')).toHaveValue('admin@doctortracker.com');
    await expect(page.getByPlaceholder('••••••••••••')).toHaveValue('Admin123456!');
  });

  test('Valid login authenticates user and navigates to /dashboard with AppShell', async ({ page, context }) => {
    // Mock the backend API routes for deterministic browser testing
    await page.route('**/api/v1/auth/login', async (route) => {
      // Set the auth cookie in the browser
      await context.addCookies([
        {
          name: 'dt_auth_token',
          value: 'mock_jwt_token_for_playwright_test',
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: '67cb1234567890abcdef1234',
              name: 'Dr. Sarah Ahmed',
              email: 'admin@doctortracker.com',
              role: 'admin',
              createdAt: new Date().toISOString(),
            },
            token: 'mock_jwt_token_for_playwright_test',
          },
        }),
      });
    });

    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: '67cb1234567890abcdef1234',
              name: 'Dr. Sarah Ahmed',
              email: 'admin@doctortracker.com',
              role: 'admin',
              createdAt: new Date().toISOString(),
            },
          },
        }),
      });
    });

    await page.goto('/login');
    await page.getByRole('button', { name: /fill demo admin credentials/i }).click();
    await page.getByRole('button', { name: /^sign in$/i }).click();

    // Verify redirection to /dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Doctor Tracker').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Doctors', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Patients', exact: true })).toBeVisible();
  });

  test('Logout action clears session and redirects to /login', async ({ page, context }) => {
    // Seed authenticated cookie
    await context.addCookies([
      {
        name: 'dt_auth_token',
        value: 'mock_jwt_token_for_playwright_test',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);

    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: '67cb1234567890abcdef1234',
              name: 'Dr. Sarah Ahmed',
              email: 'admin@doctortracker.com',
              role: 'admin',
              createdAt: new Date().toISOString(),
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/auth/logout', async (route) => {
      await context.clearCookies();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { loggedOut: true },
        }),
      });
    });

    await page.goto('/dashboard');
    await expect(page.getByText('Doctor Tracker')).toBeVisible();

    // Click logout
    const logoutBtn = page.getByRole('button', { name: /sign out/i });
    await logoutBtn.click();

    // Verify redirected to /login
    await expect(page).toHaveURL(/\/login/);
  });
});

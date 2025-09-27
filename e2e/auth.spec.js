import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the sign in page
    await page.goto('/signin');
  });

  test('should display sign in page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/sign in/i);
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send magic link/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
  });

  test('should handle magic link flow', async ({ page }) => {
    // Mock the magic link API response
    await page.route('**/auth/magic-link', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Magic link sent to your email'
        })
      });
    });

    // Fill in email and submit
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByRole('button', { name: /send magic link/i }).click();

    // Should show success message
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });

  test('should handle invalid email validation', async ({ page }) => {
    // Try to submit with invalid email
    await page.getByLabel(/email address/i).fill('invalid-email');
    await page.getByRole('button', { name: /send magic link/i }).click();

    // Browser validation should prevent submission
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toHaveAttribute('validity.valid', 'false');
  });

  test('should handle magic link errors', async ({ page }) => {
    // Mock error response
    await page.route('**/auth/magic-link', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Failed to send magic link'
        })
      });
    });

    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByRole('button', { name: /send magic link/i }).click();

    await expect(page.getByText(/failed to send magic link/i)).toBeVisible();
  });

  test('should handle Google OAuth button', async ({ page }) => {
    // Mock OAuth flow (in reality this would redirect)
    let oauthClicked = false;
    await page.route('**/auth/oauth/google**', async route => {
      oauthClicked = true;
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>OAuth redirect</body></html>'
      });
    });

    // Mock supabase auth
    await page.addInitScript(() => {
      window.mockSupabase = {
        auth: {
          signInWithOAuth: () => Promise.resolve({ error: null })
        }
      };
    });

    await page.getByRole('button', { name: /continue with google/i }).click();

    // Should show loading state
    await expect(page.getByText(/redirecting/i)).toBeVisible();
  });

  test('should redirect authenticated users', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'test-user', email: 'test@example.com' }
      }));
    });

    await page.goto('/signin');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should handle auth callback page', async ({ page }) => {
    // Mock successful auth callback
    await page.route('**/auth/session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            session: {
              access_token: 'mock-token',
              user: { id: 'test-user', email: 'test@example.com' }
            }
          }
        })
      });
    });

    await page.goto('/auth/callback');

    // Should show loading state then redirect
    await expect(page.getByText(/signing you in/i)).toBeVisible();

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should handle auth callback errors', async ({ page }) => {
    // Mock error response
    await page.route('**/auth/session', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { message: 'Invalid session' }
        })
      });
    });

    await page.goto('/auth/callback');

    await expect(page.getByText(/authentication error/i)).toBeVisible();
    await expect(page.getByText(/redirecting to sign in/i)).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper form labels
    await expect(page.getByLabel(/email address/i)).toBeVisible();

    // Check for proper heading structure
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check color contrast (basic check)
    const emailInput = page.getByLabel(/email address/i);
    const styles = await emailInput.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor
      };
    });

    expect(styles.color).toBeTruthy();
    expect(styles.backgroundColor).toBeTruthy();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();

    // Form should be properly sized
    const form = page.locator('form');
    const boundingBox = await form.boundingBox();
    expect(boundingBox?.width).toBeLessThan(375);
  });
});
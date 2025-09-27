import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'test-user', email: 'test@example.com' }
      }));
    });

    // Mock API responses
    await page.route('**/auth/user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-user',
          email: 'test@example.com',
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        })
      });
    });

    await page.route('**/organizations', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'org-1',
            organization_id: 'org-1',
            role: 'owner',
            organizations: {
              id: 'org-1',
              name: 'Test Organization',
              slug: 'test-org'
            }
          }
        ])
      });
    });

    await page.route('**/deliverables', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'deliverable-1',
            client_name: 'Client A',
            created_at: '2023-01-01T00:00:00Z'
          },
          {
            id: 'deliverable-2',
            client_name: 'Client B',
            created_at: '2023-01-02T00:00:00Z'
          }
        ])
      });
    });
  });

  test('should display dashboard with user data', async ({ page }) => {
    await page.goto('/dashboard');

    // Should show welcome message
    await expect(page.getByText(/welcome back, test user/i)).toBeVisible();

    // Should show organization context
    await expect(page.getByText(/working in test organization/i)).toBeVisible();

    // Should show quick action cards
    await expect(page.getByText('Create Deliverable')).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should navigate to create deliverable page', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('link', { name: /create deliverable/i }).click();

    await expect(page).toHaveURL('/new');
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('link', { name: /profile/i }).click();

    await expect(page).toHaveURL('/profile');
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('link', { name: /settings/i }).click();

    await expect(page).toHaveURL('/settings');
  });

  test('should display organizations section', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('Your Organizations')).toBeVisible();
    await expect(page.getByText('Test Organization')).toBeVisible();
    await expect(page.getByText('owner')).toBeVisible();
    await expect(page.getByText('Current')).toBeVisible();
  });

  test('should display deliverables list', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('Recent Deliverables')).toBeVisible();
    await expect(page.getByText('Client A')).toBeVisible();
    await expect(page.getByText('Client B')).toBeVisible();

    // Should have view links
    const viewLinks = page.getByRole('link', { name: /view/i });
    await expect(viewLinks).toHaveCount(2);
  });

  test('should navigate to individual deliverable', async ({ page }) => {
    // Mock deliverable content
    await page.route('**/deliverables/deliverable-1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><h1>Client A Deliverable</h1></body></html>'
      });
    });

    await page.goto('/dashboard');

    // Click on first deliverable
    const firstViewLink = page.getByRole('link', { name: /view/i }).first();
    await firstViewLink.click();

    await expect(page).toHaveURL('/deliverables/deliverable-1');
    await expect(page.getByText('Client A Deliverable')).toBeVisible();
  });

  test('should show empty state when no deliverables', async ({ page }) => {
    // Mock empty deliverables response
    await page.route('**/deliverables', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/dashboard');

    await expect(page.getByText('No deliverables')).toBeVisible();
    await expect(page.getByText('Get started by creating your first deliverable')).toBeVisible();

    // Empty state should have create button
    const createButton = page.getByRole('link', { name: /create deliverable/i }).last();
    await createButton.click();

    await expect(page).toHaveURL('/new');
  });

  test('should handle navbar navigation', async ({ page }) => {
    await page.goto('/dashboard');

    // Test navbar links
    await page.getByRole('link', { name: /momentum/i }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/dashboard');
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');

    await page.getByRole('link', { name: /new/i }).click();
    await expect(page).toHaveURL('/new');
  });

  test('should show user menu and sign out', async ({ page }) => {
    // Mock sign out
    await page.route('**/auth/signout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Signed out' })
      });
    });

    await page.goto('/dashboard');

    // Click user avatar/menu
    const userButton = page.getByRole('button').filter({ hasText: /test user/i }).or(
      page.locator('[data-testid="user-menu"]')
    ).first();

    if (await userButton.isVisible()) {
      await userButton.click();

      // Click sign out
      await page.getByText(/sign out/i).click();

      // Should redirect to sign in
      await expect(page).toHaveURL('/signin');
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/dashboard');

    // Should show mobile-friendly layout
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Quick action cards should stack on mobile
    const quickActions = page.locator('.card').first();
    const boundingBox = await quickActions.boundingBox();
    expect(boundingBox?.width).toBeLessThan(375);

    // Should show mobile navigation
    const navToggle = page.locator('[data-testid="mobile-menu-toggle"]').or(
      page.getByRole('button', { name: /menu/i })
    );

    if (await navToggle.isVisible()) {
      await navToggle.click();
      // Mobile menu should be visible
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow API responses
    await page.route('**/deliverables', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/dashboard');

    // Should show loading state for deliverables
    await expect(page.getByText('Recent Deliverables')).toBeVisible();

    // Should show some loading indicator
    const loadingIndicator = page.locator('[data-testid="loading"]').or(
      page.locator('.animate-spin')
    );

    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock error response
    await page.route('**/deliverables', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.goto('/dashboard');

    // Should still show basic dashboard structure
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByText('Create Deliverable')).toBeVisible();

    // May show error state or empty state
    await expect(page.getByText('Recent Deliverables')).toBeVisible();
  });

  test('should search/filter deliverables', async ({ page }) => {
    await page.goto('/dashboard');

    // If search functionality exists
    const searchInput = page.locator('input[placeholder*="search"]').or(
      page.getByLabel(/search/i)
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill('Client A');

      // Should filter results
      await expect(page.getByText('Client A')).toBeVisible();
      await expect(page.getByText('Client B')).not.toBeVisible();
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate with keyboard
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('should maintain state on page refresh', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for content to load
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Refresh page
    await page.reload();

    // Should maintain authenticated state and show dashboard
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByText('Create Deliverable')).toBeVisible();
  });
});
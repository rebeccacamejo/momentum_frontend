import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Complete Deliverable Creation Flow', () => {
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
          name: 'Test User'
        })
      });
    });

    await page.route('**/organizations', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.route('**/deliverables', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'deliverable-1',
            client_name: 'Test Client',
            created_at: '2023-01-01T00:00:00Z'
          }
        ])
      });
    });
  });

  test('should navigate to new deliverable page from dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Click on create deliverable
    await page.getByRole('link', { name: /create deliverable/i }).click();

    await expect(page).toHaveURL('/new');
  });

  test('should display new deliverable form', async ({ page }) => {
    await page.goto('/new');

    // Check for form elements
    await expect(page.getByText(/client name/i)).toBeVisible();
    await expect(page.getByText(/upload file/i)).toBeVisible();
    await expect(page.getByText(/primary color/i)).toBeVisible();
    await expect(page.getByText(/secondary color/i)).toBeVisible();
  });

  test('should handle file upload and deliverable creation', async ({ page }) => {
    // Mock file upload response
    await page.route('**/upload', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'new-deliverable-id',
          html: '<html><body><h1>Test Deliverable</h1></body></html>'
        })
      });
    });

    await page.goto('/new');

    // Fill in form
    await page.getByLabel(/client name/i).fill('Test Client');

    // Create a test file
    const fileContent = 'fake audio content';
    await page.setInputFiles('input[type="file"]', {
      name: 'test.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from(fileContent)
    });

    // Set colors
    await page.getByLabel(/primary color/i).fill('#FF0000');
    await page.getByLabel(/secondary color/i).fill('#00FF00');

    // Submit form
    await page.getByRole('button', { name: /create deliverable/i }).click();

    // Should show success message
    await expect(page.getByText(/deliverable created/i)).toBeVisible();

    // Should redirect to deliverable view
    await expect(page).toHaveURL(/deliverables\/new-deliverable-id/);
  });

  test('should handle file upload errors', async ({ page }) => {
    // Mock error response
    await page.route('**/upload', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Invalid file format'
        })
      });
    });

    await page.goto('/new');

    await page.getByLabel(/client name/i).fill('Test Client');
    await page.setInputFiles('input[type="file"]', {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not an audio file')
    });

    await page.getByRole('button', { name: /create deliverable/i }).click();

    await expect(page.getByText(/invalid file format/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/new');

    // Try to submit without required fields
    await page.getByRole('button', { name: /create deliverable/i }).click();

    // Should show validation errors
    const clientNameInput = page.getByLabel(/client name/i);
    await expect(clientNameInput).toHaveAttribute('required');
  });

  test('should generate deliverable from text', async ({ page }) => {
    // Mock text generation response
    await page.route('**/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'generated-deliverable-id',
          html: '<html><body><h1>Generated Deliverable</h1></body></html>'
        })
      });
    });

    await page.goto('/new');

    // Switch to text input tab
    await page.getByText(/from text/i).click();

    // Fill in text form
    await page.getByLabel(/client name/i).fill('Text Client');
    await page.getByLabel(/transcript/i).fill('This is a test transcript');

    await page.getByRole('button', { name: /generate deliverable/i }).click();

    await expect(page.getByText(/deliverable generated/i)).toBeVisible();
  });

  test('should display deliverable content', async ({ page }) => {
    // Mock deliverable content
    await page.route('**/deliverables/test-deliverable-id', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><h1>Test Deliverable</h1><p>Deliverable content here</p></body></html>'
      });
    });

    await page.goto('/deliverables/test-deliverable-id');

    await expect(page.getByText('Test Deliverable')).toBeVisible();
    await expect(page.getByText('Deliverable content here')).toBeVisible();
  });

  test('should handle PDF download', async ({ page }) => {
    // Mock PDF generation
    await page.route('**/deliverables/test-deliverable-id/pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://example.com/test-deliverable.pdf'
        })
      });
    });

    // Mock deliverable page
    await page.route('**/deliverables/test-deliverable-id', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><h1>Test Deliverable</h1><button data-testid="download-pdf">Download PDF</button></body></html>'
      });
    });

    await page.goto('/deliverables/test-deliverable-id');

    // Wait for download promise before clicking
    const downloadPromise = page.waitForDownload();
    await page.getByTestId('download-pdf').click();

    // Should initiate download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('test-deliverable.pdf');
  });

  test('should navigate back to dashboard from deliverable', async ({ page }) => {
    await page.route('**/deliverables/test-deliverable-id', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><h1>Test Deliverable</h1></body></html>'
      });
    });

    await page.goto('/deliverables/test-deliverable-id');

    // Click dashboard link in navigation
    await page.getByRole('link', { name: /dashboard/i }).click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('should show deliverable in dashboard list', async ({ page }) => {
    await page.goto('/dashboard');

    // Should show the deliverable in the list
    await expect(page.getByText('Test Client')).toBeVisible();
    await expect(page.getByRole('link', { name: /view/i })).toBeVisible();
  });

  test('should handle brand customization', async ({ page }) => {
    // Mock brand settings
    await page.route('**/brand/settings', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            primary_color: '#2A3EB1',
            secondary_color: '#4C6FE7',
            logo_url: 'https://example.com/logo.png'
          })
        });
      } else if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true
          })
        });
      }
    });

    await page.goto('/settings');

    // Should show current brand settings
    await expect(page.getByDisplayValue('#2A3EB1')).toBeVisible();

    // Update brand settings
    await page.getByLabel(/primary color/i).fill('#FF0000');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText(/settings saved/i)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/new');

    // Form should be mobile-friendly
    const form = page.locator('form');
    const boundingBox = await form.boundingBox();
    expect(boundingBox?.width).toBeLessThan(375);

    // All form elements should be visible
    await expect(page.getByLabel(/client name/i)).toBeVisible();
    await expect(page.getByText(/upload file/i)).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow response
    await page.route('**/upload', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'new-deliverable-id',
          html: '<html><body><h1>Test</h1></body></html>'
        })
      });
    });

    await page.goto('/new');

    await page.getByLabel(/client name/i).fill('Test Client');
    await page.setInputFiles('input[type="file"]', {
      name: 'test.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('fake audio')
    });

    await page.getByRole('button', { name: /create deliverable/i }).click();

    // Should show loading state
    await expect(page.getByText(/creating/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create deliverable/i })).toBeDisabled();
  });
});
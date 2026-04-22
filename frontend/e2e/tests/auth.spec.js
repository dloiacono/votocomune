import { test, expect } from '@playwright/test'

// Auth tests use a fresh browser context — no saved storageState
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('admin123')
    await page.getByRole('button', { name: /accedi/i }).click()

    await page.waitForURL('/dashboard')
    await expect(page.getByText('Dashboard Scrutinio')).toBeVisible()
  })

  test('failed login shows error message', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('wronguser')
    await page.getByLabel('Password').fill('wrongpass')
    await page.getByRole('button', { name: /accedi/i }).click()

    await expect(page.getByText('Errore di login')).toBeVisible()
    expect(page.url()).toContain('/login')
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/login/)
    await expect(page.getByLabel('Username')).toBeVisible()
  })

  test('logout clears session and redirects to login', async ({ page }) => {
    // First login
    await page.goto('/login')
    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('admin123')
    await page.getByRole('button', { name: /accedi/i }).click()
    await page.waitForURL('/dashboard')

    // Then logout
    await page.getByRole('button', { name: /esci/i }).click()
    await page.waitForURL(/\/login/)

    // Verify token is cleared
    const token = await page.evaluate(() => localStorage.getItem('comunali_token'))
    expect(token).toBeNull()
  })
})

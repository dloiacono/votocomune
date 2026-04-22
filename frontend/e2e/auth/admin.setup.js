import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth/admin.json'

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Username').fill('admin')
  await page.getByLabel('Password').fill('admin123')
  await page.getByRole('button', { name: /accedi/i }).click()

  await page.waitForURL('/dashboard')
  await expect(page.getByText('Dashboard Scrutinio')).toBeVisible()

  await page.context().storageState({ path: authFile })
})

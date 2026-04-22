import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('displays page heading', async ({ page }) => {
    await expect(page.getByText('Dashboard Scrutinio')).toBeVisible()
  })

  test('renders all KPI cards', async ({ page }) => {
    await expect(page.getByText('Sezioni Scrutinate')).toBeVisible()
    await expect(page.getByText('Votanti Totali')).toBeVisible()
    await expect(page.getByText('Schede Bianche/Nulle')).toBeVisible()
    await expect(page.getByText('Completamento')).toBeVisible()
  })

  test('shows section status table with headers', async ({ page }) => {
    await expect(page.getByText('Stato Sezioni')).toBeVisible()
    const table = page.locator('table').first()
    await expect(table.getByText('Sezione')).toBeVisible()
    await expect(table.getByText('Nome')).toBeVisible()
    await expect(table.getByText('Stato')).toBeVisible()
    await expect(table.getByText('Votanti')).toBeVisible()
  })

  test('displays chart headings', async ({ page }) => {
    await expect(page.getByText('Voti per Sindaco')).toBeVisible()
    await expect(page.getByText('Voti per Lista')).toBeVisible()
    await expect(page.getByText('Top 10 Consiglieri per Preferenze')).toBeVisible()
  })

  test('refresh button works without error', async ({ page }) => {
    const refreshButton = page.getByRole('button', { name: /aggiorna/i })
    await expect(refreshButton).toBeVisible()
    await refreshButton.click()

    // Page should still show dashboard content without error
    await expect(page.getByText('Dashboard Scrutinio')).toBeVisible()
  })
})

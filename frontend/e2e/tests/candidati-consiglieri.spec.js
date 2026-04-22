import { test, expect } from '@playwright/test'
import { getField } from '../helpers/auth.js'

test.describe('Candidati Consiglieri CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/candidati/consiglieri')
    await expect(page.getByRole('heading', { name: 'Candidati Consiglieri' })).toBeVisible()
  })

  test('page loads with seed council candidates', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(15)
  })

  test('filter by list shows only that list\'s candidates', async ({ page }) => {
    const filterSelect = page.locator('select').first()
    await filterSelect.selectOption({ label: 'Lista A - Centro Sinistra' })

    // Wait for the filtered results to load
    await page.waitForTimeout(500)

    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBe(5)
  })

  test('reset filter shows all candidates', async ({ page }) => {
    // First filter
    const filterSelect = page.locator('select').first()
    await filterSelect.selectOption({ label: 'Lista A - Centro Sinistra' })
    await page.waitForTimeout(500)

    // Then reset
    await filterSelect.selectOption({ label: '-- Tutte le liste --' })
    await page.waitForTimeout(500)

    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(15)
  })

  test.describe.serial('create, edit, delete a consigliere', () => {
    test('create a new consigliere', async ({ page }) => {
      await page.getByRole('button', { name: /nuovo candidato/i }).click()

      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()

      await getField(modal, 'Nome').fill('E2E')
      await getField(modal, 'Cognome').fill('TestConsigliere')

      // Select a lista from dropdown
      const listaSelect = getField(modal, 'Lista')
      await listaSelect.selectOption({ label: 'Lista A - Centro Sinistra' })

      await getField(modal, 'Ordine in Lista').fill('99')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.getByText('TestConsigliere')).toBeVisible()
    })

    test('edit the created consigliere', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'TestConsigliere' })
      await row.getByTitle('Modifica').click()

      const modal = page.getByRole('dialog')
      const cognomeField = getField(modal, 'Cognome')
      await cognomeField.clear()
      await cognomeField.fill('TestConsigliereUpdated')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.getByText('TestConsigliereUpdated')).toBeVisible()
    })

    test('delete the created consigliere', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'TestConsigliereUpdated' })
      await row.getByTitle('Elimina').click()

      const confirmDialog = page.getByRole('alertdialog')
      await confirmDialog.getByRole('button', { name: /elimina/i }).click()

      await expect(page.locator('table tbody tr').filter({ hasText: 'TestConsigliereUpdated' })).not.toBeVisible()
    })
  })
})

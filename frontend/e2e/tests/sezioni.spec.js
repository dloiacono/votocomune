import { test, expect } from '@playwright/test'
import { getField } from '../helpers/auth.js'

test.describe('Sezioni CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sezioni')
    await expect(page.getByText('Gestione Sezioni')).toBeVisible()
  })

  test('page loads with seed sections', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(20)
  })

  test.describe.serial('create, edit, delete a section', () => {
    test('create a new section', async ({ page }) => {
      await page.getByRole('button', { name: /nuova sezione/i }).click()

      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()

      await getField(modal, 'Numero Sezione').fill('99')
      await getField(modal, 'Nome Sezione').fill('E2E Test Sezione')
      await getField(modal, 'Aventi Diritto').fill('100')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.getByText('E2E Test Sezione')).toBeVisible()
    })

    test('edit the created section', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'E2E Test Sezione' })
      await row.getByTitle('Modifica').click()

      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()

      const nomeField = getField(modal, 'Nome Sezione')
      await nomeField.clear()
      await nomeField.fill('E2E Test Sezione Updated')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.getByText('E2E Test Sezione Updated')).toBeVisible()
    })

    test('delete the created section', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'E2E Test Sezione Updated' })
      await row.getByTitle('Elimina').click()

      const confirmDialog = page.getByRole('alertdialog')
      await expect(confirmDialog).toBeVisible()
      await confirmDialog.getByRole('button', { name: /elimina/i }).click()

      await expect(page.locator('table tbody tr').filter({ hasText: 'E2E Test Sezione Updated' })).not.toBeVisible()
    })
  })

  test('cancel modal does not save', async ({ page }) => {
    const rowCountBefore = await page.locator('table tbody tr').count()

    await page.getByRole('button', { name: /nuova sezione/i }).click()
    const modal = page.getByRole('dialog')
    await getField(modal, 'Numero Sezione').fill('98')
    await getField(modal, 'Nome Sezione').fill('Should Not Exist')
    await modal.getByRole('button', { name: /annulla/i }).click()

    await expect(modal).not.toBeVisible()
    const rowCountAfter = await page.locator('table tbody tr').count()
    expect(rowCountAfter).toBe(rowCountBefore)
  })
})

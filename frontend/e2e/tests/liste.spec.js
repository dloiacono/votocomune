import { test, expect } from '@playwright/test'
import { getField } from '../helpers/auth.js'

test.describe('Liste Elettorali CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/liste')
    await expect(page.getByText('Gestione Liste Elettorali')).toBeVisible()
  })

  test('page loads with seed lists', async ({ page }) => {
    await expect(page.getByText('Lista A - Centro Sinistra')).toBeVisible()
    await expect(page.getByText('Lista B - Centro Destra')).toBeVisible()
    await expect(page.getByText('Lista C - Sinistra')).toBeVisible()
  })

  test.describe.serial('create, edit, delete a list', () => {
    test('create a new list', async ({ page }) => {
      await page.getByRole('button', { name: /nuova lista/i }).click()

      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()

      await getField(modal, 'Numero Lista').fill('4')
      await getField(modal, 'Nome Lista').fill('E2E Test Lista')
      await getField(modal, 'Simbolo').fill('Testsimbolo')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.getByText('E2E Test Lista')).toBeVisible()
    })

    test('edit the created list', async ({ page }) => {
      const card = page.locator('.bg-white.rounded-lg.border').filter({ hasText: 'E2E Test Lista' })
      await card.getByRole('button', { name: /modifica/i }).click()

      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()

      const nomeField = getField(modal, 'Nome Lista')
      await nomeField.clear()
      await nomeField.fill('E2E Test Lista Updated')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.getByText('E2E Test Lista Updated')).toBeVisible()
    })

    test('delete the created list', async ({ page }) => {
      const card = page.locator('.bg-white.rounded-lg.border').filter({ hasText: 'E2E Test Lista Updated' })
      await card.getByRole('button', { name: /elimina/i }).click()

      const confirmDialog = page.getByRole('alertdialog')
      await expect(confirmDialog).toBeVisible()
      await confirmDialog.getByRole('button', { name: /elimina/i }).click()

      await expect(page.locator('.bg-white.rounded-lg.border').filter({ hasText: 'E2E Test Lista Updated' })).toHaveCount(0)
    })
  })
})

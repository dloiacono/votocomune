import { test, expect } from '@playwright/test'
import { getField } from '../helpers/auth.js'

test.describe('Utenti CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/utenti')
    await expect(page.getByRole('heading', { name: 'Gestione Utenti' })).toBeVisible()
  })

  test('page loads with seed admin user', async ({ page }) => {
    await expect(page.locator('table tbody tr').filter({ hasText: 'admin' })).toBeVisible()
  })

  test('admin user shows profile badges', async ({ page }) => {
    const adminRow = page.locator('table tbody tr').filter({ hasText: 'admin' })
    await expect(adminRow.getByText('ADMIN', { exact: true })).toBeVisible()
  })

  test.describe.serial('create, edit, delete a user', () => {
    test('create a new user', async ({ page }) => {
      await page.getByRole('button', { name: /nuovo utente/i }).click()

      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()

      await getField(modal, 'Username').fill('e2e_testuser')
      await getField(modal, 'Nome').fill('E2E')
      await getField(modal, 'Cognome').fill('TestUser')
      await getField(modal, 'Email').fill('e2e@test.com')
      await getField(modal, 'Password').fill('test1234')

      // Assign GESTORE_VOTI role
      await modal.locator('label').filter({ hasText: 'GESTORE VOTI' }).click()

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      const newRow = page.locator('table tbody tr').filter({ hasText: 'e2e_testuser' })
      await expect(newRow).toBeVisible()
      await expect(newRow.getByText('GESTORE VOTI')).toBeVisible()
    })

    test('edit the created user', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'e2e_testuser' })
      await row.getByTitle('Modifica').click()

      const modal = page.getByRole('dialog')
      const nomeField = getField(modal, 'Nome')
      await nomeField.clear()
      await nomeField.fill('E2EUpdated')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.locator('table tbody tr').filter({ hasText: 'E2EUpdated' })).toBeVisible()
    })

    test('delete the created user', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'e2e_testuser' })
      await row.getByTitle('Elimina').click()

      const confirmDialog = page.getByRole('alertdialog')
      await confirmDialog.getByRole('button', { name: /elimina/i }).click()

      await expect(page.locator('table tbody tr').filter({ hasText: 'e2e_testuser' })).not.toBeVisible()
    })
  })

  test('password is required for new users', async ({ page }) => {
    await page.getByRole('button', { name: /nuovo utente/i }).click()

    const modal = page.getByRole('dialog')
    await getField(modal, 'Username').fill('e2e_nopass')
    await getField(modal, 'Nome').fill('No')
    await getField(modal, 'Cognome').fill('Password')
    await getField(modal, 'Email').fill('nopass@test.com')
    // Leave password empty

    await modal.getByRole('button', { name: /salva/i }).click()

    // Should show error about password being required
    await expect(page.getByText('La password è obbligatoria')).toBeVisible()
  })
})

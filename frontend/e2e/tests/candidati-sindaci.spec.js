import { test, expect } from '@playwright/test'
import { getField, getAdminApiContext } from '../helpers/auth.js'

test.describe('Candidati Sindaci CRUD', () => {
  let adminApi

  test.beforeAll(async ({ playwright }) => {
    adminApi = await getAdminApiContext(playwright)
    // Clean up any leftover E2E test data
    const response = await adminApi.get('/api/sindaci')
    if (response.ok()) {
      const sindaci = await response.json()
      for (const s of sindaci) {
        if (s.nome === 'E2E') {
          await adminApi.delete(`/api/sindaci/${s.id}`)
        }
      }
    }
  })

  test.afterAll(async () => {
    if (adminApi) {
      const response = await adminApi.get('/api/sindaci')
      if (response.ok()) {
        const sindaci = await response.json()
        for (const s of sindaci) {
          if (s.nome === 'E2E') {
            await adminApi.delete(`/api/sindaci/${s.id}`)
          }
        }
      }
      await adminApi.dispose()
    }
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/candidati/sindaci')
    await expect(page.getByRole('heading', { name: 'Candidati Sindaci' })).toBeVisible()
  })

  test('page loads with seed mayor candidates', async ({ page }) => {
    await expect(page.getByText('Marco')).toBeVisible()
    await expect(page.getByText('Rossi')).toBeVisible()
    await expect(page.getByText('Anna')).toBeVisible()
    await expect(page.getByText('Bianchi')).toBeVisible()
  })

  test('seed candidates show list associations as badges', async ({ page }) => {
    const rossiRow = page.locator('table tbody tr').filter({ hasText: 'Rossi' })
    await expect(rossiRow.getByText('Lista A - Centro Sinistra')).toBeVisible()
    await expect(rossiRow.getByText('Lista B - Centro Destra')).toBeVisible()

    const bianchiRow = page.locator('table tbody tr').filter({ hasText: 'Bianchi' })
    await expect(bianchiRow.getByText('Lista C - Sinistra')).toBeVisible()
  })

  test.describe.serial('create, edit, delete a sindaco', () => {
    test('create a new sindaco', async ({ page }) => {
      await page.getByRole('button', { name: /nuovo candidato/i }).click()

      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()

      await getField(modal, 'Nome').fill('E2E')
      await getField(modal, 'Cognome').fill('TestSindaco')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.locator('table tbody tr').filter({ hasText: 'TestSindaco' })).toBeVisible()
    })

    test('edit the created sindaco', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'TestSindaco' })
      await row.getByTitle('Modifica').click()

      const modal = page.getByRole('dialog')
      const cognomeField = getField(modal, 'Cognome')
      await cognomeField.clear()
      await cognomeField.fill('TestSindacoUpdated')

      await modal.getByRole('button', { name: /salva/i }).click()
      await expect(modal).not.toBeVisible()

      await expect(page.getByText('TestSindacoUpdated')).toBeVisible()
    })

    test('delete the created sindaco', async ({ page }) => {
      const row = page.locator('table tbody tr').filter({ hasText: 'TestSindacoUpdated' })
      await row.getByTitle('Elimina').click()

      const confirmDialog = page.getByRole('alertdialog')
      await confirmDialog.getByRole('button', { name: /elimina/i }).click()

      await expect(page.locator('table tbody tr').filter({ hasText: 'TestSindacoUpdated' })).not.toBeVisible()
    })
  })
})

import { test, expect } from '@playwright/test'
import { loginAs, getAdminApiContext } from '../helpers/auth.js'

// RBAC tests use fresh browser contexts (no saved storageState)
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Role-Based Access Control', () => {
  let adminApi
  const testUsers = []

  test.beforeAll(async ({ playwright }) => {
    adminApi = await getAdminApiContext(playwright)

    // Create test users with specific roles
    const users = [
      { username: 'e2e_voti', nome: 'E2E', cognome: 'Voti', email: 'voti@e2e.com', password: 'test1234', profili: ['GESTORE_VOTI'] },
      { username: 'e2e_liste', nome: 'E2E', cognome: 'Liste', email: 'liste@e2e.com', password: 'test1234', profili: ['GESTORE_LISTE'] },
      { username: 'e2e_candidati', nome: 'E2E', cognome: 'Candidati', email: 'candidati@e2e.com', password: 'test1234', profili: ['GESTORE_CANDIDATI'] },
    ]

    for (const user of users) {
      const response = await adminApi.post('/api/utenti', { data: user })
      if (response.ok()) {
        const created = await response.json()
        testUsers.push(created)
      }
    }
  })

  test.afterAll(async () => {
    // Cleanup test users
    if (adminApi) {
      const response = await adminApi.get('/api/utenti')
      if (response.ok()) {
        const allUsers = await response.json()
        for (const user of allUsers) {
          if (user.username.startsWith('e2e_')) {
            await adminApi.delete(`/api/utenti/${user.id}`)
          }
        }
      }
      await adminApi.dispose()
    }
  })

  test('GESTORE_VOTI sees only Dashboard and Inserimento Voti in sidebar', async ({ page }) => {
    await loginAs(page, 'e2e_voti', 'test1234')

    const nav = page.locator('nav')
    await expect(nav.getByText('Dashboard')).toBeVisible()
    await expect(nav.getByText('Inserimento Voti')).toBeVisible()

    // Should NOT see admin-only items
    await expect(nav.getByText('Sezioni')).not.toBeVisible()
    await expect(nav.getByText('Liste')).not.toBeVisible()
    await expect(nav.getByText('Utenti')).not.toBeVisible()
    await expect(nav.getByText('Candidati Sindaci')).not.toBeVisible()
    await expect(nav.getByText('Candidati Consiglieri')).not.toBeVisible()
  })

  test('GESTORE_LISTE sees only Dashboard and Liste in sidebar', async ({ page }) => {
    await loginAs(page, 'e2e_liste', 'test1234')

    const nav = page.locator('nav')
    await expect(nav.getByText('Dashboard')).toBeVisible()
    await expect(nav.getByText('Liste')).toBeVisible()

    await expect(nav.getByText('Sezioni')).not.toBeVisible()
    await expect(nav.getByText('Inserimento Voti')).not.toBeVisible()
    await expect(nav.getByText('Utenti')).not.toBeVisible()
    await expect(nav.getByText('Candidati Sindaci')).not.toBeVisible()
    await expect(nav.getByText('Candidati Consiglieri')).not.toBeVisible()
  })

  test('GESTORE_CANDIDATI sees Dashboard and Candidati pages in sidebar', async ({ page }) => {
    await loginAs(page, 'e2e_candidati', 'test1234')

    const nav = page.locator('nav')
    await expect(nav.getByText('Dashboard')).toBeVisible()
    await expect(nav.getByText('Candidati Sindaci')).toBeVisible()
    await expect(nav.getByText('Candidati Consiglieri')).toBeVisible()

    await expect(nav.getByText('Sezioni')).not.toBeVisible()
    await expect(nav.getByText('Inserimento Voti')).not.toBeVisible()
    await expect(nav.getByText('Liste')).not.toBeVisible()
    await expect(nav.getByText('Utenti')).not.toBeVisible()
  })
})

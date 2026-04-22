import { test, expect } from '@playwright/test'

test.describe('Vote Entry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/voti')
    await expect(page.getByRole('heading', { name: 'Inserimento Voti' })).toBeVisible()
  })

  test('page loads with section dropdown', async ({ page }) => {
    const select = page.locator('#sezione')
    await expect(select).toBeVisible()

    const options = select.locator('option')
    const count = await options.count()
    // 20 sections + 1 placeholder
    expect(count).toBeGreaterThanOrEqual(21)
  })

  test('selecting a section reveals the vote form', async ({ page }) => {
    const select = page.locator('#sezione')
    await select.selectOption({ index: 1 })

    // Check that form sections appear
    await expect(page.getByRole('heading', { name: 'Dati Generali' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Voti per Lista' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Preferenze Consiglieri' })).toBeVisible()

    // Check general data fields are visible
    await expect(page.getByText('Votanti Totali')).toBeVisible()
    await expect(page.getByText('Schede Bianche')).toBeVisible()
    await expect(page.getByText('Schede Nulle')).toBeVisible()

    // Check save button
    await expect(page.getByRole('button', { name: /salva voti sezione/i })).toBeVisible()
  })

  test('enter votes and save successfully', async ({ page }) => {
    const select = page.locator('#sezione')
    // Use the last section (20) to minimize interference with other tests
    await select.selectOption({ index: 20 })

    // Wait for form to load
    await expect(page.getByRole('heading', { name: 'Dati Generali' })).toBeVisible()

    // Fill general data — find labels then navigate to parent div to get the input
    const generalSection = page.locator('h2', { hasText: 'Dati Generali' }).locator('..')
    await generalSection.locator('label', { hasText: 'Votanti Totali' }).locator('xpath=..').locator('input').fill('300')
    await generalSection.locator('label', { hasText: 'Schede Bianche' }).locator('xpath=..').locator('input').fill('5')
    await generalSection.locator('label', { hasText: 'Schede Nulle' }).locator('xpath=..').locator('input').fill('3')

    // Fill list votes — locate each list card by its colored border
    const listeSection = page.locator('h2', { hasText: 'Voti per Lista' }).locator('..')
    const listaCards = listeSection.locator('[style*="border-left"]')

    for (let i = 0; i < await listaCards.count(); i++) {
      const card = listaCards.nth(i)
      await card.locator('label', { hasText: 'Voti Lista' }).locator('xpath=..').locator('input').fill(String(80 + i * 10))
      await card.locator('label', { hasText: 'Voti Sindaco' }).locator('xpath=..').locator('input').fill(String(70 + i * 10))
    }

    // Save
    await page.getByRole('button', { name: /salva voti sezione/i }).click()

    // Assert success message
    await expect(page.getByText('Voti salvati con successo!')).toBeVisible()
  })

  test('consigliere preferences are grouped by list', async ({ page }) => {
    const select = page.locator('#sezione')
    await select.selectOption({ index: 1 })

    await expect(page.getByRole('heading', { name: 'Preferenze Consiglieri' })).toBeVisible()

    // Each seed list should appear as a group header within the preferences section
    const prefSection = page.locator('h2', { hasText: 'Preferenze Consiglieri' }).locator('..')
    await expect(prefSection.getByRole('heading', { name: 'Lista A - Centro Sinistra' })).toBeVisible()
    await expect(prefSection.getByRole('heading', { name: 'Lista B - Centro Destra' })).toBeVisible()
    await expect(prefSection.getByRole('heading', { name: 'Lista C - Sinistra' })).toBeVisible()
  })
})

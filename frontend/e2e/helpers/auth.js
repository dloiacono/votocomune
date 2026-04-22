/**
 * Login as a specific user by navigating to /login and filling the form.
 * Clears any existing session first.
 */
export async function loginAs(page, username, password) {
  await page.goto('/login')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /accedi/i }).click()
  await page.waitForURL('/dashboard')
}

/**
 * Get an authenticated API request context for direct API calls.
 * Uses the backend directly (port 8080) to avoid dependency on Vite proxy.
 */
export async function getAdminApiContext(playwright) {
  const apiContext = await playwright.request.newContext({
    baseURL: 'http://localhost:8080',
  })
  const loginResponse = await apiContext.post('/api/auth/login', {
    data: { username: 'admin', password: 'admin123' },
  })
  const { token } = await loginResponse.json()
  await apiContext.dispose()

  return playwright.request.newContext({
    baseURL: 'http://localhost:8080',
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Fill a form field inside a container by finding the label text,
 * then navigating to its parent div to get the associated input.
 */
export function getField(container, labelText) {
  return container
    .locator('label', { hasText: labelText })
    .first()
    .locator('xpath=..')
    .locator('input, select, textarea')
    .first()
}

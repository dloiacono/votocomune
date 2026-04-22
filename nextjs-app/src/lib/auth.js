import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production')
const JWT_ISSUER = 'https://comunali.app'
const JWT_EXPIRY = '8h'

export async function generateToken(username, profili) {
  return new SignJWT({ sub: username, groups: profili })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { issuer: JWT_ISSUER })
    return payload
  } catch {
    return null
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export async function getAuthUser(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  const payload = await verifyToken(token)
  if (!payload) return null

  return { username: payload.sub, profili: payload.groups || [] }
}

export function hasRole(user, ...roles) {
  if (!user?.profili) return false
  return roles.some(role => user.profili.includes(role))
}

export type UserRole = 'guest'|'user'|'admin'

export function roleFromClaims(claims?: Record<string, any>): UserRole {
  const r = claims?.role || 'user'
  return (['guest','user','admin'] as UserRole[]).includes(r) ? r : 'user'
}

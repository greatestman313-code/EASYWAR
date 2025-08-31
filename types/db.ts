export type Thread = { id: string; title: string; created_at: string }
export type Message = { id: string; thread_id: string; role: 'user'|'assistant'; content: string; created_at: string }
export type UserSetting = { id: string; user_id: string; font_size: number }

export interface Story {
  id: string
  content: string
  latitude: number
  longitude: number
  created_at: string
  updated_at: string
  author_id: string | null
  mood: StoryMood | null
  expires_at: string | null
}

export type StoryMood = "happy" | "sad" | "nostalgic" | "longing"

export interface StoryInsert {
  content: string
  latitude: number
  longitude: number
  mood?: StoryMood
  expires_at?: string
}

export interface NearbyStoriesParams {
  latitude: number
  longitude: number
  radius_km: number
  limit?: number
}

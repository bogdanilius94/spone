export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      global_settings: {
        Row: {
          id: number;
          artist_name: string;
          artist_font_family: string;
          accent_color: string;
          show_quick_links: boolean;
          show_biography: boolean;
          show_discography: boolean;
          show_gallery: boolean;
          show_videos: boolean;
          show_qr_widget: boolean;
          show_audio_player: boolean;
          hero_background_url: string | null;
          hero_background_blur: boolean;
          hero_video_url: string | null;
          featured_song_title: string;
          featured_song_stream_url: string | null;
          featured_song_audio_url: string | null;
          bio_text: string;
          bio_portrait_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          artist_name?: string;
          artist_font_family?: string;
          accent_color?: string;
          show_quick_links?: boolean;
          show_biography?: boolean;
          show_discography?: boolean;
          show_gallery?: boolean;
          show_videos?: boolean;
          show_qr_widget?: boolean;
          show_audio_player?: boolean;
          hero_background_url?: string | null;
          hero_background_blur?: boolean;
          hero_video_url?: string | null;
          featured_song_title?: string;
          featured_song_stream_url?: string | null;
          featured_song_audio_url?: string | null;
          bio_text?: string;
          bio_portrait_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          artist_name?: string;
          artist_font_family?: string;
          accent_color?: string;
          show_quick_links?: boolean;
          show_biography?: boolean;
          show_discography?: boolean;
          show_gallery?: boolean;
          show_videos?: boolean;
          show_qr_widget?: boolean;
          show_audio_player?: boolean;
          hero_background_url?: string | null;
          hero_background_blur?: boolean;
          hero_video_url?: string | null;
          featured_song_title?: string;
          featured_song_stream_url?: string | null;
          featured_song_audio_url?: string | null;
          bio_text?: string;
          bio_portrait_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: Database["public"]["Enums"]["link_platform"];
          label: string;
          url: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform?: Database["public"]["Enums"]["link_platform"];
          label: string;
          url: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: Database["public"]["Enums"]["link_platform"];
          label?: string;
          url?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      releases: {
        Row: {
          id: string;
          title: string;
          cover_url: string | null;
          listen_url: string;
          release_date: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          cover_url?: string | null;
          listen_url: string;
          release_date?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          cover_url?: string | null;
          listen_url?: string;
          release_date?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          caption?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          caption?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      music_videos: {
        Row: {
          id: string;
          title: string;
          platform: Database["public"]["Enums"]["video_platform"];
          video_url: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          platform?: Database["public"]["Enums"]["video_platform"];
          video_url: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          platform?: Database["public"]["Enums"]["video_platform"];
          video_url?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      link_platform:
        | "spotify"
        | "apple_music"
        | "youtube"
        | "instagram"
        | "tiktok"
        | "soundcloud"
        | "custom";
      video_platform: "youtube" | "vimeo";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  T extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][T]["Row"];

export type TableInsert<
  T extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][T]["Insert"];

export type TableUpdate<
  T extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][T]["Update"];


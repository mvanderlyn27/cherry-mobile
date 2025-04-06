// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]
export type Json = Record<string, any>;

export type Database = {
  public: {
    Tables: {
      book_progress: {
        Row: {
          book_id: string;
          created_at: string;
          current_chapter_id: string | null;
          id: string;
          percent_done: number;
          status: Database["public"]["Enums"]["book_status"] | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id: string;
          created_at?: string;
          current_chapter_id?: string | null;
          id?: string;
          percent_done?: number;
          status?: Database["public"]["Enums"]["book_status"] | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: string;
          created_at?: string;
          current_chapter_id?: string | null;
          id?: string;
          percent_done?: number;
          status?: Database["public"]["Enums"]["book_status"] | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "book_progress_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_progress_current_chapter_id_fkey";
            columns: ["current_chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      book_tags: {
        Row: {
          book_id: string;
          created_at: string;
          id: string;
          tag_id: string;
          updated_at: string;
        };
        Insert: {
          book_id: string;
          created_at?: string;
          id?: string;
          tag_id: string;
          updated_at?: string;
        };
        Update: {
          book_id?: string;
          created_at?: string;
          id?: string;
          tag_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "book_tags_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      books: {
        Row: {
          author: string;
          cover_placeholder: string | null;
          cover_url: string | null;
          created_at: string;
          description: string | null;
          id: string;
          like_count: number | null;
          price: number;
          reader_count: number;
          reading_time: number | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author: string;
          cover_placeholder?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          like_count?: number | null;
          price: number;
          reader_count?: number;
          reading_time?: number | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string;
          cover_placeholder?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          like_count?: number | null;
          price?: number;
          reader_count?: number;
          reading_time?: number | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chapter_progress: {
        Row: {
          book_progress_id: string;
          chapter_id: string;
          created_at: string;
          id: string;
          status: Database["public"]["Enums"]["chapter_status"] | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_progress_id: string;
          chapter_id: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["chapter_status"] | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_progress_id?: string;
          chapter_id?: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["chapter_status"] | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_progress_book_progress_id_fkey";
            columns: ["book_progress_id"];
            isOneToOne: false;
            referencedRelation: "book_progress";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_progress_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      chapters: {
        Row: {
          book_id: string;
          chapter_number: number;
          content_url: string | null;
          created_at: string;
          id: string;
          price: number;
          title: string;
          updated_at: string;
          word_count: number;
        };
        Insert: {
          book_id: string;
          chapter_number: number;
          content_url?: string | null;
          created_at?: string;
          id?: string;
          price: number;
          title: string;
          updated_at?: string;
          word_count?: number;
        };
        Update: {
          book_id?: string;
          chapter_number?: number;
          content_url?: string | null;
          created_at?: string;
          id?: string;
          price?: number;
          title?: string;
          updated_at?: string;
          word_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          }
        ];
      };
      cherry_ledger: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          new_balance: number;
          previous_balance: number;
          transaction_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          new_balance: number;
          previous_balance: number;
          transaction_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          new_balance?: number;
          previous_balance?: number;
          transaction_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cherry_ledger_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cherry_ledger_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          book_id: string;
          chapter_id: string | null;
          content: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id: string;
          chapter_id?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: string;
          chapter_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      interactions: {
        Row: {
          book_id: string | null;
          chapter_id: string | null;
          created_at: string;
          id: string;
          type: Database["public"]["Enums"]["interaction_type"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id?: string | null;
          chapter_id?: string | null;
          created_at?: string;
          id?: string;
          type: Database["public"]["Enums"]["interaction_type"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: string | null;
          chapter_id?: string | null;
          created_at?: string;
          id?: string;
          type?: Database["public"]["Enums"]["interaction_type"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interactions_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interactions_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      liked_chapters: {
        Row: {
          book_id: string | null;
          chapter_id: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id?: string | null;
          chapter_id: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: string | null;
          chapter_id?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "liked_chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "liked_chapters_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "liked_chapters_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          profile_placeholder: string | null;
          profile_url: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          profile_placeholder?: string | null;
          profile_url?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          profile_placeholder?: string | null;
          profile_url?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_books: {
        Row: {
          book_id: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_books_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_books_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_tags: {
        Row: {
          created_at: string;
          id: string;
          tag_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          tag_id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          tag_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_tags_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          tag_image_placeholder: string | null;
          tag_image_url: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          tag_image_placeholder?: string | null;
          tag_image_url?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          tag_image_placeholder?: string | null;
          tag_image_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          book_id: string | null;
          chapter_id: string | null;
          created_at: string;
          credits: number;
          id: string;
          payment_intent_id: string | null;
          price: number;
          status: Database["public"]["Enums"]["transaction_status"] | null;
          transaction_type: Database["public"]["Enums"]["transaction_type"];
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          book_id?: string | null;
          chapter_id?: string | null;
          created_at?: string;
          credits: number;
          id?: string;
          payment_intent_id?: string | null;
          price: number;
          status?: Database["public"]["Enums"]["transaction_status"] | null;
          transaction_type: Database["public"]["Enums"]["transaction_type"];
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          book_id?: string | null;
          chapter_id?: string | null;
          created_at?: string;
          credits?: number;
          id?: string;
          payment_intent_id?: string | null;
          price?: number;
          status?: Database["public"]["Enums"]["transaction_status"] | null;
          transaction_type?: Database["public"]["Enums"]["transaction_type"];
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_unlocks: {
        Row: {
          book_id: string;
          chapter_id: string | null;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id: string;
          chapter_id?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: string;
          chapter_id?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_unlocks_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_unlocks_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_unlocks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          created_at: string;
          credits: number | null;
          id: string;
          preferences: Json | null;
          premium_user: boolean | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          credits?: number | null;
          id: string;
          preferences?: Json | null;
          premium_user?: boolean | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          credits?: number | null;
          id?: string;
          preferences?: Json | null;
          premium_user?: boolean | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      book_status: "finished" | "reading" | "unread";
      chapter_status: "reading" | "unread" | "completed";
      interaction_type: "share" | "like" | "read" | "purchase" | "open" | "save" | "comment";
      transaction_status: "completed" | "failed" | "pending" | "refund";
      transaction_type: "PURCHASE_CREDITS" | "UNLOCK_BOOK" | "UNLOCK_CHAPTER" | "REFUND_CREDITS" | "REFUND_UNLOCK";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

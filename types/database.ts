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
          discount_percent: number | null;
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
          discount_percent?: number | null;
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
          discount_percent?: number | null;
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
          is_free: boolean;
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
          is_free?: boolean;
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
          is_free?: boolean;
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
          credits: number | null;
          error: string | null;
          id: string;
          payment_intent_id: string | null;
          price: number | null;
          status: Database["public"]["Enums"]["transaction_status"];
          transaction_type: Database["public"]["Enums"]["transaction_type"];
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          book_id?: string | null;
          chapter_id?: string | null;
          created_at?: string;
          credits?: number | null;
          error?: string | null;
          id?: string;
          payment_intent_id?: string | null;
          price?: number | null;
          status?: Database["public"]["Enums"]["transaction_status"];
          transaction_type: Database["public"]["Enums"]["transaction_type"];
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          book_id?: string | null;
          chapter_id?: string | null;
          created_at?: string;
          credits?: number | null;
          error?: string | null;
          id?: string;
          payment_intent_id?: string | null;
          price?: number | null;
          status?: Database["public"]["Enums"]["transaction_status"];
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
      delete_user_data: {
        Args: { p_user_id: string };
        Returns: undefined;
      };
      migrate_user_data: {
        Args: { old_user_id: string; new_user_id: string };
        Returns: undefined;
      };
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

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      book_status: ["finished", "reading", "unread"],
      chapter_status: ["reading", "unread", "completed"],
      interaction_type: ["share", "like", "read", "purchase", "open", "save", "comment"],
      transaction_status: ["completed", "failed", "pending", "refund"],
      transaction_type: ["PURCHASE_CREDITS", "UNLOCK_BOOK", "UNLOCK_CHAPTER", "REFUND_CREDITS", "REFUND_UNLOCK"],
    },
  },
} as const;

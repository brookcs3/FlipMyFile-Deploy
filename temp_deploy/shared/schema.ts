import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  conversions: many(conversions),
}));

export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  conversionMode: text("conversion_mode").notNull(),
  originalFileName: text("original_file_name").notNull(),
  originalFileSize: integer("original_file_size").notNull(),
  outputFileName: text("output_file_name").notNull(),
  outputFileSize: integer("output_file_size").notNull(),
  conversionTime: integer("conversion_time").notNull(), // in milliseconds
  quality: integer("quality"), // optional quality setting
  successful: boolean("successful").notNull().default(true),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"), // additional metadata, if any
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversionsRelations = relations(conversions, ({ one }) => ({
  user: one(users, {
    fields: [conversions.userId],
    references: [users.id],
  }),
}));

export const conversionSettings = pgTable("conversion_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  defaultQuality: integer("default_quality").default(90),
  preserveMetadata: boolean("preserve_metadata").default(true),
  maxDimension: integer("max_dimension"), // optional max dimension
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversionSettingsRelations = relations(conversionSettings, ({ one }) => ({
  user: one(users, {
    fields: [conversionSettings.userId],
    references: [users.id],
  }),
}));

// Insert schemas for each table
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversionSchema = createInsertSchema(conversions).omit({
  id: true,
  createdAt: true,
});

export const insertConversionSettingsSchema = createInsertSchema(conversionSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversion = z.infer<typeof insertConversionSchema>;
export type Conversion = typeof conversions.$inferSelect;

export type InsertConversionSettings = z.infer<typeof insertConversionSettingsSchema>;
export type ConversionSettings = typeof conversionSettings.$inferSelect;

import { pgTable, text, timestamp, boolean, numeric, integer, } from "drizzle-orm/pg-core";


export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
 image: text('image'),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
  });

  export const session = pgTable("session", {
   id: text('id').primaryKey(),
   expiresAt: timestamp('expires_at').notNull(),
   token: text('token').notNull().unique(),
   createdAt: timestamp('created_at').notNull(),
   updatedAt: timestamp('updated_at').notNull(),
   ipAddress: text('ip_address'),
   userAgent: text('user_agent'),
   userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
          });

export const account = pgTable("account", {
 id: text('id').primaryKey(),
 accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: timestamp('access_token_expires_at'),
 refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
 scope: text('scope'),
 password: text('password'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
        });

export const verification = pgTable("verification", {
 id: text('id').primaryKey(),
 identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});


export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  category: text("category").notNull(),

  description: text("description"),

  url: text("url"),

  amount: numeric("amount") // better than integer for decimals
    .notNull(),

  currency: text("currency").notNull(), // e.g. USD, INR

  // Cycle fields
  cycleType: text("cycle_type").notNull(), // "month" or "year"
  cycleCount: integer("cycle_count").notNull(), // 1, 3, 6, 12 etc.

  // Billing dates
  startBilling: timestamp("start_billing").notNull(),
  nextBilling: timestamp("next_billing").notNull(),

  // Reminder toggle
  reminder: boolean("reminder")
    .$defaultFn(() => false)
    .notNull(),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),

  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

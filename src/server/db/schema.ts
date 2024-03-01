import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  serial,
  date,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator(
  (name) => `workout-tracker_${name}`,
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const workouts = createTable(
  "workout",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    userId: varchar("userId", { length: 255 }).notNull(),
    time: varchar("time", { length: 256 }),
    date: date("date").notNull(),
    type: varchar("type", { length: 256 }),
    specificName: varchar("specificName", { length: 256 }),
    duration: varchar("duration", { length: 256 }),
    notes: text("notes"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (x) => ({
    userIdIdx: index("userId_idx").on(x.userId),
  }),
);

export type Workout = typeof workouts.$inferSelect & { exercises: Exercise[] };
export type NewWorkout = typeof workouts.$inferInsert;

export const exercise = createTable(
  "exercise",
  {
    id: serial("id").primaryKey(),
    workoutId: varchar("workoutId", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    date: date("date"),
  },
  (x) => ({
    workoutIdIdx: index("workoutId_idx").on(x.workoutId),
  }),
);

export type Exercise = typeof exercise.$inferSelect & { sets: Set[] };
export type NewExercise = typeof exercise.$inferInsert;

export const sets = createTable(
  "sets",
  {
    id: serial("id").primaryKey(),
    exerciseId: varchar("exerciseId", { length: 256 }),
    setNumber: int("setNumber"),
    weightAmount: int("weightAmount"),
    weightUnit: varchar("weightUnit", { length: 256 }),
    repAmount: int("repAmount"),
  },
  (x) => ({
    exerciseIdIdx: index("exerciseId_idx").on(x.exerciseId),
  }),
);

export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;

// export const posts = createTable(
//   "post",
//   {
//     id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("createdById", { length: 255 }).notNull(),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//   },
//   (example) => ({
//     createdByIdIdx: index("createdById_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   }),
// );

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  workouts: many(workouts),
}));

export const workoutRelations = relations(workouts, ({ one, many }) => ({
  workout: one(users, { fields: [workouts.userId], references: [users.id] }),
  exercises: many(exercise),
}));

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
  exercise: one(workouts, {
    fields: [exercise.workoutId],
    references: [workouts.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  set: one(exercise, { fields: [sets.exerciseId], references: [exercise.id] }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

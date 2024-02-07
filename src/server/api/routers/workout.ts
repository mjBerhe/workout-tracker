import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { workouts } from "~/server/db/schema";

type Workout = typeof workouts.$inferInsert;

export const workoutRouter = createTRPCRouter({
  getAllWorkouts: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return "hello";
    }),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().optional().nullable(),
        time: z.string().optional().nullable(),
        type: z.string().optional().nullable(),
        specificName: z.string().optional().nullable(),
        duration: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, name, type, time, specificName, duration, notes } = input;

      const newWorkout = await ctx.db.insert(workouts).values({
        userId,
        name,
        type,
        time,
        specificName,
        duration,
        notes,
      });

      return { status: "success", workout: newWorkout };
    }),
});

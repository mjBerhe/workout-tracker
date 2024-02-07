import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { workouts } from "~/server/db/schema";

export const workoutRouter = createTRPCRouter({
  getAllWorkouts: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return "hello";
    }),
});

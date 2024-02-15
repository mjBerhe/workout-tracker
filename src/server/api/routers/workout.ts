import { set, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  workouts,
  exercise as exerciseTable,
  sets as setTable,
} from "~/server/db/schema";
import { db } from "~/server/db";

export const workoutRouter = createTRPCRouter({
  getAllWorkouts: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return "hello";
    }),

  createWorkout: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(), // Leg Day 1
        time: z.string().optional(), // Afternoon
        type: z.string().optional(), // Strength Training
        duration: z.string().optional(),
        specificName: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
        date: z.date(),
        exercises: z.array(
          z.object({
            name: z.string(),
            sets: z.array(
              z.object({
                // id: z.number().optional(),
                setNumber: z.string(),
                weightAmount: z.string(),
                weightUnit: z.string(),
                repAmount: z.string(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        userId,
        name: workoutName,
        type,
        time,
        specificName,
        duration,
        notes,
        date,
        exercises,
      } = input;

      const newWorkout = await db.insert(workouts).values({
        userId,
        date,
        name: workoutName,
        time,
        type,
        duration,
      });
      const workoutId = newWorkout.insertId;

      const test = exercises.map(async (exercise) => {
        const newExercise = await db.insert(exerciseTable).values({
          date: date,
          name: exercise.name,
          workoutId: workoutId,
        });
        const exerciseId = newExercise.insertId;
        const sets = exercise.sets.map((x) => ({
          exerciseId,
          setNumber: parseInt(x.setNumber),
          weightAmount: parseInt(x.weightAmount),
          repAmount: parseInt(x.repAmount),
          weightMeasurement: x.weightUnit,
        }));
        const newSets = await db.insert(setTable).values([...sets]);
      });

      // return { status: "success", workout: newWorkout };
    }),

  // createSet: protectedProcedure
  //   .input(
  //     z.object({
  //       // userId: z.string(),
  //       workoutId: z.string().optional().nullable(),
  //       setNumber: z.number().optional().nullable(),
  //       weightAmount: z.number().optional().nullable(),
  //       weightUnit: z.string().optional().nullable(),
  //       repAmount: z.number().optional().nullable(),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const { workoutId, setNumber, weightAmount, weightUnit, repAmount } =
  //       input;
  //     const newSet = await db.insert(sets).values({
  //       workoutId,
  //       setNumber,
  //       weightAmount,
  //       weightUnit,
  //       repAmount,
  //     });

  //     return { status: "success", set: newSet };
  //   }),
});

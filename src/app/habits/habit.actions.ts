import { createAction, props } from '@ngrx/store';

export const addHabit = createAction(
  '[Habit] Add',
  props<{ title: string; description?: string,  monthlyGoal?: number}>()
);

export const toggleDay = createAction(
  '[Habit] Toggle Day',
  props<{ habitId: string; date: string }>()
);

export const deleteHabit = createAction('[Habit] Delete', props<{ habitId: string }>());


export const updateMonthlyGoal = createAction(
  '[Habit] Update Monthly Goal',
  props<{ habitId: string; goal: number }>()
);


import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HabitState } from './habit.reducer';
import { Habit } from './habit.model';

// 1. Selettore dello stato dei habits
export const selectHabitState = createFeatureSelector<HabitState>('habits');

// 2. Tutti gli habits
export const selectAllHabits = createSelector(
  selectHabitState,
  (state) => state.habits
);

// 3. Solo gli habit completati oggi
export const selectHabitsCompletedToday = createSelector(
  selectAllHabits,
  (habits) => {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter(habit => habit.completedDays.includes(today));
  }
);

// 4. Habit specifico per ID (utile nei dettagli)
export const selectHabitById = (habitId: string) => createSelector(
  selectAllHabits,
  (habits) => habits.find(h => h.id === habitId)
);

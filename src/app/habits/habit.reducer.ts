import { createReducer, on } from '@ngrx/store';
import { addHabit, toggleDay, deleteHabit, updateMonthlyGoal} from './habit.actions';
import { Habit } from './habit.model';
import { v4 as uuid } from 'uuid';

export interface HabitState {
  habits: Habit[];
}

const storedHabits = localStorage.getItem('habits');
const initialState: HabitState = {
  habits: storedHabits ? JSON.parse(storedHabits) : []
};

function persist(state: HabitState): HabitState {
  localStorage.setItem('habits', JSON.stringify(state.habits));
  return state;
}

export const habitReducer = createReducer(
  initialState,

  // Add new habit
  on(addHabit, (state, { title, description, monthlyGoal }) => {
    const newHabit: Habit = {
      id: uuid(),
      title,
      description,
      completedDays: [],
      monthlyGoal,
      createdAt: new Date().toISOString()
    };
    const updatedState = {
      ...state,
      habits: [...state.habits, newHabit]
    };
    return persist(updatedState);
  }),

  // Toggle completion for a specific day
  on(toggleDay, (state, { habitId, date }) => {
    const updatedState = {
      ...state,
      habits: state.habits.map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              completedDays: habit.completedDays.includes(date)
                ? habit.completedDays.filter(d => d !== date)
                : [...habit.completedDays, date]
            }
          : habit
      )
    };
    return persist(updatedState);
  }),

  // Delete a habit
  on(deleteHabit, (state, { habitId }) => {
    const updatedState = {
      ...state,
      habits: state.habits.filter(h => h.id !== habitId)
    };
    return persist(updatedState);
  }),

  // Update monthlyGoal
  on(updateMonthlyGoal, (state, { habitId, goal }) => ({
    ...state,
    habits: state.habits.map(h =>
      h.id === habitId ? { ...h, monthlyGoal: goal } : h
    )
  }))  
);

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { habitReducer } from './habits/habit.reducer';
import { HabitEffects } from './habits/habit.effects';
import { provideRouter } from '@angular/router';

export const appConfig = [
  provideStore({ habits: habitReducer }),
  provideEffects([HabitEffects]),
  provideRouter([
      {
        path: '',
        redirectTo: 'habits',
        pathMatch: 'full'
      },
      {
        path: 'habits',
        loadComponent: () => import('./habits/components/habits-page.component').then(m => m.HabitsPageComponent)
      }
    ])
];

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitFormComponent } from './habit-form.component';
import { HabitListComponent } from './habit-list.component';

@Component({
  selector: 'app-habits-page',
  standalone: true,
  imports: [CommonModule, HabitFormComponent, HabitListComponent],
  template: `
    <div class="p-4">
      <h2>Habit Tracker</h2>
      <app-habit-form></app-habit-form>
      <div class="mt-4">
        <app-habit-list></app-habit-list>
      </div>
    </div>
  `
})
export class HabitsPageComponent {}

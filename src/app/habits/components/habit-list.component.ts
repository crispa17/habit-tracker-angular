import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Habit } from '../habit.model';
import * as HabitActions from '../habit.actions';
import { selectAllHabits } from '../habit.selectors';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
  FormsModule
} from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    FormsModule,
    ProgressBarModule,
  ],
  template: `
<p-card header="Your Habits" class="mt-4">
  <div class="mb-3">
    <input
      pInputText
      type="text"
      [(ngModel)]="filter"
      placeholder="Search habits"
      class="w-full"
    />
  </div>

  @if(filteredHabits$ | async; as habits){
    <ul class="list-none p-0 m-0">
      @for(h of habits; track h){
        <li class="mb-4 pb-4 border-b">
            <div class="flex justify-between items-start w-full">
              <div class="flex-1 pr-4">
                <strong class="text-lg block">{{ h.title }}</strong>
                <p class="text-sm text-gray-600 mt-1" *ngIf="h.description">{{ h.description }}</p>
                <div class="mt-1">
                  <span
                    class="inline-block px-2 py-1 rounded text-sm font-semibold"
                    [ngClass]="{
                      'bg-green-100 text-green-800': isCompletedToday(h),
                      'bg-gray-200 text-gray-600': !isCompletedToday(h)
                    }"
                  >
                    {{ isCompletedToday(h) ? 'Completed today' : 'Not done today' }}
                  </span>

                  <span class="text-sm text-gray-500 ml-3">
                    🔥 {{ getStreak(h) }} day streak
                  </span>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <button
                  pButton
                  type="button"
                  icon="pi pi-check"
                  class="p-button-sm p-button-rounded p-button-success"
                  (click)="toggleToday(h.id)"
                ></button>

                <button
                  pButton
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-sm p-button-rounded p-button-danger"
                  (click)="deleteHabit(h.id)"
                ></button>
              </div>
            </div>

            <!-- Monthly Progress -->
            @if(h.monthlyGoal){ 
              <div class="mt-3 w-full">
                <p class="text-xs text-gray-500 mb-1">📅 Monthly Progress</p>
                <p-progressBar [value]="getMonthlyProgress(h)" [showValue]="true" styleClass="w-full"></p-progressBar>
                <small class="text-xs text-gray-400">Goal: {{ h.monthlyGoal }} days</small>
              </div>
            }
        </li>
      }
    </ul>
  }
</p-card>

  `,
})
export class HabitListComponent {
  habits$: Observable<Habit[]>;

  filter: string = '';

  habitForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    monthlyGoal: new FormControl(0),
  });

  constructor(private store: Store) {
    this.habits$ = this.store.select(selectAllHabits);
  }

  addHabit() {
    if (this.habitForm.invalid) return;

    const { title, description, monthlyGoal } = this.habitForm.value!;
    this.store.dispatch(
      HabitActions.addHabit({
        title: title ?? '',
        description: description ?? '',
        monthlyGoal: monthlyGoal ?? 0,
      })
    );
    this.habitForm.reset();
  }

  toggleToday(habitId: string) {
    const today = new Date().toISOString().split('T')[0];
    this.store.dispatch(HabitActions.toggleDay({ habitId, date: today }));
  }

  isCompletedToday(habit: Habit): boolean {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDays.includes(today);
  }

  getStreak(habit: Habit): number {
    const sorted = [...habit.completedDays].sort((a, b) => b.localeCompare(a));
    let streak = 0;
    let date = new Date();

    for (const d of sorted) {
      const dStr = date.toISOString().split('T')[0];
      if (d === dStr) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  deleteHabit(habitId: string) {
    this.store.dispatch(HabitActions.deleteHabit({ habitId }));
  }

  get filteredHabits$(): Observable<Habit[]> {
    return this.habits$.pipe(
      map((habits) =>
        habits.filter((h) =>
          h.title.toLowerCase().includes(this.filter.toLowerCase())
        )
      )
    );
  }

  getMonthlyProgress(habit: Habit): number {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
    const completedThisMonth = habit.completedDays.filter(date =>
      date.startsWith(yearMonth)
    ).length;
  
    const goal = habit.monthlyGoal ?? 10;
    return Math.min(100, Math.round((completedThisMonth / goal) * 100));
  }

  updateGoal(habitId: string, goal: number) {
    this.store.dispatch(HabitActions.updateMonthlyGoal({ habitId, goal }));
  }  
  
}

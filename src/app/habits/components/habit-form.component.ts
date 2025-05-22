import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addHabit } from '../habit.actions';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="p-fluid">
      <div class="field">
        <input pInputText formControlName="title" placeholder="Title" />
      </div>
      <div class="field">
        <input pInputText formControlName="description" placeholder="Description (optional)" />
      </div>
      <div class="field mb-4">
        <input pInputText formControlName="monthlyGoal" placeholder="Monthly Goal (optional)" type="number"/>
      </div>
      <button pButton type="submit" label="Add Habit" [disabled]="form.invalid"></button>
    </form>
  `
})
export class HabitFormComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    monthlyGoal: [null, [Validators.max(31), Validators.min(1)]]
  });

  submit() {
    if (this.form.valid) {
      const newHabit = {
        title: this.form.value.title,
        description: this.form.value.description,
        monthlyGoal: this.form.value.monthlyGoal
      };
      this.store.dispatch(addHabit({ title: newHabit.title, description: newHabit.description, monthlyGoal: newHabit.monthlyGoal }));
      this.form.reset();
    }
  }
}

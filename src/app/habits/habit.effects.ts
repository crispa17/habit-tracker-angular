import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class HabitEffects {
  constructor(private actions$: Actions) {}
}

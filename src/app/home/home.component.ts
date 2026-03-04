import { Component } from '@angular/core';
import type { OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RandomizerComponent } from '../randomizer/randomizer.component';
import { CommonModule } from '@angular/common';

type HomeForm = {
  nameList: FormControl<string>;
  minValue: FormControl<number | null>;
  maxValue: FormControl<number | null>;
};

const integerValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as number | null;

  if (value === null || value === undefined) return null;

  return Number.isInteger(value) ? null : { integer: true };
};

const validRangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const form = control as FormGroup<HomeForm>;
  const minValue = form.controls.minValue.value;
  const maxValue = form.controls.maxValue.value;

  if (minValue === null || maxValue === null) return null;

  return minValue <= maxValue ? null : { invalidRange: true };
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RandomizerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public items: string[] = [];
  public showRandomizer: boolean = false;
  public form: FormGroup<HomeForm> = new FormGroup<HomeForm>(
    {
      nameList: new FormControl('', { nonNullable: true }),
      minValue: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(1), integerValidator],
      }),
      maxValue: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(1), integerValidator],
      }),
    },
    { validators: [validRangeValidator] }
  );

  constructor() {}

  ngOnInit(): void {
    const names = localStorage.getItem('names');
    if (names) this.form.get('nameList')?.setValue(names);
  }

  public randomizeName(): void {
    const names = this.getValidNames();

    if (names.length === 0) {
      this.form.controls.nameList.markAsTouched();
      this.items = [];
      this.showRandomizer = false;
      return;
    }

    localStorage.setItem('names', this.form.controls.nameList.value);
    this.items = names;
    this.showRandomizer = true;
  }

  public randomizeNumber() {
    this.items = [];

    this.form.controls.minValue.markAsTouched();
    this.form.controls.maxValue.markAsTouched();
    this.form.updateValueAndValidity();

    if (!this.canRandomizeNumber()) {
      this.showRandomizer = false;
      return;
    }

    const minValue = this.form.controls.minValue.value as number;
    const maxValue = this.form.controls.maxValue.value as number;

    for (let i = minValue; i <= maxValue; i++) {
      this.items.push(i.toString());
    }

    this.showRandomizer = true;
  }

  public onClose() {
    this.showRandomizer = false;
    this.items = [];
  }

  public canRandomizeName(): boolean {
    return this.getValidNames().length > 0;
  }

  public canRandomizeNumber(): boolean {
    const minValueControl = this.form.controls.minValue;
    const maxValueControl = this.form.controls.maxValue;

    return (
      minValueControl.valid &&
      maxValueControl.valid &&
      !this.form.hasError('invalidRange')
    );
  }

  private getValidNames(): string[] {
    return this.form.controls.nameList.value
      .split('\n')
      .map((name: string) => name.trim())
      .filter(Boolean);
  }
}

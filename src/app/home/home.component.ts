import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RandomizerComponent } from '../randomizer/randomizer.component';
import { CommonModule } from '@angular/common';

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
  public form: FormGroup = new FormGroup({
    nameList: new FormControl(),
    minValue: new FormControl(),
    maxValue: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {
    const names = localStorage.getItem('names');
    if (names) this.form.get('nameList')?.setValue(names);
  }

  public randomizeName(): void {
    const rawNames = this.form.get('nameList')?.value;

    const names = rawNames
      ?.split('\n')
      .map((n: string) => n.trim())
      .filter(Boolean);

    if (names) {
      localStorage.setItem('names', rawNames);
      this.items = names;
      this.showRandomizer = true;
    }
  }

  public randomizeNumber() {
    this.items = [];

    const minValue = Number(this.form.get('minValue')?.value);
    const maxValue = Number(this.form.get('maxValue')?.value);

    if (minValue == 0 && maxValue == 0) return;

    for (let i = minValue; i <= maxValue; i++) {
      this.items.push(i.toString());
    }

    this.showRandomizer = true;
  }

  public onClose() {
    this.showRandomizer = false;
    this.items = [];
  }
}

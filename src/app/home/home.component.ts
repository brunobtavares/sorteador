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

  public randomizeName() {
    this.items = [];

    const names = this.form
      .get('nameList')
      ?.value?.split('\n')
      ?.filter((n: String) => n.trim());

    localStorage.setItem('names', this.form.get('nameList')?.value);

    this.items = names;
    this.showRandomizer = true;
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

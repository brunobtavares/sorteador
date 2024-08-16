import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set nameList value from localStorage on init if it exists', () => {
    const names = 'Alice\nBob\nCharlie';
    localStorage.setItem('names', names);

    component.ngOnInit();

    expect(component.form.get('nameList')?.value).toBe(names);
  });

  it('should update items and showRandomizer when randomizeName is called', () => {
    component.form.get('nameList')?.setValue('Alice\nBob\nCharlie');

    component.randomizeName();

    expect(component.items).toEqual(['Alice', 'Bob', 'Charlie']);
    expect(component.showRandomizer).toBeTrue();
    expect(localStorage.getItem('names')).toBe('Alice\nBob\nCharlie');
  });

  it('should clear items and update showRandomizer when randomizeName is called with empty input', () => {
    component.form.get('nameList')?.setValue('');

    component.randomizeName();

    expect(component.items).toEqual([]);
    expect(component.showRandomizer).toBeTrue();
  });

  it('should populate items with numbers from minValue to maxValue when randomizeNumber is called', () => {
    component.form.get('minValue')?.setValue(1);
    component.form.get('maxValue')?.setValue(5);

    component.randomizeNumber();

    expect(component.items).toEqual(['1', '2', '3', '4', '5']);
    expect(component.showRandomizer).toBeTrue();
  });

  it('should clear items and update showRandomizer when minValue and maxValue are 0', () => {
    component.form.get('minValue')?.setValue(0);
    component.form.get('maxValue')?.setValue(0);

    component.randomizeNumber();

    expect(component.items).toEqual([]);
    expect(component.showRandomizer).toBeFalse();
  });

  it('should reset showRandomizer and items when onClose is called', () => {
    component.items = ['item1', 'item2'];
    component.showRandomizer = true;

    component.onClose();

    expect(component.items).toEqual([]);
    expect(component.showRandomizer).toBeFalse();
  });
});

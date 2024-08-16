import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RandomizerComponent } from './randomizer.component';

const timeOutMS = 5500;

describe('RandomizerComponent', () => {
  let component: RandomizerComponent;
  let fixture: ComponentFixture<RandomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomizerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set winner to "Todos já foram sorteados!" if items are empty', async () => {
    component.items = [];

    await component.randomizer();

    expect(component.winner).toBe('Todos já foram sorteados!');
  });

  it('should call stopRandomizer after 5000ms', fakeAsync(() => {
    spyOn(component, 'stopRandomizer').and.callThrough();
    component.items = ['item1', 'item2'];
    component.randomizer();

    tick(5000);

    expect(component.stopRandomizer).toHaveBeenCalledWith(5000);

    flush();
  }));

  it('should set showWinner to true after randomizer completes', fakeAsync(() => {
    component.items = ['item1', 'item2'];

    component.randomizer();
    tick(timeOutMS);

    expect(component.showWinner).toBeTrue();

    flush();
  }));

  it('should update winner and winners array during randomizer execution', fakeAsync(() => {
    const items = ['item1', 'item2', 'item3'];
    component.items = items;

    component.randomizer();
    tick(timeOutMS);

    expect(component.winners.length).toBeGreaterThan(0);
    expect(component.winners).toContain(component.winner);

    flush();
  }));

  it('should remove the winner from items array', fakeAsync(() => {
    const items = ['item1', 'item2', 'item3'];
    component.items = [...items];

    component.randomizer();
    tick(timeOutMS);

    expect(component.items.length).toBe(items.length - 1);

    flush();
  }));

  it('should clear console and log winners after randomizer completes', fakeAsync(() => {
    spyOn(console, 'clear');
    spyOn(console, 'table');
    component.items = ['item1', 'item2'];

    component.randomizer();
    tick(timeOutMS);

    expect(console.clear).toHaveBeenCalled();
    expect(console.table).toHaveBeenCalledWith(component.winners);

    flush();
  }));

  it('should clear console and log winners after randomizer completes with one item', () => {
    spyOn(console, 'clear');
    spyOn(console, 'table');
    component.items = ['item1'];

    component.randomizer();

    expect(console.clear).toHaveBeenCalled();
    expect(console.table).toHaveBeenCalledWith(component.winners);
  });

  it('should do nothing when loading is true', () => {
    spyOn(console, 'clear');
    spyOn(component, 'stopRandomizer');

    component.loading = true;

    component.randomizer();

    expect(console.clear).not.toHaveBeenCalled();
    expect(component.stopRandomizer).not.toHaveBeenCalled();
  });
});

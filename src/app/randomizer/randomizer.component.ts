import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-randomizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './randomizer.component.html',
  styleUrl: './randomizer.component.scss',
})
export class RandomizerComponent implements OnInit, OnDestroy {
  private inputItems: string[] = [];
  private stopTimer?: ReturnType<typeof setTimeout>;
  private resolveStopTimer?: () => void;
  private destroyed: boolean = false;

  @Input() set items(value: string[]) {
    this.inputItems = Array.isArray(value) ? value : [];
    this.remainingItems = [...this.inputItems];
    this.winner = '';
    this.winners = [];
    this.showWinner = false;
  }

  get items(): string[] {
    return this.inputItems;
  }

  @Output() onClose: EventEmitter<void> = new EventEmitter();

  public winner: string = '';
  public winners: string[] = [];
  public showWinner: boolean = false;
  public remainingItems: string[] = [];

  public loading: boolean = false;

  ngOnInit(): void {
    this.destroyed = false;
    this.randomizer();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.loading = false;
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = undefined;
    }
    if (this.resolveStopTimer) {
      this.resolveStopTimer();
      this.resolveStopTimer = undefined;
    }
  }

  public async randomizer() {
    if (this.loading) return;

    const listSize = this.remainingItems.length;

    if (listSize < 1) {
      this.winner = 'Todos já foram sorteados!';
      return;
    } else if (listSize == 1) {
      this.winner = this.remainingItems[0];
      this.listWinners(this.winner);
      this.remainingItems = [];
      this.showWinner = true;
      return;
    }

    this.showWinner = false;
    this.loading = true;

    const stopRandomizerPromise = this.stopRandomizer(5000);

    let sleepTimeMS = 100;
    while (this.loading && !this.destroyed) {
      const randomIndex = Math.floor(Math.random() * listSize);
      this.winner = this.remainingItems[randomIndex];
      await this.sleep(sleepTimeMS);
      sleepTimeMS += 20;
    }

    if (this.destroyed) return;

    await stopRandomizerPromise;

    if (this.destroyed) return;

    const finalIndex = Math.floor(Math.random() * listSize);
    this.winner = this.remainingItems[finalIndex];

    this.listWinners(this.winner);

    this.remainingItems.splice(finalIndex, 1);

    this.showWinner = true;
  }

  public async stopRandomizer(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.resolveStopTimer = resolve;
      this.stopTimer = setTimeout(() => {
        this.loading = false;
        this.stopTimer = undefined;
        this.resolveStopTimer = undefined;
        resolve();
      }, ms);
    });
  }

  private listWinners(winner: string) {
    this.winners.push(winner);

    console.clear();
    console.table(this.winners);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

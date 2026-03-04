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
  private readonly shuffleDurationMS: number = 5000;
  private inputItems: string[] = [];
  private shuffledQueue: string[] = [];
  private stopTimer?: ReturnType<typeof setTimeout>;
  private resolveStopTimer?: () => void;
  private destroyed: boolean = false;

  @Input() set items(value: string[]) {
    this.inputItems = Array.isArray(value) ? value : [];
    this.remainingItems = [...this.inputItems];
    this.shuffledQueue = this.shuffleItems([...this.inputItems]);
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
      this.shuffledQueue = [];
      this.showWinner = true;
      return;
    }

    this.showWinner = false;
    this.loading = true;

    const stopRandomizerPromise = this.stopRandomizer(this.shuffleDurationMS);
    const shuffleStartMS = Date.now();

    while (this.loading && !this.destroyed) {
      const randomIndex = this.randomInt(listSize);
      this.winner = this.remainingItems[randomIndex];
      const elapsedMS = Date.now() - shuffleStartMS;
      const progress = Math.min(elapsedMS / this.shuffleDurationMS, 1);
      await this.sleep(this.getShuffleFrameDelay(progress));
    }

    if (this.destroyed) return;

    await stopRandomizerPromise;

    if (this.destroyed) return;

    const nextWinner = this.shuffledQueue.pop();
    if (!nextWinner) {
      this.winner = 'Todos já foram sorteados!';
      this.showWinner = true;
      return;
    }
    this.winner = nextWinner;

    this.listWinners(this.winner);

    const finalIndex = this.remainingItems.indexOf(nextWinner);
    if (finalIndex === -1) {
      this.showWinner = true;
      return;
    }
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

  private getShuffleFrameDelay(progress: number): number {
    const easedProgress = Math.min(Math.max(progress, 0), 1) ** 2;
    const minDelayMS = 30;
    const maxDelayMS = 140;

    return Math.round(minDelayMS + (maxDelayMS - minDelayMS) * easedProgress);
  }

  private shuffleItems(items: string[]): string[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
  }

  private randomInt(maxExclusive: number): number {
    if (maxExclusive <= 1) return 0;

    const cryptoApi = globalThis.crypto;
    if (cryptoApi?.getRandomValues) {
      const upperBound = 0x1_0000_0000;
      const unbiasedLimit = upperBound - (upperBound % maxExclusive);
      const randomBuffer = new Uint32Array(1);

      do {
        cryptoApi.getRandomValues(randomBuffer);
      } while (randomBuffer[0] >= unbiasedLimit);

      return randomBuffer[0] % maxExclusive;
    }

    return Math.floor(Math.random() * maxExclusive);
  }
}

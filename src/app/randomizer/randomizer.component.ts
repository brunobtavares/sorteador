import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-randomizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './randomizer.component.html',
  styleUrl: './randomizer.component.scss',
})
export class RandomizerComponent implements OnInit {
  @Input() items: string[] = [];
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  public winner: string = '';
  public winners: string[] = [];
  public showWinner: boolean = false;

  public loading: boolean = false;

  ngOnInit(): void {
    this.randomizer();
  }

  public async randomizer() {
    if (this.loading) return;

    const listSize = this.items.length;

    if (listSize < 1) {
      this.winner = 'Todos já foram sorteados!';
      return;
    } else if (listSize == 1) {
      this.winner = this.items[0];
      this.listWinners(this.winner);
      this.items = [];
      return;
    }

    this.showWinner = false;
    this.loading = true;

    const stopRandomizerPromise = this.stopRandomizer(5000);

    let sleepTimeMS = 100;
    while (this.loading) {
      const randomIndex = Math.floor(Math.random() * listSize);
      this.winner = this.items[randomIndex];
      await this.sleep(sleepTimeMS);
      sleepTimeMS += 20;
    }

    await stopRandomizerPromise;

    const finalIndex = Math.floor(Math.random() * listSize);
    this.winner = this.items[finalIndex];

    this.listWinners(this.winner);

    this.items.splice(finalIndex, 1);

    this.showWinner = true;
  }

  public async stopRandomizer(ms: number): Promise<void> {
    await this.sleep(ms);
    this.loading = false;
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

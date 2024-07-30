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
  public showFireworks: boolean = false;

  private loading: boolean = false;

  ngOnInit(): void {
    this.randomizer();
  }

  public async randomizer() {
    const listSize = this.items.length;
    if (listSize < 1) {
      this.winner = 'Todos já foram sorteados!';
      return;
    }

    this.showFireworks = false;
    this.loading = true;
    setTimeout(() => this.stopRandomizer(), 3000);

    while (this.loading) {
      const randomNumber = Math.floor(Math.random() * listSize);
      this.winner = this.items[randomNumber];
      await this.sleep(150);
    }

    const randomNumber = Math.floor(Math.random() * listSize);

    this.showFireworks = true;
    this.winner = this.items[randomNumber];

    this.winners.push(this.winner);

    console.clear();
    console.table(this.winners);

    this.items.splice(randomNumber, 1);
  }

  public stopRandomizer() {
    this.loading = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

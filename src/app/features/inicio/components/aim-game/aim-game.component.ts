import { Component, OnDestroy, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

const TOTAL_TARGETS = 20;

type GameStatus = 'idle' | 'playing' | 'finished';

interface TargetPosition {
  x: number;
  y: number;
  size: number;
}

@Component({
  selector: 'app-aim-game',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './aim-game.component.html',
})
export class AimGameComponent implements OnDestroy {
  protected readonly totalTargets = TOTAL_TARGETS;
  protected readonly status = signal<GameStatus>('idle');
  protected readonly points = signal(0);
  protected readonly misses = signal(0);
  protected readonly remaining = signal(TOTAL_TARGETS);
  protected readonly elapsedMs = signal(0);
  protected readonly target = signal<TargetPosition>({ x: 50, y: 50, size: 42 });

  protected readonly accuracy = computed(() => {
    const attempts = this.points() + this.misses();
    return attempts === 0 ? 0 : Math.round((this.points() / attempts) * 100);
  });

  protected readonly seconds = computed(() => (this.elapsedMs() / 1000).toFixed(1));
  protected readonly progress = computed(() => (this.points() / TOTAL_TARGETS) * 100);

  private timerId: number | undefined;
  private startedAt = 0;

  protected start(): void {
    this.stopTimer();
    this.status.set('playing');
    this.points.set(0);
    this.misses.set(0);
    this.remaining.set(TOTAL_TARGETS);
    this.elapsedMs.set(0);
    this.spawnTarget();

    this.startedAt = Date.now();
    this.timerId = window.setInterval(() => {
      this.elapsedMs.set(Date.now() - this.startedAt);
    }, 100);
  }

  protected hit(event: Event): void {
    event.stopPropagation();

    if (this.status() !== 'playing') {
      return;
    }

    this.points.update((value) => value + 1);
    this.remaining.update((value) => value - 1);

    if (this.remaining() === 0) {
      this.finish();
      return;
    }

    this.spawnTarget();
  }

  protected miss(): void {
    if (this.status() === 'playing') {
      this.misses.update((value) => value + 1);
    }
  }

  private spawnTarget(): void {
    this.target.set({
      x: 12 + Math.random() * 76,
      y: 14 + Math.random() * 72,
      size: 34 + Math.random() * 18,
    });
  }

  private finish(): void {
    this.stopTimer();
    this.elapsedMs.set(Date.now() - this.startedAt);
    this.status.set('finished');
  }

  private stopTimer(): void {
    if (this.timerId !== undefined) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}

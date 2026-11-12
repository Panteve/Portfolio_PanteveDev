import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

const FOLLOW_FACTOR = 0.14;
const REST_X_RATIO = 0.2;
const REST_Y_RATIO = 0.18;
const FRAME_MS = 1000 / 60;
const MAX_FRAME_DELTA = 64;
const SETTLE_DISTANCE = 0.3;

@Component({
  selector: 'app-ambient-background',
  templateUrl: './ambient-background.component.html',
  styleUrl: './ambient-background.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'aria-hidden': 'true' },
})
export class AmbientBackgroundComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;

  private frame = 0;
  private lastFrameTime = 0;
  private trackingEnabled = false;
  private pointerActive = false;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private motionQuery: MediaQueryList | null = null;
  private pointerQuery: MediaQueryList | null = null;

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.trackingEnabled || event.pointerType === 'touch') {
      return;
    }

    this.pointerActive = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.targetX = event.clientX;
    this.targetY = event.clientY;
    this.startAnimation();
  };

  private readonly onPointerLeave = (): void => {
    if (!this.trackingEnabled) {
      return;
    }

    this.pointerActive = false;
    this.setRestTarget();
    this.startAnimation();
  };

  private readonly onResize = (): void => {
    this.updateViewport();

    if (!this.trackingEnabled) {
      this.resetToRest();
      return;
    }

    if (this.pointerActive) {
      this.targetX = this.lastPointerX;
      this.targetY = this.lastPointerY;
      this.startAnimation();
      return;
    }

    this.resetToRest();
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) {
      this.cancelAnimation();
      return;
    }

    if (this.trackingEnabled && this.isPending()) {
      this.startAnimation();
    }
  };

  private readonly onMediaChange = (): void => {
    const enabled = this.shouldTrack();
    if (enabled === this.trackingEnabled) {
      return;
    }

    this.trackingEnabled = enabled;

    if (!enabled) {
      this.resetToRest();
    }
  };

  ngAfterViewInit(): void {
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.pointerQuery = window.matchMedia('(pointer: fine)');
    this.trackingEnabled = this.shouldTrack();

    this.updateViewport();
    this.resetToRest();

    this.zone.runOutsideAngular(() => {
      this.motionQuery?.addEventListener('change', this.onMediaChange);
      this.pointerQuery?.addEventListener('change', this.onMediaChange);
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.onPointerLeave);
      window.addEventListener('resize', this.onResize, { passive: true });
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    });
  }

  ngOnDestroy(): void {
    this.cancelAnimation();
    this.motionQuery?.removeEventListener('change', this.onMediaChange);
    this.pointerQuery?.removeEventListener('change', this.onMediaChange);
    window.removeEventListener('pointermove', this.onPointerMove);
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private shouldTrack(): boolean {
    return (
      !!this.motionQuery &&
      !this.motionQuery.matches &&
      !!this.pointerQuery &&
      this.pointerQuery.matches
    );
  }

  private setRestTarget(): void {
    this.targetX = window.innerWidth * REST_X_RATIO;
    this.targetY = window.innerHeight * REST_Y_RATIO;
  }

  private updateViewport(): void {
    const host = this.host.nativeElement;
    host.style.setProperty('--viewport-w', `${window.innerWidth}px`);
    host.style.setProperty('--viewport-h', `${window.innerHeight}px`);
  }

  private resetToRest(): void {
    this.cancelAnimation();
    this.pointerActive = false;
    this.setRestTarget();
    this.currentX = this.targetX;
    this.currentY = this.targetY;
    this.applyPosition();
  }

  private startAnimation(): void {
    if (!this.trackingEnabled || this.frame || document.hidden) {
      return;
    }

    this.lastFrameTime = 0;
    this.frame = requestAnimationFrame(this.step);
  }

  private cancelAnimation(): void {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }

    this.lastFrameTime = 0;
  }

  private isPending(): boolean {
    return (
      Math.abs(this.targetX - this.currentX) >= SETTLE_DISTANCE ||
      Math.abs(this.targetY - this.currentY) >= SETTLE_DISTANCE
    );
  }

  private readonly step = (now: number): void => {
    this.frame = 0;

    if (!this.trackingEnabled) {
      this.lastFrameTime = 0;
      return;
    }

    const elapsed = this.lastFrameTime === 0 ? FRAME_MS : now - this.lastFrameTime;
    const delta = Math.min(Math.max(elapsed, 1), MAX_FRAME_DELTA);
    this.lastFrameTime = now;

    const alpha = 1 - Math.pow(1 - FOLLOW_FACTOR, delta / FRAME_MS);
    const dx = this.targetX - this.currentX;
    const dy = this.targetY - this.currentY;

    if (Math.abs(dx) < SETTLE_DISTANCE && Math.abs(dy) < SETTLE_DISTANCE) {
      this.currentX = this.targetX;
      this.currentY = this.targetY;
      this.applyPosition();
      this.lastFrameTime = 0;
      return;
    }

    this.currentX += dx * alpha;
    this.currentY += dy * alpha;
    this.applyPosition();
    this.frame = requestAnimationFrame(this.step);
  };

  /**
   * El CSS usa `--glow-x` / `--glow-y` para colocar el azul y calcula el
   * violeta en el punto espejo con las dimensiones reales del viewport.
   */
  private applyPosition(): void {
    const host = this.host.nativeElement;
    host.style.setProperty('--glow-x', `${this.currentX.toFixed(1)}px`);
    host.style.setProperty('--glow-y', `${this.currentY.toFixed(1)}px`);
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';

const FOLLOW_FACTOR = 0.14;
const REST_X_RATIO = 0.2;
const REST_Y_RATIO = 0.18;

@Component({
  selector: 'app-ambient-background',
  templateUrl: './ambient-background.component.html',
  styleUrl: './ambient-background.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'aria-hidden': 'true' },
})
export class AmbientBackgroundComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly teal = viewChild<ElementRef<HTMLElement>>('teal');
  private readonly violet = viewChild<ElementRef<HTMLElement>>('violet');

  private frame = 0;
  private listening = false;
  private pointerActive = false;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;

  private readonly onPointerMove = (event: PointerEvent): void => {
    // En pantallas táctiles el fondo permanece estático.
    if (event.pointerType === 'touch') {
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
    this.pointerActive = false;
    this.setRestTarget();
    this.startAnimation();
  };

  private readonly onResize = (): void => {
    if (this.pointerActive) {
      this.targetX = this.lastPointerX;
      this.targetY = this.lastPointerY;
    } else {
      this.setRestTarget();
      this.currentX = this.targetX;
      this.currentY = this.targetY;
      this.render();
    }

    this.startAnimation();
  };

  ngAfterViewInit(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    // En táctil o con movimiento reducido, el CSS deja los brillos fijos y responsive.
    if (reducedMotion || !finePointer) {
      return;
    }

    this.setRestTarget();
    this.currentX = this.targetX;
    this.currentY = this.targetY;
    this.render();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.onPointerLeave);
      window.addEventListener('resize', this.onResize, { passive: true });
    });
    this.listening = true;
  }

  ngOnDestroy(): void {
    if (this.listening) {
      window.removeEventListener('pointermove', this.onPointerMove);
      document.documentElement.removeEventListener('pointerleave', this.onPointerLeave);
      window.removeEventListener('resize', this.onResize);
    }

    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
  }

  private setRestTarget(): void {
    this.targetX = window.innerWidth * REST_X_RATIO;
    this.targetY = window.innerHeight * REST_Y_RATIO;
  }

  private startAnimation(): void {
    if (this.frame) {
      return;
    }

    this.frame = requestAnimationFrame(this.step);
  }

  private readonly step = (): void => {
    this.frame = 0;

    const dx = this.targetX - this.currentX;
    const dy = this.targetY - this.currentY;

    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
      this.currentX = this.targetX;
      this.currentY = this.targetY;
      this.render();
      return;
    }

    this.currentX += dx * FOLLOW_FACTOR;
    this.currentY += dy * FOLLOW_FACTOR;
    this.render();
    this.frame = requestAnimationFrame(this.step);
  };

  /** El violeta se dibuja siempre en el punto opuesto al teal. */
  private render(): void {
    const teal = this.teal()?.nativeElement;
    const violet = this.violet()?.nativeElement;

    if (teal) {
      teal.style.transform = `translate3d(${this.currentX.toFixed(1)}px, ${this.currentY.toFixed(1)}px, 0)`;
    }

    if (violet) {
      const x = window.innerWidth - this.currentX;
      const y = window.innerHeight - this.currentY;
      violet.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  }
}

import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

/**
 * Mueve un foco radial sobre el host siguiendo al puntero.
 * Solo se activa con puntero fino y sin preferencia de movimiento reducido.
 */
@Directive({
  selector: '[appCursorGlow]',
})
export class CursorGlowDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly zone = inject(NgZone);

  private pointerQuery: MediaQueryList | null = null;
  private motionQuery: MediaQueryList | null = null;
  private enabled = false;

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.enabled) {
      return;
    }

    const rect = this.host.nativeElement.getBoundingClientRect();
    const style = this.host.nativeElement.style;
    style.setProperty('--cursor-x', `${event.clientX - rect.left}px`);
    style.setProperty('--cursor-y', `${event.clientY - rect.top}px`);
    style.setProperty('--cursor-glow-opacity', '1');
  };

  private readonly onPointerLeave = (): void => {
    if (this.enabled) {
      this.host.nativeElement.style.setProperty('--cursor-glow-opacity', '0');
    }
  };

  private readonly syncEnabled = (): void => {
    this.enabled = this.pointerQuery?.matches === true && this.motionQuery?.matches === false;

    if (!this.enabled) {
      this.host.nativeElement.style.setProperty('--cursor-glow-opacity', '0');
    }
  };

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.pointerQuery = window.matchMedia('(pointer: fine)');
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.syncEnabled();

    this.zone.runOutsideAngular(() => {
      this.pointerQuery?.addEventListener('change', this.syncEnabled);
      this.motionQuery?.addEventListener('change', this.syncEnabled);
      this.host.nativeElement.addEventListener('pointermove', this.onPointerMove, {
        passive: true,
      });
      this.host.nativeElement.addEventListener('pointerleave', this.onPointerLeave);
    });
  }

  ngOnDestroy(): void {
    this.pointerQuery?.removeEventListener('change', this.syncEnabled);
    this.motionQuery?.removeEventListener('change', this.syncEnabled);
    this.host.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.host.nativeElement.removeEventListener('pointerleave', this.onPointerLeave);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CONTACT_EMAIL } from '../../core/config/contact';
import { SeoService } from '../../core/services/seo.service';
import { PROFILE, SOCIAL_LINKS } from '../../data/profile';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ContactoService } from './contacto.service';

type FieldName = 'nombre' | 'correo' | 'mensaje';
type EstadoEnvio = 'inactivo' | 'enviando' | 'ok' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return typeof value === 'string' && value.trim().length > 0
    ? null
    : { required: true };
}

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule, IconComponent],
  host: { class: 'flex flex-1 flex-col' },
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  protected readonly profile = PROFILE;
  protected readonly socials = SOCIAL_LINKS;
  protected readonly contactEmail = CONTACT_EMAIL;

  private readonly formBuilder = inject(FormBuilder);
  private readonly contactoService = inject(ContactoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [requiredTrimmed]],
    correo: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    mensaje: ['', [requiredTrimmed]],
    website: [''],
  });

  protected readonly estado = signal<EstadoEnvio>('inactivo');
  protected readonly copied = signal(false);

  private copyTimer?: number;

  private readonly nombreInput = viewChild<ElementRef<HTMLElement>>('nombreInput');
  private readonly correoInput = viewChild<ElementRef<HTMLElement>>('correoInput');
  private readonly mensajeInput = viewChild<ElementRef<HTMLElement>>('mensajeInput');

  constructor() {
    inject(SeoService).set(
      'Contacto · Diego',
      'Escríbele a Diego: correo, GitHub y LinkedIn para hablar de proyectos o prácticas.',
    );

    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== undefined) {
        window.clearTimeout(this.copyTimer);
      }
    });
  }

  protected showError(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected errorNombre(): string | null {
    return this.showError('nombre') ? 'Escribe tu nombre' : null;
  }

  protected errorCorreo(): string | null {
    if (!this.showError('correo')) {
      return null;
    }

    return this.form.controls.correo.hasError('required')
      ? 'Escribe tu correo'
      : 'El correo no parece válido';
  }

  protected errorMensaje(): string | null {
    return this.showError('mensaje') ? 'Escribe tu mensaje' : null;
  }

  protected async send(): Promise<void> {
    if (this.estado() === 'enviando') {
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.estado.set('inactivo');
      this.focusFirstInvalid();
      return;
    }

    const { nombre, correo, mensaje, website } = this.form.getRawValue();
    this.estado.set('enviando');

    const resultado = await this.contactoService.enviar({
      nombre: nombre.trim(),
      correo: correo.trim(),
      mensaje: mensaje.trim(),
      website,
    });

    if (resultado.ok) {
      this.form.reset();
      this.estado.set('ok');
      return;
    }

    this.estado.set('error');
  }

  protected async copyEmail(): Promise<void> {
    const copied = await this.writeToClipboard(this.contactEmail);

    if (!copied) {
      this.copied.set(false);
      return;
    }

    this.copied.set(true);

    if (this.copyTimer !== undefined) {
      window.clearTimeout(this.copyTimer);
    }

    this.copyTimer = window.setTimeout(() => this.copied.set(false), 2000);
  }

  private async writeToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // La API puede fallar por permisos; se intenta el fallback clásico.
      }
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      textarea.remove();
      previouslyFocused?.focus();
      return success;
    } catch {
      previouslyFocused?.focus();
      return false;
    }
  }

  private focusFirstInvalid(): void {
    const fields: FieldName[] = ['nombre', 'correo', 'mensaje'];
    const firstInvalid = fields.find((field) => this.form.controls[field].invalid);

    if (!firstInvalid) {
      return;
    }

    const inputs: Record<FieldName, ElementRef<HTMLElement> | undefined> = {
      nombre: this.nombreInput(),
      correo: this.correoInput(),
      mensaje: this.mensajeInput(),
    };

    inputs[firstInvalid]?.nativeElement.focus();
  }
}

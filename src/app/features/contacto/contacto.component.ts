import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '../../core/services/seo.service';
import { PROFILE, SOCIAL_LINKS } from '../../data/profile';
import { IconComponent } from '../../shared/components/icon/icon.component';

type FieldName = 'nombre' | 'correo' | 'mensaje';

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

  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected readonly sent = signal(false);
  protected readonly mailtoHref = signal('');

  constructor() {
    inject(SeoService).set(
      'Contacto · Diego',
      'Escríbele a Diego: correo, GitHub y LinkedIn para hablar de proyectos o prácticas.',
    );
  }

  protected showError(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, correo, mensaje } = this.form.getRawValue();
    const subject = encodeURIComponent(`Contacto desde el portfolio — ${nombre}`);
    const body = encodeURIComponent(`De: ${nombre} <${correo}>\n\n${mensaje}`);

    this.mailtoHref.set(`mailto:${this.profile.email}?subject=${subject}&body=${body}`);
    this.sent.set(true);
  }

  protected writeAnother(): void {
    this.sent.set(false);
    this.mailtoHref.set('');
    this.form.reset();
  }
}

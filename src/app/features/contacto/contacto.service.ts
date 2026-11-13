import { Injectable } from '@angular/core';
import { CONTACT_API_URL } from '../../core/config/contact';

export interface ContactoDatos {
  nombre: string;
  correo: string;
  mensaje: string;
  website: string;
}

export type ContactoResultado = { ok: true } | { ok: false };

@Injectable({ providedIn: 'root' })
export class ContactoService {
  async enviar(datos: ContactoDatos): Promise<ContactoResultado> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(datos),
        signal: controller.signal,
      });

      if (!response.ok) {
        return { ok: false };
      }

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
      } | null;

      return data?.ok === true ? { ok: true } : { ok: false };
    } catch {
      return { ok: false };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}

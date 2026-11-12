import { ProjectStatus } from '../../data/projects';

const STATUS_CLASSES: Record<ProjectStatus, string> = {
  terminado: 'border-accent/30 bg-accent/10 text-accent',
  'en-desarrollo': 'border-warm/30 bg-warm/10 text-warm',
  'en-pausa': 'border-ink/15 bg-ink/5 text-muted',
};

export function statusBadgeClass(status: ProjectStatus): string {
  return `chip ${STATUS_CLASSES[status]}`;
}

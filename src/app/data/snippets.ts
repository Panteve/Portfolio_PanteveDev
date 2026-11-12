export interface CodeSnippet {
  id: string;
  projectId: string;
  projectName: string;
  language: string;
  description: string;
  code: string;
}

// Fragmentos ilustrativos. TODO(diego): reemplazar por código real del repo.
export const SNIPPETS: CodeSnippet[] = [
  {
    id: 'pesos-pipe',
    projectId: 'pos-multisucursal',
    projectName: 'POS multisucursal',
    language: 'typescript',
    description: 'Formateo de pesos colombianos para tickets y totales.',
    code: `@Pipe({ name: 'pesos' })
export class PesosPipe implements PipeTransform {
  transform(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }
}`,
  },
  {
    id: 'venta-prisma',
    projectId: 'pos-multisucursal',
    projectName: 'POS multisucursal',
    language: 'typescript',
    description: 'Venta + descuento de inventario en una sola transacción.',
    code: `return prisma.$transaction(async (tx) => {
  const venta = await tx.venta.create({ data });

  for (const item of data.items) {
    await tx.stock.update({
      where: { id: item.stockId },
      data: { cantidad: { decrement: item.cantidad } },
    });
  }

  return venta;
});`,
  },
  {
    id: 'spawn-objetivo',
    projectId: 'aimlabs-godot',
    projectName: 'Juego de puntería',
    language: 'gdscript',
    description: 'Aparición aleatoria de objetivos en el rango 3D.',
    code: `func _spawn_target() -> void:
    var target := TARGET.instantiate()
    target.position = Vector3(
        randf_range(-4.0, 4.0),
        randf_range(1.0, 2.5),
        randf_range(-6.0, -2.0)
    )
    add_child(target)`,
  },
];

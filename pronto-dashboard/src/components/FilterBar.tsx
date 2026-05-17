import type { Intencion, Orden } from "../types";

type FilterBarProps = {
  categorias: string[];
  categoriaActiva: string;
  intencionActiva: Intencion;
  orden: Orden;
  onCategoriaChange: (categoria: string) => void;
  onIntencionChange: (intencion: Intencion) => void;
  onOrdenChange: (orden: Orden) => void;
};

export function FilterBar({
  categorias,
  categoriaActiva,
  intencionActiva,
  orden,
  onCategoriaChange,
  onIntencionChange,
  onOrdenChange,
}: FilterBarProps) {
  const intenciones: Intencion[] = ["Todas", "Alta", "Media", "Baja"];

  return (
    <section className="filtros">
      <div className="grupo-filtro">
        <h3>Categoría</h3>

        <div className="botones">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={categoriaActiva === categoria ? "btn activo" : "btn"}
              onClick={() => onCategoriaChange(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      <div className="grupo-filtro">
        <h3>Intención de compra</h3>

        <div className="botones">
          {intenciones.map((intencion) => (
            <button
              key={intencion}
              className={intencionActiva === intencion ? "btn activo" : "btn"}
              onClick={() => onIntencionChange(intencion)}
            >
              {intencion}
            </button>
          ))}
        </div>
      </div>

      <div className="grupo-filtro">
        <h3>Ordenar por fecha</h3>

        <div className="botones">
          <button
            className={orden === "reciente" ? "btn activo" : "btn"}
            onClick={() => onOrdenChange("reciente")}
          >
            Más reciente
          </button>
          <button
            className={orden === "antiguo" ? "btn activo" : "btn"}
            onClick={() => onOrdenChange("antiguo")}
          >
            Más antiguo
          </button>
        </div>
      </div>
    </section>
  );
}

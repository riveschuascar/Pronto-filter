import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

type Intencion = "Todas" | "Alta" | "Media" | "Baja";
type Categoria = "Todas" | "Moto" | "Electrodoméstico" | "Celular" | "Crédito";
type Orden = "mayor" | "menor";

type Lead = {
  id: string;
  nombre: string;
  categoria: Exclude<Categoria, "Todas">;
  intencion: Exclude<Intencion, "Todas">;
  prioridad: number;
  estado?: string;
};

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("Todas");
  const [intencionActiva, setIntencionActiva] = useState<Intencion>("Todas");
  const [orden, setOrden] = useState<Orden>("mayor");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerLeads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "leads"));

        const datos = querySnapshot.docs.map((documento) => {
          const data = documento.data();

          return {
            id: documento.id,
            nombre: data.nombre ?? "Sin nombre",
            categoria: data.categoria ?? "Crédito",
            intencion: data.intencion ?? "Baja",
            prioridad: Number(data.prioridad ?? 0),
            estado: data.estado ?? "Pendiente",
          } as Lead;
        });

        setLeads(datos);
      } catch (error) {
        console.error("Error al obtener leads:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerLeads();
  }, []);

  const categorias: Categoria[] = [
    "Todas",
    "Moto",
    "Electrodoméstico",
    "Celular",
    "Crédito",
  ];

  const intenciones: Intencion[] = ["Todas", "Alta", "Media", "Baja"];

  const leadsFiltrados = useMemo(() => {
    return leads
      .filter((lead) => {
        const coincideCategoria =
          categoriaActiva === "Todas" || lead.categoria === categoriaActiva;

        const coincideIntencion =
          intencionActiva === "Todas" || lead.intencion === intencionActiva;

        return coincideCategoria && coincideIntencion;
      })
      .sort((a, b) => {
        if (orden === "mayor") {
          return b.prioridad - a.prioridad;
        }

        return a.prioridad - b.prioridad;
      });
  }, [leads, categoriaActiva, intencionActiva, orden]);

  if (cargando) {
    return (
      <main className="app">
        <section className="panel">
          <h1>Pronto AI</h1>
          <p>Cargando clientes desde Firebase...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="panel">
        <div className="header">
          <div>
            <h1>Pronto AI</h1>
            <p>Filtro inteligente de conversaciones y clientes potenciales</p>
          </div>

          <span className="contador">
            {leadsFiltrados.length} resultados
          </span>
        </div>

        <section className="filtros">
          <div className="grupo-filtro">
            <h3>Categoría</h3>

            <div className="botones">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  className={categoriaActiva === categoria ? "btn activo" : "btn"}
                  onClick={() => setCategoriaActiva(categoria)}
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
                  onClick={() => setIntencionActiva(intencion)}
                >
                  {intencion}
                </button>
              ))}
            </div>
          </div>

          <div className="grupo-filtro">
            <h3>Ordenar por prioridad</h3>

            <div className="botones">
              <button
                className={orden === "mayor" ? "btn activo" : "btn"}
                onClick={() => setOrden("mayor")}
              >
                Mayor a menor
              </button>

              <button
                className={orden === "menor" ? "btn activo" : "btn"}
                onClick={() => setOrden("menor")}
              >
                Menor a mayor
              </button>
            </div>
          </div>
        </section>

        <section className="tabla-contenedor">
          {leadsFiltrados.length === 0 ? (
            <div className="estado-vacio">
              <h2>No hay clientes para mostrar</h2>
              <p>
                Cuando se conecte la base de datos, aquí aparecerán los clientes
                clasificados por la inteligencia artificial.
              </p>
            </div>
          ) : (
            <table className="tabla-leads">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Categoría</th>
                  <th>Intención</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {leadsFiltrados.map((lead) => (
                  <tr key={lead.id}>
                    <td data-label="ID">{lead.id}</td>

                    <td data-label="Usuario">
                      <div className="usuario">
                        <div className="avatar">
                          {lead.nombre.charAt(0)}
                        </div>

                        <div>
                          <strong>{lead.nombre}</strong>
                          <span>Cliente potencial</span>
                        </div>
                      </div>
                    </td>

                    <td data-label="Categoría">
                      <span className="badge categoria">
                        {lead.categoria}
                      </span>
                    </td>

                    <td data-label="Intención">
                      <span className={`badge intencion-${lead.intencion.toLowerCase()}`}>
                        {lead.intencion}
                      </span>
                    </td>

                    <td data-label="Acción">
                      <button className="btn-accion">
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
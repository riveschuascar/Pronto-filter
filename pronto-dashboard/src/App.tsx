import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";
import { FilterBar } from "./components/FilterBar";
import { ConversationTable } from "./components/ConversationTable";
import type { Conversation, Intencion, Orden } from "./types";

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState < string > ("Todas");
  const [intencionActiva, setIntencionActiva] = useState < Intencion > ("Todas");
  const [orden, setOrden] = useState < Orden > ("reciente");
  const [conversations, setConversations] = useState < Conversation[] > ([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerConversaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "conversations"));

        const datos = querySnapshot.docs.map((documento) => {
          const data = documento.data();

          return {
            id: documento.id,
            phone: String(data.phone ?? ""),
            name: String(data.name ?? "Sin nombre"),
            categories: Array.isArray(data.categories)
              ? data.categories.map(String)
              : [],
            products: Array.isArray(data.products)
              ? data.products.map(String)
              : [],
            purchase_intent: String(data.purchase_intent ?? "Sin intención"),
            created_at: data.created_at ?? null,
            updated_at: data.updated_at ?? null,
          } as Conversation;
        });

        setConversations(datos);
      } catch (error) {
        console.error("Error al obtener conversaciones:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerConversaciones();
  }, []);

  const categorias = useMemo(() => {
    const uniqueCategories = new Set < string > ();
    conversations.forEach((conversation) => {
      conversation.categories.forEach((category) => {
        if (category) uniqueCategories.add(category);
      });
    });
    return ["Todas", ...Array.from(uniqueCategories).sort()];
  }, [conversations]);

  const conversacionesFiltradas = useMemo(() => {
    return conversations
      .filter((conversation) => {
        const coincideCategoria =
          categoriaActiva === "Todas" ||
          conversation.categories.includes(categoriaActiva);
        const coincideIntencion =
          intencionActiva === "Todas" ||
          conversation.purchase_intent.toLowerCase() === intencionActiva.toLowerCase();
        return coincideCategoria && coincideIntencion;
      })
      .sort((a, b) => {
        const fechaA = a.created_at?.seconds ?? 0;
        const fechaB = b.created_at?.seconds ?? 0;
        return orden === "reciente" ? fechaB - fechaA : fechaA - fechaB;
      });
  }, [conversations, categoriaActiva, intencionActiva, orden]);

  return (
    <main className="app">
      <section className="panel">
        <div className="header">
          <div>
            <h1>Conversaciones</h1>
            <p>Filtro inteligente de conversaciones de clientes</p>
          </div>

          <span className="contador">
            {conversacionesFiltradas.length} resultados
          </span>
        </div>

        <FilterBar
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          intencionActiva={intencionActiva}
          orden={orden}
          onCategoriaChange={setCategoriaActiva}
          onIntencionChange={setIntencionActiva}
          onOrdenChange={setOrden}
        />

        <ConversationTable
          conversations={conversacionesFiltradas}
          loading={cargando}
        />
      </section>
    </main>
  );
}

export default App;

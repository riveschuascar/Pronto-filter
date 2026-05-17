import type { Conversation } from "../types";

type ConversationTableProps = {
  conversations: Conversation[];
  loading: boolean;
};

function formatDate(timestamp: { seconds?: number } | null | undefined) {
  if (!timestamp?.seconds) return "-";
  return new Date(timestamp.seconds * 1000).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConversationTable({ conversations, loading }: ConversationTableProps) {
  if (loading) {
    return (
      <section className="tabla-contenedor">
        <div className="estado-vacio">
          <h2>Cargando conversaciones...</h2>
          <p>Estamos recibiendo los datos desde Firebase.</p>
        </div>
      </section>
    );
  }

  if (conversations.length === 0) {
    return (
      <section className="tabla-contenedor">
        <div className="estado-vacio">
          <h2>No hay conversaciones para mostrar</h2>
          <p>
            Cuando se conecte la base de datos, aquí aparecerán las
            conversaciones registradas en Firebase.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="tabla-contenedor">
      <table className="tabla-leads">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Categorías</th>
            <th>Productos</th>
            <th>Intención</th>
            <th>Creado</th>
          </tr>
        </thead>

        <tbody>
          {conversations.map((conversation) => (
            <tr key={conversation.id}>
              <td data-label="ID">{conversation.id}</td>
              <td data-label="Nombre">
                <div className="usuario">
                  <div className="avatar">{conversation.name?.charAt(0) ?? "?"}</div>
                  <div>
                    <strong>{conversation.name}</strong>
                    <span>{conversation.purchase_intent}</span>
                  </div>
                </div>
              </td>
              <td data-label="Teléfono">{conversation.phone || "-"}</td>
              <td data-label="Categorías">
                <span className="badge categoria">
                  {conversation.categories.length > 0
                    ? conversation.categories.join(", ")
                    : "Sin categorías"}
                </span>
              </td>
              <td data-label="Productos">
                {conversation.products.length > 0
                  ? conversation.products.join(", ")
                  : "-"}
              </td>
              <td data-label="Intención">
                <span className={`badge intencion-${conversation.purchase_intent.toLowerCase()}`}>
                  {conversation.purchase_intent}
                </span>
              </td>
              <td data-label="Creado">{formatDate(conversation.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

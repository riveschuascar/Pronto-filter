import type { Conversation } from "../types";

type ConversationTableProps = {
  conversations: Conversation[];
  loading: boolean;
};

function getValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "~";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "~";
  }

  return String(value);
}

export function ConversationTable({
  conversations,
  loading,
}: ConversationTableProps) {
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
            <th>Teléfono</th>
            <th>Nombre</th>
            <th>Productos</th>
            <th>Categorías</th>
            <th>Prioridad</th>
          </tr>
        </thead>

        <tbody>
          {conversations.map((conversation, index) => (
            <tr key={conversation.id ?? index}>
              <td data-label="Teléfono">
                {getValue(conversation.phone)}
              </td>

              <td data-label="Nombre">
                <strong>{getValue(conversation.name)}</strong>
              </td>

              <td data-label="Productos">
                {getValue(conversation.products)}
              </td>

              <td data-label="Categorías">
                <span className="badge categoria">
                  {getValue(conversation.categories)}
                </span>
              </td>

              <td data-label="Prioridad">
                <span
                  className={`badge intencion-${String(
                    conversation.purchase_intent ?? "baja"
                  ).toLowerCase()}`}
                >
                  {getValue(conversation.purchase_intent)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
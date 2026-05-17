import type { Timestamp } from "firebase/firestore";

type Intencion = "Todas" | "Alta" | "Media" | "Baja";
type Orden = "reciente" | "antiguo";

type Conversation = {
  id: string;
  phone: string;
  name: string;
  categories: string[];
  products: string[];
  purchase_intent: string;
  created_at?: Timestamp | null;
  updated_at?: Timestamp | null;
};

export type { Intencion, Orden, Conversation };

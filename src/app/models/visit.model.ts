export interface Visit {
  id: string;
  restaurante: {
    id: string;
    nombre: string;
    ubicacion: string;
    tipo: string;
    imagen?: string;
    descripcion?: string;
    horario?: string;
    beneficios?: string[];
  };
  userId: string;
  fecha: string; // formato YYYY-MM-DD
  hora: string; // formato HH:MM
  numeroPersonas: number;
  notasEspeciales?: string;
  estado: 'programada' | 'confirmada' | 'cancelada' | 'completada';
  codigoReserva?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateVisitRequest {
  restaurante: {
    id: string;
    nombre: string;
    ubicacion: string;
    tipo: string;
    imagen?: string;
    descripcion?: string;
    horario?: string;
    beneficios?: string[];
  };
  fecha: string; // formato YYYY-MM-DD
  hora: string; // formato HH:MM
  numeroPersonas: number;
  notasEspeciales?: string;
}

export interface VisitResponse {
  success: boolean;
  message?: string;
  data?: Visit | Visit[];
  visit?: Visit;
  visits?: Visit[];
}

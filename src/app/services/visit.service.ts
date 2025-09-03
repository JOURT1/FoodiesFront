import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Visit, CreateVisitRequest, VisitResponse } from '../models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly STORAGE_KEY = 'foodie_visits';

  constructor() {}

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getStoredVisits(): Visit[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveVisits(visits: Visit[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(visits));
  }

  private getCurrentUserId(): string {
    // Obtener el ID del usuario del localStorage
    const userData = localStorage.getItem('user');
    console.log('Datos del usuario en localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Usuario parseado:', user);
        const userId = user.id || user._id || 'default_user';
        console.log('ID del usuario obtenido:', userId);
        return userId;
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        return 'default_user';
      }
    }
    
    // También intentar obtener de otros posibles keys
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        console.log('AuthData encontrado:', auth);
        return auth.user?.id || auth.user?._id || 'default_user';
      } catch (error) {
        console.error('Error al parsear authData:', error);
      }
    }
    
    console.log('No se encontraron datos de usuario, usando default_user');
    return 'default_user';
  }

  private generateReservationCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `RES${timestamp}${random}`.toUpperCase();
  }

  // Crear una nueva visita
  createVisit(visitData: CreateVisitRequest): Observable<VisitResponse> {
    try {
      const visits = this.getStoredVisits();
      const userId = this.getCurrentUserId();
      
      const newVisit: Visit = {
        id: this.generateId(),
        restaurante: visitData.restaurante,
        userId: userId,
        fecha: visitData.fecha,
        hora: visitData.hora,
        numeroPersonas: visitData.numeroPersonas,
        notasEspeciales: visitData.notasEspeciales || '',
        estado: 'programada',
        codigoReserva: this.generateReservationCode(),
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };

      visits.push(newVisit);
      this.saveVisits(visits);

      console.log('Visita creada y guardada:', newVisit);

      const response: VisitResponse = {
        success: true,
        message: 'Visita programada exitosamente',
        data: newVisit
      };

      return of(response);
    } catch (error) {
      console.error('Error al crear visita:', error);
      const errorResponse: VisitResponse = {
        success: false,
        message: 'Error al programar la visita'
      };
      return of(errorResponse);
    }
  }

  // Obtener todas las visitas del usuario actual
  getUserVisits(): Observable<VisitResponse> {
    try {
      const allVisits = this.getStoredVisits();
      const userId = this.getCurrentUserId();
      
      console.log('Todas las visitas almacenadas:', allVisits);
      console.log('ID del usuario actual:', userId);
      
      // Filtrar visitas del usuario actual
      const userVisits = allVisits.filter(visit => visit.userId === userId);
      
      console.log('Visitas filtradas del usuario:', userVisits);
      
      // Ordenar por fecha y hora
      userVisits.sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`);
        const dateB = new Date(`${b.fecha}T${b.hora}`);
        return dateA.getTime() - dateB.getTime();
      });

      console.log('Visitas del usuario obtenidas:', userVisits);

      const response: VisitResponse = {
        success: true,
        data: userVisits,
        visits: userVisits
      };

      return of(response);
    } catch (error) {
      console.error('Error al obtener visitas:', error);
      const errorResponse: VisitResponse = {
        success: false,
        message: 'Error al obtener las visitas',
        visits: []
      };
      return of(errorResponse);
    }
  }

  // Obtener visitas por estado
  getVisitsByStatus(status: string): Observable<VisitResponse> {
    try {
      const allVisits = this.getStoredVisits();
      const userId = this.getCurrentUserId();
      
      const filteredVisits = allVisits.filter(visit => 
        visit.userId === userId && visit.estado === status
      );

      const response: VisitResponse = {
        success: true,
        data: filteredVisits,
        visits: filteredVisits
      };

      return of(response);
    } catch (error) {
      console.error('Error al obtener visitas por estado:', error);
      const errorResponse: VisitResponse = {
        success: false,
        message: 'Error al obtener las visitas',
        visits: []
      };
      return of(errorResponse);
    }
  }

  // Cancelar una visita
  cancelVisit(visitId: string): Observable<VisitResponse> {
    try {
      const visits = this.getStoredVisits();
      const userId = this.getCurrentUserId();
      const visitIndex = visits.findIndex(v => v.id === visitId && v.userId === userId);

      if (visitIndex === -1) {
        const errorResponse: VisitResponse = {
          success: false,
          message: 'Visita no encontrada'
        };
        return of(errorResponse);
      }

      const visit = visits[visitIndex];
      
      if (visit.estado !== 'programada') {
        const errorResponse: VisitResponse = {
          success: false,
          message: 'Solo puedes cancelar visitas programadas'
        };
        return of(errorResponse);
      }

      visit.estado = 'cancelada';
      visit.fechaActualizacion = new Date().toISOString();

      visits[visitIndex] = visit;
      this.saveVisits(visits);

      console.log('Visita cancelada:', visit);

      const response: VisitResponse = {
        success: true,
        message: 'Visita cancelada exitosamente',
        data: visit
      };

      return of(response);
    } catch (error) {
      console.error('Error al cancelar visita:', error);
      const errorResponse: VisitResponse = {
        success: false,
        message: 'Error al cancelar la visita'
      };
      return of(errorResponse);
    }
  }

  // Actualizar una visita
  updateVisit(visitId: string, updateData: Partial<CreateVisitRequest>): Observable<VisitResponse> {
    try {
      const visits = this.getStoredVisits();
      const userId = this.getCurrentUserId();
      const visitIndex = visits.findIndex(v => v.id === visitId && v.userId === userId);

      if (visitIndex === -1) {
        const errorResponse: VisitResponse = {
          success: false,
          message: 'Visita no encontrada'
        };
        return of(errorResponse);
      }

      const visit = visits[visitIndex];
      
      if (visit.estado !== 'programada') {
        const errorResponse: VisitResponse = {
          success: false,
          message: 'Solo puedes modificar visitas programadas'
        };
        return of(errorResponse);
      }

      // Actualizar campos
      if (updateData.fecha) visit.fecha = updateData.fecha;
      if (updateData.hora) visit.hora = updateData.hora;
      if (updateData.numeroPersonas) visit.numeroPersonas = updateData.numeroPersonas;
      if (updateData.notasEspeciales !== undefined) visit.notasEspeciales = updateData.notasEspeciales;
      
      visit.fechaActualizacion = new Date().toISOString();

      visits[visitIndex] = visit;
      this.saveVisits(visits);

      const response: VisitResponse = {
        success: true,
        message: 'Visita actualizada exitosamente',
        data: visit
      };

      return of(response);
    } catch (error) {
      console.error('Error al actualizar visita:', error);
      const errorResponse: VisitResponse = {
        success: false,
        message: 'Error al actualizar la visita'
      };
      return of(errorResponse);
    }
  }
}

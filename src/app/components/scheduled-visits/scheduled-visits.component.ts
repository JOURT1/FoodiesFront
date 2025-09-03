import { Component, OnInit } from '@angular/core';
import { VisitService } from '../../services/visit.service';
import { Visit } from '../../models/visit.model';

@Component({
  selector: 'app-scheduled-visits',
  templateUrl: './scheduled-visits.component.html',
  styleUrls: ['./scheduled-visits.component.css']
})
export class ScheduledVisitsComponent implements OnInit {
  visits: Visit[] = [];
  isLoading = true;
  errorMessage = '';
  selectedTab: 'all' | 'programada' | 'confirmada' | 'completada' | 'cancelada' = 'all';

  constructor(private visitService: VisitService) { }

  ngOnInit() {
    this.loadVisits();
  }

  loadVisits() {
    this.isLoading = true;
    this.errorMessage = '';

    this.visitService.getUserVisits().subscribe(response => {
      this.isLoading = false;
      if (response.success) {
        // Usar tanto data como visits para compatibilidad
        this.visits = (response.data as Visit[]) || response.visits || [];
        console.log('Visitas cargadas en componente:', this.visits);
      } else {
        this.errorMessage = response.message || 'Error al cargar las visitas';
        this.visits = [];
      }
    });
  }

  filterVisits(status?: string) {
    if (!status || status === 'all') {
      return this.visits;
    }
    return this.visits.filter(visit => visit.estado === status);
  }

  selectTab(tab: 'all' | 'programada' | 'confirmada' | 'completada' | 'cancelada') {
    this.selectedTab = tab;
  }

  cancelVisit(visitId: string) {
    if (confirm('¿Estás seguro de que quieres cancelar esta visita?')) {
      this.visitService.cancelVisit(visitId).subscribe(response => {
        if (response.success) {
          this.loadVisits(); // Recargar la lista
        } else {
          alert('Error al cancelar la visita: ' + (response.message || 'Error desconocido'));
        }
      });
    }
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'programada': return 'status-programada';
      case 'confirmada': return 'status-confirmed';
      case 'cancelada': return 'status-cancelled';
      case 'completada': return 'status-completed';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'programada': return 'Programada';
      case 'confirmada': return 'Confirmada';
      case 'cancelada': return 'Cancelada';
      case 'completada': return 'Completada';
      default: return status;
    }
  }

  getVisitCountByStatus(status: string): number {
    if (status === 'all') return this.visits.length;
    return this.visits.filter(visit => visit.estado === status).length;
  }
}

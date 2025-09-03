import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisitService } from '../../services/visit.service';
import { CreateVisitRequest } from '../../models/visit.model';

@Component({
  selector: 'app-visit-modal',
  templateUrl: './visit-modal.component.html',
  styleUrls: ['./visit-modal.component.css']
})
export class VisitModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() restaurant: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() visitCreated = new EventEmitter<void>();

  visitForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  minDate = '';
  availableHours: string[] = [];

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService
  ) {
    this.visitForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      numeroPersonas: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      notasEspeciales: ['']
    });
  }

  ngOnInit() {
    this.setMinDate();
    this.generateAvailableHours();
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  generateAvailableHours() {
    this.availableHours = [];
    for (let hour = 8; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.availableHours.push(timeString);
      }
    }
  }

  onSubmit() {
    if (this.visitForm.valid && this.restaurant) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const visitData: CreateVisitRequest = {
        restaurante: {
          id: this.restaurant._id || this.restaurant.id || 'macchiata',
          nombre: this.restaurant.nombre || this.restaurant.name || 'Macchiata',
          ubicacion: this.restaurant.ubicacion || this.restaurant.address || 'La Primavera 1 en Cumbayá, Ecuador',
          tipo: this.restaurant.tipo || this.restaurant.type || 'Brunch-Pizza-Pasta',
          imagen: this.restaurant.imagen || this.restaurant.image,
          descripcion: this.restaurant.descripcion || this.restaurant.description,
          horario: this.restaurant.horario || this.restaurant.schedule || '08:00 - 22:00',
          beneficios: this.restaurant.beneficios || this.restaurant.benefits || []
        },
        fecha: this.visitForm.value.fecha,
        hora: this.visitForm.value.hora,
        numeroPersonas: this.visitForm.value.numeroPersonas,
        notasEspeciales: this.visitForm.value.notasEspeciales || ''
      };

      this.visitService.createVisit(visitData).subscribe(response => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Visita programada exitosamente';
          this.visitCreated.emit();
          setTimeout(() => {
            this.closeModal();
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Error al programar la visita';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.visitForm.controls).forEach(key => {
      const control = this.visitForm.get(key);
      control?.markAsTouched();
    });
  }

  closeModal() {
    this.isOpen = false;
    this.visitForm.reset({
      numeroPersonas: 2
    });
    this.errorMessage = '';
    this.successMessage = '';
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}

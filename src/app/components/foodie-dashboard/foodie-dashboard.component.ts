import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { VisitService } from '../../services/visit.service';
import { Router } from '@angular/router';
import { Visit } from '../../models/visit.model';

@Component({
  selector: 'app-foodie-dashboard',
  templateUrl: './foodie-dashboard.component.html',
  styleUrls: ['./foodie-dashboard.component.css']
})
export class FoodieDashboardComponent implements OnInit {
  currentUser: any = null;
  sidebarOpen: boolean = false;
  activeTab: 'explorar' | 'visitas' | 'evidencias' = 'explorar';
  searchTerm: string = '';
  locationFilter: string = '';
  cuisineFilter: string = '';

  // Modal state
  isVisitModalOpen = false;
  selectedRestaurant: any = null;

  // Visits data
  visits: Visit[] = [];
  isLoadingVisits = false;
  selectedVisitTab: 'all' | 'programada' | 'completada' | 'cancelada' = 'all';

  // Evidence upload state
  isEvidenceModalOpen = false;
  selectedVisitForEvidence: any = null;
  evidenceForm: any = {
    tiktokLink: '',
    instagramPhoto: null,
    amountSpent: 0
  };
  evidenceUploadError = '';
  evidenceUploadSuccess = '';

  restaurants = [
    {
      id: 1,
      name: 'Macchiata',
      category: 'Brunch-Pizza-Pasta',
      location: 'La Primavera 1 en Cumbayá, Ecuador',
      hours: '08:00 - 22:00',
      rating: 4.5,
      reviews: 128,
      price: '$$',
      image: 'assets/Macchiata.png',
      description: 'Delicioso brunch con opciones de pizza y pasta artesanal en un ambiente acogedor.',
      benefits: 'Beneficios exclusivos',
      hasBenefits: true
    },
    {
      id: 2,
      name: 'Michael´s',
      category: 'Grill',
      location: 'Quito, Guayaquil',
      hours: '12:00 - 23:00',
      rating: 4.8,
      reviews: 93,
      price: '$$$',
      image: 'assets/Michaels.png',
      description: 'Experiencia grill premium con los mejores cortes de carne y ambiente sofisticado.',
      benefits: 'Beneficios exclusivos',
      hasBenefits: true
    },
    {
      id: 3,
      name: 'Roll It',
      category: 'Sushi',
      location: 'Quito, Cumbayá',
      hours: '18:00 - 01:00',
      rating: 4.3,
      reviews: 75,
      price: '$$',
      image: 'assets/RollIt.png',
      description: 'Sushi fresco y creativo con ingredientes de la más alta calidad.',
      benefits: 'Beneficios exclusivos',
      hasBenefits: true
    }
  ];

  constructor(
    private authService: AuthService,
    private visitService: VisitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verificar que el usuario sea realmente un Foodie
    if (!this.currentUser || this.currentUser.rol !== 'foodie') {
      this.router.navigate(['/dashboard']);
    }

    // Cargar visitas al inicializar
    this.loadVisits();
  }

  // Sidebar methods
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  navigateToSection(section: string) {
    this.closeSidebar();
    switch(section) {
      case 'foodie':
        // Ya estamos en el dashboard de foodie
        break;
      case 'visitas':
        this.setActiveTab('visitas');
        break;
      case 'restaurante':
        console.log('Navigating to restaurant section');
        break;
      case 'cuenta':
        console.log('Navigating to account section');
        break;
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Listen for escape key to close sidebar
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.sidebarOpen) {
      this.closeSidebar();
    }
  }

  setActiveTab(tab: 'explorar' | 'visitas' | 'evidencias') {
    this.activeTab = tab;
    if (tab === 'visitas') {
      this.loadVisits();
    }
  }

  // Métodos para manejar visitas
  loadVisits() {
    this.isLoadingVisits = true;
    this.visitService.getUserVisits().subscribe(response => {
      this.isLoadingVisits = false;
      if (response.success) {
        this.visits = (response.data as Visit[]) || response.visits || [];
        console.log('Visitas cargadas en dashboard:', this.visits);
      } else {
        console.error('Error al cargar visitas:', response.message);
        this.visits = [];
      }
    });
  }

  filterVisitsByStatus(status?: string) {
    if (!status || status === 'all') {
      return this.visits;
    }
    return this.visits.filter(visit => visit.estado === status);
  }

  selectVisitTab(tab: 'all' | 'programada' | 'completada' | 'cancelada') {
    this.selectedVisitTab = tab;
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

  scheduleVisit(restaurant: any) {
    this.selectedRestaurant = restaurant;
    this.isVisitModalOpen = true;
    console.log('Programar visita a:', restaurant.name);
  }

  closeVisitModal() {
    this.isVisitModalOpen = false;
    this.selectedRestaurant = null;
  }

  onVisitCreated() {
    console.log('Visita creada exitosamente');
    // Cerrar el modal
    this.closeVisitModal();
    // Recargar las visitas y cambiar a la tab de visitas
    this.loadVisits();
    this.setActiveTab('visitas');
  }

  // Métodos para evidencias de visita
  canUploadEvidence(visit: any): boolean {
    if (visit.estado !== 'completada') return false;
    
    const visitDate = new Date(visit.fecha);
    const now = new Date();
    const diffInHours = (now.getTime() - visitDate.getTime()) / (1000 * 60 * 60);
    
    return diffInHours <= 48; // 48 horas para subir evidencia
  }

  openEvidenceModal(visit: any) {
    this.selectedVisitForEvidence = visit;
    this.isEvidenceModalOpen = true;
    this.evidenceForm = {
      tiktokLink: '',
      instagramPhoto: null,
      amountSpent: 0
    };
    this.evidenceUploadError = '';
    this.evidenceUploadSuccess = '';
  }

  closeEvidenceModal() {
    this.isEvidenceModalOpen = false;
    this.selectedVisitForEvidence = null;
    this.evidenceForm = {
      tiktokLink: '',
      instagramPhoto: null,
      amountSpent: 0
    };
    this.evidenceUploadError = '';
    this.evidenceUploadSuccess = '';
  }

  // Métodos para evidencias
  getVisitsForEvidence() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.visits.filter(visit => {
      const visitDate = new Date(visit.fecha);
      const daysDiff = Math.floor((today.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Solo mostrar visitas que ya pasaron y están dentro de las 48 horas
      return visitDate <= today && daysDiff <= 2 && visit.estado === 'programada';
    });
  }

  hasEvidence(visitId: string): boolean {
    const evidence = localStorage.getItem(`evidence_${visitId}`);
    return !!evidence;
  }

  getRemainingTime(visitDate: string): string {
    const today = new Date();
    const visit = new Date(visitDate);
    const endTime = new Date(visit.getTime() + (48 * 60 * 60 * 1000)); // 48 horas después
    
    const timeLeft = endTime.getTime() - today.getTime();
    
    if (timeLeft <= 0) {
      return 'Tiempo agotado';
    }
    
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    return `${hoursLeft} horas`;
  }

  updateEvidenceForm(visitId: string, field: string, event: any) {
    if (!this.evidenceForm[visitId]) {
      this.evidenceForm[visitId] = {};
    }
    
    const value = event.target ? event.target.value : event;
    this.evidenceForm[visitId][field] = value;
  }

  submitEvidence(visitId: string) {
    const evidenceForm = this.evidenceForm[visitId];
    
    if (!evidenceForm || !evidenceForm.tiktokUrl || !evidenceForm.instagramPhoto || !evidenceForm.amountSpent) {
      alert('Todos los campos son obligatorios');
      return;
    }

    // Validar que el enlace de TikTok sea válido
    if (!evidenceForm.tiktokUrl.includes('tiktok.com')) {
      alert('Por favor ingresa un enlace válido de TikTok');
      return;
    }

    // Guardar la evidencia en localStorage
    const evidenceData = {
      visitId: visitId,
      tiktokUrl: evidenceForm.tiktokUrl,
      instagramPhoto: evidenceForm.instagramPhoto.name,
      amountSpent: evidenceForm.amountSpent,
      submittedAt: new Date().toISOString()
    };

    localStorage.setItem(`evidence_${visitId}`, JSON.stringify(evidenceData));
    
    // Limpiar el formulario
    delete this.evidenceForm[visitId];
    
    alert('Evidencias enviadas correctamente');
  }

  onInstagramPhotoSelected(event: any, visitId: string) {
    const file = event.target.files[0];
    if (file) {
      if (!this.evidenceForm[visitId]) {
        this.evidenceForm[visitId] = {};
      }
      this.evidenceForm[visitId].instagramPhoto = file;
    }
  }

  generateStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const stars = [];
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    // Media estrella
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
    
    return stars;
  }
}

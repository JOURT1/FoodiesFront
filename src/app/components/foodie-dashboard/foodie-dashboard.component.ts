import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foodie-dashboard',
  templateUrl: './foodie-dashboard.component.html',
  styleUrls: ['./foodie-dashboard.component.css']
})
export class FoodieDashboardComponent implements OnInit {
  currentUser: any = null;
  sidebarOpen: boolean = false;
  activeTab: string = 'explorar';
  searchTerm: string = '';
  locationFilter: string = '';
  cuisineFilter: string = '';
  favorites: number[] = []; // Array para almacenar IDs de restaurantes favoritos

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verificar que el usuario sea realmente un Foodie
    if (!this.currentUser || this.currentUser.rol !== 'foodie') {
      this.router.navigate(['/dashboard']);
    }
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

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  scheduleVisit(restaurant: any) {
    console.log('Programar visita a:', restaurant.name);
  }

  toggleFavorite(restaurant: any) {
    const index = this.favorites.indexOf(restaurant.id);
    if (index > -1) {
      // Si ya está en favoritos, lo quitamos
      this.favorites.splice(index, 1);
      console.log(`${restaurant.name} quitado de favoritos`);
    } else {
      // Si no está en favoritos, lo agregamos
      this.favorites.push(restaurant.id);
      console.log(`${restaurant.name} agregado a favoritos`);
    }
  }

  isFavorite(restaurant: any): boolean {
    return this.favorites.includes(restaurant.id);
  }

  getFavoriteRestaurants() {
    return this.restaurants.filter(restaurant => this.favorites.includes(restaurant.id));
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

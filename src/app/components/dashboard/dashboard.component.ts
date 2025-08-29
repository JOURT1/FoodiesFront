import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  searchTerm: string = '';
  activeTab: string = 'explorar';
  sidebarOpen: boolean = false;
  locationFilter: string = '';
  cuisineFilter: string = '';
  
  restaurants = [
    {
      id: 1,
      name: 'Macchiata',
      cuisine: 'Brunch-Pizza-Pasta',
      address: 'La Primavera 1 en Cumbayá, Ecuador',
      rating: 4.5,
      reviews: 128,
      image: 'assets/Macchiata.png',
      favorite: false
    },
    {
      id: 2,
      name: 'Michael´s',
      cuisine: 'Grill',
      address: 'Quito, Guayaquil',
      rating: 4.8,
      reviews: 93,
      image: 'assets/Michaels.png',
      favorite: false
    },
    {
      id: 3,
      name: 'Roll It',
      cuisine: 'Sushi',
      address: 'Quito, Cumbayá',
      rating: 4.3,
      reviews: 75,
      image: 'assets/RollIt.png',
      favorite: false
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleFavorite(restaurant: any) {
    restaurant.favorite = !restaurant.favorite;
  }

  getFilteredRestaurants() {
    let filtered = this.restaurants;
    
    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por ubicación
    if (this.locationFilter) {
      filtered = filtered.filter(restaurant => 
        restaurant.address.toLowerCase().includes(this.locationFilter.toLowerCase())
      );
    }
    
    // Filtrar por tipo de cocina
    if (this.cuisineFilter) {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine.toLowerCase().includes(this.cuisineFilter.toLowerCase())
      );
    }
    
    return filtered;
  }

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars: string[] = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars;
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
    // Implement navigation logic based on section
    switch(section) {
      case 'foodie':
        // Verificar el rol del usuario para decidir a dónde ir
        if (this.currentUser && this.currentUser.rol === 'foodie') {
          // Si ya es Foodie, ir al dashboard de Foodie
          this.router.navigate(['/foodie-dashboard']);
        } else {
          // Si es usuario normal, ir al formulario de aplicación
          this.router.navigate(['/foodie-application']);
        }
        break;
      case 'restaurante':
        // Navigate to restaurant management (if implemented)
        console.log('Navigating to restaurant section');
        break;
      case 'cuenta':
        this.setActiveTab('perfil');
        break;
    }
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
}

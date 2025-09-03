import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  image: string;
  rating: number;
  priceRange: string;
  benefits?: string;
}

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, BadgeModule],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
  @Input() showActions: boolean = true;
  @Output() scheduleVisit = new EventEmitter<Restaurant>();
  @Output() toggleFavorite = new EventEmitter<Restaurant>();

  onScheduleVisit() {
    this.scheduleVisit.emit(this.restaurant);
  }

  onToggleFavorite() {
    this.toggleFavorite.emit(this.restaurant);
  }

  getStarsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}

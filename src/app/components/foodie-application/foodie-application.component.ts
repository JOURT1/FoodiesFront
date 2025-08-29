import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-foodie-application',
  templateUrl: './foodie-application.component.html',
  styleUrls: ['./foodie-application.component.css']
})
export class FoodieApplicationComponent implements OnInit {
  foodieForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.foodieForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      numeroPersonal: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      paisDondeVives: ['Ecuador', [Validators.required]],
      ciudadDondeVives: ['', [Validators.required]],
      nivelContenido: ['', [Validators.required]],
      usuarioInstagram: ['', [Validators.required]],
      seguidoresInstagram: ['', [Validators.required, Validators.min(1000)]],
      cuentaPublica: ['', [Validators.required]],
      usuarioTiktok: ['', [Validators.required]],
      seguidoresTiktok: ['', [Validators.required]],
      sobreTi: ['', [Validators.required, Validators.minLength(50)]],
      aceptaBeneficios: ['', [Validators.required]],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any, fieldName: string): void {
    const file = event.target.files[0];
    if (file) {
      console.log(`Archivo seleccionado para ${fieldName}:`, file.name);
      // Aquí puedes manejar la carga del archivo
    }
  }

  onSubmit(): void {
    if (this.foodieForm.valid) {
      console.log('Formulario enviado:', this.foodieForm.value);
      alert('¡Aplicación enviada con éxito! Te contactaremos pronto.');
    } else {
      console.log('Formulario inválido');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.foodieForm.controls).forEach(key => {
      const control = this.foodieForm.get(key);
      control?.markAsTouched();
    });
  }
}
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foodie-application',
  templateUrl: './foodie-application.component.html',
  styleUrls: ['./foodie-application.component.css']
})
export class FoodieApplicationComponent implements OnInit {
  foodieForm: FormGroup;
  currentUser: any = null;
  sidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
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
      seguidoresInstagram: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cuentaPublica: ['', [Validators.required]],
      usuarioTiktok: ['', [Validators.required]],
      seguidoresTiktok: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      sobreTi: ['', [Validators.required, Validators.minLength(20)]],
      aceptaBeneficios: ['', [Validators.required]],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verificar si el usuario ya es un Foodie
    if (this.currentUser && this.currentUser.rol === 'foodie') {
      // Si ya es Foodie, redirigir al dashboard de Foodie
      this.router.navigate(['/foodie-dashboard']);
      return;
    }
    
    // Si no es Foodie (es usuario), mostrar el formulario de aplicación
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
        // Ya estamos en la página de foodie application
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

  onFileSelected(event: any, fieldName: string): void {
    const file = event.target.files[0];
    if (file) {
      console.log(`Archivo seleccionado para ${fieldName}:`, file.name);
      // Aquí puedes manejar la carga del archivo
    }
  }

  // Validación para campos de números de seguidores
  onFollowersInput(event: any, fieldName: string): void {
    let value = event.target.value;
    // Remover cualquier carácter que no sea número
    value = value.replace(/[^0-9]/g, '');
    
    // Actualizar el campo del formulario
    this.foodieForm.patchValue({
      [fieldName]: value
    });
    
    // Actualizar el valor del input
    event.target.value = value;
  }

  // Prevenir entrada de caracteres no numéricos
  onFollowersKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    // Solo permitir números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Prevenir pegar contenido no numérico
  onFollowersPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const paste = (event.clipboardData || (window as any).clipboardData).getData('text');
    const numericValue = paste.replace(/[^0-9]/g, '');
    
    if (numericValue) {
      const target = event.target as HTMLInputElement;
      target.value = numericValue;
      
      // Actualizar el formulario reactivo
      const fieldName = target.getAttribute('formControlName');
      if (fieldName) {
        this.foodieForm.patchValue({
          [fieldName]: numericValue
        });
      }
    }
  }

  onSubmit(): void {
    if (this.foodieForm.valid) {
      const formData = this.foodieForm.value;
      
      // Verificar si cumple los requisitos para ser Foodie automáticamente
      const instagramFollowers = parseInt(formData.seguidoresInstagram) || 0;
      const tiktokFollowers = parseInt(formData.seguidoresTiktok) || 0;
      const hasPublicAccount = formData.cuentaPublica === 'si';
      
      // Criterios para ser Foodie automáticamente: más de 1000 seguidores en IG o TikTok Y cuenta pública
      const qualifiesForAutoApproval = (instagramFollowers >= 1000 || tiktokFollowers >= 1000) && hasPublicAccount;
      
      console.log('Evaluando criterios:', {
        instagramFollowers,
        tiktokFollowers, 
        hasPublicAccount,
        qualifiesForAutoApproval
      });
      
      if (qualifiesForAutoApproval) {
        // Actualizar rol a foodie automáticamente
        this.authService.updateUserRole('foodie').subscribe({
          next: (response) => {
            console.log('Rol actualizado a Foodie:', response);
            
            if (response.success) {
              // Actualizar el usuario actual en el servicio
              const currentUser = this.authService.getCurrentUser();
              if (currentUser) {
                currentUser.rol = 'foodie';
                this.authService.setCurrentUser(currentUser);
              }
              
              // Enviar aplicación con aprobación automática
              this.submitFoodieApplication(formData, true);
            } else {
              console.error('Error en la respuesta del servidor:', response.message);
              alert('❌ Error al procesar la aplicación: ' + response.message);
            }
          },
          error: (error) => {
            console.error('Error al actualizar rol:', error);
            let errorMessage = 'Error al procesar la aplicación. ';
            
            if (error.status === 401) {
              errorMessage += 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
              this.authService.logout();
              this.router.navigate(['/login']);
            } else if (error.status === 403) {
              errorMessage += 'No tienes permisos para realizar esta acción.';
            } else if (error.status === 500) {
              errorMessage += 'Error interno del servidor. Intenta nuevamente más tarde.';
            } else {
              errorMessage += 'Intenta nuevamente.';
            }
            
            alert('❌ ' + errorMessage);
          }
        });
      } else {
        // No cumple requisitos para aprobación automática, pero envía la aplicación para revisión manual
        this.submitFoodieApplication(formData, false);
      }
    } else {
      console.log('Formulario inválido');
      this.markFormGroupTouched();
      
      // Identificar campos específicos con errores
      const invalidFields: string[] = [];
      Object.keys(this.foodieForm.controls).forEach(key => {
        const control = this.foodieForm.get(key);
        if (control?.invalid) {
          invalidFields.push(this.getFieldDisplayName(key));
        }
      });
      
      alert(`❌ Por favor, completa correctamente los siguientes campos:\n\n• ${invalidFields.join('\n• ')}`);
    }
  }

  private submitFoodieApplication(formData: any, approved: boolean): void {
    // Aquí puedes enviar los datos de la aplicación al backend si es necesario
    console.log('Aplicación de Foodie enviada:', formData);
    
    if (approved) {
      const instagramFollowers = parseInt(formData.seguidoresInstagram) || 0;
      const tiktokFollowers = parseInt(formData.seguidoresTiktok) || 0;
      const maxFollowers = Math.max(instagramFollowers, tiktokFollowers);
      
      alert(`🎉 ¡FELICIDADES! 🎉\n\n✅ Tu aplicación ha sido APROBADA AUTOMÁTICAMENTE\n✅ Ahora eres un FOODIE oficial de FoodiesBNB\n✅ Tienes ${maxFollowers.toLocaleString()} seguidores\n✅ Tu cuenta es pública\n\n🍽️ ¡Bienvenido al equipo de influencers gastronómicos!\n\n📱 Ahora puedes acceder a todos los beneficios exclusivos para Foodies.`);
      
      // Redirigir al dashboard de Foodie después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/foodie-dashboard']);
      }, 3000);
    } else {
      const instagramFollowers = parseInt(formData.seguidoresInstagram) || 0;
      const tiktokFollowers = parseInt(formData.seguidoresTiktok) || 0;
      const hasPublicAccount = formData.cuentaPublica === 'si';
      const maxFollowers = Math.max(instagramFollowers, tiktokFollowers);
      
      let mensaje = '� APLICACIÓN ENVIADA PARA REVISIÓN\n\n';
      
      if (maxFollowers >= 1000 && hasPublicAccount) {
        // Este caso no debería ocurrir normalmente
        mensaje += '⚠️ Cumples con los requisitos pero hubo un problema técnico.\n';
      } else {
        mensaje += '📊 Estado de requisitos:\n\n';
        
        if (hasPublicAccount) {
          mensaje += '✅ Cuenta pública: Aprobado\n';
        } else {
          mensaje += '❌ Cuenta pública: Necesitas tener cuenta pública\n';
        }
        
        if (maxFollowers >= 1000) {
          mensaje += `✅ Seguidores: Aprobado (${maxFollowers.toLocaleString()})\n`;
        } else {
          mensaje += `❌ Seguidores: Necesitas al menos 1,000 (tienes ${maxFollowers.toLocaleString()})\n`;
        }
        
        mensaje += '\n� Hemos enviado tu aplicación a nuestro equipo de revisión.\n';
        mensaje += '📞 Te contactaremos pronto con una respuesta.\n';
        mensaje += '📈 Mientras tanto, sigue creciendo tu audiencia!';
      }
      
      alert(mensaje);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.foodieForm.controls).forEach(key => {
      const control = this.foodieForm.get(key);
      control?.markAsTouched();
    });
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      nombreCompleto: 'Nombre completo',
      email: 'Correo electrónico',
      numeroPersonal: 'Número personal',
      fechaNacimiento: 'Fecha de nacimiento',
      genero: 'Género',
      paisDondeVives: 'País donde vives',
      ciudadDondeVives: 'Ciudad donde vives',
      nivelContenido: 'Nivel de contenido',
      usuarioInstagram: 'Usuario de Instagram',
      seguidoresInstagram: 'Seguidores de Instagram',
      cuentaPublica: 'Cuenta pública',
      usuarioTiktok: 'Usuario de TikTok',
      seguidoresTiktok: 'Seguidores de TikTok',
      sobreTi: 'Sobre ti',
      aceptaBeneficios: 'Acepta beneficios',
      aceptaTerminos: 'Acepta términos y condiciones'
    };
    
    return fieldNames[fieldName] || fieldName;
  }

  private getInvalidFields(): any {
    const invalidFields: any = {};
    Object.keys(this.foodieForm.controls).forEach(key => {
      const control = this.foodieForm.get(key);
      if (control && control.invalid) {
        invalidFields[key] = {
          errors: control.errors,
          value: control.value,
          displayName: this.getFieldDisplayName(key)
        };
      }
    });
    return invalidFields;
  }

  getInvalidFieldsList(): any[] {
    const invalidFields: any[] = [];
    Object.keys(this.foodieForm.controls).forEach(key => {
      const control = this.foodieForm.get(key);
      if (control && control.invalid) {
        invalidFields.push({
          field: key,
          errors: control.errors,
          value: control.value,
          displayName: this.getFieldDisplayName(key)
        });
      }
    });
    return invalidFields;
  }
}
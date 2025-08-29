import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EmailValidators {
  static realEmailDomain(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const email = control.value.toLowerCase();
    
    // Lista de dominios de email válidos y populares
    const validDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'live.com',
      'msn.com',
      'icloud.com',
      'me.com',
      'mac.com',
      'aol.com',
      'protonmail.com',
      'zoho.com',
      'yandex.com',
      'mail.com',
      'gmx.com',
      'tutanota.com',
      'fastmail.com',
      'runbox.com',
      'mailbox.org',
      'disroot.org',
      // Dominios empresariales comunes
      'company.com',
      'corp.com',
      'org.com',
      'edu',
      'gov',
      // Dominios españoles
      'telefonica.net',
      'terra.es',
      'ya.com',
      'ono.com',
      'jazztel.es',
      'orange.es'
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { invalidEmail: true };
    }

    const domain = email.split('@')[1];
    
    // Verificar si el dominio está en la lista de dominios válidos
    const isDomainValid = validDomains.some(validDomain => 
      domain === validDomain || domain.endsWith('.' + validDomain)
    );

    // También permitir dominios que terminen en extensiones comunes
    const commonExtensions = ['.com', '.org', '.net', '.edu', '.gov', '.es', '.mx', '.co', '.io'];
    const hasValidExtension = commonExtensions.some(ext => domain.endsWith(ext));

    if (!isDomainValid && !hasValidExtension) {
      return { invalidEmailDomain: true };
    }

    // Verificar que no sea un dominio temporal o desechable conocido
    const temporaryDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'throwaway.email',
      'temp-mail.org'
    ];

    const isTemporary = temporaryDomains.includes(domain);
    
    if (isTemporary) {
      return { temporaryEmail: true };
    }

    return null;
  }
}

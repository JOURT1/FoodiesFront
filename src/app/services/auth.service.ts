import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  _id?: string;
  nombreCompleto: string;
  email: string;
  rol?: string;
  fechaRegistro?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  usuario?: User;
  errores?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si el usuario ya está logueado
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.verifyToken().subscribe(response => {
        if (response.success && response.usuario) {
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(response.usuario);
        } else {
          this.logout();
        }
      });
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const body = {
      nombreCompleto: name,
      email: email,
      password: password
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/registro`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (response.success && response.token && response.usuario) {
          this.setToken(response.token);
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(response.usuario);
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en registro:', error);
        return of({
          success: false,
          message: error.error?.message || 'Error de conexión con el servidor'
        });
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const body = {
      email: email,
      password: password
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (response.success && response.token && response.usuario) {
          this.setToken(response.token);
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(response.usuario);
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return of({
          success: false,
          message: error.error?.message || 'Error de conexión con el servidor'
        });
      })
    );
  }

  verifyToken(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.API_URL}/verificar`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error verificando token:', error);
        return of({
          success: false,
          message: 'Token inválido'
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  updateUserRole(newRole: string): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.API_URL}/actualizar-rol`, 
      { rol: newRole }, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (response.success && response.usuario) {
          // Actualizar el usuario actual en el servicio
          this.currentUserSubject.next(response.usuario);
        }
        return response;
      }),
      catchError(error => {
        console.error('Error actualizando rol:', error);
        return of({
          success: false,
          message: error.error?.message || 'Error al actualizar rol'
        });
      })
    );
  }

  getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }

  getUserName(): string | null {
    const user = this.getCurrentUser();
    return user ? user.nombreCompleto : null;
  }
}

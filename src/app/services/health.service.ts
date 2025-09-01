import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  
  constructor(private http: HttpClient) { }

  checkBackendHealth(): Observable<{success: boolean, message: string, url: string}> {
    const url = `${environment.apiUrl.replace('/api', '')}/api`;
    
    console.log('Testing backend connectivity to:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => ({
        success: true,
        message: response.message || 'Backend is reachable',
        url: url
      })),
      catchError(error => {
        console.error('Backend health check failed:', error);
        return of({
          success: false,
          message: `Backend unreachable: ${error.message}`,
          url: url
        });
      })
    );
  }
}

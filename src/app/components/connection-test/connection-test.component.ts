import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-connection-test',
  template: `
    <div style="padding: 20px; background: #f5f5f5; margin: 20px; border-radius: 8px;">
      <h3>🔧 Connection Test</h3>
      <div *ngFor="let test of tests" [style.color]="test.success ? 'green' : 'red'">
        {{ test.success ? '✅' : '❌' }} {{ test.name }}: {{ test.message }}
      </div>
      <button (click)="runTests()" style="margin-top: 10px; padding: 8px 16px;">Run Tests</button>
    </div>
  `
})
export class ConnectionTestComponent implements OnInit {
  tests: any[] = [];

  ngOnInit() {
    this.runTests();
  }

  async runTests() {
    this.tests = [];
    
    // Test 1: Environment check
    try {
      this.tests.push({
        name: 'Environment Config',
        success: true,
        message: `API URL: ${environment.apiUrl}, Production: ${environment.production}`
      });
    } catch (error) {
      this.tests.push({
        name: 'Environment Config',
        success: false,
        message: 'Failed to load environment'
      });
    }

    // Test 2: Basic API connectivity
    try {
      const response = await fetch('https://foodiesback.onrender.com/api');
      const data = await response.json();
      this.tests.push({
        name: 'API Base Endpoint',
        success: response.ok,
        message: data.message || 'API reachable'
      });
    } catch (error) {
      this.tests.push({
        name: 'API Base Endpoint',
        success: false,
        message: `Network error: ${error}`
      });
    }

    // Test 3: Origin check
    this.tests.push({
      name: 'Current Origin',
      success: true,
      message: window.location.origin
    });

    // Test 4: CORS Test
    try {
      const response = await fetch('https://foodiesback.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'wrongpassword'
        })
      });
      
      this.tests.push({
        name: 'CORS Test',
        success: true,
        message: `Response received (${response.status})`
      });
    } catch (error: any) {
      this.tests.push({
        name: 'CORS Test',
        success: false,
        message: error.message.includes('CORS') ? 'CORS blocking request' : `Network error: ${error.message}`
      });
    }
  }
}

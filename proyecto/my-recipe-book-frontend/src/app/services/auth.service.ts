import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  token: string;
  userId: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  public redirectUrl: string | null = null;
  private isBrowser: boolean;
  private authTokenKey = 'auth_token';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    let storedUser = null;

    if (this.isBrowser) {
      storedUser = localStorage.getItem('currentUser');
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return this.isBrowser ? localStorage.getItem(this.authTokenKey) : null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.token;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (this.isBrowser) {
            // Store token separately
            localStorage.setItem(this.authTokenKey, response.token);

            // Store user info
            const user: User = {
              id: response.userId,
              name: response.name,
              email: email,
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error:', error);
          console.error('Login error.status:', error.status);
          console.error('Login error.error:', error.error.message);
          console.error('Login error.message:', error.message);
          // Handle specific error case for "Bad credentials"
          if (error.status === 500 && error.error instanceof SyntaxError) {
            return throwError(() => new Error(error.error.message));
          }

          // Handle other errors
          return throwError(() => new Error(error.error.message));
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap((newUser) => {
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            this.currentUserSubject.next(newUser);
          }
        }),
        catchError((error) => {
          console.error('Registration error:', error);
          return throwError(() => new Error(error.error.message));
        })
      );
  }

  logout(): void {
    // Remove user and token from local storage
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem(this.authTokenKey);
    }
    this.currentUserSubject.next(null);
  }
}

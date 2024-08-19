import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { Login } from '../interfaces/login.interface';
import { environments } from '../../../environments/environments.dev';
import { Usuario } from '../../shared/interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environments.baseUrl;
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  constructor(private http: HttpClient, public router: Router) {}

  login(email: string, password: string): Observable<Login> {
    let URL = this.baseUrl + '/auth/login';
    return this.http.post<Login>(URL, { email:email, password:password }).pipe(
      map((resp: Login) => {
        const result = this.saveLocalStorage(resp);
        return result;
      }),
      catchError((err: any) => {
        // console.log(err);
        return of(err);
      })
    );
  }

  saveLocalStorage(resp: Login): boolean {
    if (resp && resp.token) {
      localStorage.setItem('token', resp.token);
      localStorage.setItem('rol', resp.rol);
      return true;
    }
    return false;
  }

  checkAuthentication(): Observable<boolean> {
    if (!this.isLocalStorageAvailable) {
      return of(false);
    }
    const token = localStorage.getItem('token') ?? '';

    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<Usuario>(
        `${this.baseUrl}/usuarios/me`,
        { headers }
      )
      .pipe(
        map((response) => true),
        catchError(() => of(false)) // Si hay algún error, devuelve false
      );
  }

  // register(register: Register): Observable<Register> {
  //   const URL = this.baseUrl + '/auth/register';
  //   return this.http.post<Register>(URL, register);
  // }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 500);
  }
}

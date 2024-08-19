import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../shared/interfaces/usuarios.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from '../../../environments/environments.dev';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl: string = environments.baseUrl;
  constructor(private httpClient: HttpClient) {}

  //Variable usuarios para mantener el estado actual y poder editarlo 
  private usuarios = signal<Usuario[]>([]);

  get usariosActuales() {
    return this.usuarios;
  }

  getUsuarios(token: string): Observable<Usuario[]> {
    // Crear los encabezados con el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    return this.httpClient.get<Usuario[]>(`${this.baseUrl}/usuarios/`, {
      headers,
    });
  }

  crearUsuario(token:string,usuario:Usuario): Observable<Usuario> {
      // Crear los encabezados con el token
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
      });
  
      return this.httpClient.post<Usuario>(`${this.baseUrl}/auth/signup` , usuario , {headers});
  }

  
}

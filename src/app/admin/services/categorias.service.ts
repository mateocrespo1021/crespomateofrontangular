import { Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) {}

  private categorias = signal<Categoria[]>([]);

  get categoriasActuales(){
  return this.categorias
  }

  //Obtiene las categorias
  getCategorias(token: string): Observable<Categoria[]> {
    // Crear los encabezados con el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    return this.httpClient.get<Categoria[]>(`${this.baseUrl}/api/categorias`, {
      headers,
    });
  }

  addCategoria(token: string, categoria: Categoria): Observable<Categoria> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    return this.httpClient.post<Categoria>(
      `${this.baseUrl}/api/categorias`,
      categoria,
      { headers }
    );
  }

  updateCategoria(token: string, categoria: Categoria,id:number): Observable<Categoria> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    return this.httpClient.put<Categoria>(
      `${this.baseUrl}/api/categorias/${id}`,
      categoria,
      { headers }
    );
  }

  deleteCategoriaById(token:string,id: number): Observable<boolean> {
    if (!id) throw Error('Categoria Id is required');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    return this.httpClient.delete(`${this.baseUrl}/api/categorias/${id}` , {headers}).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }

}

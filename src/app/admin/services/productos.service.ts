import { Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) {}

   //Variable prodcutos para mantener el estado actual y poder editarlo 
  private products = signal<Producto[]>([]);

  private productosClientes = signal<Producto[]>([]);

  

  //Signal carga tabla productos
  private signalLoading = signal<boolean>(false);

  get loading() {
    return this.signalLoading;
  }

  get currentProducts() {
    return this.products;
  }

  get productosCliente(){
    return this.productosClientes
  }

  obtenerProductosCliente(): Observable<Producto[]>{
    return this.httpClient.get<Producto[]>(`${this.baseUrl}/api/productos`);
  }

  getProducts(token: string): Observable<Producto[]> {
    // Crear los encabezados con el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    console.log(headers);

    return this.httpClient.get<Producto[]>(`${this.baseUrl}/api/productos`, {
      headers,
    });
  }

  getSearchItems(query: string): Observable<Producto[]> {
    return this.httpClient
      .get<Producto[]>(`${this.baseUrl}/productos/search`, {
        params: { q: query },
      })
      .pipe(catchError((error) => of([])));
  }

  getProductsById(id: string): Observable<Producto | undefined> {
    return this.httpClient
      .get<Producto>(`${this.baseUrl}/productos/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  addProduct(token: string, producto: any, file: any): Observable<Producto> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    // Crear un FormData para enviar el producto y el archivo
    const formData: FormData = new FormData();
    formData.append('producto', JSON.stringify(producto)); // Agregar el producto como JSON
    formData.append('file', file); // Agregar el archivo

    return this.httpClient.post<Producto>(
      `${this.baseUrl}/api/productos`,
      formData,
      { headers }
    );
  }

  updateProducts(
    token: string,
    producto: any,
    file: any,
    id: any
  ): Observable<Producto> {
    if (!id) throw Error('Product Id is required');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    // Crear un FormData para enviar el producto y el archivo
    const formData: FormData = new FormData();
    if (producto != null) {
      formData.append('producto', JSON.stringify(producto)); // Agregar el producto como JSON
    }

    if (file != null) {
      formData.append('file', file); // Agregar el archivo
    }

    return this.httpClient.put<Producto>(
      `${this.baseUrl}/api/productos/${id}`,
      formData , {headers}
    );
  }

  deleteProductById(token:string,id: number): Observable<boolean> {
    if (!id) throw Error('Product Id is required');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token.trim()}`, // Incluir el token en el encabezado
    });

    return this.httpClient.delete(`${this.baseUrl}/api/productos/${id}` , {headers}).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}

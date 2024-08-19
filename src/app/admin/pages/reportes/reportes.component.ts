import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import jsPDF from 'jspdf';
import { ButtonModule } from 'primeng/button';
import { ProductosService } from '../../services/productos.service';
import { UsuariosService } from '../../services/usuarios.service';
import autoTable from 'jspdf-autotable';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesComponent implements OnInit {
  constructor(
    private productsService: ProductosService,
    private usuariosService: UsuariosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  token!: string;
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') ?? '';
    }
  }
  
  generateProductosPDF() {
    const doc = new jsPDF();

    this.productsService.getProducts(this.token).subscribe((products: Producto[]) => {
      // Definir las columnas de la tabla
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Nombre', dataKey: 'nombre' },
        { header: 'Categoría', dataKey: 'categoria' },
        { header: 'Descripción', dataKey: 'descripcion' },
        { header: 'Precio', dataKey: 'precio' },
        { header: 'Stock', dataKey: 'stock' },
        { header: 'Fecha de Caducidad', dataKey: 'fecha_caducidad' },
        { header: 'Ubicación', dataKey: 'ubicacion' },
      ];

      // Definir los datos de las filas, manejando objetos y valores predeterminados
      const rows = products.map(product => ({
        id: product.id ?? '',
        nombre: product.nombre ?? '',
        categoria: product.id_categoria?.nombre ?? '', // Suponiendo que Categoria tiene un campo 'nombre'
        descripcion: product.descripcion ?? '',
        precio: product.precio ?? 0,
        stock: product.stock ?? 0,
        fecha_caducidad: product.fecha_caducidad ?? '',
        ubicacion: product.ubicacion ?? '',
      }));

      // Generar la tabla en el PDF
      autoTable(doc, {
        columns: columns,
        body: rows,
        startY: 10, // Posición inicial de la tabla
        theme: 'striped', // Estilo de la tabla (puedes cambiarlo a 'grid', 'plain', etc.)
        headStyles: { fillColor: [100, 100, 255] }, // Color de fondo para el encabezado de la tabla
      });

      // Descargar el PDF
      doc.save('reporte_productos.pdf');
    });
  }
}

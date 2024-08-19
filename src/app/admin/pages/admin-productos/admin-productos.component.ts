import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ProductosService } from '../../services/productos.service';
import { FormsModule } from '@angular/forms';
import { environments } from '../../../../environments/environments.dev';
import { ModalCrearProductoComponent } from '../../components/modal-crear-producto/modal-crear-producto.component';
import { ToastModule } from 'primeng/toast';
import { ModalEditarProductoComponent } from '../../components/modal-editar-producto/modal-editar-producto.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    ModalCrearProductoComponent,
    ModalEditarProductoComponent,
    ConfirmDialogModule
  ],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css',
})
export class AdminProductosComponent implements OnInit {
  private productoService = inject(ProductosService);
  public token: string = '';
  public baseImagenes = environments.baseImagenes;

  get productos() {
    return this.productoService.currentProducts;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    //Verifica el localstorage que exista para obtener el token
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') ?? '';
      this.productoService.getProducts(this.token).subscribe((productos) => {
        this.productos.set(productos);
      });
    }
  }

  eliminarProducto(id:number,event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estas seguro de eliminar este producto?',
      header: 'Confirmacion',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.productoService.deleteProductById(this.token, id).subscribe((result)=>{
          if (result) {
            const productosAc = this.productos().filter((pro) => pro.id != id)
            this.productos.set([...productosAc])
            this.messageService.add({ severity: 'info', summary: 'Producto Eliminado' });
          }
        })
          
      },
      reject: () => {
         
      }
  });
  }

}

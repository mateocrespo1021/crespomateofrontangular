import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../../services/productos.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Producto } from '../../interfaces/producto.interface';
import { environments } from '../../../../environments/environments.dev';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../interfaces/categoria.interface';

@Component({
  selector: 'app-modal-editar-producto',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    InputNumberModule,
    FileUploadModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './modal-editar-producto.component.html',
  styleUrl: './modal-editar-producto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditarProductoComponent implements OnInit {
  //Injectamos las dependencias
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private productsService: ProductosService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private categoriaService:CategoriasService
  ) {}

  public categoriasDisponibles! : Categoria[]
  public baseImagenes = environments.baseImagenes

  //Definimos el formulario
  formEditarPro!: FormGroup;

  //Producto a editar
  @Input() producto!: Producto;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') ?? '';
      this.categoriaService.getCategorias(this.token).subscribe((categorias)=>{
        this.categoriasDisponibles = categorias
      })
    }

    this.formEditarPro = this.fb.group({
      nombre: ['', [Validators.required]],
      precio: [0, [Validators.required]],
      descripcion: ['', [Validators.required]],
      stock: [0, [Validators.required]],
      ubicacion: ['', [Validators.required]],
      fecha_caducidad: ['', [Validators.required]],
      id_categoria: ['', [Validators.required]],
    });

    // Convertir `fecha_caducidad` a objeto Date si existe
  const fechaCaducidad = this.producto.fecha_caducidad 
  ? new Date(this.producto.fecha_caducidad)
  : null;

    this.formEditarPro.patchValue({
      nombre: this.producto.nombre,
      precio: this.producto.precio,
       id_categoria: this.producto.id_categoria,
      stock: this.producto.stock,
      descripcion: this.producto.descripcion,
      ubicacion: this.producto.ubicacion,
      fecha_caducidad: fechaCaducidad
    });

   
  }
  public token: string = '';
  //Para hacer visible el modal
  visible: boolean = false;
  //Imagen subida
  file!: any;
 
  //Formulario de producto

  showDialog() {
    this.visible = true;
  }

  get productos() {
    return this.productsService.currentProducts;
  }

  editarProducto() {
    //Valida el formulario
    if (!this.formEditarPro.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ingrese todos los campos',
        detail: '',
      });
      return;
    }

    //Actualizar el producto y carga datos
    this.productsService
      .updateProducts(this.token, this.formEditarPro.value, this.file , this.producto.id)
      .subscribe((result) => {
        if (result.id) {
          //Obtener los productos actualizados
          const productosAc = this.productos().filter((pro) => pro.id != this.producto.id)
          this.productos.set([result,...productosAc]);
          this.messageService.add({
            severity: 'info',
            summary: 'Producto Editado Correctamente',
            detail: '',
          });
          this.visible = false;
        }
      });
  }

  onUpload(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0]; // Suponiendo que solo se permite subir un archivo
      this.file = file;
    }
  }
}

import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../../services/productos.service';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { CalendarModule } from 'primeng/calendar';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-modal-crear-producto',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    InputNumberModule,
    FileUploadModule,
    ToastModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './modal-crear-producto.component.html',
  styleUrl: './modal-crear-producto.component.css',
})
export class ModalCrearProductoComponent implements OnInit {
  //Injectamos las dependencias
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private productsService: ProductosService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private categoriaService:CategoriasService
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') ?? '';
      this.categoriaService.getCategorias(this.token).subscribe((categorias)=>{
        this.categoriasDisponibles = categorias
      })

    }

  }
  public categoriasDisponibles! : Categoria[]
  public token: string = '';
  //Para hacer visible el modal
  visible: boolean = false;
  //Imagen subida
  file !: any
  //Arreglo de estados disponibles
  estados = ['Disponible', 'Reposición'];
  //Formulario de producto
  formCrearPro: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    precio: [0, [Validators.required]],
    descripcion: ['', [Validators.required]],
    stock: [0, [Validators.required]],
    ubicacion: ['', [Validators.required]],
    fecha_caducidad: ['', [Validators.required]],
    id_categoria: ['', [Validators.required]],
  });

  showDialog() {
    this.visible = true;
  }

  get productos(){
   return this.productsService.currentProducts
  }

  get productoFormulario() {
    return {
      nombre: this.formCrearPro.get('nombre')?.value,
      precio: this.formCrearPro.get('precio')?.value,
      descripcion: this.formCrearPro.get('descripcion')?.value,
      stock: this.formCrearPro.get('stock')?.value,
      ubicacion: this.formCrearPro.get('ubicacion')?.value,
      fecha_caducidad: this.formCrearPro.get('fecha_caducidad')?.value,
      id_categoria: this.formCrearPro.get('id_categoria')?.value, // Asignamos solo el ID de la categoría
    } as Producto
  }


  crearProducto() {
    //Valida el formulario
    if (!this.formCrearPro.valid || this.file == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ingrese todos los campos',
        detail: '',
      });
      return;
    }

  
    //Editar el formulario productos
    

    //Guarda el producto y carga datos
    this.productsService
      .addProduct(this.token,this.productoFormulario,this.file)
      .subscribe((result) => {
        if (result.id) {
          this.productos.set([result,...this.productos()])
          this.messageService.add({
            severity: 'info',
            summary: 'Producto Agregado Correctamente',
            detail: '',
          });
         this.visible=false
        }
      });
  }

  onUpload(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0]; // Suponiendo que solo se permite subir un archivo
     this.file = file
    }
  }
}

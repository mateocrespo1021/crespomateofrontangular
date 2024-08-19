import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CategoriasService } from '../../services/categorias.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-modal-crear-categoria',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule
  ],
  templateUrl: './modal-crear-categoria.component.html',
  styleUrl: './modal-crear-categoria.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCrearCategoriaComponent { 
    //Injectamos las dependencias
    constructor(
      private fb: FormBuilder,
      private messageService: MessageService,
      private categoriaService: CategoriasService,
      @Inject(PLATFORM_ID) private platformId: Object,
    ) {}
    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.token = localStorage.getItem('token') ?? '';
      }
    }
    public token: string = '';
    //Para hacer visible el modal
    visible: boolean = false;
    
    //Formulario de categoria
    formCrearCategoria: FormGroup = this.fb.group({
      nombre: ['', [Validators.required]],

    });
  
    showDialog() {
      this.visible = true;
    }
  
    //Obtiene las categorias actuales
    get categorias(){
     return this.categoriaService.categoriasActuales
    }
  
    crearCategoria() {
      //Valida el formulario
      if (!this.formCrearCategoria.valid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Ingrese todos los campos',
          detail: '',
        });
        return;
      }

      this.visible=false
  
      //Guarda el producto y carga datos
      this.categoriaService
        .addCategoria(this.token,this.formCrearCategoria.value)
        .subscribe((result) => {
          if (result.id) {
            //Actualizamos la tabla de categorias
            this.categorias.set([result,...this.categorias()])
            this.messageService.add({
              severity: 'info',
              summary: 'Categoria Agregado Correctamente',
              detail: '',
            });
           
          }
        });
    }
  
}

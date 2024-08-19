import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-modal-editar-categoria',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './modal-editar-categoria.component.html',
  styleUrl: './modal-editar-categoria.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditarCategoriaComponent {
    @Input()
    categoria!:Categoria
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

      this.formEditarCategoria.patchValue({
        nombre: this.categoria.nombre
      });
      
    }
    public token: string = '';
    //Para hacer visible el modal
    visible: boolean = false;
    
    //Formulario de categoria
    formEditarCategoria: FormGroup = this.fb.group({
      nombre: ['', [Validators.required]],
    });
  
    showDialog() {
      this.visible = true;
    }
  
    //Obtiene las categorias actuales
    get categorias(){
     return this.categoriaService.categoriasActuales
    }
  
    editarCategoria() {
      
      //Valida el formulario
      if (!this.formEditarCategoria.valid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Ingrese todos los campos',
          detail: '',
        });
        return;
      }

      this.visible=false
  
      //Edita la categoria
      this.categoriaService
        .updateCategoria(this.token,this.formEditarCategoria.value,this.categoria.id)
        .subscribe((result) => {
          if (result.id) {
            //Actualizamos la tabla de categorias
            const categoriasAc = this.categorias().filter((cate) =>  cate.id != this.categoria.id)
          this.categorias.set([result,...categoriasAc]);
            this.messageService.add({
              severity: 'info',
              summary: 'Categoria Editada Correctamente',
              detail: '',
            });
          
          }
        });
    }
 }

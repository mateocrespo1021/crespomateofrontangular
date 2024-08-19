import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CategoriasService } from '../../services/categorias.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalCrearCategoriaComponent } from '../../components/modal-crear-categoria/modal-crear-categoria.component';
import { ModalEditarCategoriaComponent } from '../../components/modal-editar-categoria/modal-editar-categoria.component';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ModalCrearCategoriaComponent,
    ModalEditarCategoriaComponent
  ],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css',
})
export class AdminCategoriasComponent implements OnInit{

  //Injectamos el servicio
  private categoriaService = inject(CategoriasService);
  public token: string = '';

  get categorias(){
    return this.categoriaService.categoriasActuales
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
      //Hacemos la peticion para obtener las categorias
      this.categoriaService.getCategorias(this.token).subscribe((categorias) => {
        this.categorias.set(categorias);
      });
    }
  }

  eliminarCategoria(id:number,event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estas seguro de eliminar esta categoria?',
      header: 'Confirmacion',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.categoriaService.deleteCategoriaById(this.token, id).subscribe((result)=>{
          if (result) {
            //Filtramos para eliminar la categoria y obtener las categorias actualizadas
            const cateogriasAc = this.categorias().filter((cate) => cate.id != id)
            this.categorias.set([...cateogriasAc])
            this.messageService.add({ severity: 'info', summary: 'Categoria Eliminado' });
          }
        })
          
      },
      reject: () => {
         
      }
  });
  }

 }

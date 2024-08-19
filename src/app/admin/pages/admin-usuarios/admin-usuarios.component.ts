import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../../shared/interfaces/usuarios.interface';
import { ModalCrearUsuarioComponent } from '../../components/modal-crear-usuario/modal-crear-usuario.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, TableModule, ModalCrearUsuarioComponent, ToastModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css',
})
export class AdminUsuariosComponent implements OnInit {
  token!: string;
  
  get usuarios(){
    return this.usuariosService.usariosActuales
  }

  constructor(
    private usuariosService: UsuariosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    //Verifica el localstorage que exista para obtener el token
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') ?? '';
      this.usuariosService.getUsuarios(this.token).subscribe((usuarios) => {
        this.usuarios.set(usuarios)
      });
    }
  }
}

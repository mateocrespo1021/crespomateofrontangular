import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-aside-admin',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    SidebarModule,
    RouterModule,
  ],
  templateUrl: './aside-admin.component.html',
  styleUrl: './aside-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideAdminComponent {
  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  rol!: string;
  ngOnInit() {
    //Verifica el localstorage que exista para obtener el token
    if (isPlatformBrowser(this.platformId)) {
      this.rol = localStorage.getItem('rol') ?? '';
    }
  }

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  cerrarSesion() {
    this.authService.logout();
  }

  sidebarVisible: boolean = false;
}

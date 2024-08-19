import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AsideAdminComponent } from './shared/components/aside-admin/aside-admin.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AsideAdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'democomplex';
  isNotAdminView: boolean = false;
  admin?: boolean;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      // Verifica si la ruta actual no contiene 'admin'
      this.isNotAdminView = !this.router.url.includes('admin');
    });
  }
}

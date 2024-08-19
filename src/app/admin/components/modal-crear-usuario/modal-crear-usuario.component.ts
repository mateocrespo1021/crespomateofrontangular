import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { UsuariosService } from '../../services/usuarios.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { ValidatorService } from '../../../shared/services/validator.service';

@Component({
  selector: 'app-modal-crear-usuario',
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
  templateUrl: './modal-crear-usuario.component.html',
  styleUrl: './modal-crear-usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCrearUsuarioComponent implements OnInit {
  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private validatorsService: ValidatorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') ?? '';
    }
  }

  token!: string;

  formUsuario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ],
    ],
    rol: ['', [Validators.required]],
  });

  roles: string[] = ['ADMIN', 'INVENTARIO'];

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  get usuarios() {
    return this.usuariosService.usariosActuales;
  }

  //Obtener los errores del formulario
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.formUsuario, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formUsuario, field);
  }

  crearUsuario() {
    if (!this.formUsuario.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ingrese todos los campos',
      });
      return;
    }

    this.usuariosService
      .crearUsuario(this.token, this.formUsuario.value)
      .subscribe((result) => {
        this.visible = false;
        if (result.id) {
          this.usuarios.set([result, ...this.usuarios()]);
          this.messageService.add({
            severity: 'info',
            summary: 'Usuario Creado',
          });
          
        }
      });
  }
}

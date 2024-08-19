import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidatorService } from '../../../shared/services/validator.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit{

  //Injectamos el formbuilder para los formularios reactivos
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private validatorsService = inject(ValidatorService)
  private messageService = inject(MessageService)
  private router = inject(Router)
  public formLogin !:FormGroup
  public showSpinner: boolean = false;

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          //Expresion regular para el email
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  } 

  //Obtener los errores del formulario
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.formLogin, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formLogin, field);
  }

  onLogin(){
    if (!this.formLogin.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ingrese todos los campos',
        detail: '',
      });
      return
    }
    const {email , password} = this.formLogin.value
    console.log(email,password);
    
       this.authService.login(email,password).subscribe((result)=>{
        if (result) {
         this.router.navigateByUrl('/admin/productos')
        }
        
       })
  }


}

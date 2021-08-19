import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  user : User;
  registerForm: FormGroup;
  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
        gender: ['female'],
        dateOfBirth: ['', Validators.required],
        zodiacSign: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        username: ['', Validators.required],
        password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
        confirmPassword: ['',Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(fg: FormControl) {
    return fg.get("password").value === fg.get("confirmPassword").value ? null : {mismatch: true};
  }


  register(){

    if(this.registerForm.valid)
    {

      this.user = Object.assign({}, this.registerForm.value);

      this.authService.register(this.user).subscribe(() => {
           this.alertify.success("Rejestracja udana");
         }, error => {
           this.alertify.error(error);
        }, () => {
          this.authService.login(this.user).subscribe(() => {
              this.router.navigate(['/uzytkownicy']);
          });
        });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log("Anulowane");
  }

}

import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router ) { }

  ngOnInit() {
    this.authService.currenPhotoUrl.subscribe(photourl => this.photoUrl = photourl);
  }

  login(){
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success("Zalogowany");
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/uzytkownicy']);
    });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authService.decodeToken = null;
    this.authService.currentUser = null;
    this.alertify.success("Wylogowany Pomyślnie");
    this.router.navigate(['/home']);
  }

}

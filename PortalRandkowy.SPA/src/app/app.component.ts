import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PortalRandkowy-SPA';
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(token)
    {
      this.authService.decodeToken = this.jwtHelper.decodeToken(token);
    }

    if(user)
    {
      this.authService.currentUser = user;
      this.authService.changeUserPhoto(user.photoUrl);
    }
  }

}

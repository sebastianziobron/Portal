import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AlertifyService } from './_services/alertify.service';
import { UserService } from './_services/user.service';
import { UsersListComponent } from './users/users-list/users-list.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LikesComponent } from './likes/likes.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';

export function tokenGetter()
{
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [						
    AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      UsersListComponent,
      LikesComponent,
      MessagesComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:5000'],
          disallowedRoutes: ['localhost:5000/auth']
        }
    }),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, AlertifyService,UserService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

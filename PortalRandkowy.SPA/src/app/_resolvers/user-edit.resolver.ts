import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { UserService } from "../_services/user.service";

@Injectable()
export class UserEditResolver implements Resolve<User> {
    
    constructor( private userService: UserService, private router: Router, private alertyfi: AlertifyService, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.userService.getUser(this.authService.decodeToken.nameid).pipe(
            catchError(error => {
                this.alertyfi.error("tu zym jest");
                this.router.navigate(['/uzytkownicy']);
                return of(null);
            })
        );
    }

    

}
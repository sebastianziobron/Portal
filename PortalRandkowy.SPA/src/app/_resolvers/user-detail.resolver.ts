import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";

@Injectable()
export class UserDetailResolver implements Resolve<User> {
    
    constructor( private userService: UserService, private router: Router, private alertyfi: AlertifyService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.userService.getUser(route.params.id).pipe(
            catchError(error => {
                this.alertyfi.error("Problem z pobraniem danych 2");
                this.router.navigate(['/uzytkownicy']);
                return of(null);
            })
        );
    }

    

}
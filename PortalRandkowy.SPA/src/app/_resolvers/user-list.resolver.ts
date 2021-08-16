import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";

@Injectable()
export class UserListResolver implements Resolve<User[]> {
    
    constructor( private userService: UserService, private router: Router, private alertyfi: AlertifyService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]>{
        return this.userService.getUsers().pipe(
            catchError(error => {
                this.alertyfi.error("Problem z pobraniem danych");
                this.router.navigate(['']);
                return of(null);
            })
        );
    }

    

}
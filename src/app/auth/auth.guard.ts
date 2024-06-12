import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { map, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        
        return this.authService.user.pipe(
            map(user => {
                return !!user;
            }),
            tap(isAuth => {
                if(!isAuth) {
                    this.router.navigate(['/auth']);
                }
            })
        )

    }

}
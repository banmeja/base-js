import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../recursos/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    if(route.queryParams.token){
      return true;
    }else {//validar tokens
      return this.checkLogin(url)
    }
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn()) { return true; }

    this.authService.logOut();
    this.router.navigate(['login']);
    return false;
  }
}


@Injectable({
  providedIn: 'root'
})
export class validarPermisos implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    let bandera=false;
        let permisosUsuario=this.authService.decodePermisos().split(',')
        if(route.data['paginas']){
            route.data['paginas'].forEach(permisoPag => {
                permisosUsuario.forEach(permisoUsuario => {
                    if (permisoPag==permisoUsuario) {
                        bandera= true
                    }   
                });
            });
        }        
        console.log('permisos ',bandera)
        if(!bandera){
          this.router.navigate(['/']);
        }
        
        return bandera;
  }

  
}
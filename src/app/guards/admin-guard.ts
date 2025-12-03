// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../services/auth';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.auth.isAuthenticated() && this.auth.isAdmin()) {
      return true;
    }
    
    // Not admin, show error and redirect
    alert('⛔ Bu sayfaya erişim izniniz yok. Sadece yöneticiler erişebilir.');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
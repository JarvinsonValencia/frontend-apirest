import { Component } from "@angular/core";
import Swal from "sweetalert2";
import { AuthService } from "../usuarios/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  title:string = 'App Angular Spring'

  constructor(public authService: AuthService, private router: Router){

  }

  logout():void{

    Swal.fire('Logout', `Hola ${this.authService.usuario.username}, has cerrado sesión con éxito`, 'success')
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}



import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { cryptoOJ } from '../../recursos/cryptoOJ';
import { recursosVarios } from '../../recursos/recursosVarios';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    loginData:any={};


    constructor(private element: ElementRef,
                private router: Router,
                private loginservice:LoginService) {
        
        this.loginData.USUARIO=''
        this.loginData.CLAVE=''
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            card.classList.remove('card-hidden');
        }, 700);
    }

    /*
        Metodo validar() llamado desde el boton de ingresar
    */

    validar(){
        if((this.loginData.USUARIO!=undefined && this.loginData.USUARIO.trim()!="")&&(this.loginData.CLAVE!=undefined&&this.loginData.CLAVE.trim()!='')){
            let encr:cryptoOJ = new cryptoOJ();
            this.loginData.CLAVE=encr.encrypt(this.loginData.USUARIO,this.loginData.CLAVE);    
            this.loginservice.login(this.loginData).subscribe(
                data => {
                    this.Redireccionar(data);    
                });
        }else{
            this.loginData.CLAVE='';
            console.log('indefinido');
        }
    }


    Redireccionar(data){
        if ( data.mensaje.result == 'OK' ) {
            if(data.oauth){
                new recursosVarios().showNotification('top','right',data.mensaje.msj,2)
                this.router.navigate([''], { queryParams: { token: data.oauth.TOKEN}, queryParamsHandling: 'merge' });
            }else{
                new recursosVarios().showNotification('bottom','center',"No tienes permisos para ingresar al sistema",4)
            }

        }else{
            new recursosVarios().showNotification('top','center',data.mensaje.msj,4)
            this.loginData.CLAVE=undefined;

        }
    }


    










    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    ngOnDestroy(){
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('login-page');
      body.classList.remove('off-canvas-sidebar');
    }
}

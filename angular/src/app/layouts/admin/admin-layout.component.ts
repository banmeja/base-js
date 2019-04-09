import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import PerfectScrollbar from 'perfect-scrollbar';
import { NavbarComponent } from '../../Menu/up/navbar.component';
import { AuthService } from '../../recursos/auth.service';
import { AppconfigService } from '../../appconfig.service';
import { recursosVarios } from '../../recursos/recursosVarios';
import { SidebarComponent } from '../../Menu/left/sidebar.component';
import { cryptoOJ } from '../../recursos/cryptoOJ';
import { FixedpluginComponent } from '../../Menu/right/fixedplugin.component';

declare const $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit, AfterViewInit  {
    
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    url: string;
    private localStorageService;
    banderaOcultar=true
    dataColor='orange'
    colorFondo='blue'
    dataImage;
    fondo=true;// indica si se pone la imagen de fondo

    @ViewChild('menuLeft') sidebar: SidebarComponent;
    @ViewChild('menuUp') navbar: NavbarComponent;
    @ViewChild('menuRight') menuSys: FixedpluginComponent;

    constructor( private router: Router,
                 private location: Location,
                 private route: ActivatedRoute,
                 private authService:AuthService,
                 private appSettings:AppconfigService) {
                this.localStorageService = localStorage;
                 this.ValidarUsario();
    }


    
    actualizarVersion(VERSION_SISTEMA){
        if(VERSION_SISTEMA!=this.localStorageService.getItem( 'appVersion' + this.appSettings.sistemaId)){
            console.log("Actualiza Sistema de ",this.localStorageService.getItem( 'appVersion' + this.appSettings.sistemaId)," a ",VERSION_SISTEMA);
            this.localStorageService.setItem( 'appVersion' + this.appSettings.sistemaId,VERSION_SISTEMA);
            window.location.reload(true);
          }else{
            console.log("Sistema Actualizado");
          }
    }


    ngOnInit() {     
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        this.location.subscribe((ev:PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
         this.router.events.subscribe((event:any) => {
            if (event instanceof NavigationStart) {
               if (event.url != this.lastPoppedUrl)
                   this.yScrollStack.push(window.scrollY);
           } else if (event instanceof NavigationEnd) {
               if (event.url == this.lastPoppedUrl) {
                   this.lastPoppedUrl = undefined;
                   window.scrollTo(0, this.yScrollStack.pop());
               }
               else
                   window.scrollTo(0, 0);
           }
        });
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
             elemMainPanel.scrollTop = 0;
             elemSidebar.scrollTop = 0;
        });
        const html = document.getElementsByTagName('html')[0];
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps = new PerfectScrollbar(elemMainPanel);
            ps = new PerfectScrollbar(elemSidebar);
            html.classList.add('perfect-scrollbar-on');
        }
        else {
            html.classList.add('perfect-scrollbar-off');
        }
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
          this.navbar.sidebarClose();
        });

        

    }
    
    salida:any={};
    ValidarUsario(){
        let bandera=true;
        if(this.authService.isLoggedIn()){
            console.log("Esta Logeado");
            this.obtenerSession();
        }else {
            console.log("No Esta Logeado");
            this.route.queryParams
            .filter(params => params.token)
            .subscribe(params => {
                bandera=false;
                console.log("Viene Token OATUH");
                if(this.authService.saveLocalData("token"+this.appSettings.sistemaIdOAUTH,params.token)){
                    console.log("Token OAUTH Guardado");
                    this.obtenerSession()        
                }
            }); 

        }
    }
    xx=false;
    obtenerSession(){
        
        this.authService.getSessionUsuario(this.appSettings.sistemaId).subscribe(
            data => {
                if(data!=undefined){
                    console.log("Session de Usuario Obtenida",data);
                    this.salida.SESSION=data;
                    if(this.authService.saveLocalData("token"+this.appSettings.sistemaId,this.salida.SESSION.SISTEMA.TOKEN)){
                        console.log("Token SISTEMA Guardado");
                        let encryptPermisos=new cryptoOJ().encrypt("permisos2"+this.appSettings.sistemaId,this.salida.SESSION.PERMISOS.toString());
                        this.authService.saveLocalData("permisos2"+this.appSettings.sistemaId,encryptPermisos);
                        this.authService.saveLocalData("permisos"+this.appSettings.sistemaId,this.salida.SESSION.PERMISOS.toString());
                        this.authService.getConstantes().subscribe(
                            data => {
                                if(data!=undefined){
                                    console.log("Constantes de Sistema Obtenidas",data);
                                    this.salida.CONSTANTES=data;
                                    this.authService.InsUsuario( this.salida.SESSION ).subscribe(
                                        data => {
                                            if(data!=undefined){
                                                if(data.result=='OK'){
                                                    this.banderaOcultar=false;
                                                    new recursosVarios().showNotification('top','right',data.msj,6);
                                                    //this.authService.saveLocalData('appVersion' + this.appSettings.sistemaId,this.salida.CONSTANTES.VERSION_SISTEMA)
                                                    console.log('var this.salida ', this.salida);
                                                    if(this.sidebar.menuUsuario){
                                                        this.sidebar.menuUsuario=this.salida.SESSION.MENU_PRINCIPAl;
                                                        this.navbar.menuSuperior=this.salida.SESSION.MENU_ENCABEZADO;
                                                        this.menuSys.menuSistemas=this.salida.SESSION.SISTEMAS;
                                                        this.actualizarVersion(this.salida.SESSION.SISTEMA.VERSION_SISTEMA);
                                                        this.authService.setsession(this.salida);
                                                        this.navbar.setDatosPersonales(this.salida.SESSION.NOMBRE, this.salida.SESSION.CORREO,'data:image/png;base64,'+this.salida.SESSION.FOTO);
                                                        this.sidebar.cargarMenu()
                                                        this.xx=true;
                                                    }
                                                    //this.sidebar.MenuUsuario=this.salida.SESSION.MENU_PRINCIPAl.filter(MENU=>MENU)
                                                }else{
                                                    new recursosVarios().showNotification('top','right',data.msj,4);
                                                }
                                            }else{
                                                console.log('error al obtener InsUsuario');
                                                console.log('401');
                                                this.authService.logOut();
                                                this.router.navigate(['login']);
                                            }
                                        });
                                }else{
                                    console.log('error al obtener constantes');
                                    console.log('401');
                                    this.authService.logOut();
                                    this.router.navigate(['login']);
                                }
                            }
                        );
                    }
                }else{
                    console.log('error al obtener session de usuario');
                    console.log('401');
                    this.authService.logOut();
                    this.router.navigate(['login']);
                }
            });
    }


    
    public isMap() {
        if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen') {
            return true;
        } else {
            return false;
        }
    }

    runOnRouteChange(): void {
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        let ps = new PerfectScrollbar(elemMainPanel);
        ps = new PerfectScrollbar(elemSidebar);
        ps.update();
      }
    }

    
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    ngAfterViewInit() {
        this.runOnRouteChange();
        this.estilosMenu();
        this.setFondo();
    }

    estilosMenu(){        
        const $sidebar = $('.sidebar');
        this.colorFondo=this.localStorageService.getItem('colorFondo')
        if(!this.colorFondo){
            this.localStorageService.setItem( 'backGroundColor','blue');
            this.colorFondo='blue'
        }
        $sidebar.attr('data-background-color', this.colorFondo);

        //setear el color de fondo secundario
        
        this.dataColor=this.localStorageService.getItem('dataColor')
        if(!this.dataColor){
            this.localStorageService.setItem( 'dataColor','white');
            this.dataColor='white'
        }
        $sidebar.attr('data-color', this.dataColor);


        //Almacenar la imagen de fondo
        const $sidebar_img_container = $sidebar.find('.sidebar-background');
        this.dataImage=this.localStorageService.getItem('backgroundImage');
        if(!this.dataImage){
            this.localStorageService.setItem( 'backgroundImage','./assets/img/sidebar-1.jpg');
            this.dataImage='./assets/img/sidebar-1.jpg'
        }
        
        $sidebar_img_container.css('background-image', 'url("' + this.dataImage+ '")');
        $sidebar_img_container.fadeIn('fast');

    }
    
    setFondo(){
        const $sidebar = $('.sidebar');
    const $sidebar_img_container = $sidebar.find('.sidebar-background');
    const $full_page = $('.full-page');

    this.fondo=(localStorage.getItem('fondo')=='true')
    if(this.fondo){
        localStorage.setItem( 'fondo','true');
        this.fondo=true
    }else{
        localStorage.setItem( 'fondo','false');
        this.fondo=false
    }
    const $full_page_background = $('.full-page-background');
    const $input = $(this);
            
          if (this.fondo) {
              if ($sidebar_img_container.length !== 0) {
                  $sidebar_img_container.fadeIn('fast');
                  $sidebar.attr('data-image', '#');
              }

              if ($full_page_background.length !== 0) {
                  $full_page_background.fadeIn('fast');
                  $full_page.attr('data-image', '#');
              }

              const background_image = true;
          } else {
              if ($sidebar_img_container.length !== 0) {
                  $sidebar.removeAttr('data-image');
                  $sidebar_img_container.fadeOut('fast');
              }

              if ($full_page_background.length !== 0) {
                  $full_page.removeAttr('data-image', '#');
                  $full_page_background.fadeOut('fast');
              }
              const background_image = false;
          }
    }

    
}




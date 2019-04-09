import { Component, OnInit, Input } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { Router } from '@angular/router';

declare const $: any;

//Metadata
export class RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[]=new Array<ChildrenItems>();
    constructor(){}
}

export class ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
    constructor(){}
}

//Menu Items
export const ROUTES: RouteInfo[] =new Array<RouteInfo>();/* [
{
        path: '/',
        title: 'Dashboardx',
        type: 'link',
        icontype: 'dashboard'
},{
    path: '/generico',
    title: 'Generico',
    type: 'link',
    icontype: 'content_copy'
},{
    path: '/genericopadre',
    title: 'GenericoPadre',
    type: 'sub',
    icontype: 'content_paste',
    collapse: 'genericopadre',
    children: [
        {path: 'hijo', title: 'Hijo', ab:'HJ'},
        {path: 'hijo2', title: 'Hijo2', ab:'H2'}
    ]
},{
        path: '/pages',
        title: 'Pages',
        type: 'sub',
        icontype: 'image',
        collapse: 'pages',
        children: [
            {path: 'pricing', title: 'Pricing', ab:'P'},
            {path: 'timeline', title: 'Timeline Page', ab:'TP'},
            {path: 'login', title: 'Login Page', ab:'LP'},
            {path: 'register', title: 'Register Page', ab:'RP'},
            {path: 'lock', title: 'Lock Screen Page', ab:'LSP'},
            {path: 'user', title: 'User Page', ab:'UP'}
        ]
    }
];*/

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[]=new Array<any>();

    public menuUsuario:any[]=new Array<any>();
    public a:boolean=false;

    constructor(private router:Router){}

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        //this.menuItems = ROUTES.filter(menuItem => menuItem);
        
    }

    cargarMenu(){
     this.menuUsuario.forEach(menu => {
            let t:RouteInfo=new RouteInfo();
            t.path=menu.URL_MENU
            t.title=menu.MENU
            t.icontype=menu.ICONO
            if(menu.hijos.length>0){
                t.type='sub'
                t.collapse=menu.URL_MENU

                menu.hijos.forEach(hijo => {
                    let h:ChildrenItems=new ChildrenItems();
                    //{path: 'hijo', title: 'Hijo', ab:'HJ'},
                    h.path=hijo.URL_MENU
                    h.title=hijo.ABREVIACION
                    h.ab=hijo.ICONO
                    t.children.push(h)    
                });
            }else{
                t.type='link'
            }
            
            this.menuItems.push(t)
            ROUTES.push(t);
        });
    }

    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }


    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}

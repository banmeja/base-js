import { Component, OnInit, ElementRef } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { AuthService } from '../../recursos/auth.service';


declare const require: any;

declare const $: any;

@Component({
    selector: 'app-hijo2',
    templateUrl: 'hijo2.component.html',
    styles: ['./hijo2.component.scss']
})

export class Hijo2Component implements OnInit {
    constructor(private au:AuthService){
    }

    ngOnInit() {
        
    }

    ngAfterViewInit(){
        console.log('cargando',this.au.getsession())
    }
        myFunc(val: any) {
          // code here
        }
}

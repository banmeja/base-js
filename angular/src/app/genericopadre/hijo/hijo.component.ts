import { Component, OnInit, ElementRef } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { Router } from '@angular/router';


declare const require: any;

declare const $: any;

@Component({
    selector: 'app-hijo',
    templateUrl: 'hijo.component.html',
    styles: ['./hijo.component.scss']
})

export class HijoComponent implements OnInit {

    constructor(private router:Router){}

    ngOnInit() {
        //this.router.navigate(['login']);

    }
    myFunc(val: any) {
        // code here
    }
}

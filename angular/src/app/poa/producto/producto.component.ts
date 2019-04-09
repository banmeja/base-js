import { Component, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  title = 'angular-material-tab-router';  
  navLinks: any[];
  activeLinkIndex = -1; 
  constructor(private router: Router) {
    this.navLinks = [
      { 
          label: 'Lista productos migrados',
          link: './list',
          index: 0
      }, {
          label: 'Productos no migrados',
          link: './noMigrado',
          index: 1
      }/*, {
          label: 'Third',
          link: './third',
          index: 2
      }*/ 
  ];
   }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
  });
  }

}

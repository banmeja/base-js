import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-primero',
  templateUrl: './primero.component.html',
  styleUrls: ['./primero.component.scss']
})
export class PrimeroComponent implements OnInit {

  constructor() {
    console.log(123)
   }

  ngOnInit() {
  }

  
}

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']  
})
export class AddComponent implements OnInit {
  date = new FormControl(new Date());  
  constructor(
    
  ) { 
    console.log(this.date);
  }

  ngOnInit(
    
  ) {
    
  }

  
}

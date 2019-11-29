import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private pseudo: string;
  private passwd: string;
  private email: string;
  private isConnected: boolean;

  constructor() { }

  ngOnInit() {
  }

}

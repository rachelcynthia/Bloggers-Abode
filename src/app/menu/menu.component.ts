import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  
  loggedIn:boolean = false;
  user:any;
  profId: string;


  constructor() { 
    this.user=firebase.auth().currentUser;
    if(this.user){
      this.loggedIn=true;
      this.profId=this.user.uid;
    }
    else{
      this.loggedIn=false;
    }
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        this.loggedIn=true;
        this.profId=user.uid;
      }
      else{
        this.loggedIn=false;

      }
    })
  }

  ngOnInit(): void {
  }
  logout(){
    firebase.auth().signOut();
  }
}
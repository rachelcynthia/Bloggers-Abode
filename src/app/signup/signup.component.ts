import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms'
import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  myForm: FormGroup;
  message:string="";
  userError:any;

  constructor(public formb: FormBuilder,public authService:AuthService) {

    this.myForm = this.formb.group({
      firstName: ['',[Validators.required]],
      lastName:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(8)]],
      confirmPassword:['',[Validators.required]]
    },{
      validators : this.checkIfMatchingPassword("password","confirmPassword")
    })

   }
   checkIfMatchingPassword(passwordKey:string, confirmPasswordKey:string){
      return (group:FormGroup) =>{
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];
        if(password.value == confirmPassword.value){
          return;
        }
        else{
          confirmPassword.setErrors({
            notEqualToPassword: true
          })
        }
      }   
    }
  onSubmit(signupform: any){
    let email:string = signupform.value.email;
    let password: string = signupform.value.password;
    let firstName:string = signupform.value.firstName;
    let lastName:string = signupform.value.lastName;

    this.authService.signup(email,password,firstName,lastName)
    .then((user:any) => {
      firebase.firestore().collection("users").doc(user.uid)
      .set({
        firstName: signupform.value.firstName,
        lastName: signupform.value.lastName,
        email: signupform.value.email,
        photoURL: user.photoURL,
        interests:"", 
        bio:"",
        hobbies:""
      }).then(()=>{
        this.message = "You have been signed up Successfully. Please Login"
      })
      }).catch((error) => {
      console.log(error);
      this.userError = error;
    })
  }
  ngOnInit(): void {
  }

}

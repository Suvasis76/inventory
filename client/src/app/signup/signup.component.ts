import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from'../services/user.service';
import { SnackbarService } from'../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm :any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackbarservice:SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxServices:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null,[Validators.required]]
    });
  }

  handleSubmit(){
    this.ngxServices.start();
    var formData=this.signupForm.value;
    var data={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      password:formData.password
    }
    this.userService.signup(data).subscribe((response:any)=>{
      this.ngxServices.stop();
      this.dialogRef.close();
      this.responseMessage=response?.message;
      this.snackbarservice.openSnackbar(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error)=>{
      this.ngxServices.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarservice.openSnackbar(this.responseMessage,GlobalConstants.error);
    })
  }

}

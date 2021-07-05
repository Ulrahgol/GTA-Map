import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent {
    form: FormGroup = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  
    submit() {
      if (this.form.valid) {
        this.submitEM.emit(this.form.value);
        console.log(this.error);
        
      }
    }
    @Input() error: string;
  
    @Output() submitEM = new EventEmitter();
  }
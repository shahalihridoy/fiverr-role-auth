import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from "@angular/material";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSigningUp: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      agreed: ["", Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSigningUp = true;

      this.authService
        .loginWithEmail(
          this.loginForm.get("email").value,
          this.loginForm.get("password").value
        )
        .catch(error => {
          this.isSigningUp = false;
          this.snackbar.open(error, "", {
            duration: 5000
          });
          throw error;
        })
        .then(() => {
          if (this.afAuth.user) {
            this.router.navigateByUrl("/dashboard");
          }
          this.isSigningUp = false;
        });
    } else
      this.snackbar.open("Please, fill the form correctly", "", {
        duration: 5000
      });
  }

  requestPasswordChange() {
    let email = this.loginForm.get("email").value;
    if (email) {
      this.authService
        .requestPasswordChange(email)
        .catch(error => {
          this.snackbar.open(error, "", { duration: 5000 });
          throw error;
        })
        .then(() => {
          this.snackbar.open("Password is sent to your email", "", {
            duration: 5000
          });
        });
    } else
      this.snackbar.open("Please, type your email above", "", {
        duration: 5000
      });
  }
}

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from "@angular/material";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
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
    this.signupForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      role: ["", Validators.required],
      agreed: ["", Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isSigningUp = true;

      this.authService
        .signupWithEmail(
          this.signupForm.get("email").value,
          this.signupForm.get("password").value
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
            this.afs
              .collection("users")
              .doc(this.authService.userID)
              .set(this.signupForm.value)
              .then(() => {
                this.router.navigateByUrl("/dashboard");
              });
          }
          this.isSigningUp = false;
        });
    } else
      this.snackbar.open("Please, fill the form correctly", "", {
        duration: 5000
      });
  }

  requestPasswordChange() {
    let email = this.signupForm.get("email").value;
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

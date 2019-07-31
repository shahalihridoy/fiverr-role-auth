import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-seller",
  templateUrl: "./seller.component.html",
  styleUrls: ["./seller.component.scss"]
})
export class SellerComponent implements OnInit {
  form: FormGroup;
  sellerInfo = null;
  sub: Subscription = null;
  uid = null;
  userData = null;
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      age: ["", Validators.required],
      address: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.sub = this.auth.authState.subscribe(user => {
      this.uid = user.uid;
      // pull seller data from firebase
      this.afs
        .collection("sellers")
        .doc(this.uid)
        .get()
        .subscribe(data => {
          if (data.exists) {
            let { name, age, address } = data.data();
            this.form = this.fb.group({
              name: [name, Validators.required],
              age: [age, Validators.required],
              address: [address, Validators.required]
            });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.sub ? this.sub.unsubscribe() : null;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.afs
      .collection("sellers")
      .doc(this.uid)
      .set(this.form.value)
      .then(() => {
        this.router.navigateByUrl("/dashboard");
      });
  }
}

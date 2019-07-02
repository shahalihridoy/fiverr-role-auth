import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-buyer",
  templateUrl: "./buyer.component.html",
  styleUrls: ["./buyer.component.scss"]
})
export class BuyerComponent implements OnInit {
  form: FormGroup;
  sellerInfo = null;
  sub: Subscription = null;
  uid = null;
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.form = fb.group({
      name: ["", Validators.required],
      age: ["", Validators.required],
      address: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.sub = this.auth.authState.subscribe(user => {
      this.uid = user.uid;
    });
  }

  ngOnDestroy(): void {
    this.sub ? this.sub.unsubscribe() : null;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.afs
      .collection("buyers")
      .doc(this.uid)
      .set(this.form.value)
      .then(() => {
        this.router.navigateByUrl("/dashboard");
      });
  }
}

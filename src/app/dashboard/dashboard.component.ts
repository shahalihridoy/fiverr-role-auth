import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  userInfo = null;
  sellerInfo = null;
  buyerInfo = null;
  sub: Subscription = null;
  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.auth.authState.subscribe(user => {
      if (user) {
        this.userInfo = this.afs
          .collection("users")
          .doc(user.uid)
          .get();
        this.sellerInfo = this.afs
          .collection("sellers")
          .doc(user.uid)
          .get();
        this.buyerInfo = this.afs
          .collection("buyers")
          .doc(user.uid)
          .get();
      } else {
        this.router.navigateByUrl("/login");
      }
    });
  }

  ngOnDestroy(): void {
    this.sub ? this.sub.unsubscribe() : null;
  }

  logout() {
    this.authService.logout();
  }
}

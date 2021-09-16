import { Component, OnInit } from "@angular/core";
import { Column } from "../column.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor() {}
  public columns: Column[] = [];

  ngOnInit(): void {
    this.columns = [
      {
        name: "Name",
        isChecked: true,
        isDisabled: true,
        sortOrder: 1,
      },
      {
        name: "Division",
        isChecked: true,
        isDisabled: false,
        sortOrder: 2,
      },
      {
        name: "Specialties",
        isChecked: true,
        isDisabled: false,
        sortOrder: 3,
      },
      {
        name: "Status",
        isChecked: true,
        isDisabled: false,
        sortOrder: 4,
      },
    ];
  }

  public outputColumnFilter(event: any): void {}
}

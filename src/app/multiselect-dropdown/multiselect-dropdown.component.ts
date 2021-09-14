import { Component, Input, OnInit } from '@angular/core';
import { Align } from '@progress/kendo-angular-popup';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
})
export class MultiselectDropdownComponent implements OnInit {
  @Input('dropdown-items') dropdownItems: Array<any> = [];
  @Input('dropdown-label') dropdownLabel: string = '';

  public checkedKeys: string[] = [];
  public selectedItems: Array<any> = [];
  public showDropdown: Boolean = false;

  public anchorAlign: Align = { horizontal: 'center', vertical: 'center' };
  public popupAlign: Align = { horizontal: 'center', vertical: 'center' };

  constructor() {}

  ngOnInit(): void {
    this.selectedItems = this.dropdownItems;
  }

  public isOpen(event: any): void {
    event.preventDefault();
    this.showDropdown = true;
  }
}

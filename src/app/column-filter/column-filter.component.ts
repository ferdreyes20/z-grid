import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from "@angular/core";
import { RowClassArgs } from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";
import { fromEvent, Subscription } from "rxjs";
import { tap, take } from "rxjs/operators";
import { Column, IColumn, IOutputColumnFilter } from "../column.model";

const tableRow = (node) => node.tagName.toLowerCase() === "tr";
const closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }

  return node;
};

@Component({
  selector: "column-filter",
  templateUrl: "./column-filter.component.html",
  styleUrls: ["./column-filter.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnFilterComponent implements OnInit, AfterViewInit {
  @Input("columns") columns: Column[] = [];
  @Output() action: EventEmitter<IOutputColumnFilter> =
    new EventEmitter<IOutputColumnFilter>();
  @Output() checkboxChanged: EventEmitter<IColumn> =
    new EventEmitter<IColumn>();
  @Output() sortChanged: EventEmitter<IOutputColumnFilter> =
    new EventEmitter<IOutputColumnFilter>();

  public state: State = {
    skip: 0,
    take: 10,
  };
  public gridData: any = process(this.columns, this.state);
  private currentSubscription: Subscription;

  constructor(private renderer: Renderer2, private zone: NgZone) {}

  public ngAfterViewInit(): void {
    this.currentSubscription = this.handleDragAndDrop();
  }

  public ngOnDestroy(): void {
    this.currentSubscription.unsubscribe();
  }

  public dataStateChange(state: State): void {
    this.state = state;
    this.gridData = process(this.columns, this.state);
    this.currentSubscription.unsubscribe();
    this.zone.onStable
      .pipe(take(1))
      .subscribe(() => (this.currentSubscription = this.handleDragAndDrop()));
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging,
    };
  }

  ngOnInit(): void {
    this.gridData = process(this.columns, this.state);
  }

  private handleDragAndDrop(): Subscription {
    const sub = new Subscription(() => {});
    let draggedItemIndex;

    const tableRows = Array.from(document.querySelectorAll(".k-grid tr"));
    tableRows.forEach((item) => {
      this.renderer.setAttribute(item, "draggable", "true");
      const dragStart = fromEvent<DragEvent>(item, "dragstart");
      const dragOver = fromEvent(item, "dragover");
      const dragEnd = fromEvent(item, "dragend");

      sub.add(
        dragStart
          .pipe(
            tap(({ dataTransfer }) => {
              try {
                const dragImgEl = document.createElement("span");
                dragImgEl.setAttribute(
                  "style",
                  "position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;"
                );
                document.body.appendChild(dragImgEl);
                dataTransfer.setDragImage(dragImgEl, 0, 0);
              } catch (err) {
                // IE doesn't support setDragImage
              }
              try {
                // Firefox won't drag without setting data
                dataTransfer.setData("application/json", "");
              } catch (err) {
                // IE doesn't support MIME types in setData
              }
            })
          )
          .subscribe(({ target }) => {
            const row: HTMLTableRowElement = <HTMLTableRowElement>target;
            draggedItemIndex = row.rowIndex;
            const dataItem = this.gridData.data[draggedItemIndex];
            dataItem.dragging = true;
          })
      );

      sub.add(
        dragOver.subscribe((e: any) => {
          e.preventDefault();
          const dataItem = this.gridData.data.splice(draggedItemIndex, 1)[0];
          const dropIndex = closest(e.target, tableRow).rowIndex;
          const dropItem = this.gridData.data[dropIndex];

          draggedItemIndex = dropIndex;
          this.zone.run(() =>
            this.gridData.data.splice(dropIndex, 0, dataItem)
          );
        })
      );

      sub.add(
        dragEnd.subscribe((e: any) => {
          e.preventDefault();
          const dataItem = this.gridData.data[draggedItemIndex];
          dataItem.dragging = false;
          this.sortChanged.emit(this.gridData);
        })
      );
    });

    return sub;
  }

  public changeInCheckbox(dataItem: any): void {
    dataItem.isChecked = !dataItem.isChecked;
    this.checkboxChanged.emit(dataItem);
  }

  public update(): void {
    this.action.emit({
      actionName: "update",
      columns: this.gridData,
    } as IOutputColumnFilter);
  }
}

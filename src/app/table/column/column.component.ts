import { Component, Input, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-column',
  template: ''
})
export class ColumnComponent implements OnInit {
  @Input() header: string;
  @Input() name: string;
  @Input() orderable: boolean;
  @Input() render: <T>(data: any, obj?: T) => void;

  ngOnInit() {
    if (!this.render)
      this.render = this.defaultRender;
  }

  private defaultRender<T>(data: any, obj?: T): void {
    return data;
  }
}

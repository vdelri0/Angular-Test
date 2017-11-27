import { IQueryParams, IQueryResult } from './../http.service';
import { Observable } from 'rxjs/Observable';
import { ColumnComponent } from './column/column.component';
import {
  Component, Input, ViewChild, ContentChildren, QueryList, EventEmitter,
  Output, ElementRef, OnInit, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  constructor() {
  }

  @ContentChildren(ColumnComponent) columns: QueryList<ColumnComponent>;
  @Output() onExecuteRequest: EventEmitter<IQueryParams> = new EventEmitter();
  @Output() selectedItemChange: EventEmitter<any> = new EventEmitter();
  @Output() settingsChange: EventEmitter<any> = new EventEmitter();

  @Input() get settings() {
    return this._settings;
  }
  set settings(value) {
    this._settings = value;
    this.settingsChange.emit(this._settings);
  }
  @Input() get data() {
    return this._data;
  }
  set data(value) {
    this.loading = false;
    this._data = value;
    if (this._data)
      this.page_buttons = this._buildPagesButtons(this.current_page, this.settings.size, this._data.total);
  }

  get items() {
    return this.data ? (this.data.items || []) : [];
  }

  @Input() get selectedItem() {
    return this._selectedItem;
  }
  set selectedItem(value) {
    this._selectedItem = value;
    this.selectedItemChange.emit(this._selectedItem);
  };
  page_buttons: number[] = [];
  get last_page() {
    if (this.data)
      return Math.ceil((this.data.total || 1) / this.settings.size);

    return 1;
  }
  current_page: number = 1;
  filter_text: string = '';
  searching: boolean = false;
  loading: boolean = true;

  private _data: IQueryResult<any> = { total: 0, items: [] };
  private _settings: IQueryParams = {
    startdate: this.getCurrentDate(),
    enddate: this.getCurrentDate(),
    size: 20
  };
  private _selectedItem: any;

  getCurrentDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = 0 + dd;
    }

    if (mm < 10) {
      mm = 0 + mm;
    }

    const todayString = mm + '/' + dd + '/' + yyyy;
    return todayString;
  }

  doRequest() {
    this.onExecuteRequest.emit(this.settings);
    this.loading = true;
    console.log('Request', JSON.stringify(this.settings));
    this.setSize(20);
  }

  ngOnInit() {
    this.doRequest();
  }

  ngAfterViewInit() {
    let all = this.columns.filter(i => i.orderable);
    if (all && all.length)
      this.settings.orderBy = all[0].name;
    this.setSize(20);
  }

  toggleSelection(item: any) {
    this.selectedItem = this.selectedItem == item ? null : item;
  }

  onReorder(h: ColumnComponent) {
    if (h.name != this.settings.orderBy) {
      this.settings.orderBy = h.name;
      this.settings.orderType = 'ASC';
    } else {
      this.settings.orderType = (this.settings.orderType == 'ASC' ? 'DESC' : 'ASC');
    }
    this.doRequest();
  }

  onSearch(text: string) {
    if (this.settings.search != text) {
      this.settings.search = text;
      this.setPage(1, true);
    }
  }

  onEnableSearch(inputSearch: any) {
    this.searching = true;
    setTimeout(() => inputSearch.focus(), 100);
  }

  onClearSearch() {
    this.filter_text = '';
    this.onSearch(this.filter_text);
    this.searching = false;
  }
  onGoTo() {
    this.setPage(+this._promptWhile('Ir a la página', this.current_page.toString(), true));
  }
  private _promptWhile(message: string, defaultVal: string, onlyNumber?: boolean) {
    let msg: string = null;
    do {
      msg = prompt(message, defaultVal);

      if (msg == null) {
        return onlyNumber ? (defaultVal || 1) : null;
      }
    } while (msg.trim() === '' || (onlyNumber ? isNaN(+msg) : false));

    return msg;
  }

  setPage(page: number, force?: boolean) {

    if (force || this.current_page != page) {
      let start = (page - 1) * this.settings.size;
      this.settings.start = start;
      this.current_page = page;
      this.doRequest();
    }
  }
  setSize(size: number) {
    if (this.settings.size != size) {
      this.settings.size = size;
      this.setPage(1, true);
    }
  }

  getColumnHeaderClasses(col: ColumnComponent) {
    let r: any = {};
    r[this.settings.orderType] = this.settings.orderBy == col.name;
    r.orderable = col.orderable;
    return r;
  }

  private _buildPagesButtons(page: number, size: number, total_items: number) {

    /*
    var page = 1, total_items = 101, size = 20;
    /**/
    let pages = Math.ceil(total_items / size);
    let result: number[] = [];

    if (pages > 10) {
      result.push(1);

      if (page <= 5) {
        for (let i = 2; i <= 7; i++) result.push(i);
        result.push(0);
      } else if (page > pages - 5) {
        result.push(0);
        for (let i = pages - 6; i < pages; i++) result.push(i);
      } else {
        result.push(0);
        for (let i = page - 2; i <= page + 2; i++) result.push(i);
        result.push(0);
      }
      result.push(pages);
    } else {
      for (let i = 0; i < pages; i++) {
        result.push(i + 1);
      }
    }

    return result;
  }

  private _buildQueryParams(paramsObj: IQueryParams): string {
    let parts: string[] = [];
    for (let key in paramsObj) {
      if (paramsObj.hasOwnProperty(key)) {
        let value = paramsObj[key];
        if (value) {
          let part = `${key}=${encodeURIComponent(value)}`;
          parts.push(part);
        }
      }
    }

    let result = parts.join('&');
    return result;
  }

}

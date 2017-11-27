import { LogService } from './table/shared/log.service';
import { Component } from '@angular/core';
import { IQueryParams, IQueryResult } from './http.service';
import { HttpService } from './http.service';
import { ILog } from './table/shared/log.model';

import * as moment from 'moment';
import { IData } from './table/shared/data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  logs: IQueryResult<ILog>;
  selectedItem: ILog;
  show: boolean = false;
  averageResponse: number;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabelsMachine: string[] = [];
  public barChartLabelsStatus: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartDataMachine: IData = { data: [], label: 'Request per machine' };
  public barChartDataStatus: IData = { data: [], label: 'Request per compliance status' };
  public barChartArrayMachine: IData[] = [];
  public barchartArrayStatus: IData[] = [];
  constructor(private _logService: LogService) {
  }

  getLogs(settings: IQueryParams) {
    this._logService.get(settings).subscribe(
      (data: IQueryResult<ILog>) => {
        this.logs = data;
        this.clean();
        for (let index = 0; index < this.countRequestPerMachine(data).length; index++) {
          let element = this.countRequestPerMachine(data)[index];
          console.log('Machine: ' + element.value + ' ' + element.name);
          this.barChartDataMachine.data.push(element.value);
          this.barChartLabelsMachine.push(element.name);
        }
        for (let index = 0; index < this.countRequestPerStatus(data).length; index++) {
          let element = this.countRequestPerStatus(data)[index];
          console.log('Status: ' + element.value + ' ' + element.name);
          this.barChartDataStatus.data.push(element.value);
          this.barChartLabelsStatus.push(element.name);
        }
        this.barChartArrayMachine.push(this.barChartDataMachine);
        this.barchartArrayStatus.push(this.barChartDataStatus);
        this.show = true;
      },
      error => {
        console.log(error);
      }
    );
  }

  clean() {
    this.barChartDataMachine.data = [];
    this.barChartLabelsMachine = [];
    this.barChartDataStatus.data = [];
    this.barChartLabelsStatus = [];
    this.barChartArrayMachine = [];
    this.barchartArrayStatus = [];
  }

  countRequestPerMachine(data?: IQueryResult<ILog>) {
    let temporalData = data.items;
    let storage: any[] = [];
    let flag: boolean;
    temporalData.forEach(element => {
      if (storage.length == 0) {
        storage.push({ value: 1, name: element.cd_machine });
      } else {
        flag = false;
        for (let index = 0; index < storage.length; index++) {
          if (element.cd_machine == storage[index].name) {
            storage[index].value++;
            flag = true;
          }
        }
        if (!flag) {
          storage.push({ value: 1, name: element.cd_machine });
        }
      }
    });
    return storage;
  }

  countRequestPerStatus(data?: IQueryResult<ILog>) {
    let temporalData = data.items;
    let storage: any[] = [];
    let flag: boolean;
    temporalData.forEach(element => {
      if (storage.length == 0) {
        storage.push({ value: 1, name: element.ds_compl_status_returned });
      } else {
        flag = false;
        for (let index = 0; index < storage.length; index++) {
          if (element.ds_compl_status_returned == storage[index].name) {
            storage[index].value++;
            flag = true;
          }
        }
        if (!flag) {
          storage.push({ value: 1, name: element.ds_compl_status_returned });
        }
      }
    });
    return storage;
  }

  renderDate(value: Date) {
    if (!value) return null;
    return moment(value).locale('es').format('DD/MM/YYYY');
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public randomizeStatus(): void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartDataStatus));
    clone[0].data = data;
    this.barChartDataStatus = clone;
  }

  public randomizeMachine(): void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartDataMachine));
    clone[0].data = data;
    this.barChartDataMachine = clone;
  }
}

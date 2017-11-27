import { ILog } from './log.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpService, IQueryParams, IQueryResult } from './../../http.service';

@Injectable()
export class LogService extends HttpService<any> {

  get endpoint(): string { return ''; }

  constructor(http: Http) { super(http); }

  get(queryParamas?: IQueryParams): Observable<IQueryResult<ILog> | ILog[]> {
    const promise = super.get(queryParamas);
    return promise.map((result: ILog[]) => {
      console.log(this.formatToQueryResult(result));
      return this.formatToQueryResult(result);
    });
  }

  formatToQueryResult(result?: ILog[]) {
    const _data: IQueryResult<ILog> = { total: result.length, items: result };
    return _data;
  }
}

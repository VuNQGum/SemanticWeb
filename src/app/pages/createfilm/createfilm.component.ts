import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FILM } from 'src/app/model/film';
import { CommonApiService } from 'src/app/service/commonHttp';
import { Util } from 'src/app/service/util';
import { Subject, takeUntil } from 'rxjs';
import { FUSEKI } from 'src/app/constant/api';

@Component({
  selector: 'app-createfilm',
  templateUrl: './createfilm.component.html',
  styleUrls: ['./createfilm.component.css']
})
export class CreatefilmComponent implements OnInit {
  @Output('create_back') back = new EventEmitter<boolean>();
  prefix = 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
    'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
    'PREFIX : <http://example/> '
  model: FILM = {};
  listTheLoai: any[] = [];
  listNgonNgu: any[] = [];
  listDaoDien: any[] = [];
  listDienVien: any[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private http: CommonApiService,
    private util: Util,
    public datepipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.http.onGetQuery('PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>' +
      'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
      'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
      'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
      'PREFIX : <http://example/>' +
      'SELECT ?a WHERE {' +
      '?a a :Director' +
      '}', FUSEKI.query).subscribe((res) => {
        // this.listDaoDien = res.data;
        res.data.forEach((element: any) => {
          this.listDaoDien.push({ name: this.util.preprocessLink(element.a.value), value: element.a.value })
        });

      })
    this.http.onGetQuery(this.prefix +
      'SELECT ?a WHERE {' +
      '?a a :Actor' +
      '}', FUSEKI.query).subscribe((res) => {
        // this.listDaoDien = res.data;
        res.data.forEach((element: any) => {
          this.listDienVien.push({ name: this.util.preprocessLink(element.a.value), value: element.a.value })
        });
      })
    this.http.onGetQuery(this.prefix +
      'SELECT ?a WHERE {' +
      '?a a :Language' +
      '}', FUSEKI.query).subscribe((res) => {
        // this.listDaoDien = res.data;
        res.data.forEach((element: any) => {
          this.listNgonNgu.push({ name: this.util.preprocessLink(element.a.value), value: element.a.value })
        });
      })
    this.http.onGetQuery(this.prefix +
      'SELECT ?a WHERE {' +
      '?a a :Genre' +
      '}', FUSEKI.query).subscribe((res) => {
        // this.listDaoDien = res.data;
        res.data.forEach((element: any) => {
          this.listTheLoai.push({ name: this.util.preprocessLink(element.a.value), value: element.a.value })
        });
      })
  }

  save() {
    let data = "";
    if (this.model.title) {
      data = data.concat(':', this.model.title?.replaceAll(' ', '_'), ' ', 'a :Movie;');
      // data = data.concat('\n')
      data = data.concat(' :hasTitle ', '"' + this.model.title + '"', ' ;')
      // data = data.concat('\n')
    }
    if (this.model.genre && this.model.genre?.length > 0) {
      data = data.concat(' :hasGenre ')
      this.model.genre.forEach((item) => {
        data = data.concat('<', item, '>', ' ,')
      })
      data = data.slice(0, -1);
      data = data.concat(' ;')
      // data = data.concat('\n')
    }
    if (this.model.language && this.model.language?.length > 0) {
      data = data.concat(' :hasLanguage ')
      this.model.language.forEach((item) => {
        data = data.concat('<', item, '>', ' ,')
      })
      data = data.slice(0, -1);
      data = data.concat(' ;')
      // data = data.concat('\n')
    }
    if (this.model.actor && this.model.actor?.length > 0) {
      data = data.concat(' :hasActor ')
      this.model.actor.forEach((item) => {
        data = data.concat('<', item, '>', ' ,')
      })
      data = data.slice(0, -1);
      data = data.concat(' ; ')
      // data = data.concat('\n')
    }
    if (this.model.director && this.model.director?.length > 0) {
      data = data.concat(' :hasDirector ')
      this.model.director.forEach((item) => {
        data = data.concat('<', item, '>', ' ,')
      })
      data = data.slice(0, -1);
      data = data.concat(' ;')
      // data = data.concat('\n')
    }
    if (this.model.imbd) {
      data = data.concat(' :hasImdbRating ', '' + this.model.imbd, ' ;')
      // data = data.concat('\n')
    }
    if (this.model.releaseDate) {
      data = data.concat(' :hasReleaseDate ', '"' + this.datepipe.transform(this.model.releaseDate, 'dd MMMM yyyy') + '"', ' ;')
      // data = data.concat('\n')
    }
    if (this.model.plot) {
      data = data.concat(' :hasPlot ', '"' + this.model.plot + '"', ' ;')
      // data = data.concat('\n')
    }
    data = data.slice(0, -2);
    let query = this.prefix + "INSERT DATA {" + data + ".}";
    console.log(query);

    this.http.onPostQuery(query, FUSEKI.update).pipe(takeUntil(this._unsubscribeAll)).subscribe(res =>{
      if (res.state) {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
      } else {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content'});
      }

    }
    );
  }

  onBackToList() {
    this.back.emit(true);
  }
}

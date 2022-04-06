import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Article } from './article';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  url = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.url + '/articles');
  }

  getArticleById(articleId: string): Observable<Article> {
    return this.http.get<Article>(this.url + '/articles/' + articleId);
  }
  createArticle(article: Article): Observable<Article> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Article>(this.url + '/articles/', article, httpOptions);
  }

  updateArticle(article: Article): Observable<Article> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Article>(this.url + '/articles/'+article.id, article, httpOptions);
  }

  deleteArticleById(articleid: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/articles/'+articleid, httpOptions);
  }

}

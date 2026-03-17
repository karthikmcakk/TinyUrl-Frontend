import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShortUrl {
  id: number;
  originalUrl: string;
  shortCode: string;
  isPrivate: boolean;
  clicks: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private apiUrl = `${environment.apiUrl}/urls`;

  constructor(private http: HttpClient) {}

  shortenUrl(originalUrl: string, isPrivate: boolean): Observable<ShortUrl & { message?: string }> {
    return this.http.post<ShortUrl & { message?: string }>(this.apiUrl, { originalUrl, isPrivate });
  }

  getAllUrls(): Observable<ShortUrl[]> {
    return this.http.get<ShortUrl[]>(this.apiUrl);
  }

  getUrl(code: string): Observable<ShortUrl> {
    return this.http.get<ShortUrl>(`${this.apiUrl}/${code}`);
  }

  deleteUrl(code: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${code}`);
  }
}
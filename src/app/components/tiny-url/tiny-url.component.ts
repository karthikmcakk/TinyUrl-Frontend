import { Component, OnInit } from '@angular/core';
import { UrlService, ShortUrl } from '../../services/url.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tiny-url',
  templateUrl: './tiny-url.component.html',
  styleUrls: ['./tiny-url.component.css']
})
export class TinyUrlComponent implements OnInit {
  backendOrigin = environment.backendOrigin;

  originalUrl: string = '';
  isPrivate: boolean = false;
  searchTerm: string = '';
  loading: boolean = false;
  message: string = '';
  shortUrl: string = '';
  urls: ShortUrl[] = [];

  constructor(private urlService: UrlService) {}

  ngOnInit(): void {
    this.loadUrls();
  }

  submitUrl(): void {
    if (!this.originalUrl) return;

    this.loading = true;
    this.shortUrl = '';
    this.message = '';

    this.urlService.shortenUrl(this.originalUrl, this.isPrivate).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.message) this.message = res.message;
        if (res.shortCode) this.shortUrl = `${this.backendOrigin}/${res.shortCode}`;
        this.loadUrls();
      },
      error: () => {
        this.loading = false;
        this.message = 'Something went wrong';
      }
    });
  }

  loadUrls(): void {
    this.urlService.getAllUrls().subscribe({
      next: (data) => this.urls = data,
      error: () => this.message = 'Failed to load URLs'
    });
  }

  copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.message = 'Copied to clipboard!';
    });
  }

  deleteUrl(shortCode: string): void {
    this.urlService.deleteUrl(shortCode).subscribe({
      next: () => {
        this.message = 'URL deleted';
        this.loadUrls();
      },
      error: () => this.message = 'Failed to delete URL'
    });
  }

  // Filtered arrays
  get publicUrls(): ShortUrl[] {
    return this.urls
      .filter(u => !u.isPrivate)  // only public
      .filter(u =>
        u.originalUrl?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.shortCode?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

  get privateUrls(): ShortUrl[] {
    return this.urls
      .filter(u => u.isPrivate) // only private
      .filter(u =>
        u.originalUrl?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.shortCode?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }
}
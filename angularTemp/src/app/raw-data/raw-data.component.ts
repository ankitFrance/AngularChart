import { Component, OnInit } from '@angular/core';
import { TabledataService } from '../tabledata.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
@Component({
  selector: 'app-raw-data',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './raw-data.component.html',
  styleUrl: './raw-data.component.css',
  
})
export class RawDataComponent {
  data: any;
  constructor(private dataService: TabledataService) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe(response => {
      this.data = response;
    });
  }
}

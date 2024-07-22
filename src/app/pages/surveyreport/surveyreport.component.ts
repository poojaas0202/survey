import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';

interface ChartData {
  option: string;
  count: number;
}

@Component({
  selector: 'app-surveyreport',
  standalone: true,
  imports: [],
  templateUrl: './surveyreport.component.html',
  styleUrls: ['./surveyreport.component.css']
})
export class SurveyreportComponent implements OnInit, AfterViewInit {
  private data: ChartData[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const surveyId = params['id'];
      if (surveyId) {
        this.fetchSurveys(surveyId);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.data.length > 0) {
      this.createBarChart();
    }
  }

  fetchSurveys(surveyId: string): void {
    fetch(`http://localhost:8081/responses/${surveyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
     
      this.data = this.processResponses(data);
       console.log(data)
      this.ngAfterViewInit(); // Ensure chart is created after data is fetched
    })
    .catch(error => {
      console.error('Error making GET request:', error);
    });
  }

  processResponses(data: any): ChartData[] {
    const responses = data.responses[0].responses;
    const singleOptionResponses = responses.filter((response: any) => response.type === 'SINGLEOPTION');

    const responseCounts: { [key: string]: number } = {};
    singleOptionResponses.forEach((response: any) => {
      const value = response.response;
      responseCounts[value] = (responseCounts[value] || 0) + 1;
    });

    return Object.entries(responseCounts).map(([key, value]) => ({ option: key, count: value }));
  }

  createBarChart(): void {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(this.data.map(d => d.option))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.count) || 0])
      .nice()
      .range([height, 0]);

    svg.append('g')
      .selectAll('.bar')
      .data(this.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.option) || 0)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count));

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));
  }
}

import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, AfterViewInit {
  @ViewChild('singleOptionChart', { static: false }) private singleOptionChartContainer: ElementRef | undefined;
  @ViewChild('multiOptionChart', { static: false }) private multiOptionChartContainer: ElementRef | undefined;
  @ViewChild('ratingChart', { static: false }) private ratingChartContainer: ElementRef | undefined;
  @ViewChild('wordCloud', { static: false }) private wordCloudContainer: ElementRef | undefined;

  singleOptionResponses: string[] = [];
  multiOptionResponses: string[] = [];
  ratingResponses: number[] = [];
  openEndedResponses: string[] = [];
  wordData: { text: string, size: number }[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    this.fetchSurveys();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.singleOptionChartContainer) {
        this.createBarChart(this.singleOptionChartContainer, this.singleOptionResponses, 'Single Option Responses');
      }
      if (this.multiOptionChartContainer) {
        this.createBarChart(this.multiOptionChartContainer, this.multiOptionResponses, 'Multi Option Responses');
      }
      if (this.ratingChartContainer) {
        this.createBarChart(this.ratingChartContainer, this.ratingResponses, 'Rating Responses');
      }
      if (this.wordCloudContainer) {
        this.createWordCloud();
      }
    } else {
      console.error('Chart container is not available or not running in the browser.');
    }
  }

  extractResponses(data: any[]): void {
    data.forEach(survey => {
      survey.responses.forEach((responseObj: { responses: any[]; }) => {
        responseObj.responses.forEach(response => {
          if (response.response) {
            if (response.type === 'SINGLEOPTION') {
              this.singleOptionResponses.push(response.response);
            } else if (response.type === 'MULTIOPTION' && Array.isArray(response.response)) {
              this.multiOptionResponses.push(...response.response);
            } else if (response.type === 'RATING') {
              this.ratingResponses.push(Number(response.response));
            } else if (response.type === 'OPENENDED') {
              this.openEndedResponses.push(response.response);
            }
          }
        });
      });
    });

    // Process word data for the word cloud
    this.processWordData();
  }

  fetchSurveys(): void {
    fetch("http://localhost:8081/responses", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message || 'Something went wrong');
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      this.extractResponses(data);

      console.log('Single Option Responses:', this.singleOptionResponses);
      console.log('Multi Option Responses:', this.multiOptionResponses);
      console.log('Rating Responses:', this.ratingResponses);
      console.log('Open Ended Responses:', this.openEndedResponses);

      if (isPlatformBrowser(this.platformId)) {
        if (this.singleOptionChartContainer) {
          this.createBarChart(this.singleOptionChartContainer, this.singleOptionResponses, 'Single Option Responses');
        }
        if (this.multiOptionChartContainer) {
          this.createBarChart(this.multiOptionChartContainer, this.multiOptionResponses, 'Multi Option Responses');
        }
        if (this.ratingChartContainer) {
          this.createBarChart(this.ratingChartContainer, this.ratingResponses, 'Rating Responses');
        }
        if (this.wordCloudContainer) {
          this.createWordCloud();
        }
      }
    })
    .catch(error => {
      console.error('Error making GET request:', error);
    });
  }

  createBarChart(container: ElementRef, responses: (string | number)[], chartTitle: string): void {
    if (!container) return;

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const responseCounts = responses.reduce((counts, response) => {
      counts[response] = (counts[response] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });

    const data = Object.keys(responseCounts).map(response => ({
      response,
      count: responseCounts[response]
    }));

    d3.select(container.nativeElement).selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.response))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(container.nativeElement).append('svg')
      .attr('width', width)
      .attr('height', height);

    svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.response)!)
      .attr('y', d => y(d.count))
      .attr('height', d => y(0) - y(d.count))
      .attr('width', x.bandwidth());

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .text(chartTitle);

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Count');
  }

  processWordData(): void {
    const wordCounts: { [key: string]: number } = {};
  
    // Process each open-ended response
    this.openEndedResponses.forEach((response: string) => {
      // Convert to lowercase, remove punctuation, and split into words
      const words = response
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/); // Split by whitespace
  
      // Count the frequency of each word
      words.forEach(word => {
        if (word) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    });
  
    // Prepare the word data for the word cloud
    this.wordData = Object.keys(wordCounts)
      .filter(word => word.trim().length > 0) // Ensure no empty words
      .map(word => ({
        text: word,
        size: Math.max(10, wordCounts[word] * 5) // Scale size with a minimum value
      }));
  
    // Optional: log the word data to inspect
    console.log('Processed Word Data:', this.wordData);
  }
  
  createWordCloud(): void {
    if (!this.wordCloudContainer) return;

    const width = 600;
    const height = 400;

    const layout = cloud()
      .size([width, height])
      .words(this.wordData)
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 90 : 0))
      .fontSize(20)
      .on('end', this.drawWordCloud.bind(this));

    layout.start();
  }

  drawWordCloud(words: any[]): void {
    if (!this.wordCloudContainer) return;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
    d3.select(this.wordCloudContainer.nativeElement).selectAll('*').remove();
  
    d3.select(this.wordCloudContainer.nativeElement)
      .append('svg')
      .attr('width', 600)
      .attr('height', 400)
      .append('g')
      .attr('transform', 'translate(300,200)')
      .selectAll('text')
      .data(words)
      .enter().append('text')
      .style('font-size', d => `${d.size}px`)
      .style('fill', (d, i) => colorScale(i.toString()))
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
  
}

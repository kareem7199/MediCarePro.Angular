import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  HostListener,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Howl } from 'howler';
import { Subscription } from 'rxjs';
import { PhysicianScreenService } from 'src/app/core/services/physician-screen.service';
import { DetailedVisit } from 'src/app/shared/models/DetailedVisit.model';
import { VisitHubService } from 'src/app/core/services/visit-hub.service';
import * as moment from 'moment';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css'],
})
export class VisitsComponent implements OnInit, OnDestroy {
  private polygons: {
    vertices: [number, number][];
    boneName: string;
  }[] = [];
  date!: Date;
  selectedVisit: DetailedVisit | null = null;
  visits: DetailedVisit[] = [];
  loading = false;
  private subscription!: Subscription;
  sound = new Howl({
    src: ['assets/sounds/notification.mp3'],
    volume: 1.0, // Adjust volume as needed (0.0 to 1.0)
    onloaderror: (error) => {
      console.error('Failed to load sound:', error);
    },
  });

  constructor(
    private _physicianScreenService: PhysicianScreenService,
    private _toastr: ToastrService,
    private _visitHubService: VisitHubService,
    private cdRef: ChangeDetectorRef
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.handleResize();
  }

  ngOnInit(): void {
    this._visitHubService.startConnection();

    this.subscription = this._visitHubService.visitAdded.subscribe({
      next: (response) => {
        const date1 = moment(this.date);
        const date2 = moment(response.date);
        if (date1.isSame(date2)) {
          this.visits.push(response.visit);
          this.visits.sort(this.sortByDate);
          this._toastr.success('New visit added!', 'Notification');
          this.sound.play();
        }
      },
    });
  }

  handleResize() {
    const image = document.getElementById('myImage') as HTMLImageElement;
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    if (image && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.polygons = [];
        // Set canvas size to match the image size
        const height = image.height;
        const width = image.width;
        canvas.width = width;
        canvas.height = height;

        this.generatePolygons(ctx, height, width);
      } else {
        console.error('Canvas context is not available');
      }
    } else {
      console.error('Image or Canvas element is not available');
    }
  }

  initializeCanvasAndImage(): void {
    const image = document.getElementById('myImage') as HTMLImageElement;
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    image.onload = () => {
      if (image && canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas size to match the image size
          const height = image.height;
          const width = image.width;
          canvas.width = width;
          canvas.height = height;

          this.generatePolygons(ctx, height, width);

          canvas.addEventListener('click', (event) => this.handleClick(event));
        } else {
          console.error('Canvas context is not available');
        }
      } else {
        console.error('Image or Canvas element is not available');
      }
    };
  }

  generatePolygons(
    ctx: CanvasRenderingContext2D,
    height: number,
    width: number
  ) {
    this.polygons = [];
    this.drawPolygon(
      ctx,
      [
        [width * 0.265, height * 0.3],
        [width * 0.265, height * 0.29],
        [width * 0.28, height * 0.24],
        [width * 0.3, height * 0.23],
        [width * 0.292222, height * 0.22],
        [width * 0.28, height * 0.215],
        [width * 0.25, height * 0.212],
        [width * 0.24, height * 0.22],
        [width * 0.25, height * 0.23],
        [width * 0.24, height * 0.3],
        [width * 0.22999, height * 0.32],
        [width * 0.2199999, height * 0.34],
        [width * 0.21, height * 0.35],
        [width * 0.26, height * 0.35],
      ],
      'Right Humerus'
    );
  }

  redrawCanvas() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear only the area where polygons are drawn
      // (or clear the whole canvas if necessary)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.generatePolygons(ctx, canvas.height, canvas.width);
    }
  }

  drawPolygon(
    ctx: CanvasRenderingContext2D,
    vertices: [number, number][],
    boneName: string
  ) {
    ctx.beginPath();
    ctx.moveTo(vertices[0][0], vertices[0][1]);

    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i][0], vertices[i][1]);
    }

    ctx.closePath();
    ctx.fillStyle = `${
      this.selectedVisit?.diagnoses.find((d) => d.boneName === boneName)
        ? 'rgba(255, 0, 0, 0.2)'
        : 'rgba(255, 255, 255, 0)'
    }`;
    ctx.fill();

    // Store polygon details
    this.polygons.push({ vertices, boneName });
  }

  isPointInPolygon(
    point: [number, number],
    vertices: [number, number][]
  ): boolean {
    let inside = false;
    const [px, py] = point;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const [viX, viY] = vertices[i];
      const [vjX, vjY] = vertices[j];

      const intersect =
        viY > py !== vjY > py &&
        px < ((vjX - viX) * (py - viY)) / (vjY - viY) + viX;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  handleClick(event: MouseEvent) {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the click is within any polygon
    for (const polygon of this.polygons) {
      if (this.isPointInPolygon([x, y], polygon.vertices)) {
        console.log(`${polygon.boneName} clicked`);
        this.redrawCanvas();
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelectDate(event: any) {
    this.date = event.target.value;
    this.fetchVisits();
  }

  fetchVisits() {
    this.loading = true;
    this._physicianScreenService.getDailyVisits(this.date).subscribe({
      next: (response) => {
        this.loading = false;
        this.visits = response;
      },
    });
  }

  selectVisit(visit: DetailedVisit) {
    this.selectedVisit = visit;
    this.cdRef.detectChanges(); // Ensure the view is updated
    this.initializeCanvasAndImage();
    this.redrawCanvas();
  }

  formatDate(date: Date) {
    return moment(date).format('HH:mm:ss');
  }

  save() {
    // this._physicianScreenService
    //   .updateVisitDiagnosis(
    //     this.selectedVisit!.id,
    //     this.selectedVisit!.diagnosis
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       this._toastr.success('Diagnosis updated successfully', 'Success');
    //     },
    //     error: (error) => {
    //       this._toastr.error(error, 'Error');
    //     },
    //   });
  }

  private sortByDate(a: DetailedVisit, b: DetailedVisit) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }

  print(id: number) {
    return `https://localhost:44302/ReportViewer?id=${id}`;
  }
}

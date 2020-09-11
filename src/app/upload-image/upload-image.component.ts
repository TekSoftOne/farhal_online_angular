import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscribable,
  Subscription,
  of,
  Subject,
  combineLatest,
} from 'rxjs';
import { map, switchMap, skip, tap } from 'rxjs/operators';

@Component({
  selector: 'ot-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('imageUpload', { static: true }) inputImage: ElementRef;

  public imageUrl: Observable<string | undefined>;
  public image: BehaviorSubject<File>;
  public imageFileSubscription: Subscription;
  public isInvalid: Observable<boolean>;
  @Input() formSubmitted = false;
  @Input() isRequired = false;
  @Output() data: EventEmitter<File>;

  private formSubmittedEvent: BehaviorSubject<boolean>;

  constructor() {
    this.image = new BehaviorSubject<File>(undefined);
    this.formSubmittedEvent = new BehaviorSubject<boolean>(false);
    this.data = new EventEmitter<File>();

    this.imageUrl = this.image.pipe(
      switchMap((file) => {
        if (!file) {
          return of(undefined);
        }
        return this.readUrl(file);
      })
    );

    this.isInvalid = combineLatest([
      this.formSubmittedEvent,
      this.imageUrl,
    ]).pipe(
      map(([summitStatus, url]) => {
        return summitStatus && this.isRequired && !url;
      })
    );

    const imageFile = this.image.pipe(
      skip(1),
      tap((f) => {
        this.data.emit(f);
      })
    );

    this.imageFileSubscription = imageFile.subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formSubmitted) {
      this.formSubmittedEvent.next(changes.formSubmitted.currentValue);
    }
  }
  ngOnDestroy(): void {
    if (this.imageFileSubscription) {
      this.imageFileSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {}

  public triggerImageUpload(): void {
    this.inputImage.nativeElement.click();
  }

  public onImageChange(files: FileList): void {
    const f = files[0];
    this.image.next(f);
  }

  // tslint:disable-next-line: typedef
  public readUrl(file: any): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.readAsDataURL(file);
    });
  }
}

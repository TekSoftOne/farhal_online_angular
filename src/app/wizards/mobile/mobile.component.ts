import { IFormWizard } from './../../interfaces';
import { MembershipRequest } from './../../constants';
import { NgForm } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isFormValid } from '../../form';

@Component({
  selector: 'ot-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
})
export class MobileComponent implements OnInit, IFormWizard {
  @Input() phoneNumber: string;
  @Output() nextStep = new EventEmitter<NgForm>();
  @Output() data = new EventEmitter<MembershipRequest>();
  constructor() {}
  checkControlInvalid(form: NgForm, control: any): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}

  public checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }

  public next(f: NgForm): void {
    this.data.emit({ phoneNumber: this.phoneNumber } as MembershipRequest);
    this.nextStep.emit(f);
  }
}

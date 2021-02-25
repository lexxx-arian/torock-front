import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { RegistrationService } from './registration.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormFieldModel } from '../model/form-field.model';
import { FieldType } from '../model/form-field.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalSuccessRegistrationComponent } from './modal.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  formInit = false;
  eventTitle: string;
  formFieldList: Array<FormFieldModel> = [];
  fieldType = FieldType;
  // emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  isFormInvalid = false;
  modalRef: BsModalRef;
  staticFormData = [
    {
      "display_name": "Фамилия",
      "field_name": "last_name",
      "field_type": "TEXT",
      "list_values": "",
      "is_required": "1",
      "field_note": ""
    }, {
      "display_name": "Имя",
      "field_name": "first_name",
      "field_type": "TEXT",
      "list_values": "",
      "is_required": "1",
      "field_note": ""
    }, {
      "display_name": "Отчество",
      "field_name": "middle_name",
      "field_type": "TEXT",
      "list_values": "",
      "is_required": "0",
      "field_note": ""
    }, {
      "display_name": "Пол",
      "field_name": "gender",
      "field_type": "RADIO",
      "list_values": "М;Ж",
      "is_required": "1",
      "field_note": ""
    }, {
      "display_name": "Дата рождения",
      "field_name": "bdate",
      "field_type": "DATE",
      "list_values": "",
      "is_required": "1",
      "field_note": ""
    }, {
      "display_name": "e-mail",
      "field_name": "email",
      "field_type": "TEXT",
      "list_values": "",
      "is_required": "1",
      "field_note": ""
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(switchMap(queryParamMap => this.registrationService.getRegistrationForm(queryParamMap['event'])))
      .subscribe((res: any) => {
        this.eventTitle = res.event_name;
        this.formFieldList = [...this.staticFormData, ...res.form_fields].map((field: any) => new FormFieldModel({
          fieldName: field.field_name as string,
          fieldType: field.field_type as FieldType,
          required: Boolean(Number(field.is_required)),
          label: field.display_name,
          valueList: field.list_values
        }));
        this.registrationForm = this.formBuilder.group({...this.formFieldList.reduce((acc: any, fieldModel: FormFieldModel) => ({...acc, ...fieldModel.getControl()}), {})});
        console.log(res);
      });
    this.formInit = true;
  }

  isRequiredError(controlName: string): boolean {
    return (this.registrationForm.get(controlName) as FormGroup).hasError('required');
  }

  openModal(template: any, params: any) {
    this.modalRef = this.modalService.show(template, params);
  }

  submit() {
    console.log(this.registrationForm);
    this.isFormInvalid = this.registrationForm.invalid;
    if (!this.registrationForm?.valid) {
      return;
    }
    const formData = new FormData();
    Object.entries(this.registrationForm?.value).forEach(item => formData.append(item[0], item[1] as string));
    this.registrationService.sendRegistrationData(formData).subscribe((res: string) => {
      console.log(res);
      const registrationNumber = (res.match(/(Ваш персональный код\:\s+)(\d+)/) || [])[2];
      this.openModal(ModalSuccessRegistrationComponent, {registrationNumber, title: `Регистрация на ${this.eventTitle}`});
    });
  }

}

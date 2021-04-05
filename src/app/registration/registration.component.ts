import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { RegistrationService } from './registration.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormFieldModel } from '../model/form-field.model';
import { FieldType } from '../model/form-field.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalSuccessRegistrationComponent } from './modal.component';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup | null | undefined;
  formInit = false;
  eventTitle: string;
  formFieldList: Array<FormFieldModel> = [];
  fieldType = FieldType;
  isFormInvalid = false;
  modalRef: BsModalRef;
  eventId: string;
  submitDisabled = false;
  errorFromServer: string = '';
  isLoaded = false;
  staticFormData = [
    {
      "display_name": "Маршрут гонки",
      "field_name": "id_route",
      "field_type": "LIST",
      "list_values": 'SERVER_LIST',
      "is_required": "1",
      // "field_note": "На один маршрут возможно зарегистрироваться только один раз"
    },
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
      "field_note": "Заполните при наличии"
    }, {
      "display_name": "Пол",
      "field_name": "gender",
      "field_type": "RADIO",
      "list_values": [{
        name: 'Муж',
        value: 'М'
      },
      {
        name: 'Жен',
        value: 'Ж'
      }],
      "is_required": "1",
      // "field_note": "Укажите если вы определяете себя к какому либо из вариантов"
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
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(switchMap(queryParamMap => {
      this.eventId = queryParamMap['event'];
      this.registrationForm = null;
      if (!Boolean(this.eventId)) {
        return of({
          event_name: 'Регистрация в системе',
          form_fields: [],
          routes: []
        });
      }
      return this.registrationService.getRegistrationForm(this.eventId);
    }))
      .subscribe((res: any) => {
        this.isLoaded = true;
        if (res.event_state > 2) {
          this.cdr.markForCheck();
          return;
        }
        this.eventTitle = res.event_name;
        const routes = res.routes.map((item: any) => ({name: item.route_name, value: item.id}));
        this.staticFormData[0].list_values = routes;
        this.formFieldList = [...this.staticFormData, ...res.form_fields].map((field: any) => new FormFieldModel({
          fieldName: field.field_name as string,
          fieldType: field.field_type as FieldType,
          required: Boolean(Number(field.is_required)),
          label: field.display_name,
          valueList: field.list_values,
          fieldNote: field.field_note
        }));
(        this.registrationForm as FormGroup) = this.formBuilder.group({...this.formFieldList.reduce((acc: any, fieldModel: FormFieldModel) => ({...acc, ...fieldModel.getControl()}), {}), agreement: []});
        if (routes.length === 1) {
          (this.registrationForm as FormGroup).get('id_route')?.setValue(routes[0].value);
        }
        console.log(res);
        this.cdr.markForCheck();
      });
    this.formInit = true;
    this.cdr.markForCheck();
  }

  isRequiredError(controlName: string): boolean {
    return ((this.registrationForm as FormGroup).get(controlName) as FormGroup).hasError('required');
  }

  openModal(template: any, params: any) {
    this.modalRef = this.modalService.show(template, {initialState: params, class: 'gray modal-lg'});
    this.modalRef.onHidden.subscribe(res => {
      (this.registrationForm as FormGroup).patchValue({
        last_name: null,
        first_name: null,
        middle_name: null,
        id_route: null,
        bdate: null,
        gender: null,
      });
      (this.registrationForm as FormGroup).markAsPristine();
      (this.registrationForm as FormGroup).markAsUntouched();
    });
  }

  submit() {
    this.submitDisabled = true;
    this.errorFromServer = '';
    console.log(this.registrationForm);
    this.isFormInvalid = (this.registrationForm as FormGroup).invalid;
    if (this.isFormInvalid) {
      this.submitDisabled = false;
      return;
    }
    const formData = new FormData();
    const formDataForDuplicate = new FormData();
    const uniqueFieldList = ['last_name', 'first_name', 'email'];
    const {agreement, ...params} = (this.registrationForm as FormGroup).value;
    Object.entries(params).forEach(item => {
      const elementForm = this.formFieldList.find(element => element.fieldName === item[0])
      const fieldValue = elementForm && elementForm.fieldType === FieldType.CHECKBOX ? (item[1] && 'on' || 'off') : (item[1] || '');
      formData.append(item[0], fieldValue as string);
      if (uniqueFieldList.includes(item[0])) {
        formDataForDuplicate.append(item[0], fieldValue as string)
      }
    });
    formData.append('id_event', this.eventId);
    // this.registrationService.getDuplicateUserId(formDataForDuplicate)
    of(null)
      .pipe(
        switchMap((res: any) => {
          // if (res.success) {
          //   this.errorFromServer = res.Msg;
          //   return throwError('error duplicate');
          // }
          return this.registrationService.checkMail(params.email);
        }),
        switchMap(res => {
          if (!res.success) {
            this.errorFromServer = res.Msg;
            return throwError('error. email does not exist');
          }
          return this.registrationService.sendRegistrationData(formData);
        }))
      .subscribe(
        {
          next:(res: any) => {
            this.openModal(ModalSuccessRegistrationComponent,
              {
                title: `Ваша заявка на участие в <strong>${this.eventTitle}</strong> ${res.success ? '' : 'не'} принята.`,
                body: res.success ? `На вашу электронную почту: ${params.email} отправлено сообщение для подтверждения регистрации на гонку. Для успешного завершения регистрации, пожалуйста, выполните инструкции, приведённые в указанном письме.`
                  : `Регистрация не выполнена: ${res.Msg}`,
                hasAdditionalButton: res.success,
                eventName: this.eventTitle
              });
            this.submitDisabled = false;
          },
          error: e => this.submitDisabled = false,
          complete: () => this.submitDisabled = false
        }
      );
  }

  setFileForUpload(event: Event, controlName: string): void {
    const eventFiles = (<HTMLInputElement>event?.target).files;
    if (eventFiles && eventFiles.length > 0) {
      this.registrationForm?.get(controlName)?.setValue(eventFiles[0]);
      this.cdr.markForCheck();
    }
  }

  getFileName(controlName: string): string {
    return this.registrationForm?.get(controlName)?.value?.name;
  }

  isFileLarge(controlName: string): boolean {
    return this.registrationForm?.get(controlName)?.value?.size > 5242880;
  }

  hasFileCorrectExtension(controlName: string): boolean {
    const fileType = (this.registrationForm?.get(controlName)?.value?.type || '').split('/').pop();
    return !(['jpeg','png','pdf'].includes(fileType) || !Boolean(fileType));
  }
}

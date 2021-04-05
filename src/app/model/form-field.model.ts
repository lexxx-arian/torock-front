import { FieldType } from './form-field.interface';
import { Validators } from '@angular/forms';

export class FormFieldModel {
  fieldId?: number;
  fieldName: string;
  required: boolean;
  fieldType: FieldType;
  label: string;
  fieldNote: string;
  valueList?: {name: string, value: string | number}[];
  textType?: string;
  placeholder?: string;
  min?: string | number;
  max?: string | number;

  constructor(options: {
    fieldId?: number;
    fieldName: string;
    required: boolean;
    fieldType: FieldType;
    label: string;
    fieldNote: string;
    valueList?: string;
  }) {
    this.fieldId = options.fieldId;
    this.fieldName = options.fieldName;
    this.required = options.required;
    this.fieldType = [FieldType.DATE, FieldType.NUM].includes(options.fieldType) ? FieldType.INPUT : options.fieldType;
    this.label = options.label;
    this.fieldNote = options.fieldNote;
    this.valueList = Array.isArray(options?.valueList) ? options?.valueList : (options?.valueList?.split(';').map(item => ({name: item, value: item})) || [{name: 'нет значений', value: 0}]);
    switch (options.fieldType) {
      case FieldType.DATE:
        this.textType = 'date';
        break;
      case FieldType.NUM:
        this.textType = 'number';
        break;
      default:
        this.textType = /.+mail/.test(options.fieldName) ? 'email' : 'text';
        break;
    }
    this.placeholder = this.textType === 'email' ? 'name@example.com' : '';
    this.max = this.textType === 'date' && this.fieldName === 'bdate' ? new Date().toJSON().slice(0, 10) : '';
    this.min = this.textType === 'date' ? '1899-01-01' : '';
  }

  getControl(): {[key: string]: any} {
    return {
      [this.fieldName]: [null, [this.required ? Validators.required : Validators.nullValidator, this.textType === 'email' ? Validators.email : Validators.nullValidator]]
    }
  }
}

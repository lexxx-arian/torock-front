import { FieldType } from './form-field.interface';
import { Validators } from '@angular/forms';

export class FormFieldModel {
  fieldId?: number;
  fieldName: string;
  required: boolean;
  fieldType: FieldType;
  label: string;
  valueList?: string[];
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
    valueList?: string;
  }) {
    this.fieldId = options.fieldId;
    this.fieldName = options.fieldName;
    this.required = options.required;
    this.fieldType = options.fieldType === FieldType.DATE ? FieldType.INPUT : options.fieldType;
    this.label = options.label;
    this.valueList = options?.valueList?.split(';') || [];
    this.textType = options.fieldType === FieldType.DATE ? 'date' : (/.+mail/.test(options.fieldName) ? 'email' : 'text');
    this.placeholder = this.textType === 'email' ? 'name@example.com' : '';
    this.max = this.textType === 'date' ? new Date().toJSON().slice(0, 10) : '';
    this.min = this.textType === 'date' ? '1899-01-01' : '';
  }

  getControl(): {[key: string]: any} {
    return {
      [this.fieldName]: [null, [this.required ? Validators.required : Validators.nullValidator, this.textType === 'email' ? Validators.email : Validators.nullValidator]]
    }
  }
}

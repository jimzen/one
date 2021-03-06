import * as yup from 'yup';
import { TYPE_INPUT } from 'client/constants';
import { getValidationFromFields } from 'client/utils/helpers';

const SHUTDOWN_ACTIONS = [
  { text: 'None', value: '""' },
  { text: 'Shutdown', value: 'shutdown' },
  { text: 'Shutdown hard', value: 'shutdown-hard' }
];

export const FORM_FIELDS = [
  {
    name: 'name',
    label: 'Name',
    type: TYPE_INPUT.TEXT,
    validation: yup
      .string()
      .min(1)
      .trim()
      .required('Name field is required')
      .default('')
  },
  {
    name: 'cardinality',
    label: 'Cardinality',
    type: TYPE_INPUT.TEXT,
    validation: yup
      .number()
      .min(1)
      .required()
      .default(1)
  },
  {
    name: 'shutdown_action',
    label: 'Select a VM shutdown action',
    type: TYPE_INPUT.SELECT,
    values: SHUTDOWN_ACTIONS,
    validation: yup
      .string()
      .oneOf(SHUTDOWN_ACTIONS.map(({ value }) => value))
      .default(SHUTDOWN_ACTIONS[1].value)
  }
];

export const STEP_FORM_SCHEMA = yup.object(
  getValidationFromFields(FORM_FIELDS)
);

import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { TYPE_INPUT } from 'client/constants';
import { getValidationFromFields } from 'client/utils/helpers';
import useOpennebula from 'client/hooks/useOpennebula';

const SELECT = {
  template: 'template',
  network: 'network'
};

const TYPES_NETWORKS = [
  { text: 'Create', value: 'template_id', select: SELECT.template },
  { text: 'Reserve', value: 'reserve_from', select: SELECT.network },
  { text: 'Existing', value: 'id', select: SELECT.network }
];

const ID = {
  name: 'id',
  label: 'ID',
  type: TYPE_INPUT.TEXT,
  htmlType: 'hidden',
  validation: yup
    .string()
    .uuid()
    .required()
    .default(uuidv4),
  grid: { style: { display: 'none' } }
};

const MANDATORY = {
  name: 'mandatory',
  label: 'Mandatory',
  type: TYPE_INPUT.CHECKBOX,
  validation: yup
    .boolean()
    .required()
    .default(false),
  grid: { md: 12 }
};

const NAME = {
  name: 'name',
  label: 'Name',
  type: TYPE_INPUT.TEXT,
  validation: yup
    .string()
    .trim()
    .required('Name field is a required')
    .default('')
};

const DESCRIPTION = {
  name: 'description',
  label: 'Description',
  type: TYPE_INPUT.TEXT,
  multiline: true,
  validation: yup
    .string()
    .trim()
    .default('')
};

const TYPE = {
  name: 'type',
  label: 'Select a type',
  type: TYPE_INPUT.SELECT,
  values: TYPES_NETWORKS,
  validation: yup
    .string()
    .oneOf(TYPES_NETWORKS.map(({ value }) => value))
    .required('Type field is required')
    .default(TYPES_NETWORKS[0].value)
};

const ID_VNET = {
  name: 'idVnet',
  label: `Select a network`,
  type: TYPE_INPUT.AUTOCOMPLETE,
  dependOf: TYPE.name,
  values: dependValue => {
    const { vNetworks, vNetworksTemplates } = useOpennebula();
    const type = TYPES_NETWORKS.find(({ value }) => value === dependValue);

    const values =
      type?.select === SELECT.network ? vNetworks : vNetworksTemplates;

    return values
      .map(({ ID: value, NAME: text }) => ({ text, value }))
      .sort((a, b) => a.value - b.value);
  },
  validation: yup
    .string()
    .trim()
    .when(TYPE.name, (type, schema) =>
      TYPES_NETWORKS.some(
        ({ value, select }) => type === value && select === SELECT.network
      )
        ? schema.required('Network field is required')
        : schema.required('Network template field is required')
    )
    .default(undefined)
};

const EXTRA = {
  name: 'extra',
  label: 'Extra',
  multiline: true,
  type: TYPE_INPUT.TEXT,
  validation: yup
    .string()
    .trim()
    .default('')
};

export const FORM_FIELDS = [
  ID,
  MANDATORY,
  NAME,
  DESCRIPTION,
  TYPE,
  ID_VNET,
  EXTRA
];

export const NETWORK_FORM_SCHEMA = yup.object(
  getValidationFromFields(FORM_FIELDS)
);

export const STEP_FORM_SCHEMA = yup
  .array()
  .of(NETWORK_FORM_SCHEMA)
  .default([]);

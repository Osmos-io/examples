import { useState } from "react";
import { canAddRow } from "../API/API";
import './SchemaCreator.css';

const initialSchema =
  [{ fieldName: 'foo', fieldType: 'Text', repeated: false },
  { fieldName: 'bar', fieldType: 'Double', repeated: false }];

const fieldTypeOptions = [
  'Text',
  'Double',
  'Boolean'
];

const newField = { fieldName: '', fieldType: 'Text', repeated: false };

function SchemaCreator() {

  const [schema, setSchema] = useState(initialSchema);
  function setField(newField, index) {
    schema[index] = newField;
    setSchema(schema);
  }


  const schemaForBackend = { schema, token: 'superSecretToken' };
  function addRow() {
    // For some reason we have to ask the backend if we can add a row. it seems to always say yes, at least
    canAddRow(schemaForBackend).then(function (canAdd) {
      if (canAdd) {
        console.log('success');
        setSchema([...schemaForBackend.schema, newField]);
      }
      else {
        console.error('back end bugs, call Aaron');
      }
    })
  }

  return (
    <div className='schema-creator'>
      {schema.map((field, index) => (
        <div key={index} className='field-row'>

          <label>Field Name</label>
          <input value={field.fieldName} type='text' onChange={(e) => {
            const newVal = e.target.value;
            console.log('filedname', newVal);
            setField({ ...field, fieldName: newVal }, index);
          }} />

          <label>Field Type</label>
          <select value={field.fieldType} onChange={(e) => {
            const newVal = e.target.value;
            setField({ fieldType: newVal, ...field }, index);
          }}>
            {fieldTypeOptions.map(option => <option value={option} key={option}>{option}</option>)}
          </select>

          <label>Repeated</label>
          <input value={field.repeated} type='checkbox' checked={field.repeated} onChange={(e) => {
            const newVal = e.target.checked;
            setField({ ...field, repeated: newVal }, index);
          }} />
        </div>
      ))}

      <div>
        <button onClick={addRow}>Add Field</button>
      </div>
    </div>
  )
};

export default SchemaCreator;
import { useState } from "react";
import { canAddRow } from "../API/API";
import "./SchemaCreator.css";

enum FieldTypeOptions {
  TEXT = "Text",
  DOUBLE = "Double",
  BOOLEAN = "Boolean",
}

interface Field {
  fieldName: string;
  fieldType: FieldTypeOptions;
  repeated: boolean;
}

const initialSchema: Field[] = [
  { fieldName: "foo", fieldType: FieldTypeOptions.TEXT, repeated: false },
  { fieldName: "bar", fieldType: FieldTypeOptions.TEXT, repeated: false },
];

const newField = {
  fieldName: "",
  fieldType: FieldTypeOptions.TEXT,
  repeated: false,
};

function SchemaCreator() {
  const [schema, setSchema] = useState(initialSchema);
  function setField(newField: Field, index: number) {
    schema[index] = newField;
    setSchema(schema);
  }

  const schemaForBackend = { schema, token: "superSecretToken" };
  function addRow() {
    // For some reason we have to ask the backend if we can add a row. it seems to always say yes, at least
    canAddRow(schemaForBackend).then(function (canAdd) {
      if (canAdd) {
        console.log("success");
        setSchema([...schemaForBackend.schema, newField]);
      } else {
        console.error("back end bugs, call Aaron");
      }
    });
  }

  return (
    <div className="schema-creator">
      {schema.map((field, index) => (
        <div key={index} className="field-row">
          <label>Field Name</label>
          <input
            value={field.fieldName}
            type="text"
            onChange={(e) => {
              const newVal = e.target.value;
              setField({ ...field, fieldName: newVal }, index);
            }}
          />

          <label>Field Type</label>
          <select
            value={field.fieldType}
            onChange={(e) => {
              const newVal = e.target.value as FieldTypeOptions;
              setField({ ...field, fieldType: newVal }, index);
            }}
          >
            {Object.values(FieldTypeOptions).map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>

          <label>Repeated</label>
          <input
            type="checkbox"
            checked={field.repeated}
            onChange={(e) => {
              const newVal = e.target.checked;
              setField({ ...field, repeated: newVal }, index);
            }}
          />
        </div>
      ))}

      <div>
        <button onClick={addRow}>Add Field</button>
      </div>
    </div>
  );
}

export default SchemaCreator;

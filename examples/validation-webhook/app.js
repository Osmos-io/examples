const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const port = 2939;

/**
 * Represents a field to be validated.
 * @typedef {Object} FieldToValidate
 * @property {string} fieldName - The name of the field.
 * @property {string} value - The value of the field.
 */

/**
 * Represents the output of the validation.
 * @typedef {(boolean|{isValid: boolean, errorMessage?: string, warningMessage?: string, validOptions?: string[]}|{infoMessage?: string, replacement: string})} ValidationOutput
 */

/**
 * Validates a given record.
 * @param {FieldToValidate} record - The record to validate.
 * @returns {ValidationOutput} The result of the validation.
 */
const validator = (record) => {
  // Basic validation
  if (record.fieldName === "yourFieldName") {
    const isValid = record.value !== "notAllowedValue";
    const isWarning = record.value === "warningValue";
    return {
      isValid,
      ...(!isValid && { errorMessage: `Value ${record.value} not allowed` }),
      ...(isWarning && { warningMessage: `Warning!` }),
    };
  }
  // With valid options
  if (record.fieldName === "yourFieldNameWithOptions") {
    const isValid = record.value !== "notAllowedValue";
    return {
      isValid,
      validOptions: ["option1", "option2"],
      ...(!isValid && { errorMessage: `Value ${record.value} not allowed` }),
    };
  }
  // Replace the field value
  if (record.fieldName === "yourOtherFieldName") {
    if (record.value === "replaceMe") {
      return {
        replacement: "replacedValue",
        infoMessage: "Field replaced by webhook",
      };
    }
  }
  // Return true for other fields
  return true;
};

app.post("/", async (req, res) => {
  const body = await req.body;
  if (!Array.isArray(body)) {
    return res
      .status(400)
      .send({ message: "Invalid POST body; expected an array" });
  }

  try {
    const validationResults = body.map((record) => {
      if (!Array.isArray(record)) {
        throw new Error("Inner record value must be an array");
      }
      return record.map(validator);
    });
    return res.status(200).send(validationResults);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

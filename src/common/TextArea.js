import { Field } from "react-final-form";
import PropTypes from "prop-types";

import FieldError from "./FieldError";

const TextArea = ({ fieldName, validation, label, error, rows }) => (
  <div
    className={`wmrards-fe-group ${error && "wmrards-fe-group--error"}
    }`}
  >
    {label ? (
      <label className="wmrards-fe-label" htmlFor={fieldName}>
        {label}
      </label>
    ) : null}
    <FieldError text={error} />
    <Field name={fieldName} validate={validation}>
      {({ input }) => (
        <textarea {...input} className="wmrards-fe-textarea" rows={rows} />
      )}
    </Field>
  </div>
);

TextArea.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  validation: PropTypes.func,
  error: PropTypes.string,
  rows: PropTypes.number,
};

export default TextArea;

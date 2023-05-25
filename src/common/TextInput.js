import { Field } from "react-final-form";
import PropTypes from "prop-types";

import FieldError from "./FieldError";

const TextInput = ({
  fieldName,
  label,
  validation,
  error,
  containerClass,
  defaultValue,
  type,
}) => (
  <div
    className={`wmrards-fe-group ${error && "wmrards-fe-group--error"} ${
      containerClass && containerClass
    }`}
  >
    <label className="wmrards-fe-label" htmlFor={fieldName}>
      {label}
    </label>
    <FieldError text={error} />
    <Field
      name={fieldName}
      validate={validation}
      component="input"
      type={type}
      className="wmrards-fe-input"
      defaultValue={defaultValue}
    />
  </div>
);

TextInput.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  validation: PropTypes.func,
  error: PropTypes.string,
  containerClass: PropTypes.string,
  defaultValue: PropTypes.any,
  type: PropTypes.string,
};

TextInput.defaultProps = {
  type: "text",
};

export default TextInput;

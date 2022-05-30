import PropTypes from "prop-types";

const ButtonLink = ({ children, callback, disabled }) => {
  return (
    <button
      type="button"
      onClick={callback}
      className="wmrards-btn wmrards-btn--link"
      disabled={disabled ? "disabled" : undefined}
    >
      {children}
    </button>
  );
};

ButtonLink.propTypes = {
  children: PropTypes.node,
  callback: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ButtonLink;

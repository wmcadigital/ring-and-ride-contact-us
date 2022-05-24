import { useEffect } from "react";
import PropTypes from "prop-types";
import { useFormState } from "react-final-form";

import FormSection from "../../common/FormSection";
import RadioGroup from "../../common/RadioGroup";
import Question from "../../common/Question";
import RadioButton from "../../common/RadioButton";
import FieldError from "../../common/FieldError";
import ProgressIndicator from "../../common/ProgressIndicator";
import ContactDetails from "../../common/ContactDetails";
import AddressFormatted from "../../common/AddressFormatted";
import getSectionPositionInfo from "../getSectionPosition";
import getAboutReturnJourneySectionName from "./getAboutReturnJourneySectionName";

import { required } from "../../common/validation";

const ReturnDestinationAddress = ({
  setReturnDestinationAddress,
  setGoToPage,
}) => {
  const stateApi = useFormState();
  const formValues = stateApi.values;
  const bookingParty = formValues["bookingParty"];

  const error = stateApi.submitFailed
    ? stateApi.errors?.returnDestinationAddress
    : null;

  let question = "";
  if (bookingParty === "mySelf") {
    question = "What address do you want to go to?";
  } else if (bookingParty === "behalfSomeone") {
    question = `What address does ${formValues["firstName"]} want to go to?`;
  } else if (bookingParty === "behalfGroup") {
    question = "What address is the group going to?";
  }

  let labelOne = "";
  if (bookingParty === "mySelf") {
    labelOne = "My registered home address";
  } else if (bookingParty === "behalfSomeone") {
    labelOne = "Their registered home address";
  } else if (bookingParty === "behalfGroup") {
    labelOne = "The outward journey address they were collected from";
  }

  useEffect(() => {
    if (formValues.returnDestinationAddress) {
      setReturnDestinationAddress(formValues.returnDestinationAddress);
    }
    if (formValues.returnDestinationAddress === "other") {
      setGoToPage(null);
    }
  }, [formValues.returnDestinationAddress]);

  return (
    <FormSection>
      <ProgressIndicator
        sectionPosition={getSectionPositionInfo("3", stateApi)}
        sectionName={getAboutReturnJourneySectionName(stateApi)}
      />
      <Question text={question} />
      <RadioGroup error={error}>
        <FieldError text={error} />
        <RadioButton
          key={1}
          label={labelOne}
          validation={required}
          value="sameAsOutwardCollectionAddress"
          fieldName="returnDestinationAddress"
        />
        {formValues.returnDestinationAddress ===
          "sameAsOutwardCollectionAddress" && bookingParty === "behalfGroup" ? (
          <div className="wmrards-m-l-xl wmrards-p-l-sm wmrards-m-b-lg">
            <ContactDetails>
              <AddressFormatted addressObj={formValues["otherOutward"]} />
            </ContactDetails>
          </div>
        ) : null}
        <RadioButton
          key={2}
          label="Another address"
          validation={required}
          value="other"
          fieldName="returnDestinationAddress"
        />
      </RadioGroup>
    </FormSection>
  );
};

ReturnDestinationAddress.propTypes = {
  setReturnDestinationAddress: PropTypes.func,
  setGoToPage: PropTypes.func,
};

ReturnDestinationAddress.defaultProps = {
  setReturnDestinationAddress: () => {},
  setGoToPage: () => {},
};

export default ReturnDestinationAddress;

import { useState, useEffect } from "react";
import { useFormState, useForm } from "react-final-form";
import PropTypes from "prop-types";

import Question from "../common/Question";
import Checkbox from "../common/Checkbox";
import FieldError from "../common/FieldError";
import Table from "../common/Table";
import CheckAnswerRow from "../common/CheckAnswerRow";
import CheckboxContainer from "../common/CheckboxContainer";
// import formatDate from "../common/formatDate";
import formatTime from "../common/formatTime";
import getAboutSectionName from "./section1/getAboutSectionName";
import AddressFormatted from "../common/AddressFormatted";
import ErrorPanel from "../common/ErrorPanel";
import AboutPassengers from "./aboutPassengers/AboutPassengers";

const CheckAnswers = ({
  setGoToPage,
  hideSubmit,
  setHideFinalSubmit,
  setConfirmSameAdditionalPassenger,
  setFormSubmitting,
  formSubmitError,
}) => {
  const stateApi = useFormState();
  const formApi = useForm();
  const formValues = stateApi.values;

  const submitting = stateApi.submitting;

  useEffect(() => {
    setFormSubmitting(submitting);
  }, [setFormSubmitting, submitting]);

  const [passengerFormOpen, setPassengerFormOpen] = useState(false);
  const [returnPassengerFormOpen, setReturnPassengerFormOpen] = useState(false);

  const bookingParty = formValues["bookingParty"];
  const includeInGroupBooking = formValues["includeInGroupBooking"];

  const outWardCollectionAddress = (() => {
    if (
      formValues["outwardCollectionAddress"] === "registered" &&
      bookingParty !== "behalfGroup"
    ) {
      if (bookingParty === "mySelf") {
        return "My registered home address";
      } else {
        return `${formValues["firstName"]}'s registered home address`;
      }
    } else {
      return <AddressFormatted addressObj={formValues["otherOutward"]} />;
    }
  })();

  const returnCollectionAddress = (() => {
    if (
      formValues["returnCollectionAddress"] ===
      "sameAsOutwardDestinationAddress"
    ) {
      if (bookingParty === "mySelf") {
        return "The address you were brought to";
      } else if (bookingParty === "behalfSomeone") {
        return `The address ${formValues["firstName"]} was brought to`;
      } else if (bookingParty === "behalfGroup") {
        return "The address the group were brought to";
      }
    } else {
      return <AddressFormatted addressObj={formValues["otherReturn"]} />;
    }
  })();

  const returnDestinationAddress = (() => {
    if (
      formValues["returnDestinationAddress"] ===
      "sameAsOutwardCollectionAddress"
    ) {
      if (bookingParty === "mySelf") {
        return "My registered home address";
      } else if (bookingParty === "behalfSomeone") {
        return `${formValues["firstName"]}'s registered home address`;
      } else if (bookingParty === "behalfGroup") {
        return "The outward journey address they were collected from";
      }
    } else {
      return (
        <AddressFormatted addressObj={formValues["otherReturnDestination"]} />
      );
    }
  })();

  const agreeLegalError = stateApi.submitFailed ? stateApi.errors?.legal : null;

  const offSet1 =
    bookingParty === "behalfGroup"
      ? includeInGroupBooking === "yes"
        ? 3
        : 2
      : 1;

  const offSet2 =
    typeof outWardCollectionAddress === "string" ||
    bookingParty === "behalfGroup"
      ? offSet1
      : offSet1 + 1;

  const offSet3 =
    bookingParty === "behalfGroup"
      ? offSet2
      : formValues["additionalPassenger"] === "yes"
      ? offSet2 + 2
      : offSet2 + 1;

  const offSet4 =
    typeof returnCollectionAddress === "string" ? offSet3 : offSet3 + 1;

  const offSet5 =
    typeof returnDestinationAddress === "string" ? offSet4 : offSet4 + 1;

  const showReturnPassengerNumbers =
    bookingParty !== "behalfGroup" &&
    ((formValues["additionalPassenger"] === "no" &&
      formValues["additionalPassengerReturn"] === "yes") ||
      (formValues["additionalPassenger"] === "yes" &&
        formValues["confirmSameAdditionalPassenger"] !== "alone")) &&
    formValues["additionalReturnPassengerNumbers"];

  const showReturnPassengerNumbersForOffset =
    bookingParty !== "behalfGroup" &&
    ((formValues["additionalPassenger"] === "no" &&
      formValues["additionalPassengerReturn"] === "yes") ||
      (formValues["additionalPassenger"] === "yes" &&
        formValues["confirmSameAdditionalPassenger"] === "no")) &&
    formValues["additionalReturnPassengerNumbers"];

  const offSet6 =
    !!showReturnPassengerNumbersForOffset ||
    (bookingParty === "behalfGroup" &&
      formValues["returnJourney"] === "yes" &&
      formValues["groupSameAsOutward"] === "no")
      ? offSet5 + 1
      : offSet5;

  const showSeparatePassengerLists =
    bookingParty === "behalfGroup" &&
    formValues["returnJourney"] === "yes" &&
    formValues["groupSameAsOutward"] === "no";

  return (
    <>
      <Question text="Check your answers" />
      {formSubmitError ? <ErrorPanel message={formSubmitError} /> : null}
      <h3>{getAboutSectionName(stateApi)}</h3>
      <Table>
        <CheckAnswerRow
          label="Name"
          value={`${formValues["firstName"]} ${formValues["lastName"]}`}
          changeValueCallback={() => setGoToPage(2)}
          disableButton={submitting}
        />
        {bookingParty !== "behalfGroup" ? (
          <CheckAnswerRow
            label="Registration number"
            value={formValues["registrationNo"]}
            changeValueCallback={() => setGoToPage(3)}
            disableButton={submitting}
          />
        ) : null}
        <CheckAnswerRow
          label="Preferred method of contact"
          value={`${
            formValues["emailContact"]
              ? `Email: ${formValues["emailAddress"]} `
              : ""
          }
        ${formValues["phoneContact"] ? `Phone: ${formValues["phoneNo"]}` : ""}`}
          changeValueCallback={() => {
            bookingParty === "behalfGroup" ? setGoToPage(3) : setGoToPage(4);
          }}
          disableButton={submitting}
        />
      </Table>
      {bookingParty === "behalfGroup" &&
      !(
        formValues["returnJourney"] === "yes" &&
        formValues["groupSameAsOutward"] === "no"
      ) ? (
        <AboutPassengers
          summaryPageMode
          showPassengerListCallback={() => setHideFinalSubmit(false)}
          showPassengerDetailsCallback={() => setHideFinalSubmit(true)}
        />
      ) : null}
      <h3>Outward Journey</h3>
      <Table>
        <CheckAnswerRow
          label="Date of booking"
          value={formValues["bookingDateDayAuto"]}
          changeValueCallback={() => setGoToPage(5 + offSet1)}
          disableButton={submitting}
        />
        <CheckAnswerRow
          label="Time to be picked up"
          value={formatTime(
            formValues.outwardPickup.hour,
            formValues.outwardPickup.minute
          )}
          changeValueCallback={() => setGoToPage(6 + offSet1)}
          disableButton={submitting}
        />
        <CheckAnswerRow
          label="Collection address"
          value={outWardCollectionAddress}
          changeValueCallback={() => setGoToPage(7 + offSet2)}
          disableButton={submitting}
        />
        <CheckAnswerRow
          label="Destination address"
          value={
            <AddressFormatted addressObj={formValues["outwardDestination"]} />
          }
          changeValueCallback={() => setGoToPage(8 + offSet2)}
          disableButton={submitting}
        />
        {bookingParty !== "behalfGroup" &&
        formValues["additionalPassenger"] === "yes" ? (
          <CheckAnswerRow
            label={`People joining ${
              bookingParty === "mySelf" ? "you" : "them"
            }`}
            value={`${formValues["additionalPassengerNumbers"]} other people`}
            changeValueCallback={() => setGoToPage(10 + offSet2)}
            disableButton={submitting}
          />
        ) : null}
      </Table>
      {showSeparatePassengerLists ? (
        <AboutPassengers
          summaryPageMode
          showPassengerListCallback={() => {
            setHideFinalSubmit(false);
            setPassengerFormOpen(false);
          }}
          showPassengerDetailsCallback={() => {
            setHideFinalSubmit(true);
            setPassengerFormOpen(true);
          }}
          otherFormOpen={returnPassengerFormOpen}
          anotherFormPresent
        />
      ) : null}
      {formValues["returnJourney"] === "yes" ? (
        <>
          <h3>Return Journey</h3>
          <Table>
            <CheckAnswerRow
              label="Time to be picked up"
              value={formatTime(
                formValues.returnPickup.hour,
                formValues.returnPickup.minute
              )}
              changeValueCallback={() => setGoToPage(9 + offSet3)}
              disableButton={submitting}
            />
            <CheckAnswerRow
              label="Collection address"
              value={returnCollectionAddress}
              changeValueCallback={() => setGoToPage(10 + offSet4)}
              disableButton={submitting}
            />
            <CheckAnswerRow
              label="Destination address"
              value={returnDestinationAddress}
              changeValueCallback={() => setGoToPage(11 + offSet5)}
              disableButton={submitting}
            />
            {showReturnPassengerNumbers ? (
              <CheckAnswerRow
                label={`People joining ${
                  bookingParty === "mySelf" ? "you" : "them"
                }`}
                value={`${formValues["additionalReturnPassengerNumbers"]} other people`}
                changeValueCallback={() => {
                  if (formValues["additionalPassenger"] === "yes") {
                    formApi.mutators.setFormAttribute(
                      "confirmSameAdditionalPassenger",
                      "no"
                    );
                    setConfirmSameAdditionalPassenger("no");
                  }
                  setGoToPage(14 + offSet5);
                }}
                disableButton={submitting}
              />
            ) : null}
          </Table>
        </>
      ) : null}
      {showSeparatePassengerLists ? (
        <AboutPassengers
          summaryPageMode
          returnPassengers
          showPassengerListCallback={() => {
            setHideFinalSubmit(false);
            setReturnPassengerFormOpen(false);
          }}
          showPassengerDetailsCallback={() => {
            setHideFinalSubmit(true);
            setReturnPassengerFormOpen(true);
          }}
          otherFormOpen={passengerFormOpen}
          anotherFormPresent
        />
      ) : null}
      {formValues["otherInformation"] === "yes" ? (
        <>
          <h3>Any other information</h3>
          <Table>
            <CheckAnswerRow
              label="Additional Requirements"
              value={formValues["otherInformationDetails"]}
              changeValueCallback={() =>
                setGoToPage(
                  formValues["returnJourney"] === "yes"
                    ? 13 + offSet6
                    : 8 + offSet3
                )
              }
              disableButton={submitting}
            />
          </Table>
        </>
      ) : null}
      {!hideSubmit ? (
        <>
          <h3>Now send your enquiry</h3>
          <p>
            By submitting this enquiry you are confirming that, to the best of
            your knowledge, the details you are providing are correct.
          </p>
          <CheckboxContainer error={agreeLegalError}>
            <FieldError text={agreeLegalError} />
            <Checkbox
              fieldName="agreeTermsAndConditions"
              label={
                <>
                  Agree to the{" "}
                  <a
                    href="https://www.wmca.org.uk/policies"
                    target="_blank"
                    rel="noreferrer"
                  >
                    terms and conditions
                  </a>
                </>
              }
            />
            <Checkbox
              fieldName="agreePrivacyPolicy"
              label={
                <>
                  Agree to the{" "}
                  <a
                    href="https://www.wmca.org.uk/policies"
                    target="_blank"
                    rel="noreferrer"
                  >
                    privacy policy
                  </a>
                </>
              }
            />
          </CheckboxContainer>
        </>
      ) : null}
    </>
  );
};

CheckAnswers.propTypes = {
  setGoToPage: PropTypes.func,
  hideSubmit: PropTypes.bool,
  setHideFinalSubmit: PropTypes.func,
  setConfirmSameAdditionalPassenger: PropTypes.func,
  setFormSubmitting: PropTypes.func,
  formSubmitError: PropTypes.string,
};

export default CheckAnswers;

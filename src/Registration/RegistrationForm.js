import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import FormContentWrapper from "../common/FormContentWrapper";
import Header from "../common/Header";
import BreadCrumb from "../common/BreadCrumb";
import FormWizard from "../common/FormWizard";

import RegistrationIndividual from "./section1/RegistrationIndividual";
import RegistrationName from "./section1/RegistrationName";
import DateOfBirth from "./section1/DateOfBirth";
import TelephoneNo from "./section1/TelephoneNo";
import EmailAddress from "./section1/EmailAddress";
import RegistrationAddress from "./section1/RegistrationAddress";
import ContactPreferences from "./section1/ContactPreferences";
import EthnicGroup from "./section1/EthnicGroup";
import SpecificEthnicGroup from "./section1/SpecificEthnicGroup";

import EmergencyContact from "./section2/EmergencyContact";
import EmergencyContactAnother from "./section2/EmergencyContactAnother";
import EmergencyContactName from "./section2/EmergencyContactName";
import EmergencyRelationship from "./section2/EmergencyRelationship";
import EmergencyContactTelephone from "./section2/EmergencyContactTelephone";
import EmergencyContactEmail from "./section2/EmergencyContactEmail";
import EmergencyContactAddress from "./section2/EmergencyContactAddress";

import StandardBusProblems from "./section3/StandardBusProblems";
import StandardBusReasons from "./section3/StandardBusReasons";
import ConditionQuery from "./section3/ConditionQuery";
import ConditionDetails from "./section3/ConditionDetails";
import MobilityAidsQuery from "./section3/MobilityAidsQuery";
import WheelChairTransfer from "./section3/WheelChairTransfer";
import AdditionalRequirements from "./section3/AdditionalRequirements";
import CheckAnswers from "./CheckAnswers";
import { validateCheckAnswers } from "./validation";

import {
  validateSelectOneOption,
  addressIdPresent,
} from "../common/validation";
import { validateDateOfBirth } from "./validation";

const RegistrationForm = () => {
  const location = useLocation();
  const [registrationAddresses, setRegistrationAddresses] = useState([]);
  const [emergencyAddresses, setEmergencyAddresses] = useState([]);
  const [registerForYourself, setRegisterForYourself] = useState(null);
  const [ethnicGroup, setEthnicGroup] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [emergencyContactAnother, setEmergencyContactAnother] = useState(null);
  const [hasCondition, setHasCondition] = useState(null);
  const [mobilityAids, setMobilityAids] = useState(null);

  const [goToPage, setGoToPage] = useState(null);
  const [externalPage, setExternalPage] = useState(null);

  const showEmergencyContact =
    emergencyContact === "yes" ||
    (registerForYourself === "no" && emergencyContactAnother === "yes");

  useEffect(() => {
    setExternalPage(location?.state?.orderNo);
  }, [location?.state?.orderNo]);

  return (
    <>
      <Header heading="Register for the Ring and Ride service" />
      <FormContentWrapper>
        <BreadCrumb currentPageName="Register" />
        <FormWizard
          onSubmit={() => {}}
          initialValues={location?.state?.formValues}
          goToPage={goToPage}
          setGoToPage={setGoToPage}
          externalPage={externalPage}
          setExternalPage={setExternalPage}
        >
          <RegistrationIndividual
            setRegisterForYourself={setRegisterForYourself}
          />
          <RegistrationName />
          <DateOfBirth validate={validateDateOfBirth} />
          <TelephoneNo />
          <EmailAddress />
          <RegistrationAddress
            orderNo={5}
            registrationAddresses={registrationAddresses}
            setRegistrationAddresses={setRegistrationAddresses}
            validate={addressIdPresent("registered")}
          />
          <ContactPreferences
            validate={validateSelectOneOption(
              "contactPreference",
              "selectContactPref"
            )}
          />
          <EthnicGroup
            setEthnicGroup={setEthnicGroup}
            setGoToPage={setGoToPage}
          />
          {ethnicGroup !== "preferNotToSay" ? (
            <SpecificEthnicGroup />
          ) : undefined}
          <EmergencyContact setEmergencyContact={setEmergencyContact} />
          {registerForYourself === "no" && emergencyContact === "no" ? (
            <EmergencyContactAnother
              setEmergencyContactAnother={setEmergencyContactAnother}
            />
          ) : undefined}
          {showEmergencyContact ? <EmergencyContactName /> : undefined}
          {showEmergencyContact ? <EmergencyRelationship /> : undefined}
          {showEmergencyContact ? <EmergencyContactTelephone /> : undefined}
          {showEmergencyContact ? <EmergencyContactEmail /> : undefined}
          {showEmergencyContact ? (
            <EmergencyContactAddress
              emergencyAddresses={emergencyAddresses}
              setEmergencyAddresses={setEmergencyAddresses}
              validate={addressIdPresent("emergency")}
            />
          ) : undefined}
          <StandardBusProblems
            validate={validateSelectOneOption(
              "standardBusProb",
              "selectStandardBusProb"
            )}
          />
          <StandardBusReasons
            validate={validateSelectOneOption(
              "standardBusReason",
              "selectStandardBusReason"
            )}
          />
          <ConditionQuery setHasCondition={setHasCondition} />
          {hasCondition === "yes" ? <ConditionDetails /> : undefined}
          <MobilityAidsQuery
            validate={validateSelectOneOption(
              "mobilityAids",
              "selectMobilityAids"
            )}
            setMobilityAids={setMobilityAids}
          />
          {mobilityAids?.manualWheelchair || mobilityAids?.poweredWheelchair ? (
            <WheelChairTransfer />
          ) : undefined}
          <AdditionalRequirements />
          <CheckAnswers
            setGoToPage={setGoToPage}
            validate={validateCheckAnswers}
          />
        </FormWizard>
      </FormContentWrapper>
    </>
  );
};

export default RegistrationForm;

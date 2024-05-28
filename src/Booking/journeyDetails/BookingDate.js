import { useEffect } from "react";
import { useFormState, useForm } from "react-final-form";

import FormSection from "../../common/FormSection";
import Question from "../../common/Question";
import ProgressIndicator from "../../common/ProgressIndicator";
// import DateInput from "../../common/DateInput";
import getSectionPositionInfo from "../getSectionPosition";
import getAboutJourneySectionName from "./getAboutJourneySectionName";
import RadioGroup from "../../common/RadioGroup";
import RadioButton from "../../common/RadioButton";
import FieldError from "../../common/FieldError";
import { required } from "../../common/validation";

const BookingDate = () => {
  const stateApi = useFormState();
  const formValues = stateApi.values;
  const formApi = useForm();
  // const error = stateApi.submitFailed ? stateApi.errors?.bookingDate : null;
  const error1 = stateApi.submitFailed
    ? stateApi.errors?.bookingDateDayAuto
    : null;

  useEffect(() => {
    if (formValues.bookingDateDayAuto == "other") {
      if (
        formValues.bookingDateDay !== null &&
        formValues.bookingDateMonth !== null &&
        formValues.bookingDateYear !== null
      ) {
        formApi.mutators.setFormAttribute(
          "formData.bookingDateDayManual",
          formValues.bookingDateDay +
            "/" +
            formValues.bookingDateMonth +
            "/" +
            formValues.bookingDateYear
        );
      } else {
        formApi.mutators.setFormAttribute(
          "formData.bookingDateDayManual",
          "N/A"
        );
      }
    }
  }, [
    formApi.mutators,
    formValues.bookingDateDay,
    formValues.bookingDateMonth,
    formValues.bookingDateYear,
    formValues.bookingDateDayAuto,
  ]);

  // trip date validation
  const today = new Date();
  const current = new Date();
  const current2 = new Date();
  const current3 = new Date();
  const current4 = new Date();
  const current5 = new Date();
  const current6 = new Date();
  const current7 = new Date();

  // 👇️ get current date and include the 0 in minutes
  const currentTime =
    `${today.getHours()}`.padStart(2, "0") +
    ":" +
    `${today.getMinutes()}`.padStart(2, "0");
  // set cut off time
  const cutoffTime = "14:30";

  today.setDate(today.getDate());
  current.setDate(current.getDate() + 1);
  current2.setDate(current2.getDate() + 2);
  current3.setDate(current3.getDate() + 3);
  current4.setDate(current4.getDate() + 4);
  current5.setDate(current5.getDate() + 5);
  current6.setDate(current6.getDate() + 6);
  current7.setDate(current7.getDate() + 7);

  const dateToday = today.toDateString();
  const dayTomorrow = current.toLocaleDateString("en-GB", { weekday: "short" });
  let dateTomorrow = current.toDateString();
  const dateInTwoDays = current2.toDateString();
  const dateInThreeDays = current3.toDateString();
  const dateInFourDays = current4.toDateString();
  const dateInFiveDays = current5.toDateString();
  const dateInSixDays = current6.toDateString();
  const dateInSevenDays = current7.toDateString();

  // disable sunday button if today is saturday
  if (dateToday.includes("Sun")) {
    // disable monday if today is sunday
    const radios = document.querySelectorAll(
      'input[name="bookingDateDayAuto"]'
    );
    for (const f of radios) {
      if (f.value.includes("Mon")) {
        f.disabled = true;
      }
    }
  }

  // disable next day if after 14:30
  if (currentTime > cutoffTime) {
    const radios = document.querySelectorAll(
      'input[name="bookingDateDayAuto"]'
    );
    for (const f of radios) {
      if (f.value.includes(dayTomorrow)) {
        f.disabled = true; // disable tomorrows radio button
        dateTomorrow = `${current.toDateString()} (You can't book this day as it's after 14:30)`; // update tomorrows radio label
      }
    }
  }

  // set other date label + 7 days
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + 8);
  // const month = dateObj.getUTCMonth() + 1;
  // const day = dateObj.getUTCDate();
  // const year = dateObj.getUTCFullYear();

  // const newdate = "For example, " + day + " " + month + " " + year;

  return (
    <FormSection>
      <ProgressIndicator
        sectionPosition={getSectionPositionInfo("2", stateApi)}
        sectionName={getAboutJourneySectionName(stateApi)}
      />
      <Question text="What date is the booking for?" />

      <RadioGroup error={error1}>
        <label className="wmrards-fe-label" htmlFor="bookingDateDayAuto">
          Journey requests need to be received by 2.30pm on the day prior to
          your requested journey unless it&apos;s a Sunday or Monday where it
          needs to be 2 days before. We will then e-mail you to confirm your
          booking as soon as possible.
        </label>
        <FieldError text={error1} />
        <RadioButton
          key={1}
          label={dateTomorrow}
          validation={required}
          value={dateTomorrow}
          fieldName="bookingDateDayAuto"
        />
        <RadioButton
          key={2}
          label={dateInTwoDays}
          validation={required}
          value={dateInTwoDays}
          fieldName="bookingDateDayAuto"
        />
        <RadioButton
          key={3}
          label={dateInThreeDays}
          validation={required}
          value={dateInThreeDays}
          fieldName="bookingDateDayAuto"
        />
        <RadioButton
          key={4}
          label={dateInFourDays}
          validation={required}
          value={dateInFourDays}
          fieldName="bookingDateDayAuto"
        />
        {/* <RadioButton
          key={5}
          label={dateInFiveDays}
          validation={required}
          value={dateInFiveDays}
          fieldName="bookingDateDayAuto"
        />
        <RadioButton
          key={6}
          label={dateInSixDays}
          validation={required}
          value={dateInSixDays}
          fieldName="bookingDateDayAuto"
        />
        <RadioButton
          key={7}
          label={dateInSevenDays}
          validation={required}
          value={dateInSevenDays}
          fieldName="bookingDateDayAuto"
        /> */}
        {/*  <RadioButton
          key={8}
          label="other"
          validation={required}
          value="other"
          fieldName="bookingDateDayAuto"
        />*/}
      </RadioGroup>
      {/* {formValues.bookingDateDayAuto === "other" ? (
        <DateInput
          dayFieldName="bookingDateDay"
          monthFieldName="bookingDateMonth"
          yearFieldName="bookingDateYear"
          label={newdate}
          error={error}
        />
      ) : null} */}
      <hr />
      <p>If you wish to book on any of the days below please call 0330 053 8141.</p>
      <p>Alternatively download the <a href="https://www.tfwm.org.uk/plan-your-journey/ways-to-travel/buses-in-the-west-midlands/on-demand-buses-in-the-west-midlands/" target="_blank" rel="noreferrer">West Midlands Bus app</a> where you can book trips up to 7 days in advance.</p>
      <ul>
        <li>{dateInFiveDays}</li>
        <li>{dateInSixDays}</li>
        <li>{dateInSevenDays}</li>
      </ul>
    </FormSection>
  );
};

export default BookingDate;

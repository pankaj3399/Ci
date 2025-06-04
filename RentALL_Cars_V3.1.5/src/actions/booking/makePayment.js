import moment from 'moment';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { sendPayment } from '../../core/payment/sendPayment';
import { convert } from '../../helpers/currencyConvertion';
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import { startTimeData } from '../../helpers/formatting';
import { createReservation as mutation } from '../../lib/graphql';
import {
  BOOKING_PAYMENT_START,
  BOOKING_PAYMENT_SUCCESS,
  BOOKING_PAYMENT_ERROR,
} from '../../constants';

export const makePayment = (
  listId,
  title,
  hostId,
  guestId,
  checkIn,
  checkOut,
  guests,
  message,
  basePrice,
  delivery,
  currency,
  discount,
  discountType,
  guestServiceFee,
  hostServiceFee,
  total,
  bookingType,
  paymentCurrency,
  paymentType,
  guestEmail,
  specialPricing,
  isSpecialPriceAssigned,
  isSpecialPriceAverage,
  dayDifference,
  startTime,
  endTime,
  licenseNumber,
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  countryCode,
  paymentMethodId,
  securityDeposit,
  hostServiceFeeType,
  hostServiceFeeValue
) => {

  return async (dispatch, getState, { client }) => {
    try {

      dispatch({
        type: BOOKING_PAYMENT_START,
        payload: {
          paymentLoading: true
        }
      });

      let preApprove, bookingTypeData, cancellationPolicy, isStartValue, isStartDate, checkInDate, checkOutDate, isEndDate, isEndValue;
      let securityDepositStatus, securityDepositAmount;
      preApprove = getState().book?.bookDetails?.preApprove;
      bookingTypeData = preApprove ? 'instant' : bookingType;
      cancellationPolicy = getState().book?.data?.listingData?.cancellation?.id;
      isStartValue = startTimeData(startTime), isEndValue = startTimeData(endTime);
      isStartDate = moment(checkIn).format('YYYY-MM-DD'), isEndDate = moment(checkOut).format('YYYY-MM-DD');
      checkInDate = moment.utc(isStartDate + ' ' + isStartValue), checkOutDate = moment.utc(isEndDate + ' ' + isEndValue);
      securityDepositStatus = getState().siteSettings?.data?.securityDepositPreference;
      securityDepositAmount = securityDepositStatus == 1 ? securityDeposit : 0


      const { data } = await client.mutate({
        mutation,
        variables: {
          listId,
          hostId,
          guestId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          message,
          basePrice,
          delivery,
          currency,
          discount,
          discountType,
          guestServiceFee,
          hostServiceFee,
          total,
          bookingType: bookingTypeData,
          paymentType,
          cancellationPolicy,
          specialPricing,
          isSpecialPriceAssigned,
          isSpecialPriceAverage,
          dayDifference,
          startTime,
          endTime,
          licenseNumber,
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          countryCode,
          securityDeposit: securityDepositAmount,
          hostServiceFeeType,
          hostServiceFeeValue
        }
      })

      if (data?.createReservation) {
        let reservationId, amount, rates, baseCurrency, convertedAmount = 0, reservationDetails;
        reservationId = data?.createReservation?.id;
        amount = total + guestServiceFee + securityDepositAmount;

        rates = getState().currency?.rates;
        baseCurrency = getState().currency?.base;

        if (paymentType == 1) {
          convertedAmount = convert(baseCurrency, rates, amount, currency, paymentCurrency);
          const { status, errorMessage } = await sendPayment(reservationId, convertedAmount.toFixed(2), paymentCurrency, title);
          if (status == 200) {
            dispatch({
              type: BOOKING_PAYMENT_SUCCESS,
              payload: { paymentLoading: false }
            });
          } else {
            if (status == 422) {
              showToaster({ messageId: 'invalidCurrency', toasterType: 'error' })
            }
            else {
              errorMessage ? showToaster({ messageId: 'checkStatus', toasterType: 'error', requestMessage: errorMessage }) : '';
            }
            dispatch({
              type: BOOKING_PAYMENT_ERROR,
              payload: { paymentLoading: false }
            });
          }

        } else {
          reservationDetails = {
            reservationId,
            listId,
            hostId,
            guestId,
            guestEmail,
            title,
            amount,
            currency
          };

          const { status, errorMessage, paymentIntentSecret } = await processStripePayment(
            'reservation',
            null,
            reservationDetails,
            paymentMethodId
          );

          if (status === 200) {
            dispatch({
              type: BOOKING_PAYMENT_SUCCESS,
              payload: { paymentLoading: true }
            });

            return {
              status
            }
          } else {
            errorMessage ? showToaster({ messageId: 'failedError', toasterType: 'error', requestMessage: errorMessage }) : '';
            dispatch({
              type: BOOKING_PAYMENT_ERROR,
              payload: { paymentLoading: false }
            });

            return {
              status,
              paymentIntentSecret,
              reservationId
            }
          }
        }
      }
    } catch (error) {
      dispatch({
        type: BOOKING_PAYMENT_ERROR,
        payload: {
          error,
          paymentLoading: false
        }
      });
      return false;
    }

    return true;
  };
}
import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull
} from 'graphql';
import ReservationPaymentType from '../../types/ReservationPaymentType';
import { createThread } from '../../../libs/payment/stripe/helpers/createThread';
import { updateReservation, getReservation } from '../../../libs/payment/stripe/helpers/updateReservation';
import { blockDates } from '../../../libs/payment/stripe/helpers/blockDates';
import { createTransaction } from '../../../libs/payment/paypal/helpers/createTransaction';
import { emailBroadcast } from '../../../libs/payment/stripe/helpers/email';
import { makePayPalPayment } from '../../../libs/payment/paypal/makePayPalPayment';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const confirmPayPalExecute = {
	type: ReservationPaymentType,
	args: {
		paymentId: { type: new NonNull(StringType) },
		payerId: { type: new NonNull(StringType) }
	},
	async resolve({ request, response }, {
		paymentId,
		payerId
	}) {

		try {
			let reservation, status, errorMessage, reservationId;
			if (request.user && !request.user.admin) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}
				const { data, results } = await makePayPalPayment(paymentId);

				if (data && data.status == 'COMPLETED') {
					const extractedDatas = results && results.map((item) => {
						return {
							reservationId: item.reservationId,
							receiverEmail: item.receiverEmail,
							receiverId: item.receiverId,
							transactionId: item.transactionId,
							total: item.total,
							transactionFee: item.transactionFee,
							currency_code: item.currency_code
						};
					});

					if (extractedDatas && extractedDatas.length > 0) {
						const value = extractedDatas[0], receiverEmail = value.receiverEmail, receiverId = value.receiverId;
						const transactionId = value.transactionId, total = value.total, transactionFee = value.transactionFee, currency = value.currency_code;
						reservationId = value.reservationId;

						const payerEmail = data.payment_source.paypal.email_address;
						const payerId = data.payment_source.paypal.account_id;
						await updateReservation(reservationId);
						await createTransaction(
							reservationId,
							payerEmail,
							payerId,
							receiverEmail,
							receiverId,
							transactionId,
							total,
							transactionFee || 0,
							currency,
							""
						);
						await createThread(reservationId);
						await blockDates(reservationId);
						emailBroadcast(reservationId);
						reservation = await getReservation(reservationId);
						status = 200;
					} else {
						status = 400;
						errorMessage = await showErrorMessage({ errorCode: 'fetchRecords' })
					}
				} else {
					status = 400;
					errorMessage = await showErrorMessage({ errorCode: 'paymentNotComplete' })
				}

				return {
					results: reservation,
					status,
					reservationId,
					errorMessage
				}
			} else {
				return {
					status: 500,
					errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' })
				}
			}
		} catch (error) {
			return {
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
				status: 400
			};
		}
	},
};

export default confirmPayPalExecute;

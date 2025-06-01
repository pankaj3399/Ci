import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull
} from 'graphql';
import moment from 'moment';
import { Reservation } from '../../models';
import UserCommonType from '../../types/UserCommonType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const completeReservationTest = {
	type: UserCommonType,
	args: {
		reservationId: { type: new NonNull(IntType) },
		checkIn: { type: new NonNull(StringType) },
		checkOut: { type: new NonNull(StringType) },
	},
	async resolve({ request }, { reservationId, checkIn, checkOut }) {
		try {

			if (!request.user) {
				return {
					status: 500,
					errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' })
				}
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			const findActiveReservation = await Reservation.findOne({
				attributes: ['dayDifference'],
				where: {
					paymentState: 'completed',
					reservationState: 'approved',
					id: reservationId
				}
			});

			let momentStartDate = moment(checkIn), momentEndDate = moment(checkOut);
			let dayDifference = momentEndDate.diff(momentStartDate, 'days');
			dayDifference = dayDifference + 1;

			let checkForEndDate = (momentEndDate < moment() ? true : false);

			if (checkForEndDate && findActiveReservation && dayDifference == findActiveReservation.dayDifference) {
				await Reservation.update({
					checkIn,
					checkOut,
					reservationState: 'completed',
				}, {
					where: {
						id: reservationId
					}
				});

				return {
					status: 200
				}
			} else {
				return {
					status: 400,
					errorMessage: await showErrorMessage({ errorCode: 'reservationNotFound' })
				}
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
			};
		}
	}
};

export default completeReservationTest;
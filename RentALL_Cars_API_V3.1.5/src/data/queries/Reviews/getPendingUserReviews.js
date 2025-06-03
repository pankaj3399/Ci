import { GraphQLInt as IntType } from 'graphql';
import { Reservation } from '../../models';
import AllReservationType from '../../types/AllReservationType';
import sequelize from '../../sequelize';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getPendingUserReviews = {
    type: AllReservationType,
    args: {
        currentPage: { type: IntType }
    },
    async resolve({ request }, { currentPage }) {

        try {
            let offset = 0, limit = 10, userId, where = {};
            if (!request.user) {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' })
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            userId = request.user.id;
            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }

            where = {
                reservationState: 'completed',
                $or: [
                    {
                        hostId: userId
                    },
                    {
                        guestId: userId
                    }
                ],
                id: {
                    $notIn: [
                        sequelize.literal(`SELECT reservationId FROM Reviews WHERE authorId='${userId}'`)
                    ],
                },
                listId: {
                    $in: [
                        sequelize.literal(`SELECT id FROM Listing`)
                    ],
                }
            };

            const results = await Reservation.findAll({
                where,
                limit,
                offset,
                order: [['checkOut', 'DESC']]
            });

            const count = await Reservation.count({ where });

            return await {
                status: count > 0 && results && results.length > 0 ? 200 : 400,
                results,
                count,
                currentPage,
                errorMessage: count > 0 && results && results.length > 0 ? null : await showErrorMessage({ errorCode: 'noReviews' })
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getPendingUserReviews;
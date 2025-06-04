import { ListViews, Listing } from '../../../data/models';
import ListType from '../../types/ListType';
import sequelize from '../../sequelize';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getMostViewedListing = {
    type: ListType,
    async resolve({ request }) {

        try {
            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            const getAllListing = Listing.findAll({
                where: {
                    isPublished: true
                },
                include: [
                    {
                        model: ListViews,
                        attributes: [],
                        as: 'listViews',
                        required: true,
                        duplicating: false
                    }
                ],
                order: [
                    [sequelize.fn('count', sequelize.col('listViews.listId')), 'DESC'],
                ],
                group: ['listViews.listId'],
                limit: 10,
                offset: 0
            });

            return {
                results: getAllListing,
                status: getAllListing ? 200 : 400,
                errorMessage: getAllListing ? null : await showErrorMessage({ errorCode: 'invalidError' }),
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default getMostViewedListing;
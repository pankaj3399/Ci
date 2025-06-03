import {
    GraphQLInt as IntType,
} from 'graphql';
import { ListPhotos, Listing } from '../../../data/models';
import ListPhotosCommonType from '../../types/ListPhotosType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const ShowListPhotos = {
    type: ListPhotosCommonType,
    args: {
        listId: { type: IntType },
    },
    async resolve({ request, response }, { listId }) {

        try {
            if (request.user || request.user.admin) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
                let where, listWhere;
                where = { listId };
                listWhere = { id: listId };
                if (!request.user.admin) {

                    listWhere = {
                        id: listId,
                        userId: request.user.id
                    }
                };
                const listingPhotos = await ListPhotos.findAll({
                    where: { listId },
                    include: [
                        { model: Listing, as: 'listing', where: listWhere }
                    ]
                });

                return {
                    results: listingPhotos,
                    status: listingPhotos.length > 0 ? 200 : 400,
                    errorMessage: listingPhotos.length > 0 ? null : await showErrorMessage({ errorCode: 'invalidError' }),
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    },
};

export default ShowListPhotos;

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { User, AdminUser } from '../../models';
import CommonType from '../../types/CommonType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const validateEmailExist = {
    type: CommonType,
    args: {
        email: {
            type: new NonNull(StringType)
        }
    },
    async resolve({ request, response }, {
        email
    }) {

        if (request && request.user) {
            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }
        }

        const checkUser = await User.findOne({
            attributes: ['id', 'email'],
            where: {
                email,
                userDeletedAt: {
                    $eq: null
                },
            },
            order: [
                [`createdAt`, `DESC`],
            ],
        });

        try {
            if (checkUser) {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'userExists' }),
                    status: 400
                };
            } else {
                const getAdminUserId = await AdminUser.findOne({
                    where: {
                        email
                    },
                });

                return {
                    status: getAdminUserId ? 400 : 200,
                    errorMessage: getAdminUserId ? await showErrorMessage({ errorCode: 'userExists' }) : null
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
                status: 400
            }
        }
    }

};

export default validateEmailExist;
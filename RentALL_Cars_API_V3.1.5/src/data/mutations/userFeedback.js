import {
    GraphQLString as StringType,
} from 'graphql';
import { UserProfile } from '../models';
import ReportUserCommonType from '../types/ReportUserCommonType';
import { sendEmail } from '../../libs/sendEmail';
import checkUserBanStatus from '../../libs/checkUserBanStatus';
import { getConfigurationData } from '../../libs/getConfigurationData';
import showErrorMessage from '../../helpers/showErrorMessage';

const userFeedback = {
    type: ReportUserCommonType,
    args: {
        type: { type: StringType },
        message: { type: StringType },
    },
    async resolve({ request }, { type, message }) {

        try {
            if (request && request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let userId = request.user.id, name;

                const profile = await UserProfile.findOne({
                    attributes: ['displayName'],
                    where: {
                        userId
                    },
                    raw: true
                });

                name = profile && profile.displayName;

                let content = {
                    type,
                    message,
                    name
                };
                const configData = await getConfigurationData({ name: ['email'] });
                const { status, errorMessage } = await sendEmail(configData.email, 'userFeedback', content);

                return await {
                    status: 200,
                    errorMessage
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'checkUserExist' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default userFeedback;
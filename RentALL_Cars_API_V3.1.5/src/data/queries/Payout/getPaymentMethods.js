import { PaymentMethods } from '../../../data/models';
import GetPaymentType from '../../types/GetPaymentType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getPaymentMethods = {
    type: GetPaymentType,
    async resolve({ request }) {
        try {

            if (!request.user) {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userAuthenticate' })
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            const results = await PaymentMethods.findAll({
                attributes: ['id', 'name', 'isEnable', 'processedIn', 'fees', 'currency', 'details', 'paymentType'],
                where: {
                    isEnable: true
                },
                order: [['id', 'DESC']],
            });

            return {
                results,
                status: 200
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    }
};

export default getPaymentMethods;
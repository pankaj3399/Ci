import { Currencies } from '../../../data/models';
import AllCurrenciesType from '../../types/AllCurrenciesType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getCurrencies = {
    type: AllCurrenciesType,
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

            const getAllCurrencies = await Currencies.findAll({
                where: {
                    isEnable: true
                }
            });

            return {
                status: getAllCurrencies && getAllCurrencies.length > 0 ? 200 : 400,
                errorMessage: getAllCurrencies && getAllCurrencies.length > 0 ? null : await showErrorMessage({ errorCode: 'invalidError' }),
                results: getAllCurrencies && getAllCurrencies.length > 0 ? getAllCurrencies : []
            }

        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 500
            };
        }
    },
};

export default getCurrencies;

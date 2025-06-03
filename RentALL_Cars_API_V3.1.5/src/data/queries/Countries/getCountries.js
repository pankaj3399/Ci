import { Country } from '../../../data/models';
import CountryData from '../../types/getCountryType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getCountries = {
    type: CountryData,
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

            const getCountryList = await Country.findAll();

            return {
                status: getCountryList ? 200 : 400,
                errorMessage: getCountryList ? null : await showErrorMessage({ errorCode: 'invalidError' }),
                results: getCountryList ? getCountryList : []
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default getCountries;
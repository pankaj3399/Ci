import { ListSettingsTypes } from '../../../data/models';
import ListSettingsCommonType from '../../types/ListingSettingsCommonType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getListingSettings = {
  type: ListSettingsCommonType,
  async resolve({ request }) {

    try {
      let where;
      where = Object.assign({}, where, { isEnable: true });

      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      const getResults = await ListSettingsTypes.findOne({
        attributes: ['id'],
        where
      });

      if (!getResults) {
        return await {
          status: 400,
          errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
          results: null
        }
      }

      return await {
        status: 200,
        results: getResults,
      }
    }
    catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default getListingSettings;
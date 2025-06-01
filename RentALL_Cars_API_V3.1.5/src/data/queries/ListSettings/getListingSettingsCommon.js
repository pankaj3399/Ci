import {
  GraphQLString as StringType,
} from 'graphql';
import { ListSettingsTypes } from '../../../data/models';
import ListSettingsCommonType from '../../types/ListingSettingsType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getListingSettingsCommon = {
  type: ListSettingsCommonType,
  args: {
    step: { type: StringType }
  },
  async resolve({ request }, { step }) {

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

      let where;
      if (step != undefined) {
        where = { where: { step: step } };
      }

      where = Object.assign({}, where, { isEnable: true });

      const getResults = await ListSettingsTypes.findAll({
        ...where
      });

      if (!getResults) {
        return await {
          status: 400,
          errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
          results: []
        }
      }

      return await {
        status: 200,
        results: getResults
      };
    }
    catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default getListingSettingsCommon;
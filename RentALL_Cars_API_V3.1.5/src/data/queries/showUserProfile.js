import {
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import { UserProfile } from '../../data/models';
import ShowUserProfileCommonType from '../types/ShowUserProfileType';
import checkUserBanStatus from '../../libs/checkUserBanStatus';
import showErrorMessage from '../../helpers/showErrorMessage';

const showUserProfile = {
  type: ShowUserProfileCommonType,
  args: {
    profileId: { type: IntType },
    isUser: { type: BooleanType },
  },
  async resolve({ request }, { profileId, isUser }) {

    try {
      let where;

      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      if (isUser) {
        let userId = request.user.id;
        where = {
          userId
        };
      } else {
        where = {
          profileId
        };
      }

      // Get All User Profile Data
      const userData = await UserProfile.findOne({
        attributes: [
          'userId',
          'profileId',
          'firstName',
          'lastName',
          'dateOfBirth',
          'gender',
          'phoneNumber',
          'preferredLanguage',
          'preferredCurrency',
          'location',
          'info',
          'createdAt',
          'picture'
        ],
        where
      });

      return {
        results: userData,
        status: userData ? 200 : 400,
        errorMessage: userData ? null : await showErrorMessage({ errorCode: 'invalidError' }),
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      }
    }
  },
};

export default showUserProfile;

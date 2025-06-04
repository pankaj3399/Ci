import { ImageBanner } from '../../models';
import ImageBannerType from '../../types/siteadmin/ImageBannerType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getImageBanner = {
  type: ImageBannerType,
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

      const result = await ImageBanner.findOne(
        {
          attributes: ['id', 'title', 'description', 'buttonLabel', 'image', 'buttonLabel2', 'buttonLink1', 'buttonLink2']
        }
      )

      return await {
        status: result ? 200 : 400,
        errorMessage: result ? null : await showErrorMessage({ errorCode: 'unableToFind' }),
        result
      };
    } catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  }
};

export default getImageBanner;


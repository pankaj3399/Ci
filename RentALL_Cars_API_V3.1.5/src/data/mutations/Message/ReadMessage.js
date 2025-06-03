import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { ThreadItems, Threads } from '../../../data/models';
import SendMessageType from '../../types/SendMessageType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const readMessage = {
  type: SendMessageType,
  args: {
    threadId: { type: new NonNull(IntType) }
  },
  async resolve({ request, response }, {
    threadId
  }) {

    try {
      // Check if user already logged in
      if (request.user && !request.user.admin) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        const userId = request.user.id;

        // Create a thread item
        const threadItems = await ThreadItems.update({
          isRead: true
        }, {
          where: {
            threadId,
            sentBy: {
              $ne: userId
            },
            isRead: false
          }
        });

        const updateThreads = await Threads.update({
          isRead: true
        }, {
          where: {
            id: threadId,
          }
        });

        return {
          status: 200,
          message: 'updated'
        };
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({errorCode: 'loginError' })
        };
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default readMessage;

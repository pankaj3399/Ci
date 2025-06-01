import { User } from '../../models';
import UserType from '../../types/UserType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getUserBanStatus = {
    type: UserType,
    async resolve({ request }) {
        try {
            // Check if user already logged in
            if (request.user && !request.user.admin) {
                const userData = await User.findOne({
                    attributes: [
                        'userBanStatus'
                    ],
                    where: { id: request.user.id }
                })
                if (userData) {
                    if (userData.userBanStatus == 1) {
                        return {
                            status: 200,
                            userBanStatus: true,
                        }
                    }
                    else {
                        return {
                            status: 200,
                            userBanStatus: false
                        };
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    }
};
export default getUserBanStatus;
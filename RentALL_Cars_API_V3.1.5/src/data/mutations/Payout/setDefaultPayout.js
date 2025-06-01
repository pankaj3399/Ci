import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { Payout } from '../../models';
import PayoutType from '../../types/PayoutType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import showErrorMessage from '../../../helpers/showErrorMessage';

const setDefaultPayout = {
    type: PayoutType,
    args: {
        id: { type: new NonNull(IntType) },
        type: { type: new NonNull(StringType) },
    },
    async resolve({ request }, {
        id,
        type
    }) {

        try {
            if (request.user) {
                let userId = request.user.id;

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                if (type == 'set') {
                    await Payout.update({
                        default: false
                    },
                        {
                            where: {
                                userId
                            }
                        });

                    let payoutupdated = await Payout.update({
                        default: true
                    },
                        {
                            where: {
                                id,
                                userId
                            }
                        });
                    if (payoutupdated) {
                        return {
                            status: 200
                        }
                    }
                } else if (type == "remove") {
                    let payoutRemoved = await Payout.destroy({
                        where: {
                            id,
                            userId
                        }
                    });

                    if (payoutRemoved) {
                        return {
                            status: 200
                        }
                    }

                } else {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'checkCurrencyTypeName' })
                    };
                }

            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userAuthenticate' })
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error: error.message })

            }
        }
    },
};

export default setDefaultPayout;

/**
mutation setDefaultPayout($id: Int!, $type: String!) {
    setDefaultPayout(id: $id, type: $type) {
        status
    }
}
 */

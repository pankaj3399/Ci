import { GraphQLInt as IntType } from 'graphql';
import { StaticPage } from '../../models';
import StaticPageCommonType from '../../types/StaticPage/StaticPageCommonType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getStaticPageContent = {
    type: StaticPageCommonType,
    args: {
        id: { type: IntType }
    },
    async resolve({ request }, { id }) {

        try {
            const result = await StaticPage.findOne({
                where: {
                    id: id || 2 // Default Privacy Policy
                }
            });

            return await {
                status: result ? 200 : 400,
                errorMessage: result ? null : await showErrorMessage({ errorCode: 'unableToFindPage' }),
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

export default getStaticPageContent;
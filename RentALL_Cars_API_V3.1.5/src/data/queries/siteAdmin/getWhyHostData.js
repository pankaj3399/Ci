import { WhyHost } from '../../models';
import WhyHostCommonType from '../../types/siteadmin/WhyHostCommonType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getWhyHostData = {
	type: WhyHostCommonType,

	async resolve({ request }) {
		try {
			const results = await WhyHost.findAll();
			return await {
				results,
				status: 200
			}
		} catch (error) {
			return {
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
				status: 400
			};
		}

	}
}

export default getWhyHostData;
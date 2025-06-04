import {
  SET_SITE_SETTINGS_START,
  SET_SITE_SETTINGS_SUCCESS,
  SET_SITE_SETTINGS_ERROR
} from '../constants';
import { siteSettings as query } from '../lib/graphql';

export const setSiteSettings = () => {
  return async (dispatch, getState, { client }) => {
    try {
      dispatch({
        type: SET_SITE_SETTINGS_START,
      });

      const type = "site_settings";
      let settingsData = {};
      const { data } = await client.query({
        query,
        variables: { type },
        fetchPolicy: 'network-only'
      });
      if (data?.siteSettings) {
        data?.siteSettings?.map((item, key) => {
          settingsData[item.name] = item.value;
        });

        // Successully logged out
        dispatch({
          type: SET_SITE_SETTINGS_SUCCESS,
          data: settingsData
        });

      } else {
        dispatch({
          type: SET_SITE_SETTINGS_ERROR,
        });
      }
    } catch (error) {
      dispatch({
        type: SET_SITE_SETTINGS_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}

import fetch from 'node-fetch';
import { websiteUrl } from '../config';

export async function sendEmail(to, type, mailContents, isLoggedIn, authToken, ) {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (isLoggedIn) {
        headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            auth: authToken
        };
    }

    // Validation IsLoggedIn
    if (isLoggedIn && !authToken) {
        return {
            status: 400,
            errorMessage: 'Authentication Token Error!'
        }
    }

    const resp = await fetch(websiteUrl + '/sendEmailTemplate', {
        method: 'post',
        headers,
        body: JSON.stringify({
            to,
            type,
            content: mailContents
        })
    });

    const { status, errorMessage } = resp.json;

    return  {
        status,
        errorMessage
    };
}

export default {
    sendEmail
}

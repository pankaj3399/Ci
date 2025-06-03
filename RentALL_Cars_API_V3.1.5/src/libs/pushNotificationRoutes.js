import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import { UserLogin } from '../data/models';
import { getConfigurationData } from './getConfigurationData';
import { tokenSplitup } from '../helpers/notificationSplitup';

const pushNotificationRoutes = app => {

    app.post('/push-notification', async function (req, res) {

        try {
            const configData = await getConfigurationData({ name: ['fcmPushNotificationKey'] });

            let userId, content, notificationId, deviceIds;
            userId = req.body.userId;
            content = req.body.content;
            notificationId = Math.floor(100000 + Math.random() * 900000);
            deviceIds = [];
            content['notificationId'] = notificationId;
            content['content_available'] = true;

            const getdeviceIds = await UserLogin.findAll({
                attributes: ['deviceId', 'deviceType'],
                where: {
                    userId: userId
                },
                raw: true
            });

            if (getdeviceIds && getdeviceIds.length > 0) {
                getdeviceIds.map((o) => { if (o.deviceId) deviceIds.push(o.deviceId) });
            };

            !getApps().length ? initializeApp({ credential: cert(JSON.parse(configData.fcmPushNotificationKey)) }) : getApp();

            const getTokens = await tokenSplitup(deviceIds);

            if (getTokens.length > 0) {
                getTokens.map((tokens) => {
                    let message = {
                        notification: {
                            title: content.title,
                            body: content.message
                        },
                        data: {
                            content: JSON.stringify(content),
                        },
                        tokens
                    };
                    getMessaging().sendEachForMulticast(message)
                        .then((response) => {
                            console.log('Successfully sent message:', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });
                })
                res.send({ status: 200, errorMessage: null })
            } else {
                res.send({ status: 400, errorMessage: 'error' })
            }
        } catch (error) {
            res.send({ status: 400, errorMessage: error })
        }
    });
};

export default pushNotificationRoutes;

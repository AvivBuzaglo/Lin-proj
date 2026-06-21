import admin from 'firebase-admin';
import serviceAccount from '../firebase-service-account.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export async function sendPushNotification(deviceToken, title, body, data = {}) {
  const message = {
    token: deviceToken,
    notification: { title, body },
    data,
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  const response = await admin.messaging().send(message);
  return response;
}
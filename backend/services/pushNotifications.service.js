import admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

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
  }

  const response = await admin.messaging().send(message)
  return response
}
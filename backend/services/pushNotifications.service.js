import { cert, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

initializeApp({
  credential: cert(serviceAccount),
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

  const response = await getMessaging().send(message)
  return response
}
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

export async function initPushNotifications() {
  // Request permission
  const { receive } = await FirebaseMessaging.requestPermissions();
  if (receive !== 'granted') {
    console.warn('Push notification permission denied');
    return;
  }

  // Get the FCM token directly
  const { token } = await FirebaseMessaging.getToken();
  console.log('FCM Token:', token);
  // TODO: Send token to your backend to store it

  // Notification received while app is in foreground
  FirebaseMessaging.addListener('notificationReceived', (event) => {
    console.log('Notification received:', event);
  });

  // User tapped a notification
  FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
    console.log('Notification tapped:', event);
  });
}
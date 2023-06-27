import { PushNotifications } from '@capacitor/push-notifications';

export const initPushNotifications = async () => {
  // Register with Apple / Google to receive push via APNS/FCM
  await PushNotifications.register();

  // On success, we should be able to receive notifications
  PushNotifications.addListener('registration', (token) => {
    localStorage.setItem('pushToken', token.value);
  });

  // Some issue with our setup and push will not work
  PushNotifications.addListener('registrationError', (error) => {
    alert('Error on registration: ' + JSON.stringify(error));
  });

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener(
    'pushNotificationReceived',
    (notification) => {
      alert('Push received: ' + JSON.stringify(notification));
    }
  );

  // Method called when tapping on a notification
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    alert('Push action performed: ' + JSON.stringify(notification));
  });
}

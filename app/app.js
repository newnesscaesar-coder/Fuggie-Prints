const whatsappNumber = '256788962748';
const notificationStorageKey = 'fuggie-notification-times';

document.querySelector('#order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const message = `Hello Fuggie Prints, I would like to make an order.%0A%0AName: ${encodeURIComponent(values.get('name'))}%0AService: ${encodeURIComponent(values.get('service'))}%0ADetails: ${encodeURIComponent(values.get('details'))}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener');
});

let deferredInstall;
const installButton = document.querySelector('#install-app');
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstall = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = undefined;
  installButton.hidden = true;
});

const status = document.querySelector('#notification-status');
const timeInputs = [document.querySelector('#morning-time'), document.querySelector('#evening-time')];
const scheduleNotifications = () => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  timeInputs.forEach((input) => {
    const [hours, minutes] = input.value.split(':').map(Number);
    const now = new Date();
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const scheduleNext = () => {
      new Notification('Fuggie Prints', { body: 'Ready to bring your next idea to life? Contact us for a quick quote.', icon: '../images/fuggie-prints-logo.png' });
      setTimeout(scheduleNext, 24 * 60 * 60 * 1000);
    };
    setTimeout(scheduleNext, next - now);
  });
};
document.querySelector('#enable-notifications').addEventListener('click', async () => {
  if (!('Notification' in window)) { status.textContent = 'This browser does not support notifications.'; return; }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') { status.textContent = 'Notifications were not enabled. You can allow them later in browser settings.'; return; }
  localStorage.setItem(notificationStorageKey, JSON.stringify(timeInputs.map((input) => input.value)));
  scheduleNotifications();
  status.textContent = 'Two daily reminders are enabled for this device while the app is active.';
});
const savedTimes = JSON.parse(localStorage.getItem(notificationStorageKey) || 'null');
if (savedTimes?.length === 2) {
  timeInputs.forEach((input, index) => { input.value = savedTimes[index]; });
  if ('Notification' in window && Notification.permission === 'granted') {
    scheduleNotifications();
    status.textContent = 'Your two daily reminders are ready on this device while the app is active.';
  }
}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');

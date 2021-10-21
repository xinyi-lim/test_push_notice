'use strict';
// if(!window.top.aspkey){
// 	throw new Error('missing a public key');
// }
// const applicationServerPublicKey = window.top.aspkey;

let isSubscribed = false;
let swRegistration = null;

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
    //mysw.js has the push method and payload, mysw.js also has the eventhandler fr when the notification is clicked
    navigator.serviceWorker.register('mysw.js') //this MUST be in the same directory as index.php
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);
      swRegistration = swReg;
      askPermission();  
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
    
function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    } else {
      console.log("permission granted.");
      initialiseUI();
    }
  });
}

function initialiseUI() {
    $(".pushtoglbtn").click(function() {
      $(this).disabled = true;
      if (isSubscribed) {
          console.log("unsub");
        // unsubscribeUser();
      } else {
        console.log("sub");
        subscribeUser();
      }
    });
  // Set the initial subscription value
    // swRegistration.pushManager.getSubscription()
    // .then(function(subscription) {
    //   isSubscribed = !(subscription === null);
  
    //   if (isSubscribed) {
    //     console.log('User IS subscribed.');
    //   } else {
    //     console.log('User is NOT subscribed.');
    //   }
  
    //   // updateBtn();
    // });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function subscribeUser() {
    // const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    })
    .then(function(subscription) {
      console.log('User is subscribed.');
  
      updateSubscriptionOnServer(subscription);
  
      isSubscribed = true;
  
      updateBtn();
    })
    // .catch(function(err) {
    //   console.log('Failed to subscribe the user: ', err);
    //   updateBtn();
    // });
  }
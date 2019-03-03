/*
 * Entry point for the companion app
 */
import * as messaging from "messaging";
console.log("Companion code started");

// Fetch
function queryZeroHeart() {
  fetch("https://ipams.xyz?latitude=34.1404426&longitude=-118.1234878", {
    method: "POST",
    header: {
      
    }
  })
  .then(function (response) {
    console.log("Request sent!");
    console.log(response.status);
  })
  .catch(function (err) {
    console.log("Error fetching url: " + err);
  });
}


// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    queryZeroHeart();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
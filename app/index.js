import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { geolocation } from "geolocation";
import { BodyPresenceSensor } from "body-presence";
import * as messaging from "messaging";

// Get location
// var watchID = geolocation.watchPosition(locationSuccess, locationError);

const heartRateLabel = document.getElementById("heartRateLabel");
heartRateLabel.text = `---`;

function locationSuccess(position) {
  // heartRateLabel.text = `HelloWorld`;
    console.log("Latitude: " + position.coords.latitude,
                "Longitude: " + position.coords.longitude);
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

/***************/
// Get Heart Rate
let heartRateNum = 0;
let opened = false;
let msgready = false;

let hrm = new HeartRateSensor();
hrm.onreading = function() {
  console.log("Current heart rate: " + hrm.heartRate);
  heartRateNum = hrm.heartRate;
  //if(msgready == true){
    opened = true;
    heartRateLabel.text = `${hrm.heartRate}`;
  //}
  
  if((heartRateNum > 260 || heartRateNum < 40) && opened == true){
    console.log("OK");
    // hrm.stop();
    heartRateZeroRequest(-118.1234878, 34.1404426);
  }
}

let body = new BodyPresenceSensor();
body.onreading = () => {
  if (!body.present) {
    if(opened == true)
      heartRateLabel.text = `0`;
    heartRateNum = 0;
    hrm.stop();
    // send message
    if(opened == true && heartRateNum == 0){
      console.log("OK");
      heartRateZeroRequest(-118.1234878, 34.1404426);
    }
  } else {
     hrm.start();
  }
};
body.start();

/***************/
// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myLabel.text = `${hours}:${mins}`;
}

/***************/
// http requests
function heartRateZeroRequest(longitude, latitude) {
  sendMessage(longitude, latitude);
}

// get hashcode longitude and latitude https://www.mapdevelopers.com/geocode_tool.php
messaging.peerSocket.onopen = () => {
  // msgready = true;
  console.log("Ready");
  // heartRateZeroRequest(-118.1234878, 34.1404426);
  heartRateLabel.style.fill = 'white';
  // setTimeout(function(){heartRateLabel.style.fill = 'white';}, 500);
}

messaging.peerSocket.onerror = (err) => {
  console.log(`Connection error: ${err.code} - ${err.message}`);
}

messaging.peerSocket.onmessage = (evt) => {
  console.log(JSON.stringify(evt.data));
}

function sendMessage(longitude, latitude) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send({});
    // sendMessageUI();
  }
}

function sendMessageUI() {
  heartRateLabel.style.fill = '#F94545';
  setTimeout(function(){heartRateLabel.style.fill = 'white';}, 500);
  setTimeout(function(){heartRateLabel.style.fill = '#F94545';}, 1000);
  setTimeout(function(){heartRateLabel.style.fill = 'white';}, 1500);
  setTimeout(function(){heartRateLabel.style.fill = '#F94545';}, 2000);
  setTimeout(function(){heartRateLabel.style.fill = 'white';}, 2500);
}
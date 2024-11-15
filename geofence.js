import Geolocation from "react-native-geolocation-service"
console.log("hello")
Geolocation.getCurrentPosition(
  position => {
    
    console.log(position);
  },
  error => {
    Alert.alert(`Code ${error.code}`, error.message);
    setLocation(null);
    console.log(error);
  },
  {
    accuracy: {
      android: 'high',
      ios: 'best',
    },
    enableHighAccuracy: highAccuracy,
    timeout: 15000,
    maximumAge: 10000,
    distanceFilter: 0,
    forceRequestLocation: forceLocation,
    forceLocationManager: useLocationManager,
    showLocationDialog: locationDialog,
  },
);

import { postRequest } from '../helpers/Fetch.js';

//APIS used by more than one view. Makes easier to call. 
export async function updateLocationPosition(locationid, token, latitude, longitude) {
    let result = await postRequest(
        {
        token: token, 
        locationid: locationid, 
        latitude: latitude,
        longitude: longitude
        }, "updateHuntLocationPosition.php");
    if (result.status === "okay"){
        return true;
    }
    return false;

}

export async function getLocations(token, huntID){
    let result = await postRequest({token: token, huntid: huntID}, "getHuntLocations.php");
    if (result.status === "okay"){
        return result.locations;
    }
    else{
        return null;
    }
}


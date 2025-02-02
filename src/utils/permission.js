import {
    showError
} from "@/utils/alertutils";

let permission = JSON.parse(window.localStorage.getItem("permission"))
let permissionCheck = false

export const checkPermission = (permissionMeta) => {
    if (Object.keys(permissionMeta).length) {
        for (let category in permission) {
            if (permissionMeta.hasOwnProperty(category)) {
                for (let permissionItem in permission[category]) {
                    if (permissionMeta[category].includes(permission[category][permissionItem])) {
                        permissionCheck = true // if user permission, then change status and stop loop
                        break;
                    } else {
                        permissionCheck = false // Not yet confirmed, check the next item
                    }
                }
                if (permissionCheck) { // Stop loop when user has permission
                    break;
                }
            } else {
                permissionCheck = false // if this category not match permission, check the next item
            }
        }
    } else {
        permissionCheck = true
    }

    return permissionCheck;
}

export const check = (func, ac) => {
    if (Object.keys(permission).length) {
        if (permission.hasOwnProperty(func)) {
            if (permission[func].includes(ac)) {
                return true;
            }
        }
    }
    return false;
}
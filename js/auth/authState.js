import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth } from "../../firebase/config.js";

export function observeAuth(callback) {

    return onAuthStateChanged(auth, user => {

        callback(user);

    });

}
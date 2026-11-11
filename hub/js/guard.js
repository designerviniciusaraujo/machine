import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"


import {
    auth
} from "../../firebase/config.js"



onAuthStateChanged(auth, (user)=>{


    if(!user){

        window.location.href =  "/auth/"
        console.log(  "Usuário Negado:" )
        return

    }


    console.log(
        "Usuário logado:",
        user.email
    )


})
const currentUser = {
    name: "SysOps Teste",
    username: "sysops",
    role: "sysops",
    status: "active"
};

// const currentUser = {

//     name: "Boruto",
//     username: "Otako",
//     role: "user",
//     status: "active"

// };


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"


import {
    auth,
    db
} from "../../firebase/config.js"



const userName =
document.getElementById("userName")

const userEmail =
document.getElementById("userEmail")

const userRole =
document.getElementById("userRole")


const logoutBtn =
document.getElementById("logoutBtn")



onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.href="/auth/index.html"

        return
    }



    const ref =
    doc(db,"users",user.uid)



    const snap =
    await getDoc(ref)



    if(snap.exists()){


        const data =
        snap.data()


        userName.textContent =
        data.name || user.displayName


        userEmail.textContent =
        data.email


        userRole.textContent =
        data.role.toUpperCase()


    }


})




logoutBtn.addEventListener(
"click",
async()=>{


    await signOut(auth)


    window.location.href =
    "/auth/index.html"


})
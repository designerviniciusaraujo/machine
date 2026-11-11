function loadMenu(){

const role = currentUser.role;

console.log(currentUser)
console.log(currentUser.name)

const items = menu[role] || menu.user;

const sidebar = document.querySelector("#omda-menu");
const userName = document.querySelector("#omdaUserName");
const omdaUserRole = document.querySelector("#omdaUserRole");
 
userName.innerHTML=currentUser.name
omdaUserRole.innerHTML=role
sidebar.innerHTML = items.map(item=>`

 
<a href="#" data-role="all" class="sidebar-item flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition">
<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="home" aria-hidden="true" class="lucide lucide-home"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span>
<span class="sidebar-text">${item}</span>
</a>
`).join("");


lucide.createIcons();

}


document.addEventListener("DOMContentLoaded", loadMenu);
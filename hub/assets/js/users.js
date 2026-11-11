
 import { addUser, getUsers } from "../../services/userServices.js";
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const userForm = document.getElementById("userForm");

 if (avatarInput) {
avatarInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    avatarPreview.src = URL.createObjectURL(file);
    

});

 
userForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = {
        username: document.getElementById("username").value.trim(),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,

        role: document.getElementById("role").value,
        status: document.getElementById("status").value,

        bio: document.getElementById("bio").value.trim(),

        avatar: avatarInput.files[0] || null
    };

    if (!formData.username) {
        alert("Informe o username");
        return;
    }

    if (!formData.name) {
        alert("Informe o nome");
        return;
    }

    if (!formData.email) {
        alert("Informe o email");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem");
        return;
    }

    if (formData.password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres");
        return;
    }

    console.log(formData);

   const userData = {
    username: formData.username,
    usernameLower: formData.username.toLowerCase(),

    name: formData.name,

    email: formData.email,
    emailLower: formData.email.toLowerCase(),

    role: formData.role,
    status: formData.status,

    bio: formData.bio,

    avatar: avatarPreview.src
};

console.table(userData);
const preview = document.getElementById("userPreview");

preview.classList.remove("hidden");

preview.innerHTML = `
<div class="flex items-center gap-4">

    <img
        src="${userData.avatar}"
        class="w-16 h-16 rounded-2xl object-cover">

    <div>
        <h3 class="font-semibold">
            ${userData.username}
        </h3>

        <p class="text-zinc-500">
            ${userData.email}
        </p>
    </div>

</div>

<div class="mt-4 grid md:grid-cols-2 gap-4">

    <div>
        <strong>Nome:</strong>
        ${userData.name}
    </div>

    <div>
        <strong>Permissão:</strong>
        ${userData.role}
    </div>

    <div>
        <strong>Status:</strong>
        ${userData.status}
    </div>

    <div>
        <strong>Bio:</strong>
        ${userData.bio || "-"}
    </div>

</div>
`;
const userId = await addUser(userData);

console.log("Usuário criado:", userId);

alert("Usuário criado com sucesso!");
});

 }
// GET USERS
// console.table(await getUsers());

async function loadUsers() {

    const users = await getUsers();

    console.table(users);
    renderUsers(users);
}

loadUsers();

function renderUsers(users) {

    const usersList =
        document.getElementById("usersList");

    usersList.innerHTML = "";

    users.forEach(user => {

        usersList.innerHTML += `

        <div class="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-2xl bg-black/5 border border-white/10">

            <div class="flex items-center gap-4 flex-1">

                <div class="w-14 h-14 rounded-2xl bg-[#5864be] text-white font-bold flex items-center justify-center">

                    ${user.username?.charAt(0).toUpperCase() || "U"}

                </div>

                <div>

                    <h3 class="font-semibold">
                        ${user.username}
                    </h3>

                    <p class="text-sm text-zinc-500">
                        ${user.email}
                    </p>

                </div>

            </div>

            <div>

                <span class="text-xs text-zinc-500">
                    Permissão
                </span>

                <p>
                    ${user.role}
                </p>

            </div>

            <div>

                <span class="text-xs text-zinc-500">
                    Status
                </span>

                <p>
                    ${user.status}
                </p>

            </div>

            <div>

                <span class="text-xs text-zinc-500">
                    Cadastro
                </span>

                <p>
                    --
                </p>

            </div>

            <div class="flex gap-2">

                <button
                    data-id="${user.id}"
                    class="h-10 px-4 rounded-xl bg-white/5 border border-white/10">

                    Editar

                </button>

                <button
                    data-id="${user.id}"
                    class="h-10 px-4 rounded-xl bg-red-500/10 text-red-400">

                    Banir

                </button>

            </div>

        </div>

        `;

    });

}
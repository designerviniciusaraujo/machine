  
import {
    initSession,
    logout
} from "../../services/sessionService.js";


function updateAuthUI(user) {

    // Elementos para usuários logados
    document
        .querySelectorAll('[data-auth="logged"]')
        .forEach(element => {

            element.classList.toggle(
                "hidden",
                !user
            );

            element.classList.toggle(
                "flex",
                !!user
            );

        });


    // Elementos para usuários não logados
    document
        .querySelectorAll('[data-auth="guest"]')
        .forEach(element => {

            element.classList.toggle(
                "hidden",
                !!user
            );

        });


    // Botões de logout
    document
        .querySelectorAll('[data-action="logout"]')
        .forEach(button => {

            button.onclick = logout;

        });

}


export function initAuthUI() {

    initSession(user => {

        updateAuthUI(user);

    });

}
 

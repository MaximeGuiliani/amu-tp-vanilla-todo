import {
  loadTodoItemsFromApi,
  saveTodoItemToApi,
  toggleComplete,
} from "./api.js";
import { onClickLink } from "./routing";

import { loadTodoItemFromApi } from "./api.js";

/**
 * Permet d'ajouter visuellement une tâche dans l'interface
 * @param {{id: number, text: string, done: boolean}} item
 */
const addTodo = (item) => {
  const container = document.querySelector("ul");
  container.insertAdjacentHTML(
    "beforeend",
    `
          <li>
              <label>
                  <input type="checkbox" id="todo-${item.id}" ${
      item.done ? "checked" : ""
    } /> 
                  ${item.text}
              </label>
             <a id="goto-${item.id}" href="/${item.id}/details">Détails</a>
          </li>
      `
  );
  document
    .querySelector("input#todo-" + item.id)
    .addEventListener("click", onClickCheckbox);

  document
    .querySelector("a#goto-" + item.id)
    .addEventListener("click", onClickLink);
};

/**
 * Permet d'ajouter visuellement la liste des tâches dans l'interface
 */
export const displayTodoList = () => {
  document.querySelector("main").innerHTML = `
          <h2>La liste des tâches</h2>
          <ul></ul>
          <form>
            <input type="text" name="todo-text" placeholder="Ajouter une tâche" />
            <button>Ajouter</button>
          </form>
        `;

  loadTodoItemsFromApi().then((items) => {
    items.forEach((item) => addTodo(item));
  });

  document.querySelector("form").addEventListener("submit", onSubmitForm);
};

/**
 * Gestion du formulaire d'ajout d'une tâche
 * @param {Event} e
 */
const onSubmitForm = (e) => {
  e.preventDefault();

  const input = document.querySelector('input[name="todo-text"]');

  const item = {
    text: input.value,
    done: false,
  };

  saveTodoItemToApi(item).then((items) => {
    addTodo(items[0]);

    input.value = "";
    input.focus();
  });
};

/**
 * Gestion du click sur une Checkbox
 * @param {MouseEvent} e
 */
const onClickCheckbox = (e) => {
  const inputId = e.target.id;

  const id = +inputId.split("-").pop();

  const isDone = e.target.checked;

  e.preventDefault();

  toggleComplete(id, isDone).then(() => {
    e.target.checked = isDone;
  });
};


/**
 * Affiche dans l'interface le détails d'une tâche
 * @param {number} id 
 */
export const displayTodoDetails = (id) => {
    // On appelle l'API afin de récupérer une tâche
    loadTodoItemFromApi(id).then((item) => {
        // On injecte du HTML dans le <main> 
        // (supprimant donc ce qu'il contient à ce stade)
        document.querySelector("main").innerHTML = `
                <h2>Détails de la tâche ${item.id}</h2>
                <p><strong>Texte :</strong> ${item.text}</p>
                <p><strong>Status : </strong> ${item.done ? "Complété" : "A faire"}</p>
                <a id="back" href="/">Retour à la liste</a>
            `;
        
        // On n'oublie pas que le lien doit être géré par le routeur
        document.querySelector('a#back')
            .addEventListener('click', onClickLink);
    });
};
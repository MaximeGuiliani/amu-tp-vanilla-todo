import { loadTodoItemsFromApi, saveTodoItemToApi } from "../src/api";
import { displayTodoList } from "../src/ui";
import { tick } from "./utils";


jest.mock("../src/api");


it("displays todo items from API", async () => {

    document.body.innerHTML = `
        <main></main>
      `;

    loadTodoItemsFromApi.mockResolvedValue([
        { id: 1, text: "MOCK_TODO", done: false },
        { id: 2, text: "MOCK_TODO_2", done: true },
    ]);

    displayTodoList();

    await tick();

    expect(document.querySelector("main ul")).not.toBeNull();
    expect(document.querySelectorAll("ul li").length).toBe(2);
    expect(document.querySelector("ul li").textContent).toContain("MOCK_TODO");
    expect(document.querySelector("ul li:nth-child(2)").textContent).toContain("MOCK_TODO_2");
});

it("should add a todo item", async () => {
    loadTodoItemsFromApi.mockResolvedValue([]);
    saveTodoItemToApi.mockResolvedValue([
        { id: 1, text: "MOCK_TASK", done: false },
    ]);

    document.body.innerHTML = `
        <main></main>
      `;

    displayTodoList();

    document.querySelector('input[type=text]').value = "MOCK_TASK";
    document.querySelector('form').submit();
    await tick();
    expect(document.querySelectorAll('ul li').length).toBe(1);

});



const NAME = 'To Do List';
const EMPTY = 'You have not yet completed the To Do List';

let idCounter = 0;
let listItems = [];
let check = [];

document.addEventListener("DOMContentLoaded", (event) =>{
    initApp();
});

function initView() {
    const header = document.createElement('header');
    header.classList.add('header');
    document.body.append(header);

    const headerTitle = document.createElement('p');
    headerTitle.classList.add('header__title');
    headerTitle.innerText = NAME;
    header.append(headerTitle);

    const rootDiv = document.createElement('div');
    rootDiv.setAttribute('id', 'root');
    rootDiv.classList.add('root');
    document.body.append(rootDiv);

    const blockInput = document.createElement('div');
    blockInput.classList.add('list__block');
    rootDiv.append(blockInput);

    const inputList = document.createElement('input');
    inputList.setAttribute('type', 'text');
    inputList.setAttribute('id', 'input_new_item');
    inputList.classList.add('input__control');
    blockInput.append(inputList);

    const buttonAdd = document.createElement('input');
    buttonAdd.classList.add('button', 'button__add', 'right__block');
    buttonAdd.setAttribute('value', 'Add');
    buttonAdd.setAttribute('type', 'button');
    buttonAdd.addEventListener("click", addItem);
    blockInput.append(buttonAdd);

    initButton();

    listItems.forEach((item) => {
        const {id} = item;
        const itemBlock = document.createElement('div');
        itemBlock.setAttribute('id',  `${id}_block`);
        itemBlock.classList.add('list__block','list__item');
        rootDiv.append(itemBlock);
        addBlock(itemBlock, item);
    });
}

function addBlock(itemBlock, {title, id}) {
    const itemTitle = document.createElement('p');
    itemTitle.classList.add('list__title');
    itemTitle.innerText = title;
    itemBlock.append(itemTitle);

    const buttonGroup1 = document.createElement('div');
    buttonGroup1.classList.add('right__block');
    itemBlock.append(buttonGroup1);

    const buttonRedact = document.createElement('input');
    buttonRedact.classList.add('button', 'button__redact');
    buttonRedact.setAttribute('value', 'Redact');
    buttonRedact.setAttribute('type', 'button');
    buttonRedact.addEventListener( "click", () => {
        redactItem(id, title);
    });
    buttonGroup1.append(buttonRedact);

    const buttonGroup2 = document.createElement('div');
    buttonGroup2.classList.add('left__block');
    itemBlock.append(buttonGroup2);

    const buttonDelete = document.createElement('input');
    buttonDelete.classList.add('button', 'flag__delete',);
    buttonDelete.setAttribute('type', 'checkbox');

    buttonDelete.addEventListener( "click",() => {
        if (check.indexOf(id)!= -1) {
            check.pop();
        }else{
            check.push(id);
        }
    });

    buttonGroup2.append(buttonDelete);

    if(listItems.length === 1) {
        removeNoBlocks();
    }
}

function initButton(){

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('nothing');
    document.body.append(buttonDiv);

    const buttonDelete = document.createElement('input');
    buttonDelete.classList.add('button','button__delete', 'center__block');
    buttonDelete.setAttribute('value', 'Delete');
    buttonDelete.setAttribute('type', 'button');
    buttonDiv.append(buttonDelete);

    buttonDelete.addEventListener( "click",() => {
        for(let i = 0; i < check.length;i++)  {
            let id = check[i];
            deleteItem(id);
        }
        check = [];
    });
}

function initApp() {
    memorization();
    initView();

    if(!listItems.length) {
        noBlock();
    }
}

function addItem() {
    const inputList = document.getElementById('input_new_item');

    if(isEmpty(inputList)) {
        return;
    }

    const title = inputList.value;
    inputList.value = '';

    const newItem = {
        id: idCounter,
        title
    };

    listItems.push(newItem);
    idCounter++;
    update();

    const rootDiv = document.getElementById('root');

    const itemBlock = document.createElement('div');
    itemBlock.setAttribute('id',  `${newItem.id}_block`);
    itemBlock.classList.add('list__block','list__item');
    rootDiv.append(itemBlock);

    addBlock(itemBlock, newItem);
}

function redactItem(id, title) {
    const itemBlock = document.getElementById(`${id}_block`);
    clearBlock(itemBlock);

    const inputList = document.createElement('input');
    inputList.setAttribute('type', 'text');
    inputList.setAttribute('id', `${id}_input`);
    inputList.classList.add('input__control',);
    inputList.value = title;
    itemBlock.append(inputList);

    const buttonUpdate = document.createElement('input');
    buttonUpdate.classList.add('button', 'button__save', 'right__block');
    buttonUpdate.setAttribute('value', 'Save');
    buttonUpdate.setAttribute('type', 'button');
    buttonUpdate.addEventListener( "click",() => {
        save(id)
    });
    itemBlock.append(buttonUpdate);
}

function save(id) {
    const inputList = document.getElementById(`${id}_input`);

    if(isEmpty(inputList)) {
        return;
    }

    const title = inputList.value;
    const updatedItem = {
        id,
        title
    };

    listItems = listItems.map((item) => {
        if(item.id === id) {
            return updatedItem;
        }
        return item;
    });
    update();

    const itemBlock = document.getElementById(`${id}_block`);
    clearBlock(itemBlock);
    addBlock(itemBlock, updatedItem);
}

function deleteItem(id) {
    const itemBlock = document.getElementById(`${id}_block`);
    itemBlock.remove();

    listItems = listItems.filter((item) => {
        return item.id !== id;
    });
    update();

    if(listItems.length === 0) {
        noBlock();
    }
}

function isEmpty(input) {
    return !input.value.length;
}

function clearBlock(block) {
    const elements = block.childNodes;

    for(let i = elements.length - 1; i >= 0; i--) {
        elements[i].remove();
    }
}

function update() {
    localStorage.setItem('list', JSON.stringify(listItems));
}

function memorization() {
    const savedItems = localStorage.getItem('list');
    if(savedItems !== null) {
        listItems = JSON.parse(savedItems);

        if(!!listItems.length) {
            const {id} = listItems[listItems.length - 1];
            idCounter = id + 1;
        }
    }
}

function noBlock() {
    const rootDiv = document.getElementById('root');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('noBlock');
    messageDiv.setAttribute('id', 'noBlock');
    rootDiv.append(messageDiv);

    const message = document.createElement('p');
    message.innerText = EMPTY;
    messageDiv.append(message);
}

function removeNoBlocks() {
    const messageDiv = document.getElementById('noBlock');
    if(messageDiv) {
        messageDiv.remove();
    }
}

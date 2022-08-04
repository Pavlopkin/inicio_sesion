const socket = io.connect();

const render = (messages) => {
    const html = messages.map((element) =>{
        return(`
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>fotografía</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${element.title}</td>
                    <td class="ctr"> ${element.price}</td>
                    <td class="ctr"><img src="${element.thumbnail}"></td>
                </tr>
                </tbody>
        `)
    }).join(' ');
    document.getElementById('messages').innerHTML = html
}

const addMessage = () => {
    const message = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('new-message', message)
    return false
}

socket.on('messages', (messages) => {
    console.log(messages)
    render(messages)
})

const renderChat = (chat) => {
    const html = chat.map((element) =>{
        return(`
            <div class="msg">
                <strong>${element.author.id}</strong>
                <p style="color:Brown"> ${element.author.time}</p>
                <em>${element.text}</em>
            </div>
        `)
    }).join(' ');
    document.getElementById('chats').innerHTML = html
}

const addChat = () => {
    const chat = {
            author: {
                id: document.getElementById('id').value,
                name: document.getElementById('name').value,
                lastname: document.getElementById('lastname').value,
                age: document.getElementById('age').value,
                alias: document.getElementById('alias').value,
                avatar: document.getElementById('avatar').value,
                time: new Date().toLocaleTimeString(),
                },  
                text: document.getElementById('text').value,  
            }   
   

    socket.emit('new-chat', chat)
    return false
}
socket.on('chats', (chats) => {
    renderChat(chats)
})

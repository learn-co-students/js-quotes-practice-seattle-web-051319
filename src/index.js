// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", () => {
  const newQuoteForm = document.getElementById('new-quote-form')
  const h1 = document.querySelector('h1')
  const div = document.createElement('div')

  div.appendChild(addSortButton())
  h1.appendChild(div)
  fetchAllQuotes()
  fetchAllLikes()

  newQuoteForm.addEventListener('submit', () => {
    event.preventDefault()
    addNewQuote(newQuoteForm)
    newQuoteForm.reset()
  })
})

function fetchAllQuotes() {
  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(json => {
    for (let quote of json)
    createQuote(quote)
  })
}

function fetchSortedQuotes() {
  fetch('http://localhost:3000/quotes?_sort=author')
  .then(res => res.json())
  .then(json => {
    for (let quote of json) {
      createQuote(quote)
    }
  })
}

function fetchAllLikes() {
  return fetch('http://localhost:3000/likes')
  .then(res => res.json())
  .then(json => {
    for (let like of json) {
      findLike(like)
    }
  })
}

function createQuote(quoteObject) {
  const quoteList = document.getElementById('quote-list')
  const li = document.createElement('li')
  const blockquote = document.createElement('blockquote')
  const p = document.createElement('p')
  const footer = document.createElement('footer')
  const br = document.createElement('br')
  const button1 = document.createElement('button')
  const span = document.createElement('span')
  const button2 = document.createElement('button')
  const button3 = document.createElement('button')
  const editForm = createEditForm(quoteObject)


  li.className = 'quote-card'
  blockquote.className = 'blockquote'
  p.className = 'mb-0'
  p.textContent = quoteObject.quote
  footer.className = 'blockquote-footer'
  footer.textContent = quoteObject.author
  footer.id = quoteObject.id
  button1.className = 'btn-success'
  button1.textContent = 'Likes: '
  //Need logic for if adding new quote
  span.textContent = 0
  button2.className = 'btn-secondary'
  button2.textContent = 'Edit'
  button3.className = 'btn-danger'
  button3.textContent = 'Delete'

  button1.addEventListener('click', () => {
    addLike(quoteObject)
    ++span.textContent
  })

  button2.addEventListener('click', () => {
    if (editForm.style.display === 'none') {
      editForm.style.display = 'block'
    }
    else {
      editForm.style.display = 'none'
    }
  })

  editForm.addEventListener('submit', () => {
    event.preventDefault()
    updateQuote(quoteObject)
    p.textContent = event.target[0].value
    footer.textContent = event.target[1].value
    editForm.style.display = 'none'
  })

  button3.addEventListener('click', () => {
    deleteQuote(quoteObject)
    quoteList.removeChild(li)
  })

  blockquote.appendChild(p)
  blockquote.appendChild(footer)
  blockquote.appendChild(br)
  blockquote.appendChild(button1)
  button1.appendChild(span)
  blockquote.appendChild(button2)
  blockquote.appendChild(button3)
  blockquote.appendChild(editForm)
  li.appendChild(blockquote)
  quoteList.appendChild(li)

}

function findLike(likeObject) {
  const footers = document.getElementsByTagName('footer')
  for (let footer of footers) {
    let span = footer.nextSibling.nextSibling.children[0]
    if (likeObject.quoteId === parseInt(footer.id)) {
      ++span.textContent
    }
  }

}

function addNewQuote(htmlElement) {
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    },
    body: JSON.stringify({
      quote: event.target[0].value,
      author: event.target[1].value
    })
  })
  .then(res => res.json())
  .then(json => createQuote(json))
}

function addLike(quote) {
  fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    },
    body: JSON.stringify({
      quoteId: quote.id,
      createdAt: Date.now()
    })
  })
  .then(res => res.json())
}

function deleteQuote(quote) {
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    }
  })
  .then(res => res.json())
}

function createEditForm(quote) {
  const form = document.createElement('form')
  const div1 = document.createElement('div')
  const label1 = document.createElement('label')
  const input1 = document.createElement('input')
  const div2 = document.createElement('div')
  const label2 = document.createElement('label')
  const input2 = document.createElement('input')
  const button = document.createElement('button')

  form.class = 'hidden-edit-form'
  form.style.display = 'none'

  div1.className = 'form-group'
  label1.htmlFor = 'edit-quote'
  label1.textContent = 'Edit Quote'
  input1.type = 'text'
  input1.className = 'form-control'
  input1.placeholder = quote.quote
  div2.className = 'form-group'
  label2.htmlFor = 'edit-author'
  label2.textContent = 'Edit Author'
  input2.type = 'text'
  input2.className = 'form-control'
  input2.placeholder = quote.author
  button.type = 'submit'
  button.className = 'btn btn-primary'
  button.textContent = 'Update'

  div1.appendChild(label1)
  div1.appendChild(input1)
  div2.appendChild(label2)
  div2.appendChild(input2)

  form.appendChild(div1)
  form.appendChild(div2)
  form.appendChild(button)

  return form
}

function updateQuote(object) {
  return fetch(`http://localhost:3000/quotes/${object.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    },
    body: JSON.stringify({
      quote: event.target[0].value,
      author: event.target[1].value
    })
  })
  .then(res => res.json())
}

function addSortButton() {
  const sort = document.createElement('button')

  sort.textContent = 'Sort Alphabetically: OFF'
  sort.className = 'btn btn-primary'

  sort.addEventListener('click', () => {
    sortAlphabetically(sort)
  })
  return sort
}

function sortAlphabetically(htmlElement) {
  const quoteList = document.getElementById('quote-list')
  if (htmlElement.textContent === 'Sort Alphabetically: OFF') {
    quoteList.textContent = ''
    htmlElement.textContent = 'Sort Alphabetically: ON'
    fetchSortedQuotes()
    fetchAllLikes()
  }
  else {
    htmlElement.textContent = 'Sort Alphabetically: OFF'
    quoteList.textContent = ''
    fetchAllQuotes()
    fetchAllLikes()
  }
}

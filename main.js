// setting variables
let tBody = document.querySelector('#crud tbody')
let addUser = document.querySelector('.add-user')
let popup = document.querySelector('.popup')
let form = document.querySelector('form')
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js'
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  get,
  child,
  update,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCAjgT4nnw9oeMNgByXwg4npNuvE_nUgy8',
  authDomain: 'crud-operation-59986.firebaseapp.com',
  databaseURL: 'https://crud-operation-59986-default-rtdb.firebaseio.com',
  projectId: 'crud-operation-59986',
  storageBucket: 'crud-operation-59986.appspot.com',
  messagingSenderId: '255826738904',
  appId: '1:255826738904:web:e0e2f4a8190ffa53bae1ad',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const usersRef = ref(db, 'users/')
const newUsersRef = push(usersRef)

// Write Data
function writeUserData(name, email, phone) {
  set(newUsersRef, {
    username: name,
    email: email,
    phone: phone,
  }).then(
    (onSuccessed) => {
      console.log('Writed')
    },
    (onRejected) => {
      console.log(onRejected)
    },
  )
}

// Read Data
onValue(ref(db, 'users/'), (snapshot) => {
  const users = snapshot.val()
  tBody.innerHTML = ''
  for (let user in users) {
    console.log(users[user])
    let tr = `
    <tr data-id=${user}>
    <td>${users[user].username}</td>
    <td>${users[user].phone}</td>
    <td>${users[user].email}</td>
    <td>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </td>
  </tr>
    `
    tBody.innerHTML += tr
  }
  let editBtns = document.querySelectorAll('.edit')
  editBtns.forEach((ele) => {
    ele.addEventListener('click', function () {
      popup.classList.add('active')
      console.log(ele.parentElement.parentElement.dataset.id)
      const dbRef = ref(db)
      get(child(dbRef, `users/${ele.parentElement.parentElement.dataset.id}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val())
            form.name.value = snapshot.val().username
            form.phone.value = snapshot.val().phone
            form.email.value = snapshot.val().email
          } else {
            console.log('No data available')
          }
        })
        .catch((error) => {
          console.error(error)
        })
      form.addEventListener('submit', function (e) {
        e.preventDefault()
        const data = {
          username: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
        }
        const updates = {}
        updates['users/' + ele.parentElement.parentElement.dataset.id] = data
        update(ref(db), updates)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Successfully Updated to ${form.name.value}`,
          showConfirmButton: false,
          timer: 1500,
        })
        setTimeout(() => {
          location.reload()
        }, 3000)
      })
    })
  })

  let deleteBtns = document.querySelectorAll('.delete')
  deleteBtns.forEach((ele) => {
    ele.addEventListener('click', function () {
      const updates = {}
      updates['users/' + ele.parentElement.parentElement.dataset.id] = null
      update(ref(db), updates)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `This User Was Deleted Successfully`,
        showConfirmButton: false,
        timer: 1500,
      })
    })
  })
})

// write dynamic data
addUser.addEventListener('click', function () {
  popup.classList.add('active')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    console.log(this.children[0].value)
    writeUserData(
      this.children[0].value,
      this.children[2].value,
      this.children[1].value,
    )

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `${form.children[0].value} Was Added Successfully`,
      showConfirmButton: false,
      timer: 1500,
    })
    setTimeout(() => {
      location.reload()
    }, 3000)
    this.children[0].value = ''
    this.children[2].value = ''
    this.children[1].value = ''
  })
})

window.addEventListener('click', function (e) {
  if (e.target === popup) {
    popup.classList.remove('active')
    form.reset()
  }
})
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    popup.classList.remove('active')
    form.reset()
  }
})

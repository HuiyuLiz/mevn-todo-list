<template>
  <div id="app">
    <div class="container mx-auto mt-20 md:w-1/2 w-full px-5">
      <h1 class="text-gray-600 mb-5 text-center text-3xl">
        MEVN TODO LIST
      </h1>
      <div class="flex mx-auto mb-10">
        <input
          v-model.trim="inputDescription"
          type="text"
          class="border rounded-l-lg bg-gray-100 w-full p-3 focus:outline-none"
          placeholder="Enter Todo"
          name="todo"
          @compositionstart="onCompositionstart"
          @compositionend="onCompositionend"
          @keyup.enter="addTodo"
        >
        <button
          class="bg-blue-400 text-white p-3 rounded-r-lg px-5 flex items-center focus:outline-none "
          @click="addTodo"
        >
          <span class="material-icons">
            add
          </span>
        </button>
      </div>
      <hr class="mb-5">
      <div
        v-if="message!==''"
        class="text-gray-600  my-3 text-center text-sm bg-gray-200 p-1 rounded ml-auto"
      >
        {{ message }}
      </div>
      <ul>
        <li
          v-for="(todo,index) of todos"
          :key="index"
          class="py-4 box-border px-4 flex mx-auto bg-gray-100 rounded-lg mb-3 justify-between items-center flex-grow-0"
        >
          <div class="text-gray-600 font-bold w-8/12">
            <input
              v-if="editingTodo===todo"
              v-model="editingDescription"
              type="text"
              class="w-full border-solid border-2 border-gray-600 rounded p-2"
              @compositionstart="onCompositionstart"
              @compositionend="onCompositionend"
              @keyup.enter="updateTodo(todo)"
            >
            <div v-else>
              {{ todo.description }}
            </div>
          </div>
          <div class="flex items-end">
            <div v-if="editingTodo!==todo">
              <span
                class="material-icons text-gray-400 hover:text-blue-600 cursor-pointer transition ease-in duration-100 mr-2"
                @click="editTodo(todo)"
              >
                create
              </span>
              <span
                class="material-icons text-pink-400 hover:text-pink-600 cursor-pointer transition ease-in duration-100"
                @click="deleteTodo(todo._id)"
              >
                delete
              </span>
            </div>
            <div v-else>
              <span
                class="material-icons text-gray-400 hover:text-blue-600 cursor-pointer transition ease-in duration-100 mr-2 "
                @click="unselect"
              >
                clear
              </span>
              <span
                class="material-icons text-blue-500 hover:text-blue-600 cursor-pointer transition ease-in duration-100"
                @click="updateTodo(todo)"
              >
                save
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      todos: [],
      inputDescription: '',
      editingDescription: '',
      editingTodo: null,
      isTyping: false,
      message: ''
    }
  },
  watch: {
    message (val) {
      if (val !== '') {
        setTimeout(() => {
          this.message = ''
        }, 3000)
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    onCompositionstart () {
      this.isTyping = true
    },
    onCompositionend () {
      this.isTyping = false
    },
    getData () {
      axios.get('/api/todos').then(result => {
        this.todos = result.data.todos
      }).catch(err => {
        this.message = err.response.data.message
        console.log(err)
      })
    },
    addTodo () {
      if (this.isTyping || this.inputDescription === '') return false
      axios.post('/api/todos', { description: this.inputDescription }).then(result => {
        this.todos = [...this.todos, result.data.todo]
        this.inputDescription = ''
      }).catch(err => {
        this.message = err.response.data.message
        console.log(err)
      })
    },
    editTodo (todo) {
      this.editingTodo = todo
      this.editingDescription = todo.description
    },
    updateTodo (todo) {
      if (this.isTyping) return false
      axios.put(`/api/todos/${todo._id}`, { description: this.editingDescription })
        .then(result => {
          const updateTodo = result.data.todo
          const updateIndex = this.todos.findIndex(todo => todo._id === updateTodo._id)
          this.todos[updateIndex] = updateTodo
        })
        .then(() => {
          this.unselect()
        })
        .catch(err => {
          this.message = err.response.data.message
          console.log(err)
        })
    },
    unselect () {
      this.editingTodo = null
      this.editingDescription = ''
    },
    deleteTodo (id) {
      axios.delete(`/api/todos/${id}`).then(result => {
        this.todos = this.todos.filter(todo => todo._id !== result.data.todo._id)
      }).catch(err => {
        this.message = err.response.data.message
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
</style>

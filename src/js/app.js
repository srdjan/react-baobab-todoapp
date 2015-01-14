//- app:     React-Baobab-ToDo-App
//- author:  @djidja8
//- version: v0.1
'use strict'
var React  = require('react')
var Baobab = require('baobab')

var nextId = 0
var data = new Baobab({ todos: [{id: (nextId++).toString(), done: false, archived: false, text: 'Buy milk'}]})
var todosCursor = data.select('todos')

var TodoList = React.createClass({
  mixins: [todosCursor.mixin],

  onAllToggled() {
    this.refs.toggleAll.checked = !this.refs.toggleAll.checked
    // this.cursor.apply(todos => todos.set('done', this.refs.toggleAll.checked))
    this.cursor.apply(todos => todos.map(t => t.done = this.refs.toggleAll.checked))

  },

  renderTodo(todo) {
    console.log(todo)
    return (
      <div className="view">
         <li key={todo.id} id="todo-list" className={todo.done && 'completed'}>
          <input className="toggle"
                 type="checkbox"
                 onChange={() => this.cursor.select(todo.id).set('done', !todo.done)}
                 done={todo.done}/>
          <label> {todo.text} </label>
          <button className="destroy" onClick={() => this.cursor.select(todo.id).set('archived', true)}/>
        </li>
      </div>
    )
  },

  render() {
    return (
        <section id="main">
          <input id="toggle-all" type="checkbox"
                                 checked={false}
                                 onChange={this.onAllToggled}
                                 ref="toggleAll"/>
          <ul id="todo-list">
            {this.cursor.get().filter(todo => !todo.archived).map(this.renderTodo)}
          </ul>
        </section>
    )
  }
})

var Main = React.createClass({
  mixins: [todosCursor.mixin],

  onAdded(event) {
    if (event.key === 'Enter') {
      var val = this.refs.text.getDOMNode().value.trim()
      if (val) {
        this.cursor.push({id: nextId++, done: false, archived: false, text: val})
        this.refs.text.getDOMNode().value = ''
      }
    }
  },
  clearCompleted() {
    this.cursor.get().filter(todo => todo.done).map(t => this.cursor.unshift(t))
  },

  render() {
    return (
      <div id="todoapp">
        <header id="header">
          <h1> Todos </h1>
          <input id="new-todo" type='text' placeholder='What needs to be done?'
                                           autoFocus={true}
                                           onKeyDown={this.onAdded}
                                           ref="text"/>
        </header>
        { <TodoList/> }
        <footer id="footer">
          <span id="todo-count">
            <strong> {this.cursor.get().filter(todo => !todo.done && !todo.archived).length} todos left </strong>
          </span>
          <ul id="filters">
            <li><a className="selected" href="#/"> All </a></li>
            <li><a href="#/active"> Active </a></li>
            <li><a href="#/completed"> Completed </a></li>
          </ul>
          <button id="clear-completed" onClick={this.clearCompleted}> Clear Completed </button>
          <div id="info">
            <p>Using <a href="https://facebook.github.io/react/" target="_blank">ReactJS</a>
               <span> and </span><a href="https://github.com/Yomguithereal/baobab" target="_blank">Baobab</a>
            </p>
            <p>Created by: <a href="http://twitter.com/djidja8/" target="_blank">djidja8</a> ---
               View on <a href="https://github.com/Srdjan/todo-baobab">Github</a>
            </p>
          </div>
        </footer>
      </div>
    )
  }
})

React.render(<Main/>, document.body)

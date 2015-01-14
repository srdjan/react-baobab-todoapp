//- app:     React-Baobab-ToDo-App
//- author:  @djidja8
//- version: v0.1 wip
'use strict'
var React  = require('react')
var Baobab = require('baobab')

var nextId = 0
var data = new Baobab({root: {todos: [{id: (nextId++).toString(), done: false, archived: false, text: 'Buy milk'}]}})
var todosCursor = data.select('root')

var TodoList = React.createClass({
  mixins: [data.mixin],
  cursors: {
    root: ['root'],
    todos: ['root', 'todos']
  },
  handleAllToggled() {
    this.refs.toggleAll.checked = !this.refs.toggleAll.checked
    var updated = this.cursors.todos.get().map(t => t = { id: t.id,
                                                          done: this.refs.toggleAll.checked,
                                                          archived: t.archived,
                                                          text: t.text
                                                        })
    this.cursors.root.edit({todos: updated})
  },

  renderTodo(todo) {
    return (
      <div className="view">
         <li key={todo.id} id="todo-list" className={todo.done && 'completed'}>
          <input className="toggle"
                 type="checkbox"
                 onChange={() => this.cursors.todos.select(todo.id).set('done', !todo.done)}
                 checked={todo.done}/>
          <label> {todo.text} </label>
          <button className="destroy"
                  onClick={() => this.cursors.todos.select(todo.id).edit({archived: true})}/>
        </li>
      </div>
    )
  },

  render() {
    return (
        <section id="main">
          <input id="toggle-all" type="checkbox" checked={false}
                                 onChange={this.handleAllToggled}
                                 ref="toggleAll"/>
          <ul id="todo-list">
            {this.cursors.todos.get().filter(t => !t.archived).map(this.renderTodo)}
          </ul>
        </section>
    )
  }
})

var Main = React.createClass({
  mixins: [data.mixin],
  cursors: {
    root: ['root'],
    todos: ['root', 'todos']
  },

  onAdded(event) {
    if (event.key === 'Enter') {
      var val = this.refs.text.getDOMNode().value.trim()
      if (val) {
        this.cursors.todos.push({id: nextId++, done: false, archived: false, text: val})
        this.refs.text.getDOMNode().value = ''
      }
    }
  },

  clearCompleted() {
    var pending = this.cursors.todos.get().filter(t => !t.done)
    this.cursors.root.edit({todos: pending})
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
            <strong>
            {this.cursors.todos.get().filter(todo => !todo.done && !todo.archived).length} todos left
            </strong>
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

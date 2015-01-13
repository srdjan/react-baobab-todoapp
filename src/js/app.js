//- app:     React-Baobab-ToDo-App
//- author:  @djidja8
//- version: v0.1
'use strict'
var React  = require('react')
var Baobab = require('baobab')

var nextId = 0
var data = new Baobab({ todos: [{id: nextId++, checked: false, archived: false, text: 'Buy milk'}]})
var todosCursor = data.select('todos')

//-- todo component
var Todo = React.createClass({
  mixins: [todosCursor.mixin],

  onToggled() {
    // this.props.todo.checked = !this.props.todo.checked
  },
  onDestroy() {
    // this.props.todo.edit({'archived': true})
  },
  render() {
    return (
      <div key={this.props.todo.text} className="view">
         <li id="todo-list" className={this.props.todo.checked && 'completed'}>
          <input className="toggle"
                 type="checkbox"
                 onChange={this.onToggled}
                 checked={this.props.todo.checked}/>
          <label> {this.props.todo.text} </label>
          <button className="destroy" onClick={this.onDestroy}/>
        </li>
      </div>
    )
  }
})

//-- todolist component
var TodoList = React.createClass({
  mixins: [todosCursor.mixin],

  onToggled() {
    this.refs.toggleAll.checked = !this.refs.toggleAll.checked
    this.cursor.get().forEach(i => i.update('checked', () => this.refs.toggleAll.checked))
  },

  renderTodo(todo) {
    console.log(todo)
    var todoCursor = todo.id ? todosCursor.select(todo.id.toString()) : {id: nextId++, checked: false, archived: false, text: '?'}
    console.log(todoCursor)
    return todo.archived ? '' : <Todo key={todo.id} todo={todoCursor}/>
  },

  render() {
    return (
        <section id="main">
          <input id="toggle-all" type="checkbox"
                                 checked={false}
                                 onChange={this.onToggled}
                                 ref="toggleAll"/>
          <ul id="todo-list">
            {this.cursor.get().map(this.renderTodo)}
          </ul>
        </section>
    )
  }
})

//-- main component
var Main = React.createClass({
  mixins: [todosCursor.mixin],

  onAdded(event) {
    if (event.key === 'Enter') {
      var val = this.refs.text.getDOMNode().value.trim()
      if (val) {
        this.cursor.push({id: nextId++, checked: false, archived: false, text: val})
        this.refs.text.getDOMNode().value = ''
      }
    }
  },
  clearCompleted() {
    this.cursor.get().edit(todos => todos.filter(i => !i.get('checked')))
  },
  itemsLeft() {
    // return this.cursor.get().count(i => !i.get('checked') && !i.get('archived'))
    return 100
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
            <strong> {this.itemsLeft()} todos left </strong>
          </span>
          <ul id="filters">
            <li><a className="selected" href="#/"> All </a></li>
            <li><a href="#/active"> Active </a></li>
            <li><a href="#/completed"> Completed </a></li>
          </ul>
          <button id="clear-completed" onClick={this.clearCompleted}> Clear Completed </button>
          <div id="info">
            <p>Using <a href="https://facebook.github.io/react/" target="_blank">ReactJS</a>
               <span> and </span><a href="https://github.com/Yomguithereal/baobab" target="_blank">Omnisicient</a>
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

//-- start
React.render(<Main/>, document.body)

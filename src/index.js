import React, { useState, useEffet } from "react";
import ReactDOM from "react-dom";
import uuid from "uuid";
import { List, Map } from "immutable";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";
import "./styles.scss";

const TodoItem = ({ item, editTodo, removeTodo }) => {
  const [newValue, setNewValue] = useState("");
  const date = new Date(item.getIn(["data", "timestamp"]));

  return (
    <div className="box">
      <span>{item.get("text")}</span>
      {" | "}
      <span>
        {date && `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
      </span>
      {" | "}
      <div>
        <div>
          <button
            className="button"
            onClick={() => editTodo(item.get("id"), newValue)}
          >
            Edit
          </button>
          <input
            name="edit-todo"
            className="input"
            placeholder="Edit todo"
            onChange={e => setNewValue(e.target.value)}
          />
        </div>
        <button className="button" onClick={() => removeTodo(item.get("id"))}>
          Remove
        </button>
      </div>
    </div>
  );
};

const Todo = ({ todos, addTodo, editTodo, removeTodo }) => {
  const handleSubmit = event => {
    const text = event.target.value;
    if (event.keyCode === 13 && text.length > 0) {
      addTodo(text);
      event.target.value = "";
    }
  };

  return (
    <section className="section">
      <div className="box field">
        <label className="label">Todo</label>
        <div className="control">
          <input
            type="text"
            className="input"
            placeholder="Add todo"
            onKeyDown={handleSubmit}
          />
        </div>
      </div>
      <ul>
        {todos.map(item => (
          <TodoItem
            key={item.get("id")}
            item={item}
            editTodo={editTodo}
            removeTodo={removeTodo}
          />
        ))}
      </ul>
    </section>
  );
};

const actions = {
  addTodo(text) {
    return {
      type: "ADD_TODO",
      payload: {
        id: uuid.v4(),
        text,
        data: {
          timestamp: new Date().getTime()
        }
      }
    };
  },
  editTodo(id, text) {
    return {
      type: "EDIT_TODO",
      payload: {
        id,
        text
      }
    };
  },
  removeTodo(id) {
    return {
      type: "REMOVE_TODO",
      payload: {
        id
      }
    };
  }
};

const mapStateToProps = state => {
  return {
    todos: state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTodo: text => dispatch(actions.addTodo(text)),
    editTodo: (id, text) => dispatch(actions.editTodo(id, text)),
    removeTodo: id => dispatch(actions.removeTodo(id))
  };
};

const reducer = function(todos = List(), action) {
  switch (action.type) {
    case "ADD_TODO":
      return todos.push(Map(action.payload));
    case "EDIT_TODO":
      const index = todos.findIndex(t => t.get("id") === action.payload.id);
      console.log("index of edited todo", index);
      return todos
        .setIn([index, "text"], action.payload.text)
        .setIn([index, "data", "timestamp"], new Date().getTime());
    case "REMOVE_TODO":
      return todos.filter(todo => todo.get("id") !== action.payload.id);
    default:
      return todos;
  }
};

const store = createStore(reducer);

const App = connect(mapStateToProps, mapDispatchToProps)(Todo);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

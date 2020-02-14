import React, { useState } from "react";
import ReactDOM from "react-dom";
import uuid from "uuid";
import { List, Map } from "immutable";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";
import cn from "classnames";
import "./styles.scss";

const TodoItem = ({ item, editTodo, removeTodo }) => {
  const [newValue, setNewValue] = useState("");
  const date = new Date(item.getIn(["data", "timestamp"]));

  return (
    <div className={cn("box", "columns")}>
      <div className="column">
        <span>{item.get("text")}</span>
        {" | "}
        <span>{date && `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</span>
        {" | "}
      </div>
      <div className="column">
        <div className="columns">
          <button
            type="button"
            className={cn("button", "column")}
            onClick={() => {
              editTodo(item.get("id"), newValue);
              setNewValue("");
            }}
          >
            Edit
          </button>
          <input
            name="edit-todo"
            className="input"
            placeholder="Edit todo"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
          />
        </div>
      </div>
      <div className="column">
        <button type="button" className="button" onClick={() => removeTodo(item.get("id"))}>
          Remove
        </button>
      </div>
    </div>
  );
};

export const Todo = ({ todos, addTodo, editTodo, removeTodo }) => {
  const handleSubmit = event => {
    const text = event.target.value;
    if (event.keyCode === 13 && text.length > 0) {
      addTodo(text);
      const el = event.target;
      el.value = "";
    }
  };

  return (
    <section className="section">
      <div className="box field">
        <label className="label" htmlFor="add-todo">
          Todo
          <div className="control">
            <input type="text" className="input" placeholder="Add todo" id="add-todo" onKeyDown={handleSubmit} />
          </div>
        </label>
      </div>
      <ul>
        {todos.map(item => (
          <TodoItem key={item.get("id")} item={item} editTodo={editTodo} removeTodo={removeTodo} />
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
          timestamp: new Date().getTime(),
        },
      },
    };
  },
  editTodo(id, text) {
    return {
      type: "EDIT_TODO",
      payload: {
        id,
        text,
      },
    };
  },
  removeTodo(id) {
    return {
      type: "REMOVE_TODO",
      payload: {
        id,
      },
    };
  },
};

const mapStateToProps = state => {
  return {
    todos: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTodo: (text: string) => dispatch(actions.addTodo(text)),
    editTodo: (id, text) => dispatch(actions.editTodo(id, text)),
    removeTodo: id => dispatch(actions.removeTodo(id)),
  };
};

type TodosListType = List<Map<any, any>>;

const reducer = function TodoReducer(todos: TodosListType = List(), action) {
  switch (action.type) {
    case "ADD_TODO": {
      return todos.push(Map(action.payload));
    }
    case "EDIT_TODO": {
      const index = todos.findIndex(t => t.get("id") === action.payload.id);
      return todos
        .setIn([index, "text"], action.payload.text)
        .setIn([index, "data", "timestamp"], new Date().getTime());
    }
    case "REMOVE_TODO": {
      return todos.filter(todo => todo.get("id") !== action.payload.id);
    }
    default: {
      return todos;
    }
  }
};

const store = createStore(reducer);

const App = connect(mapStateToProps, mapDispatchToProps)(Todo);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement,
);

import React from "react";
import ReactDOM from "react-dom";
import uuid from "uuid";
import { List, Map } from "immutable";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";
import "./styles.scss";

const Todo = ({ todos, handleNewTodo }) => {
  const handleSubmit = event => {
    const text = event.target.value;
    if (event.keyCode === 13 && text.length > 0) {
      handleNewTodo(text);
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
          <div key={item.get("id")} className="box">
            {item.get("text")}
          </div>
        ))}
      </ul>
    </section>
  );
};

const actions = {
  handleNewTodo(text) {
    return {
      type: "ADD_TODO",
      payload: {
        id: uuid.v4(),
        text
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
    handleNewTodo: text => dispatch(actions.handleNewTodo(text))
  };
};

const reducer = function(state = List(), action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.push(Map(action.payload));
    default:
      return state;
  }
};

const store = createStore(reducer);

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
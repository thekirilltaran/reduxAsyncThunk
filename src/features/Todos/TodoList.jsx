import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import {selectVisibleTodos, toggleTodo, removeTodo, loadTodos, todosSelectors} from './todos-slice';


export const TodoList = () => {
  const activeFilter = useSelector(state => state.filter)
  const todos = useSelector(todosSelectors.selectAll);
  const visibleTodos = selectVisibleTodos(todos, activeFilter);
  console.log(visibleTodos)
  const dispatch = useDispatch();
  const {error, loading} = useSelector(state => state.todos);

  useEffect(() => {
    const promise = dispatch(loadTodos());

    return () => {
      promise.abort();
    }
  }, [dispatch]);

  return (
    <ul>
      {error && <h2>{error}</h2>}
      {loading === 'loading' && <h2>Loading...</h2>}
      {loading === 'idle' && !error && visibleTodos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />{" "}
          {todo.title}{" "}
          <button onClick={() => dispatch(removeTodo(todo.id))}>delete</button>
        </li>
      ))}
    </ul>
  );
};

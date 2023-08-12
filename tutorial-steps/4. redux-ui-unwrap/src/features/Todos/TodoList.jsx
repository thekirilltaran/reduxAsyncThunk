import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {selectVisibleTodos, toggleTodo, removeTodo, loadTodos} from './todos-slice';


export const TodoList = () => {
  const activeFilter = useSelector(state => state.filter)
  const todos = useSelector(state => selectVisibleTodos(state, activeFilter));
  const dispatch = useDispatch();
  const {error, loading} = useSelector(state => state.todos);

  useEffect(() => {
    dispatch(loadTodos())
      .unwrap()
      .then(() => {
        toast('All Todos were fetch');
      })
      .catch(() => {
        toast('ERROR')
      });
  }, [dispatch]);

  return (
    <>
    <ToastContainer />
    <ul>
      {error && <h2>Error!</h2>}
      {loading === 'loading' && <h2>Loading...</h2>}
      {loading === 'idle' && !error && todos.map((todo) => (
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
    </>
  );
};

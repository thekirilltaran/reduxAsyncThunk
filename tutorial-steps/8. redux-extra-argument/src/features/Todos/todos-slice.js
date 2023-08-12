import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {resetToDefault} from '../Reset/reset-action';

export const loadTodos = createAsyncThunk(
  '@@todos/load-all',
  async (_, {
    rejectWithValue, extra: api
  }) => {
    try {
      return api.loadTodos();
    } catch(err) {
      return rejectWithValue('Failed to fetch all todos.')
    }
  },
  {
    condition: (_, {getState, extra}) => {
      const {loading} = getState().todos;

      if (loading === 'loading') {
        return false;
      }
    }
  }
);

export const createTodo = createAsyncThunk(
  '@@todos/create-todo',
  async (title, {extra: api}) => {
    return api.createTodo(title)
  }
);
export const toggleTodo = createAsyncThunk(
  '@@todos/toggle-todo',
  async (id, {getState, extra: api}) => {
    const todo = getState().todos.entities.find(item => item.id === id);

    return api.toggleTodo(id, {completed: !todo.completed});
  }
);
export const removeTodo = createAsyncThunk(
  '@@todos/remove-todo',
  async (id, {extra: api}) => {
    return api.removeTodo(id);
  }
);


const todoSlice = createSlice({
  name: '@@todos',
  initialState: {
    entities: [],
    loading: 'idle', // 'loading',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return []
      })
      .addCase(loadTodos.pending, (state, action) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(loadTodos.rejected, (state) => {
        state.loading = 'idle';
        state.error = 'Something went wrong!'
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.entities = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const updatedTodo = action.payload;

        const index = state.entities.findIndex(todo => todo.id === updatedTodo.id);
        state.entities[index] = updatedTodo;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.entities = state.entities.filter(todo => todo.id !== action.payload);
      })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.loading = 'idle';
        state.error = action.payload || action.error.message;
      })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state, action) => {
        state.loading = 'idle';
      })
  }
});

export const todoReducer = todoSlice.reducer;


export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case 'all': {
      return state.todos.entities;
    }
    case 'active': {
      return state.todos.entities.filter(todo => !todo.completed);
    }
    case 'completed': {
      return state.todos.entities.filter(todo => todo.completed);
    }
    default: {
      return state.todos;
    }
  }
}
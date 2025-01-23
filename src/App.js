import "./App.css";
import { Amplify, Auth, API } from "aws-amplify";
import config from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Flex,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Heading,
  View,
} from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
} from "./graphql/mutations";
import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AddTodoModal } from "./components/AddTodoModal";

Amplify.configure(config);

function App({ signOut }) {
  const [user, setUser] = useState({ id: "", name: "" });
  const [todos, setTodos] = useState([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((userInfo) => {
      setUser({ id: userInfo.attributes.sub, name: userInfo.username });
    });
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    const todosFromAPI = apiData.data.listTodos.items;
    setTodos(todosFromAPI);
  }

  function handleAddModal() {
    if (isOpenAddModal === false) {
      setIsOpenAddModal(true);
    } else if (isOpenAddModal === true) {
      setIsOpenAddModal(false);
    }
  }

  async function createTodo(event) {
    const data = {
      title: event.title,
      status: event.status,
      priority: event.priority,
      start: event.start,
      end: event.end,
      description: event.description,
      user: event.user,
    };
    await API.graphql({
      query: createTodoMutation,
      variables: { input: data },
    });
    fetchTodos();
  }

  async function deleteTodo({ id }) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    await API.graphql({
      query: deleteTodoMutation,
      variables: { input: { id } },
    });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <View className="App" margin="0 3rem">
        <View className="header">
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading level={1}>My Todo App</Heading>
            <Flex direction="row">
              <p>{user.name}</p>
              <Button onClick={signOut}>Sign Out</Button>
            </Flex>
          </Flex>
        </View>
        <View className="add-todo-button" margin="1rem 1rem">
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button onClick={handleAddModal}>Add +</Button>
          </Flex>
        </View>
        {isOpenAddModal === true && (
          <AddTodoModal
            userId={user.id}
            createTodo={createTodo}
            handleAddModal={handleAddModal}
          ></AddTodoModal>
        )}
        <View margin="3rem 0">
          <Table caption="" highlightOnHover={false}>
            <TableHead>
              <TableRow>
                <TableCell as="th">No.</TableCell>
                <TableCell as="th">Title</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Priority</TableCell>
                <TableCell as="th">Milestone</TableCell>
                <TableCell as="th">Discription</TableCell>
                <TableCell as="th"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo, index) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.status}</TableCell>
                  <TableCell>{todo.priority}</TableCell>
                  <TableCell>
                    {todo.start} - {todo.end}
                  </TableCell>
                  <TableCell>
                    {todo.description ? todo.description : "-"}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => deleteTodo(todo)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </View>
      </View>
    </LocalizationProvider>
  );
}

export default withAuthenticator(App);

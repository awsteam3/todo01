import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  SelectField,
  TextField,
  TextAreaField,
  View,
} from "@aws-amplify/ui-react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const statusList = ["New", "Open", "On Hold", "Resolved", "Close"];
const priorityList = ["Trivial", "Minor", "Major", "Critical", "Blocker"];

export function AddTodoModal({ userId, createTodo, handleAddModal }) {
  const [todo, setTodo] = useState({
    user: userId,
    title: undefined,
    status: statusList[0],
    priority: priorityList[0],
    start: undefined,
    end: undefined,
    description: undefined,
  });

  return (
    <div className="overlay">
      <div className="content">
        <View className="header">
          <Heading level={2}>Add Todo</Heading>
        </View>
        <View margin="1rem">
          <Flex direction="column">
            <TextField
              placeholder="Input todo title"
              label="Title"
              onChange={(i) => {
                setTodo({ ...todo, title: i.target.value });
              }}
            />
            <TextAreaField
              label="Discription"
              placeholder="Input todo discription"
              onChange={(i) => {
                setTodo({ ...todo, description: i.target.value });
              }}
            />
            <SelectField
              label="Status"
              onChange={(i) => {
                setTodo({ ...todo, status: i.target.value });
              }}
            >
              {statusList.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Priority"
              onChange={(i) => {
                setTodo({ ...todo, priority: i.target.value });
              }}
            >
              {priorityList.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="1rem 0"
            >
              <DatePicker
                label="Start Date"
                onChange={(i) => {
                  setTodo({ ...todo, start: dayjs(i).format("YYYY-MM-DD") });
                }}
              />
              <span>-</span>
              <DatePicker
                label="End Date"
                onChange={(i) => {
                  setTodo({ ...todo, end: dayjs(i).format("YYYY-MM-DD") });
                }}
              />
            </Flex>
          </Flex>
          <Flex
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            margin="1rem 0"
          >
            <Button onClick={handleAddModal}>Cansel</Button>
            <Button
              onClick={() => {
                createTodo(todo);
                handleAddModal();
              }}
            >
              Add
            </Button>
          </Flex>
        </View>
      </div>
    </div>
  );
}

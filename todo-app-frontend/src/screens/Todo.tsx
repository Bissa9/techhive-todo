import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import axios from "axios";

type Todo = {
  id: string;
  title: string;
};

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/todos");
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post("http://localhost:4000/todos", {
        title,
        userId: sessionStorage.getItem("userId"),
      });
      setTodos([...todos, response.data]);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo);
    setEditTitle(todo.title);
  };

  const saveEdit = async () => {
    if (editTodo) {
      try {
        const response = await axios.put(
          `http://localhost:4000/todos/${editTodo.id}`,
          {
            title: editTitle,
          }
        );
        setTodos(
          todos.map((todo) => (todo.id === editTodo.id ? response.data : todo))
        );
        setEditTodo(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New Todo"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Add Todo" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteTodo(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {editTodo && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!editTodo}
          onRequestClose={() => setEditTodo(null)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <Button title="Save" onPress={saveEdit} />
            <Button title="Cancel" onPress={() => setEditTodo(null)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  todoText: {
    flex: 1,
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: "auto",
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "white",
  },
  editButton: {
    backgroundColor: "yellow",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: "black",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Todo;

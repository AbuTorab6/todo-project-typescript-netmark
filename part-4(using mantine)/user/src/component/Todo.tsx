import { Fragment, useState, useRef, useEffect } from "react";

import { Button } from "@mantine/core";
import { Select } from "@mantine/core";

import Modal from "react-bootstrap/Modal";
import { nanoid } from "nanoid";

type Todo = {
  id: string;
  title: string;
  status: string;
};

type FilterStatus = "all" | "complete" | "incomplete";

const Todo = () => {
  const [show, setShow] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [todoList, setTodoList] = useState<Todo[]>(() => {
    const todoListStore = localStorage.getItem("todoList");
    if (todoListStore) {
      return JSON.parse(todoListStore) as Todo[];
    } else {
      return [];
    }
  });
  const [updateTodoId, setUpdateTodoId] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState(todoList);
  const [title, setTitle] = useState<string>("");
  const [status, setstatus] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const todoTitle = useRef<HTMLInputElement>(null);
  const todoStatus = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    console.log("filterStatus", filterStatus);
    if (filterStatus === "all") {
      setFilteredItems(todoList);
    } else {
      const afterFilter = todoList.filter(
        (item) => item.status === filterStatus
      );
      setFilteredItems(afterFilter);
    }
  }, [filterStatus, todoList]);

  var saveTodo = () => {
    setShow(false);

    const task: Todo = {
      id: nanoid(),
      title: title,
      status: status,
    };

    const newTodoList = [...todoList, task];

    setTodoList(newTodoList);
  };

  var deleteTodo = (id: string) => {
    const filterTodoList = todoList.filter((item) => {
      return item.id !== id;
    });
    setTodoList(filterTodoList);
  };

  var editTodo = (id: string) => {
    setShowUpdateModal(true);
    setUpdateTodoId(id);
  };

  var updateTodo = () => {
    const filterTodoList = todoList.filter((item) => {
      return item.id !== updateTodoId;
    });

    const todoTitleElement = todoTitle.current;
    const todoStatusElement = todoStatus.current;

    if (todoTitleElement !== null && todoStatusElement !== null) {
      const task = {
        id: updateTodoId,
        title: todoTitleElement.value,
        status: todoStatusElement.value,
      };

      console.log("update", task);
      const newTodoList = [...filterTodoList, task];

      setTodoList(newTodoList);
      setFilteredItems(newTodoList); //have to show

      // setTitle("");
      // setstatus("");
      setShowUpdateModal(false);
    }
  };

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  var handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  return (
    <Fragment>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <form>
            <label>Title</label>
            <input
              className="title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <select
              onChange={(e) => setstatus(e.target.value)}
              className="status"
            >
              <option value="">choose status</option>
              <option value="complete">Complete</option>
              <option value="incomplete">incomplete</option>
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} color="gray">
            close
          </Button>
          <Button onClick={saveTodo} color="grape">
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Body>
          <form>
            <label>Title</label>
            <input
              className="title"
              type="text"
              ref={todoTitle}
              onChange={(e) => setTitle(e.target.value)}
              defaultValue={
                todoList.find((todo) => todo.id === updateTodoId)?.title
              }
            />
            <br />
            <select
              className="status"
              ref={todoStatus}
              onChange={(e) => setstatus(e.target.value)}
              defaultValue={
                todoList.find((todo) => todo.id === updateTodoId)?.status
              }
            >
              <option value="">choose status</option>
              <option value="complete">Complete</option>
              <option value="incomplete">incomplete</option>
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseUpdateModal} color="gray">
            close
          </Button>
          <Button onClick={updateTodo} color="grape">
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <section className="todo-section">
        <div className="cantainer">
          <h1>Todo List</h1>
          <div className="button-grid">
            <Button onClick={handleShow}>Add Task</Button>
            {/* <select
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            >
              <option value="all">all</option>
              <option value="incomplete">incomplete</option>
              <option value="complete">complete</option>
            </select> */}

            <Select
              // onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              onChange={setFilterStatus}
              // value={filterStatus}
              label="Choose Status"
              placeholder="Choose Status"
              data={[
                { value: "all", label: "all" },
                { value: "incomplete", label: "incomplete" },
                { value: "complete", label: "complete" },
              ]}
            />
          </div>
          <br />
          <br />
          <div className="todo-grid">
            {filteredItems.map((item, index) => {
              return (
                <div key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.status}</p>

                  <Button onClick={() => editTodo(item.id)} color="green">
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteTodo(item.id)}
                    className="deleteBtn"
                    color="red"
                  >
                    Delete
                  </Button>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Todo;

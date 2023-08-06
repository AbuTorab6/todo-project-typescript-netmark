import React, { Fragment, useState, useRef, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { nanoid } from "nanoid";

const Todo = () => {
  const [show, setShow] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [updateTodoId, setUpdateTodoId] = useState<string>("");

  type Todo = {
    id: string;
    title: string;
    status: string;
  };

  useEffect(() => {
    const todoListStore = localStorage.getItem("todoList");
    if (todoListStore !== null) {
      const obj = JSON.parse(todoListStore) as Todo[];
      setTodoList(obj);
      console.log(obj);
    }
  }, []);

  useEffect(() => {
    const todoListStore = localStorage.getItem("todoList");
    if (todoListStore !== null) {
      const obj = JSON.parse(todoListStore) as Todo[];

      const filterTodoListByStatus = obj.filter((item) => {
        return item.id == updateTodoId;
      });

      if (filterTodoListByStatus.length == 1) {
        var x = document.querySelector<HTMLInputElement>(".title");
        var y = document.querySelector<HTMLSelectElement>(".status");
        if (x !== null && y !== null) {
          x.value = filterTodoListByStatus[0].title;
          y.value = filterTodoListByStatus[0].status;
        }
      }
    }
  }, [updateTodoId]);

  var saveTodo = () => {
    setShow(false);

    var title = document.querySelector<HTMLInputElement>(".title");
    var status = document.querySelector<HTMLSelectElement>(".status");

    if (title !== null && status !== null) {
      const x = title.value;
      const y = status.value;

      const task = {
        id: nanoid(),
        title: x,
        status: y,
      };

      const newTodoList = [...todoList, task];

      setTodoList(newTodoList);
      localStorage.setItem("todoList", JSON.stringify(newTodoList));
    }
  };

  var deleteTodo = (id: string) => {
    const filterTodoList = todoList.filter((item) => {
      return item.id !== id;
    });
    setTodoList(filterTodoList);
    localStorage.setItem("todoList", JSON.stringify(filterTodoList));
  };

  var filterByStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const todoListStore = localStorage.getItem("todoList");
    if (todoListStore !== null) {
      const obj = JSON.parse(todoListStore) as Todo[];

      if (e.target.value === "all") {
        setTodoList(obj);
      } else {
        const filterTodoListByStatus = obj.filter((item) => {
          return item.status == e.target.value;
        });
        setTodoList(filterTodoListByStatus);
      }
    }
  };

  var editTodo = (id: string) => {
    setShowUpdateModal(true);
    setUpdateTodoId(id);
  };

  var updateTodo = () => {
    var title = document.querySelector<HTMLInputElement>(".title");
    var status = document.querySelector<HTMLSelectElement>(".status");

    if (title !== null && status !== null) {
      const x = title.value;
      const y = status.value;

      const filterTodoList = todoList.filter((item) => {
        return item.id !== updateTodoId;
      });

      const task = {
        id: updateTodoId,
        title: x,
        status: y,
      };

      const newTodoList = [...filterTodoList, task];

      setTodoList(newTodoList);
      localStorage.setItem("todoList", JSON.stringify(newTodoList));
    }

    setShowUpdateModal(false);
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
            <input className="title" type="text" />
            <br />
            <select className="status">
              <option value="complete">Complete</option>
              <option value="incomplete">incomplete</option>
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveTodo}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Body>
          <form>
            <label>Title</label>
            <input className="title" type="text" />
            <br />
            <select className="status">
              <option value="complete">Complete</option>
              <option value="incomplete">incomplete</option>
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <section className="todo-section">
        <div className="cantainer">
          <h1>Todo List</h1>
          <div className="button-grid">
            <button onClick={handleShow}>Add Task</button>
            <select onChange={filterByStatus}>
              <option value="all">all</option>
              <option value="incomplete">incomplete</option>
              <option value="complete">complete</option>
            </select>
          </div>
          <br />
          <br />
          <div className="todo-grid">
            {todoList.map((item, index) => {
              return (
                <div>
                  <p>{item.title}</p>
                  <p>{item.status}</p>
                  <button
                    onClick={() => deleteTodo(item.id)}
                    className="deleteBtn"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => editTodo(item.id, item.title, item.status)}
                    className="atitBtn"
                  >
                    Edit
                  </button>
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

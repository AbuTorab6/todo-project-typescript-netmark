import { Fragment, useState, useRef, useEffect } from "react";

import Button from "react-bootstrap/Button";
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
  const [createTitle, setCreateTitle] = useState<string>("");
  const [createStatus, setCreatestatus] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const todoTitle = useRef<HTMLInputElement>(null);
  const todoStatus = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
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
      title: createTitle,
      status: createStatus,
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

      const newTodoList = [...filterTodoList, task];

      setTodoList(newTodoList);

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
      {/* save modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <form>
            <label>Title</label>
            <input
              className="title"
              type="text"
              onChange={(e) => setCreateTitle(e.target.value)}
            />
            <br />
            <select
              onChange={(e) => setCreatestatus(e.target.value)}
              className="status"
            >
              <option value="">choose status</option>
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

      {/* Update modal */}
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
            <select
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            >
              <option value="all">all</option>
              <option value="incomplete">incomplete</option>
              <option value="complete">complete</option>
            </select>
          </div>
          <br />
          <br />
          <div className="todo-grid">
            {filteredItems.map((item, index) => {
              return (
                <div key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.status}</p>
                  <button
                    onClick={() => deleteTodo(item.id)}
                    className="deleteBtn"
                  >
                    Delete
                  </button>
                  <button onClick={() => editTodo(item.id)} className="atitBtn">
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

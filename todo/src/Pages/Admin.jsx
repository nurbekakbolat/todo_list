import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Pagination } from "@mui/material";
import { BiTrash, BiSolidEdit } from "react-icons/bi";

const Button = styled.button`
  width: 100%;
  background-color: #007bff;
  height: 30px;
  font-size: 1em;
  font-weight: bold;
  border: none;
  color: white;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    height: 30px;
  }
`;

const TableContainer = styled.div`
  padding-top: 15px;
  margin-bottom: 20px;
  width: 100%;
  height: 250px;
  overflow: auto;
`;

const TableRowStyled = styled(TableRow)`
  height: 20px;

  display: flex;

  align-items: center;
`;

const TableCellStyled = styled(TableCell)`
  padding: 4px;
  margin: 0;
  display: inline-flex;
  align-items: center;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Admin() {
  const [todos, setTodos] = useState([]);
  const [checked, setChecked] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [open, setOpen] = useState(false);
  const [updatedTodo, setUpdateTodo] = useState("");

  const [currentItem, setCurrentItem] = useState({
    currentId: "",
    index: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const todosPerPage = 5;

  const loadTodos = async () => {
    await axios
      .get(`http://localhost:3000/todos/${localStorage.getItem("userId")}`)
      .then((res) => {
        console.log(res.data);
        setTodos(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleTodo = async (index, el) => {
    console.log(index);
    await axios
      .post(`http://localhost:3000/todos/${index}`, {
        isChecked: el,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (e) => {
    setNewTodo(e.target.value);
  };

  const createTodo = async () => {
    console.log(newTodo);
    await axios
      .post(
        `http://localhost:3000/todos/create/${localStorage.getItem("userId")}`,
        {
          desc: newTodo,
        }
      )
      .then((res) => {
        console.log(res.data.t_id);
        const newTodoItem = {
          t_id: res.data.t_id,
          u_id: 1,
          desc: newTodo,
        };
        setTodos((prevTodos) => [...prevTodos, newTodoItem]);
        setNewTodo("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUpdate = async () => {
    console.log(currentItem.currentId);
    await axios
      .post(`http://localhost:3000/todos/update/${currentItem.currentId}`, {
        desc: updatedTodo,
        isChecked: false,
      })
      .then((res) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo, i) =>
            i === currentItem.index ? { ...todo, desc: updatedTodo } : todo
          )
        );
        setOpen(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const openModal = (id, ind) => {
    setOpen(true);
    setCurrentItem({ currentId: id, index: ind });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = async (index, el, indx) => {
    console.log(index);
    await axios
      .delete(`http://localhost:3000/todos/${index}`)
      .then((res) => {
        setTodos((prevTodos) => {
          const updateTodos = [...prevTodos];
          updateTodos.splice(indx, 1);
          return updateTodos;
        });
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // Logic for displaying todos

  return (
    <Container>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card
          sx={{
            width: "600px",
            backgroundColor: "#ffffff",
            height: "500px",
          }}
        >
          <CardHeader sx={{ backgroundColor: "#f7f7f7" }} title="Todos" />

          <Divider />

          <Grid
            sx={{ position: "sticky", top: 0 }}
            container
            alignItems="center"
          >
            <Grid item xs={10}>
              <StyledTextField
                value={newTodo}
                onChange={handleChange}
                placeholder="Enter new todo here"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={createTodo}>Submit</Button>
            </Grid>
          </Grid>
          <CardContent>
            <TableContainer>
              <Table>
                <TableBody>
                  {todos.map((item, index) => (
                    <TableRowStyled key={index}>
                      <TableCell height={"25px"} width={"30px"}>
                        <Checkbox
                          size="12px"
                          disableRipple
                          defaultChecked={item.isChecked ? true : false}
                          onChange={(e) =>
                            toggleTodo(item.id, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCellStyled align="left" height={"25px"}>
                        <Typography fontSize={"12px"}>{item.desc}</Typography>
                      </TableCellStyled>

                      <TableCellStyled
                        height={"25px"}
                        width="30%"
                        align="right"
                      >
                        <IconButton
                          onClick={() => openModal(item.id, index)}
                          sx={{
                            backgroundColor: "#29a745",
                            fontSize: "10px ",
                            borderRadius: 2,
                            width: "55%",
                          }}
                        >
                          <BiSolidEdit />
                        </IconButton>

                        <IconButton
                          onClick={(e) =>
                            handleDelete(item.id, e.target, index)
                          }
                          sx={{
                            backgroundColor: "#dc3545",
                            fontSize: "10px ",
                            borderRadius: 2,
                            marginLeft: "5px",
                            width: "40%",
                          }}
                        >
                          <BiTrash />
                        </IconButton>
                      </TableCellStyled>
                    </TableRowStyled>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Modal open={open} onClose={handleClose}>
              <Box sx={style}>
                <Typography
                  marginBottom="25px"
                  color={"black"}
                  variant="h6"
                  component="h2"
                >
                  Edit the todo
                </Typography>
                <Grid container>
                  <Grid item xs={9}>
                    <StyledTextField
                      fullWidth
                      onChange={(e) => {
                        setUpdateTodo(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button onClick={() => handleUpdate()}>
                      <Typography fontSize={"12px"}>Make changes </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default Admin;

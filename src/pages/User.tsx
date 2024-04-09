import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUserQuery,
  useDeleteUserMutation,
  useGetFoodQuery,
} from "../store/izhApi";
import "/src/style/User.css";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";

const User: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetUserQuery(id);
  const { data: foodList } = useGetFoodQuery("");
  const [open, setOpen] = useState(false);
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  if (isLoading) return <h1>Loading...</h1>;
  console.log(data);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function deleteUserbyId() {
    deleteUser(id).unwrap();
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="container">
      <div className="user">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Подтвердите действие"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Вы уверены, что хотите удалить этот элемент?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={deleteUserbyId}>ОК</Button>
            <Button onClick={handleClose} autoFocus>
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
        <div className="btn">
          <Button color="primary" variant="contained">
            Изменить
          </Button>
          <Button color="error" variant="contained" onClick={handleClickOpen}>
            Удалить
          </Button>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="user-table-header">ID</td>
              <td>{data.id}</td>
            </tr>
            <tr>
              <td className="user-table-header">Имя</td>
              <td>{data.username}</td>
            </tr>
            <tr>
              <td className="user-table-header">Email</td>
              <td>
                <a href={data.email}>{data.email}</a>
              </td>
            </tr>
            <tr>
              <td className="user-table-header">Дата рождения</td>
              <td>{data.birthdate}</td>
            </tr>
            <tr>
              <td className="user-table-header">Любимая еда</td>
              <td>
                {data.favorite_food_ids.map((food: string) => (
                  <p key={food}>{foodList[food]}</p>
                ))}
              </td>
            </tr>
            <tr>
              <td className="user-table-header">Фото</td>
              <td>
                <img
                  src={
                    data.photo_id
                      ? `http://tasks.tizh.ru/file/get?id=${data.photo_id}`
                      : "https://tasks.tizh.ru/images/user-placeholder.png"
                  }
                  alt=""
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;

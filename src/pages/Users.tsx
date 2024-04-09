import { useState } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetFoodQuery,
} from "../store/izhApi";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import "/src/style/Users.css";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Users: React.FC = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetUsersQuery("");
  const [deleteUser] = useDeleteUserMutation();
  const { data: foodlist } = useGetFoodQuery("");
  const navigate = useNavigate();

  if (isLoading) return <h1>Loading...</h1>;
  console.log(data);
  console.log(foodlist);

  const handleClickOpen = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function deleteUserbyId() {
    deleteUser(deleteId).unwrap();
    setOpen(false);
  }

  return (
    <div className="container">
      <div className="users">
        <Button
          color="success"
          variant="contained"
          onClick={() => navigate("/CreateUser")}
        >
          Добавить пользователя
        </Button>
        
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
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Фото</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Дата рождения</th>
                <th>Любимая еда</th>
                <th></th>
              </tr>
            </thead>

            {data.length > 0 ? (
              <tbody>
                {data.map((el, index) => (
                  <tr key={el.id}>
                    <td>{index + 1}</td>
                    <td>{el.id}</td>
                    <td>
                      <img
                        src={
                          el.photo_id
                            ? `http://tasks.tizh.ru/file/get?id=${el.photo_id}`
                            : "https://tasks.tizh.ru/images/user-placeholder.png"
                        }
                        alt=""
                      />
                    </td>
                    <td>{el.username}</td>
                    <td>
                      <a href={el.email}>{el.email}</a>
                    </td>
                    <td>{el.birthdate}</td>
                    {el.favorite_food_ids.filter(
                      (el: string) => el != "" && el != null
                    ).length ? (
                      <td>
                        {el.favorite_food_ids.map((food: string) => (
                          <p key={food}>{foodlist[food]}</p>
                        ))}
                      </td>
                    ) : (
                      <td>Не корректный ID еды</td>
                    )}

                    <td className="users-td-iconButton">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/WatchUser/${el.id}`)}
                      >
                        <RemoveRedEyeIcon />
                      </IconButton>
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleClickOpen(el.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <div>Ничего не найдено</div>
            )}
          </table>
        
      </div>
    </div>
  );
};

export default Users;

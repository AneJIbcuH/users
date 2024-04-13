import { useState } from "react";
import { useGetUsersQuery, useGetFoodQuery } from "../store/izhApi";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import MyModal from "../components/MyModal";
import "/src/style/Users.css";

const Users: React.FC = () => {
  const [deleteId, setDeleteId] = useState<number>();
  const [modalActive, setModalActive] = useState(false);
  const { data: users, isLoading } = useGetUsersQuery("");
  const { data: foodlist } = useGetFoodQuery("");
  const navigate = useNavigate();

  if (isLoading) return <h1>Loading...</h1>;

  const handleClickOpen = () => {
    setModalActive(true);
  };

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

        <MyModal
          deleteId={deleteId!}
          active={modalActive}
          setActive={setModalActive}
        />

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

          {users!.length > 0 ? (
            <tbody>
              {users?.map((el, index) => (
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
                  {el.favorite_food_ids.filter((el) => el != "" && el != null)
                    .length ? (
                    <td>
                      {el.favorite_food_ids.map((food) => (
                        <p key={food}>{foodlist![food]}</p>
                      ))}
                    </td>
                  ) : (
                    <td>Не корректный ID еды</td>
                  )}

                  <td className="users-td-iconButton">
                    <Tooltip title="Просмотр">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/WatchUser/${el.id}`)}
                      >
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Редактировать">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/EditUser/${el.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Удалить">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setDeleteId(el.id);
                          handleClickOpen();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
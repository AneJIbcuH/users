import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserQuery, useGetFoodQuery } from "../store/izhApi";
import Button from "@mui/material/Button";
import MyModal from "../components/MyModal";
import "/src/style/User.css";

const User: React.FC = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useGetUserQuery(id);
  const { data: foodList } = useGetFoodQuery("");
  const [modalActive, setModalActive] = useState(false);
  const navigate = useNavigate();
  
  if (isLoading) return <h1>Loading...</h1>;

  const handleClickOpen = () => {
    setModalActive(true);
  };

  return (
    <div className="container">
      <div className="user">
        <MyModal
          deleteId={id!}
          active={modalActive}
          setActive={setModalActive}
        />

        <div className="btn">
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate(`/EditUser/${id}`)}
          >
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
              <td>{user.id}</td>
            </tr>
            <tr>
              <td className="user-table-header">Имя</td>
              <td>{user.username}</td>
            </tr>
            <tr>
              <td className="user-table-header">Email</td>
              <td>
                <a href={user.email}>{user.email}</a>
              </td>
            </tr>
            <tr>
              <td className="user-table-header">Дата рождения</td>
              <td>{user.birthdate}</td>
            </tr>
            <tr>
              <td className="user-table-header">Любимая еда</td>
              <td>
                {user.favorite_food_ids.map((food: string) => (
                  <p key={food}>{foodList![food]}</p>
                ))}
              </td>
            </tr>
            <tr>
              <td className="user-table-header">Фото</td>
              <td>
                <img
                  src={
                    user.photo_id
                      ? `http://tasks.tizh.ru/file/get?id=${user.photo_id}`
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
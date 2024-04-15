import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  useCreateUserMutation,
  useGetFoodQuery,
  useGetUsersQuery,
  useEditUserMutation,
} from "../store/izhApi";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import 'dayjs/locale/en-gb';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import "/src/style/CreateUser.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const schema = yup.object().shape({
  email: yup.string().email().required('Необходимо заполнить "Email"'),
  username: yup.string().required('Необходимо заполнить "Имя"'),
  birthdate: yup.date().required('Необходимо заполнить "Дата рождения"'),
});

type FormData = {
  username: string;
  email: string;
  birthdate: any;
  upload_photo?: any;
  favorite_food_ids?: string[];
};

const CreateUser: React.FC = () => {
  const { id } = useParams();
  const { data: users } = useGetUsersQuery("");
  const user = users?.find((el) => el.id == (id as unknown as Number));
  const [photo, setPhoto] = useState<string | undefined>(
    user ? `http://tasks.tizh.ru/file/get?id=${user.photo_id}` : undefined
  );
  const [newfile, setNewFile] = useState<any>(null);
  const [createUser] = useCreateUserMutation();
  const [editUser] = useEditUserMutation();
  const navigate = useNavigate();
  const { data: foodList } = useGetFoodQuery("");
  const [foodName, setFoodName] = useState<string[]>([]);

  console.log("User данные", user);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const loadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      setNewFile(formData);
    }
  };

  const sendData: SubmitHandler<FormData> = async (data) => {
    console.log(data.birthdate);
    data.birthdate = new Date(data.birthdate).toLocaleDateString();
console.log(data.birthdate)
    data.upload_photo = newfile;
    if (data.favorite_food_ids) {
      const newFoods = data.favorite_food_ids.map((food: string) => {
        for (let key in foodList) {
          if (foodList[key] === food) {
            return key;
          }
        }
      });
      data.favorite_food_ids = newFoods;
    }

    let response;

    if (user) {
      console.log("дата измененная PUT", data);
      response = await editUser({ id, data }).unwrap();
    } else {
      console.log("дата пометоду POST", data);
      response = await createUser(data).unwrap();
    }
    console.log("тело ответа респонс", response);
    navigate(`/WatchUser/${response.id}`);
  };

  const handleSetFood = (event: SelectChangeEvent<typeof foodName>) => {
    const {
      target: { value },
    } = event;
    setFoodName(typeof value === "string" ? value.split(",") : value);
    console.log(foodName);
  };

  return (
    <div className="container">
      <div className="container-createUser">
        <div className="avatar">
          <img
            src={
              photo
                ? photo
                : "https://tasks.tizh.ru/images/user-placeholder.png"
            }
            alt=""
          />
          <input
            type="file"
            id="photo-input"
            hidden
            accept="image/*"
            onChange={loadPhoto}
          />
          <label htmlFor="photo-input" className="label-photo-input">
            Заменить
          </label>
        </div>

        <form className="inputs" onSubmit={handleSubmit(sendData)}>
          <Controller
            name="username"
            control={control}
            defaultValue={user ? user.username : ""}
            render={({ field }) => (
              <TextField
                label="Имя"
                {...field}
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ""}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue={user ? user.email : ""}
            render={({ field }) => (
              <TextField
                label="Email"
                type="email"
                {...field}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            )}
          />

          <Controller
            name="birthdate"
            control={control}
            defaultValue={user ? dayjs(user.birthdate) : null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DatePicker
                  {...field}
                  label="Дата рождения"
                />
              </LocalizationProvider>
            )}
          />

          <Controller
            name="favorite_food_ids"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel>Любимая еда</InputLabel>
                <Select
                  multiple
                  value={foodName}
                  onChange={(e) => {
                    field.onChange(e);
                    handleSetFood(e);
                  }}
                  input={<OutlinedInput label="Любимая еда" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {Object.values(foodList!).map((food) => (
                    <MenuItem key={food} value={food}>
                      {food}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Button color="success" variant="contained" type="submit">
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;

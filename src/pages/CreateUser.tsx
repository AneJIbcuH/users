import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useCreateUserMutation } from "../store/izhApi";
import { useNavigate } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Button from "@mui/material/Button";

import "/src/style/CreateUser.css";

type FormData = {
  username: string;
  email: string;
  birthdate: any;
};

const CreateUser: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const loadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      birthdate: "",
    },
  });

  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();

  const sendData: SubmitHandler<FormData> = async (data) => {
    const newdata = new Date(data.birthdate.$d).toLocaleDateString();
    data.birthdate = newdata;

    const resp = await createUser(data).unwrap();
    console.log(resp.id);
    navigate(`/WatchUser/${resp.id}`);
  };

  return (
    <div>
      <div className="avatar">
        <img
          src={
            photo ? photo : "https://tasks.tizh.ru/images/user-placeholder.png"
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
          defaultValue=""
          render={({ field }) => (
            <TextField label="Имя" onChange={(e) => field.onChange(e)} />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField label="Email" onChange={(e) => field.onChange(e)} />
          )}
        />

        <Controller
          name="birthdate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Дата рождения"
                  onChange={(e) => field.onChange(e)}
                />
              </DemoContainer>
            </LocalizationProvider>
          )}
        />

        <Button color="success" variant="contained" type="submit">
          Сохранить
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;

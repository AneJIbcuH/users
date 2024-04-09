import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useCreateUserMutation, useGetFoodQuery } from "../store/izhApi";
import { useNavigate } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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

import "/src/style/CreateUser.css";

type FormData = {
  username: string;
  email: string;
  birthdate: any;
  upload_photo?: any;
  favorite_food_ids?: any;
};

const CreateUser: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  // const [newfile, setNewFile] = useState<any>(null);
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const { data: foodList } = useGetFoodQuery("");
  const [foodName, setFoodName] = useState<string[]>([]);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      birthdate: "",
    },
  });

  const loadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // const fileObj = {
    //   description: "Пользователь",
    //   id: Date.now(),
    //   name: file!.name,
    //   mime: file!.type,
    //   size: file!.size,
    //   date_create: new Date(file!.lastModified).toISOString(),
    //   date_update: new Date().toISOString(),
    //   url: photo,
    // };

    // setNewFile(fileObj);
  };

  const sendData: SubmitHandler<FormData> = async (data) => {
    const newdata = new Date(data.birthdate.$d).toLocaleDateString();
    data.birthdate = newdata;
    // newfile.url = photo;
    // data.upload_photo = newfile;
    const newFoods = data.favorite_food_ids.map((food: string) => {
      for (let key in foodList) {
        if (foodList[key] === food) {
          return key;
        }
      }
    });
    data.favorite_food_ids = newFoods;

    console.log(data);
    const resp = await createUser(data).unwrap();
    console.log(resp.id);
    navigate(`/WatchUser/${resp.id}`);
  };

  const handleSetFood = (event: SelectChangeEvent<typeof foodName>, field) => {
    field.onChange(event);
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

          <Controller
            name="favorite_food_ids"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="demo-multiple-chip-label">
                  Любимая еда
                </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={foodName}
                  onChange={(e) => handleSetFood(e, field)}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Любимая еда"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {Object.values(foodList).map((food) => (
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

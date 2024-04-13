import { useDeleteUserMutation } from "../store/izhApi";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  active: boolean;
  setActive: (arg: boolean) => void
  deleteId: number | string
};

const MyModal: React.FC<Props> = ({ active, setActive, deleteId }) => {
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate()

  const handleClose = () => {
    setActive(false);
  };

  function deleteUserbyId() {
    deleteUser(deleteId).unwrap();
    setActive(false);
    navigate("/");
  }

  return (
    <>
      <Dialog open={active} onClose={handleClose}>
        <DialogTitle>Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>
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
    </>
  );
};

export default MyModal;
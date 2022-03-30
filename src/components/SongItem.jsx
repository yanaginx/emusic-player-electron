import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setTrack, reset } from "../features/track/trackSlice";

function SongItem({ player, data }) {
  const dispatch = useDispatch();
  const { track } = useSelector((state) => state.trackRedux);
  // console.log("🚀 ~ file: SongItem.jsx ~ line 8 ~ SongItem ~ track", track);
  // console.log(
  //   "🚀 ~ file: SongItem.jsx ~ line 4 ~ SongItem ~ player.profile",
  //   player.profile
  // );
  // console.log("🚀 ~ file: SongItem.jsx ~ line 4 ~ SongItem ~ data", data);

  const setCurrentTrack = () => {
    dispatch(setTrack(data));
    player.profile.play(data);
  };
  return (
    <>
      <Card sx={{ m: 2 }}>
        <CardActionArea onClick={setCurrentTrack}>
          <CardContent>
            <Typography variant="h5">{data.name}</Typography>
            <Typography variant="h6" color="text.secondary">
              {data.author}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default SongItem;

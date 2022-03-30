import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const drawer = (
  <div>
    <Toolbar />
    <Divider />
    {/* <Menu>
      <MenuItem component={Link} to={"/all-songs"}>
        All songs
      </MenuItem>
    </Menu> */}
    {/* <List>
      <Link to="/all-songs" style={{ textDecoration: "none" }}>
        <ListItem button key="All songs">
          <ListItemText primary="All songs" />
        </ListItem>
      </Link>
    </List> */}
    <List>
      <Link to="/all-songs" style={{ textDecoration: "none" }}>
        <MenuItem component={Link} to={"/all-songs"}>
          All songs
        </MenuItem>
      </Link>
    </List>
  </div>
);

function Sidebar() {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;

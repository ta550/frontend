import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';

const SelectDialog = (props) => {
  const { onClose, selectedValue, items, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <List>
        {items.map((item,i) => (
          <ListItem button onClick={() => handleListItemClick(item)} key={i} style={{padding: "10px 40px"}}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}


export default SelectDialog;
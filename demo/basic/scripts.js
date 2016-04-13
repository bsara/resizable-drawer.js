let myResizableDrawer = new ResizableDrawer(document.querySelector('.resizable-drawer'));


document.querySelector('#destroyButton').addEventListener('click', (e) => {
  e.preventDefault();
  myResizableDrawer.destroy();
});

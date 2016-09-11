
export default function link(scope, elem, attrs, ctrl) {
  // final our container and tell the controller what it is
  //debugger;
  ctrl.setContainer(elem.find('.panel-content'));

  // when render event is triggered, draw the map
  ctrl.events.on('render', () => {
    console.log("d3graph render event received");
    render();
  });

  // force a rendering
  render();

  // invoke on render
  function render() {
    console.log("d3graph render from link");
    ctrl.onRender();
  }
}

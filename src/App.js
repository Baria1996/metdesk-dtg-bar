import "./App.css";
import DTGBar from "./DTGBar";

function App() {
  // todo: button to go to the latest issue
  const openHelpAlert = () => {
    alert(`
    This app has 2 main components:
    1) Issues Bar
        - click on different issues to see DTGs from the model 'ecop'
        - scrolling horizontally on this bar shows the rest of  the list
    2) DTGs Container
        - click on different buttons to see the DTG as a text string in UTC
        - the selected DTG is displayed in bold below all the DTG buttons
    `);
  };

  return (
    <div className="App">
      <button className="help-button" onClick={openHelpAlert}>
        Click me for help
      </button>
      <DTGBar />
    </div>
  );
}

export default App;

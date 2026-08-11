import Header from "./Componets/Header";
import Button from "./Componets/Button";
import ProgressBar from "./Componets/ProgressBar";

function App() {
    return <>
        <Header></Header>
        <Button type={"nonclick"}>Upload Csv</Button>
        <ProgressBar percent={20}/>
        <Button type={"click"}>Back</Button>
    </>;
}

export default App;
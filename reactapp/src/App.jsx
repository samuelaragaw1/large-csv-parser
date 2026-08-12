import Header from "./Componets/Header";
import Button from "./Componets/Button";
// import ProgressBar from "./Componets/ProgressBar";
import FileUploader from "./Componets/FileUploader";

function App() {
    return <>
        <Header></Header>
        <FileUploader/>
        {/* <ProgressBar percent={20}/> */}
        <Button type={'click'}>Back</Button>
    </>;
}

export default App;
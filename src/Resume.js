import { Document, Page } from 'react-pdf';

let Resume = (props) => {
    return (
        <Document file="resume.pdf"
            onLoadError={(error) => { console.log("resume load", error) }}>
            <Page pageNumer={1} />
        </Document>
    )
}
export default Resume;
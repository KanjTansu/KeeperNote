import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
import Zoom from '@mui/material/Zoom';
export default function CreateArea(props) {
    const [noteInput, setNoteInput] = useState({
        title: "",
        content: "",
    });
    const [isExpand, setExpand] = React.useState(false);

    function handleChange(event) {
        const { value, name } = event.target
        setNoteInput((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }
    function submitNote() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: props.userId,
                notes: {
                    newTitle: noteInput.title,
                    newNote: noteInput.content
                }
            })
        };
        fetch("/usernote", requestOptions)
            .then(response => response.json())
        setNoteInput({
            title: "",
            content: "",
        })
    }
    function getNote() {
        setExpand(true)
    }
    return (
        <div >
            <form className="create-note" onSubmit={submitNote} >
                <input onClick={getNote} onChange={handleChange} value={noteInput.title} name="title" placeholder="Title" />
                {isExpand ? <textarea
                    onChange={handleChange}
                    value={noteInput.content}
                    name="content"
                    placeholder="Take a note..."
                    rows="3" />
                    : null}
                <Zoom in={isExpand}><Fab type="submit" > <AddIcon /></Fab></Zoom>
            </form>
        </div>
    );
}
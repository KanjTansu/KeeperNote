import "./styles.css";
import Note from "./Note"
import CreateArea from "./CreateArea";
import React, { useEffect, useState } from "react";

export default function NotePage() {
  const [note, setNote] = useState([]);
  const [userId, setUserId] = useState("");
  const [loginStatus, setLoginStatus] = useState(false)
  // function addNote(noteInput) {
  //   setNote((prevValue => {
  //     return [...prevValue,
  //       noteInput
  //     ]
  //   }))
  // }
  useEffect(() => {
    fetch("/usernote")
      .then(response => response.json())
      .then(data => {
        let notesdb = data.notes;
        console.log(notesdb);
        if (notesdb === undefined) {
          console.log(notesdb);
        }else{
          setLoginStatus(true)
          setUserId(data._id)
          notesdb.map((notedb) => {
            setNote(((prevValue) => {
              return [...prevValue, {
                id: notedb._id,
                title: notedb.newTitle,
                content: notedb.newNote
              }]
            }));
          });
        } 
      }
      )
  }, [])
  function deleteItem(_id) {
    fetch("/usernote", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId : userId,
        itemId: _id
       })
    })
    setNote(prevValue => {
      return prevValue.filter(
        (item) => {
          return item.id !== _id
        }
      )
    })
  }
  return (
    <div>
      {loginStatus ? <CreateArea
        userId={userId}
        note = {note}
      /> : 
      <div className="notepage-alert">
        <h1 className='text-center regis-header'>Sorry</h1>
        <h1 className='text-center regis-header'>Please Go to Login and Comeback again.</h1></div>}

      {note.map((item, index) => (
        <Note
          key={index}
          id={item.id}
          title={item.title}
          content={item.content}
          deleteItem={deleteItem}
        />))}
    </div>
  );
}

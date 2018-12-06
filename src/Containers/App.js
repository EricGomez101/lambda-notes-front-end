import React, { Component } from 'react';
import axios from 'axios';
import classes from './App.css';
import {Nav} from '../Components/Nav';
import {Note} from '../Components/Note';
// import {Route, Link, Redirect} from 'react-router-dom';
import {SideBar} from '../Components/SideBar';
import {CreateNoteInput} from '../Components/CreateNoteInput';

class App extends Component {
  constructor() {
    super();
    this.state = {
      menu: false,
      notes: [],
    };
  }
  // GET's all notes from the server
  componentDidMount() {
    axios.get('https://afternoon-citadel-23531.herokuapp.com/api/notes')
      .then(response => {
        this.setState({notes: response.data});
      })
  }
  // sends a put request to the server to update the values in a note.
  handleUpdate = (id, update) => {
    axios.put(`https://afternoon-citadel-23531.herokuapp.com/api/notes/${id}`, update)
      .then(r => {
        let {notes} = this.state;
        notes.map((note) => {
          if(note._id === r.data._id){
            note.title = r.data.title;
            note.content = r.data.content;
            return note
          }
          return note
        })
        this.setState( {notes: notes} );
      })
  }
  // sends a delete request on a note.
  handleDelete = (id) => {
    axios.delete(`https://afternoon-citadel-23531.herokuapp.com/api/notes/${id}`)
    .then(r => {
      this.setState({ notes: r.data });
    })
  }
  // submits a new note
  handleSubmit = (title, content) => {
    let newNote = {}
    if (title !== '') {
      newNote.title = title;
    }
    if (content !== '') {
      newNote.content = content;
    }
    if(newNote.title !== undefined && newNote.content !== undefined){
      axios.post('https://afternoon-citadel-23531.herokuapp.com/api/notes', newNote)
        .then(r => {
          const { notes } = this.state;
          notes.push(r.data);
          this.setState({ notes: notes });
        })
    } else { console.log('you need to either have a title or body filled out') };
  }
  // changes the value of the menu field. depending on wether they need it to be rendered or not
  handleState = () => {
    this.setState({menu: !this.state.menu});
  }

  render() {
    let notes = (
      <div key={'12345678090'} className={`fa-3x ${classes.Container__SpinnerContainer}`}>
        <i className={`fas fa-cog fa-spin ${classes.Container__SpinnerIcon}`}></i>
      </div>
    )
    if (this.state.notes.length > 0) {
      const notesLen = this.state.notes.length; // the length of the notes array.
      const avg = ~~(notesLen / 4); // the floored avg of the length of the notes arr divided by four.
      let r = (notesLen / 4) % 1 * 4; // remainder of the length of the notes array divided by four.
      let j = 0; // the iterator to properly slice the notes array.

      notes = (
        <div className={classes.Container__NotesContainer}>
          {
            [...Array(4).keys()].map((i) => {
              let max = r > 0 ? avg + 1 + j : avg + j;
              if (r > 0) r--;
              return (
                <div key={`NotesCol${i}`} className={classes.Container__NotesCol}>
                  { this.state.notes.slice(j, max).map( (n, i) => {
                    j += 1;
                    return <Note key={ n + i } note={ n } handleUpdate={ this.handleUpdate } handleDelete={ this.handleDelete }/>
                  })}
                </div>
              )
            })
          }
        </div>
      )
    }
    return (
      <div className={classes.Container}>
        <Nav handleState={this.handleState}/>
        <div className={classes.Container__ContentContainer}>
          {this.state.menu ? <SideBar/> : null}
          <div className={classes.Container__InputContainer}>
            <CreateNoteInput handleSubmit={this.handleSubmit}/>
            {notes}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
import React, {useState} from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button"
import { FcPlus } from 'react-icons/fc'
import { connect } from 'react-redux';
import {useSelector} from 'react-redux'


function AdminTopicsBootstrapModal(props) {
    const [topic, setTopic] = useState("");
    const [show, setShow] = useState(false);
    const topicReducer = useSelector(state => state.topicReducer)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const submitTopic = (e) => {
        e.preventDefault()
        const data = {topic: topic};
        props.add_topic(data)
        setTopic("")
    }

    const deleteTopic = (e) => {
        props.delete_topic(e);
    }

  return (
    <div>
      <Button onClick={handleShow} className="mybutton btn-sm">
        Add Topics
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Topics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitTopic} className="row">
                <div className="col-md-9">
                    <input type="text" value={topic}  onChange={(e) => setTopic(e.target.value)} className="form-contorl w-100 py-1" placeholder="Enter Topic" required/>
                </div>
                <div className="col-md-3">
                    <Button type="submit" style={{ background: 'none', border: 'none', padding: '0' }}><FcPlus className="h2" /></Button>
                </div>
            </form>
            {topicReducer.map((item, i) => {
                return <div key={i} className={`mcqDisplay pb-1 h5 mcq${i}`}><p style={{fontSize: '15px'}} className="option_text my-2">{item.topic}</p><svg onClick={() => deleteTopic(i)} style={{ cursor: 'pointer' }} className="MuiSvgIcon-root mcqDisplay__delete" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></div>
            })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
};




export default connect(null)(AdminTopicsBootstrapModal);

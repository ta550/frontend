import React from 'react'

function BackendTest() {
    const [state, setState] = React.useState("")
    const [res , setRes] = React.useState("")
    
    React.useEffect(()=> {
        fetch("http://localhost:9090/dashboard/de/test")
        .then(res => res.json())
        .then(res => {
            setState(res)
            console.log("/////////////////////////////////////")
            console.log(res)
        })
        .catch(err => console.log(err))
        
        fetch("http://exam-be://dashboard/de/test")
        .then(res => res.json())
        .then(res => {
            setRes(res)
            console.log(res)
            console.log("http://exam-be://dashboard/de/test")
        })
    },[])
    return (
        <div>
            <h1>From BackEnd: {state}</h1>
            <h1>From Backend: {res}</h1>
        </div>
    )
}

export default BackendTest

import React from 'react'

function BackendTest() {
    const [state, setState] = React.useState("")
    React.useEffect(()=> {
        fetch("exam-be://dashboard/de/test")
        .then(res => res.json())
        .then(res => {
            setState(res)
            console.log("/////////////////////////////////////")
            console.log(res)
        })
        .catch(err => console.log(err))
    },[])
    return (
        <div>
            <h1>From BackEnd: {state}</h1>
        </div>
    )
}

export default BackendTest

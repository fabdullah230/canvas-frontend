
import Cookies from 'js-cookie'
import {useState, useEffect} from 'react'
import axios from 'axios'
import jwt from 'jwt-decode'
import { Accordion , AccordionSummary, AccordionDetails} from '@material-ui/core'

function App() {



  var url = new URL(window.location.href);
  var data = url.searchParams.get("data");
  console.log(data);

  const [name, setName] = useState(Cookies.get("CanvasVeriguideIntegration") || data);
  const [cookieValid, setCookieValid] = useState(false);
  
  const [info, setInfo] = useState({})

  

  useEffect(() => {
    
    console.log(Cookies.get("CanvasVeriguideIntegration"));
    axios.get(`http://192.168.1.116:8090/cookie`, {
      headers:{
        'data' : name
      }
    })
    .then(res => {
      setCookieValid(true)
      setName(res.data)
      setInfo(jwt(res.data))
    })
    .catch(err => {
      console.log(err)
    })

  }, [])


const [showing, setShowing] = useState(false)

  return (
    <div className="App">
      <code>
        you have reached the dummy frontend of canvas veriguide integration
      </code>
      <br></br>













      
      {/* displaying cookies */}
      {cookieValid ? (
        <Accordion>
          <AccordionSummary>
            <code>Your cookie is valid</code>
          </AccordionSummary>
          <AccordionDetails>
            <code>{name}</code>
          </AccordionDetails>
        </Accordion>
      ) : (
        <code>Invalid cookie, could not be verified</code>
      )}
      <br />

      {/* displaying params */}
      <Accordion>
        <AccordionSummary onClick={() => setShowing(!showing)}>
          <code>
            click to {showing ? <code>collapse</code> : <code>expand</code>} params
          </code>
        </AccordionSummary>
        {Object.keys(info).map((key, i) => (
          <AccordionDetails key={i}>
            <code>
              {key} : {info[key]}
            </code>
          </AccordionDetails>
        ))}
      </Accordion>
    </div>
  );
}

export default App;

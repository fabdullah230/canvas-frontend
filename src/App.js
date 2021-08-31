import Cookies from 'js-cookie'
import {useState, useEffect} from 'react'
import axios from 'axios'
import jwt from 'jwt-decode'
import { Accordion , AccordionSummary, AccordionDetails} from '@material-ui/core'

function App() {


  var url = new URL(window.location.href); //searcing for the JWT token from URL parameter
  var data = url.searchParams.get("data"); //implemented this way because cookies dont work in iframe
  //console.log(data);

  const [cookieData, setCookieData] = useState(Cookies.get("CanvasVeriguideIntegration") || data); //sets data from Cookie or URL-params
  const [cookieValid, setCookieValid] = useState(false); //current state of cookie validation
  const [info, setInfo] = useState({}) //Jwt object state

  
  /**
   * upon page load, sends GET request to backend to check if JWT from cookie/URL-param is valid
   * if valid, sets cookie validation state (cookieValid) as true
   *           sets the JWT token as cookieData
   *           parses the JWT token and sets the Json object as info
   * if invalid, backend code sends status code 500, error is console logged, app does not show any information
  */

  useEffect(() => {
    axios.get(`http://192.168.1.116:8090/cookie`, {
      headers:{
        'data' : cookieData
      }
    })
    .then(res => {
      setCookieValid(true)
      setCookieData(res.data)
      setInfo(jwt(res.data))
    })
    .catch(err => {
      console.log(err)
    })

  }, [])

//hook to change between expand|collapse
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
            <code>{cookieData}</code>
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
        {//mapping through all jwt claims
        Object.keys(info).map((key, i) => (
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

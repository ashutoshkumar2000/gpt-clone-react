import {useState, useEffect} from 'react'

const App = () =>  {
  const [value, setValue ] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uinqueTitle) => {
    setCurrentTitle(uinqueTitle)
    setMessage(null);
    setValue("");
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body : JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type" : "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completion', options)
      const data = await response.json();
      setMessage(data.choices[0].message);
      console.log(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log(message);

  useEffect(() => {
    // console.log(currentTitle, value, message);
    if(!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if(currentTitle && value && message){
      setPreviousChats((previousChats) => (
        [
          ...previousChats,
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content : message.content
          }
        ]
      ))
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uinqueTitles = Array.from( new Set(previousChats.map(previousChat => previousChat.title)))
  // console.log(uinqueItems);
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick = {createNewChat}>+ New Chat</button>
        <ul className="history">
        {uinqueTitles?.map((uinqueTitle, index) => <li key={index} onClick={() => handleClick(uinqueTitle)}>{uinqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Ashutosh</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>AshuGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value = {value} onChange = {(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;

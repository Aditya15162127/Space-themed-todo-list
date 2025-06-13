import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { RiDeleteBin4Fill } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import gsap from 'gsap';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  const appRef = useRef(null);
  const todoWrapperRef = useRef(null);
  const videoRef = useRef(null);
  const todoListRef = useRef(null);
  const completedListRef = useRef(null);

  
  useEffect(() => {
    gsap.from(todoWrapperRef.current, {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power3.out"
    });
  }, []);

  
  const handleViewTransition = (isToComplete) => {
    const currentView = isToComplete ? todoListRef.current : completedListRef.current;
    const nextView = isToComplete ? completedListRef.current : todoListRef.current;

   
    gsap.to(currentView, {
      duration: 0.5,
      x: isToComplete ? -100 : 100,
      opacity: 0,
      ease: "power2.inOut",
      onComplete: () => {
        
        gsap.fromTo(nextView,
          {
            x: isToComplete ? 100 : -100,
            opacity: 0
          },
          {
            duration: 0.5,
            x: 0,
            opacity: 1,
            ease: "power2.out"
          }
        );
      }
    });
  };


  const handleItemHover = (e) => {
    gsap.to(e.currentTarget, {
      duration: 0.3,
      scale: 1.02,
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      ease: "power2.out"
    });
  };

  const handleItemLeave = (e) => {
    gsap.to(e.currentTarget, {
      duration: 0.3,
      scale: 1,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      ease: "power2.out"
    });
  };


  const handleIconHover = (e) => {
    gsap.to(e.target, {
      duration: 0.3,
      scale: 1.2,
      rotation: 360,
      ease: "power2.inOut"
    });
  };

  const handleIconLeave = (e) => {
    gsap.to(e.target, {
      duration: 0.3,
      scale: 1,
      rotation: 0,
      ease: "power2.inOut"
    });
  };


  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription
    };
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
    
   
    gsap.from(`.task-list-item:last-child`, {
      duration: 0.5,
      x: -100,
      opacity: 0,
      ease: "back.out(1.7)"
    });

    setNewTitle("");
    setNewDescription("");
  };


  const handleDeleteTodo = (index) => {
    const taskElement = document.querySelector(`.task-list-item:nth-child(${index + 1})`);
    gsap.to(taskElement, {
      duration: 0.3,
      x: 100,
      opacity: 0,
      ease: "power2.in",
      onComplete: () => {
        let reducedTodo = [...allTodos];
        reducedTodo.splice(index, 1);
        localStorage.setItem('todolist', JSON.stringify(reducedTodo));
        setTodos(reducedTodo);
      }
    });
  };


  const handleComplete = (index) => {
    const taskElement = document.querySelector(`.task-list-item:nth-child(${index + 1})`);
    gsap.to(taskElement, {
      duration: 0.5,
      scale: 0.8,
      opacity: 0,
      ease: "power2.in",
      onComplete: () => {
        let now = new Date();
        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yyyy = now.getFullYear();
        let h = now.getHours();
        let m = now.getMinutes();
        let s = now.getSeconds();
        let completedOn = dd + '-' + mm + '-' + yyyy + 'at' + h + ':' + m + ':' + s;

        let filteredItem = {
          ...allTodos[index],
          completedOn: completedOn
        };

        let updatedCompletedArr = [...completedTodos];
        updatedCompletedArr.push(filteredItem);
        setCompletedTodos(updatedCompletedArr);
        localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
        handleDeleteTodo(index);
      }
    });
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedCompletedTodo = [...completedTodos];
    reducedCompletedTodo.splice(index, 1);
    
    localStorage.setItem('completedTodos', JSON.stringify(reducedCompletedTodo));
    setCompletedTodos(reducedCompletedTodo);
  }

  useEffect(()=> {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo);
    }
    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setEditTitle(allTodos[index].title);
    setEditDescription(allTodos[index].description);
  }

  const handleUpdate = () => {
    let updatedTodos = [...allTodos];
    updatedTodos[editIndex] = {
      title: editTitle,
      description: editDescription
    };
    setTodos(updatedTodos);
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    setIsEditing(false);
    setEditIndex(null);
    setEditTitle("");
    setEditDescription("");
  }

  return (
    <div className="App" ref={appRef}>
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/back-hole.mp4" type="video/mp4" />
      </video>
      <div className="todo-wrapper" ref={todoWrapperRef}>
        <h1>TO-DO LIST</h1>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>TITLE</label>
            <input 
              type='text' 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}  
              placeholder='Task Title' 
            />
          </div>

          <div className='todo-input-item'>
            <label>DESCRIPTION</label>
            <input 
              type='text' 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)} 
              placeholder='Info about task' 
            />
          </div>

          <div className='todo-input-item'>
            <button type='button' onClick={handleAddTodo} className='primaryBtn'>Add</button>
          </div>
        </div>

        <div className='btn-area'>
          <button 
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} 
            onClick={() => {
              if (isCompleteScreen) {
                handleViewTransition(false);
                setIsCompleteScreen(false);
              }
            }}
          >
            To-Do
          </button>

          <button 
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`} 
            onClick={() => {
              if (!isCompleteScreen) {
                handleViewTransition(true);
                setIsCompleteScreen(true);
              }
            }}
          >
            Completed
          </button>
        </div>

        <div 
          className='task-list' 
          ref={todoListRef} 
          style={{ 
            display: isCompleteScreen ? 'none' : 'block',
            position: 'relative'
          }}
        >
          {allTodos.map((item, index) => (
            <div 
              className='task-list-item' 
              key={index}
              onMouseEnter={handleItemHover}
              onMouseLeave={handleItemLeave}
            >
              {isEditing && editIndex === index ? (
                <div className="edit-form">
                  <div className='todo-input-item'>
                    <div>
                      <label>Title</label>
                      <input type='text' value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder='Task Title' />
                    </div>
                  </div>
                  <div className='todo-input-item'>
                    <div>
                      <label>Description</label>
                      <input type='text' value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder='Info about task' />
                    </div>
                  </div>
                  <div className='todo-input-item'>
                    <div>
                      <button type='button' onClick={handleUpdate} className='primaryBtn'>Update</button>
                      <button type='button' onClick={() => setIsEditing(false)} className='secondaryBtn'>Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="icons">
                    <FaEdit 
                      className='icon' 
                      onClick={() => handleEdit(index)} 
                      onMouseEnter={handleIconHover}
                      onMouseLeave={handleIconLeave}
                      title="Edit?"
                    />
                    <RiDeleteBin4Fill 
                      className='icon' 
                      onClick={() => handleDeleteTodo(index)} 
                      onMouseEnter={handleIconHover}
                      onMouseLeave={handleIconLeave}
                      title="Delete?"
                    />
                    <TiTick 
                      className='check-icon' 
                      onClick={() => handleComplete(index)} 
                      onMouseEnter={handleIconHover}
                      onMouseLeave={handleIconLeave}
                      title="Complete?"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div 
          className='task-list' 
          ref={completedListRef} 
          style={{ 
            display: isCompleteScreen ? 'block' : 'none',
            position: 'relative'
          }}
        >
          {completedTodos.map((item, index) => (
            <div 
              className='task-list-item' 
              key={index}
              onMouseEnter={handleItemHover}
              onMouseLeave={handleItemLeave}
            >
              <div className="content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p><small>completed on: {item.completedOn}</small></p>
              </div>
              <div className="icons">
                <RiDeleteBin4Fill 
                  className='icon' 
                  onClick={() => handleDeleteCompletedTodo(index)} 
                  onMouseEnter={handleIconHover}
                  onMouseLeave={handleIconLeave}
                  title="Delete?"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

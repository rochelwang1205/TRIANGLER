const Input = ({ id,text,value,onChangeHandler }) => {
  return(
    <>
        <label htmlFor={id}>{text}</label>
        <input type="text" placeholder="Enter your name" id={id} value={value} onChange={onChangeHandler}/>
    </> 
  )
 
}

export default Input;
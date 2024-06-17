import "./style.css";

const Input = ({ label, state, setState, placeholder, type }) => {
  return (
    <div className="input-wrapper">
      <p className="label-input">{label}</p>
      <input

        style={{color:"white"}}
        type={type}
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className="custom-input"
      />
    </div>
  );
};

export default Input;

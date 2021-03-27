import React, { useState } from "react";

const Baseline = ({ message }) => {
  const [num, setNum] = useState(0);
  const newNum = () => {
    setNum(Math.floor(Math.random() * 100));
  };
  return (
    <div>
      This is a baseline component. Message: {message}
      <div>
        <button onClick={newNum}>{num}</button>
      </div>
    </div>
  );
};

export default Baseline;

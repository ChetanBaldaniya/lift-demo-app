import React, { useState, useEffect } from "react";

const floors = [1, 2, 3, 4, 5, 6, 7, 8];
const buttonArray = [8, 7, 6, 5, 4, 3, 2, 1];
const liftNames = ["A", "B", "C"];

const LiftSimulator = () => {
  const [lifts, setLifts] = useState([
    { id: "A", currentFloor: 1, queue: [], moving: false, direction: null },
  ]);   

  useEffect(() => {
    lifts.forEach((lift) => {
      if (lift.queue.length > 0 && !lift.moving) {
        moveLift(lift.id);
      }
    });
  }, [lifts]);

   // lift movement up down   
  const moveLift = async (liftId) => {
    setLifts((prevLifts) =>
      prevLifts.map((lift) =>
        lift.id === liftId ? { ...lift, moving: true } : lift
      )
    );

    let lift = lifts.find((lift) => lift.id === liftId);
    const upQueue = lift.queue
      .filter((floor) => floor > lift.currentFloor)
      .sort((a, b) => a - b);
    const downQueue = lift.queue
      .filter((floor) => floor < lift.currentFloor)
      .sort((a, b) => b - a);

    const processQueue = async (floorsToVisit, dir) => {
      for (const floor of floorsToVisit) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setLifts((prevLifts) =>
          prevLifts.map((l) =>
            l.id === liftId
              ? {
                  ...l,
                  currentFloor: floor,
                  direction: dir,
                  queue: l.queue.filter((f) => f !== floor),
                }
              : l
          )
        );
      }
    };

    await processQueue(upQueue, "up");
    await processQueue(downQueue, "down");

    setLifts((prevLifts) =>
      prevLifts.map((l) => (l.id === liftId ? { ...l, moving: false } : l))
    );
  };


  // add lift handle
  const addLift = (value) => {
    if (lifts.length < 3) {
      setLifts([
        ...lifts,
        {
          id: value,
          currentFloor: 1,
          queue: [],
          moving: false,
          direction: null,
        },
      ]);
    }
  };
    // lift remove button
  const removeLift = (id) => {
    setLifts(lifts.filter((lift) => lift.id !== id));
  };
   // button pannel handle button
  const handleButtonClick = (liftId, floor) => {
    setLifts((prevLifts) =>
      prevLifts.map((lift) =>
        lift.id === liftId && !lift.queue.includes(floor)
          ? { ...lift, queue: [...lift.queue, floor].sort((a, b) => a - b) }
          : lift
      )
    );
  };


  return (
    <>
    <div className="building-container">
      <div className="building">
        {floors.map((floor, index) => (
          <div key={index} className="floor">
            <div className="floor-box">
              <div className="windows"></div>
              <div className="windows"></div>
              <div className="windows"></div>
              <div className="windows"></div>
              <div className="floor-number">{floor}</div>
            </div>
          </div>
        ))}

        {lifts.map((lift, index) => (
          <div key={index} className={`lift-shaft${index}`}>
            <div
              className="lift"
              style={{ bottom: `${floors.indexOf(lift.currentFloor) * 81}px` }}
            >
              <span>{lift.id}</span>
              {lift.direction === "up"
                ? "↑"
                : lift.direction === "down"
                ? "↓"
                : ""}
            </div>
          </div>
        ))}
      </div>
     
      {lifts.map((lift, index) => (
        <>
          <div key={index} className="lift-panel">
            <div className="current-floor">
              <p>{lift.id}</p>
              <span>{lift.currentFloor}</span>
              <p>Current Floor</p>
            </div>
            <div className="direction">
              <span className={lift.direction === "up" ? "active" : ""}>↑</span>
              <span className={lift.direction === "down" ? "active" : ""}>
                ↓
              </span>
              <p>Direction</p>
            </div>
            <div className="floor-buttons">
              {buttonArray.map((floor) => (
                <button
                  key={floor}
                  className={`floor-button ${
                    lift.queue.includes(floor) ? "selected" : ""
                  }`}
                  disabled={floor === lift.currentFloor}
                  onClick={() => handleButtonClick(lift.id, floor)}
                >
                  {floor}
                </button>
              ))}
            </div>
            <button
              className="removeButton"
              onClick={() => removeLift(lift.id)}
            >
              Remove Lift {lift.id}
            </button>
          </div>
        </>
      ))}
      
      {lifts.length < 3 && (
        <select className="liftSelect"  onChange={(e) => addLift(e.target.value)}>
          <option value="">Please Add Lift</option>
          {liftNames?.map((name, i) => {
            let checkArray = lifts?.map((ele) => ele.id) || [];
            console.log(checkArray, "checkArray");

            return (
              !checkArray.includes(name) && (
                <option className="selectOption" key={i} value={name}>
                  {name}
                </option>
              )
            );
          })}
        </select>
      )}
    </div>
    </>
  );
};

export default LiftSimulator;

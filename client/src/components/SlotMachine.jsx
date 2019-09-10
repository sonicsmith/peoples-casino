import React from "react"
import "./SlotMachine.css"

const SlotMachine = ({ objectEmoji, subjectEmoji, spinning, win, stopped }) => {
  const slot = [0, 1, 2]
  const slots = [0, 1, 2, 3, 4]
  let emojis = [
    [subjectEmoji, objectEmoji],
    [subjectEmoji, objectEmoji],
    [subjectEmoji, objectEmoji]
  ]
  if (!win) {
    emojis = [
      [subjectEmoji, objectEmoji],
      [subjectEmoji, objectEmoji],
      [objectEmoji, subjectEmoji]
    ]
  }
  let state = spinning ? "Spinning" : ""
  state = (stopped && "Stopped") || state
  return (
    <div
      style={{
        position: "relative",
        width: "25vw",
        height: "15vw"
      }}
    >
      <div className="machine">
        <div className="slots">
          {slot.map(index => (
            <ul key={index} className={`slot${state}`}>
              {slots.map(() => {
                return emojis[index].map((e, i) => (
                  <li key={i} className="number">
                    {e}
                  </li>
                ))
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlotMachine

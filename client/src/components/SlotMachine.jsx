import React from "react"
import "./SlotMachine.css"

const SlotMachine = ({ objectEmoji, subjectEmoji, spinning, win }) => {
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
            <ul className={`slot${spinning ? "Spinning" : ""}`}>
              {slots.map(() => {
                return emojis[index].map(e => <li className="number">{e}</li>)
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
  /*
  let emojiGrid = []
  if (spinning) {
    for (let y = 0; y < 3; y++) {
      const randomEmoji = Math.random() > 0.5 ? objectEmoji : subjectEmoji
      emojiGrid.push(randomEmoji)
    }
  } else {
    if (win) {
      emojiGrid = [subjectEmoji, subjectEmoji, subjectEmoji]
    } else {
      for (let y = 0; y < 2; y++) {
        const randomEmoji = Math.random() > 0.5 ? objectEmoji : subjectEmoji
        emojiGrid.push(randomEmoji)
      }
      emojiGrid.push(objectEmoji)
    }
  }
  return (
    <Box pad="medium" border={{ size: "small" }} round={true}>
      <Text size="xlarge">{emojiGrid}</Text>
    </Box>
  )
  */
}

export default SlotMachine
